---
title: Headscale 极简部署指南
date: 2026-02-12 00:00:00
categories:
  - 运维
tags:
  - headscale
  - tailscale
toc: true
---

## 0. 架构与端口规划（先把端口定死）

| 服务 | 协议/端口 | 说明 | 谁访问谁 |
| :--- | :--- | :--- | :--- |
| **HTTPS** | `TCP/443` | Headscale 控制面 + DERP（经反代，含 Upgrade） | 公网 → Nginx/OpenResty |
| **STUN** | `UDP/3478` | 内置 STUN（打洞关键） | 公网 → Headscale（直连到服务器） |
| **Local** | `TCP/3477` | Headscale 本体（仅本机监听） | Nginx/OpenResty → Headscale |

关键点：

- **`3478` 必须放行 UDP（不是 TCP）**：很多云安全组 TCP/UDP 分开选，别选错。
- **不要对公网暴露 `3477`**：只监听 `127.0.0.1`，由反代统一出入口。

---

## 1. 前置准备（替换占位符）

把下面占位符替换成你的值：

- `hs.example.com`：你的控制面域名（必须 HTTPS 可访问）
- `SERVER_PUBLIC_IP`：服务器公网 IPv4
- `REGION_CODE`：自建 DERP code（建议小写，例如 `myderp`）

准备项：

- 一台 Linux 服务器（有公网 IPv4）
- 一个域名 A 记录指向 `SERVER_PUBLIC_IP`
- 已有证书（或你能自己搞定 ACME 申请；本文不展开）
- Nginx 或 OpenResty 已安装

---

## 2. 安装 Headscale（二进制）

从 `juanfont/headscale` 的 Releases 下载与你机器架构匹配的二进制：

- [`juanfont/headscale` Releases](https://github.com/juanfont/headscale/releases)

安装到 `/usr/local/bin/headscale`：

```bash
sudo cp ./headscale /usr/local/bin/headscale
sudo chmod 0755 /usr/local/bin/headscale
/usr/local/bin/headscale version
```

> 小坑：如果遇到 `sudo headscale: command not found`，多半是 `sudo` 的 `secure_path` 不含 `/usr/local/bin`。本文后续统一用绝对路径：`sudo /usr/local/bin/headscale ...`

---

## 3. 生成必须密钥（v0.28+ 常见强制项）

创建目录：

```bash
sudo mkdir -p /etc/headscale /var/lib/headscale
sudo chmod 700 /var/lib/headscale
```

生成 Noise 私钥：

```bash
sudo /usr/local/bin/headscale generate private-key \
  | sudo tee /var/lib/headscale/noise_private.key >/dev/null
sudo chmod 600 /var/lib/headscale/noise_private.key
```

> 说明：这里用 `tee` 是为了解决“`sudo` + 重定向”权限问题（`sudo cmd > file` 的重定向不在 sudo 权限里执行）。  
> 另外，内容通常带 `privkey:` 前缀，别手动删，否则可能报 “expected type prefix privkey:”。

---

## 4. 写入 Headscale 配置（最小可用模板）

保存为：`/etc/headscale/config.yaml`

> 说明：先**关闭 DNS/MagicDNS**，减少必填项耦合；跑通后再按「进阶」章节开启。

```yaml
# /etc/headscale/config.yaml

# 必须替换：你的控制面公网 HTTPS 地址（反代场景也一样）
server_url: "https://hs.example.com" # ← 替换为你的域名

# 只在本机监听，由 Nginx/OpenResty 对外提供 443
listen_addr: "127.0.0.1:3477"

tls_cert_path: ""
tls_key_path: ""

prefixes:
  v4: "100.64.0.0/10"
  v6: "fd7a:115c:a1e0::/48"

database:
  type: sqlite
  sqlite:
    path: "/var/lib/headscale/db.sqlite"

# v0.28+ 常见强制项：Noise 私钥
noise:
  private_key_path: "/var/lib/headscale/noise_private.key"

# 先关闭 DNS 功能，避免引入 base_domain/nameservers 等额外必填项
dns:
  magic_dns: false
  override_local_dns: false

derp:
  server:
    enabled: true
    # 可替换：自建 DERP 的 region 信息（便于识别/排查；避免与官方冲突即可）
    region_id: 901                 # ← 可改；只要不和官方/其他自建重复即可
    region_code: "REGION_CODE"     # ← 必须替换：建议小写，例如 "myderp"
    region_name: "REGION_NAME"     # ← 必须替换：随便取一个可读名字即可

    private_key_path: "/var/lib/headscale/derp_server_private.key"

    # STUN（UDP/3478）
    stun_listen_addr: "0.0.0.0:3478"

    # 告诉客户端 DERP 的公网入口（域名 + 公网 IPv4）
    hostname: "hs.example.com"     # ← 必须替换：你的域名（与 server_url 一致）
    ipv4: "SERVER_PUBLIC_IP"       # ← 必须替换：服务器公网 IPv4

    # 更安全：只允许你 tailnet 的节点使用这个 DERP
    verify_clients: true

    automatically_add_embedded_derp_region: true

  # 建议保留官方 DERP 兜底（否则单点）
  urls:
    - "https://controlplane.tailscale.com/derpmap/default"
  paths: []

log:
  level: "info"
```

配置校验（必须过）：

```bash
sudo /usr/local/bin/headscale configtest -c /etc/headscale/config.yaml
```

---

## 5. systemd 启动 Headscale

创建：`/etc/systemd/system/headscale.service`

```ini
[Unit]
Description=Headscale
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/headscale serve -c /etc/headscale/config.yaml
Restart=on-failure
RestartSec=3
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

启动并自启：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now headscale
sudo systemctl status headscale --no-pager
```

> 生产提示：为简单起见，上面未指定 `User=`/`Group=`，默认 root 运行。生产环境建议创建专用用户（如 `headscale`）并收紧 `/var/lib/headscale` 权限后再以非 root 运行。

---

## 6. Nginx/OpenResty 反代（关键是 Upgrade + 长连接）

示例：`/etc/nginx/conf.d/headscale.conf`

```nginx
map $http_upgrade $connection_upgrade {
  default upgrade;
  ''      close;
}

server {
  listen 443 ssl;
  http2 on;
  server_name hs.example.com;

  ssl_certificate     /path/to/fullchain.pem;
  ssl_certificate_key /path/to/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3477;

    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;

    # DERP/控制面都可能需要 Upgrade（保险起见全站都保留）
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection $connection_upgrade;

    proxy_read_timeout  3600s;
    proxy_send_timeout  3600s;
    proxy_buffering off;
  }
}
```

检查并重载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. 创建用户 + 客户端接入

先说明一下什么是“用户（user）”：

- Headscale 的 **user** 不是登录账号/密码体系，而是一个**命名空间/分组**：把一批设备（nodes）归到同一个用户下面，便于管理与发放入网 key。
- **个人/小团队最常见**：只建 1 个 user，然后所有设备都加入这个 user。
- `tailnet-user` 只是示例名，你可以改成自己的（例如 `alice` / `team-a`）。

创建用户：

```bash
# 创建一个 user（示例名：tailnet-user）
sudo /usr/local/bin/headscale users create tailnet-user
sudo /usr/local/bin/headscale users list
```

生成 preauth key（优先用用户名；旧版本不支持再用数字 ID）：

```bash
# 优先：直接用用户名
sudo /usr/local/bin/headscale preauthkeys create -u tailnet-user --reusable --expiration 24h

# 兜底：用 users list 里的 USER_ID
sudo /usr/local/bin/headscale preauthkeys create -u USER_ID --reusable --expiration 24h
```

客户端加入（Linux 示例）：

```bash
sudo tailscale up \
  --reset \
  --login-server https://hs.example.com \
  --authkey hskey-auth-xxxxxxxxxxxxxxxx \
  --accept-dns=false \
  --accept-routes
```

> 后续新增设备：重复本节“生成 key → 客户端 tailscale up”即可。

---

## 8. 验收清单（所有检查统一在这里做）

### 8.1 服务器侧

```bash
sudo /usr/local/bin/headscale configtest -c /etc/headscale/config.yaml
systemctl status headscale --no-pager
sudo ss -lntp | egrep ':443|:3477'
sudo ss -ulnp | egrep ':3478'
curl -i https://hs.example.com/derp
sudo /usr/local/bin/headscale nodes list
```

看到 `curl -i https://hs.example.com/derp` 返回 `426` 且包含 `DERP requires connection upgrade`：**正常**（代表路由打通）。

### 8.2 客户端侧（最重要）

```bash
tailscale status
tailscale ping <peer_100.64.x.x>
tailscale netcheck
```

`tailscale status` 速记：

- `relay` / `via DERP(...)`：走 DERP 中继（慢一些，但能通）
- `direct`：P2P 打洞成功（更快、更稳定）

---

## 9. 常见疑难杂症（只保留“现象级”问题）

### Q1：一直走很远的 DERP（例如 `DERP(nue)`），不走自己的 `REGION_CODE`

优先用裁判命令：

```bash
tailscale netcheck
```

常见原因：

- `derp.server.hostname/ipv4` 没配全或配错
- 客户端被代理影响（`netcheck` 会出现 `tshttpproxy: using proxy ...`）

### Q2：客户端日志出现 `dial tcp4 SERVER_PUBLIC_IP:3477: i/o timeout`

典型“反代场景端口混淆”：

- 客户端误以为 DERP 对外端口是 3477
- 但 3477 只在本机回环监听，公网必超时

根治：确保 `server_url` 是 `https://hs.example.com`，并在 `derp.server` 明确：

- `hostname: hs.example.com`
- `ipv4: SERVER_PUBLIC_IP`

### Q3：macOS 节点名变成 `invalid-xxxxx`

Headscale 对 hostname 限制严格（小写字母/数字/`-`/`.`）。macOS 设备名带中文/空格等会被拒绝。

修复：在服务器端用 `headscale nodes rename` 改“显示名”（需要节点 ID；先用 `headscale nodes list` 查到 ID 即可）。示例（一步）：

```bash
sudo /usr/local/bin/headscale nodes rename -i <node-id> mac-home
```

### Q4：`tailscale debug derp REGION_CODE` 里 IPv6 报错，但 IPv4 OK

域名只有 A 记录、无 AAAA 且服务器无公网 IPv6 时属于正常探测失败；只要实际 `tailscale ping` 正常即可忽略。

---

## 10. 进阶（可选）：MagicDNS / Split DNS / Subnet Router

### 10.1 MagicDNS：用机器名互访

开启 MagicDNS 时 **必须配置 `base_domain`**，并且建议显式设置 `nameservers.global`：

```yaml
dns:
  magic_dns: true
  base_domain: tailnet.internal
  override_local_dns: true
  nameservers:
    global:
      - 1.1.1.1
      - 8.8.8.8
      # 国内服务器如遇解析超时/阻断，可替换为：
      # - 223.5.5.5     # 阿里 DNS
      # - 119.29.29.29  # 腾讯 DNS
```

客户端侧需要接收 DNS 下发：

```bash
sudo tailscale up --accept-dns=true
```

### 10.2 Split DNS：只分流特定后缀到公司 DNS

模板（示例）：

```yaml
dns:
  magic_dns: true
  base_domain: tailnet.internal
  override_local_dns: true
  nameservers:
    global:
      - 1.1.1.1
      - 8.8.8.8
    split:
      company.local:
        - COMPANY_DNS_IP
```

关键前提：如果 `COMPANY_DNS_IP` 在公司内网网段里，你在家里必须先通过 Subnet Router 把这个网段路由进 Tailnet，否则会出现“DNS 服务器不可达”。

### 10.3 Subnet Router：把公司内网网段“桥接进 Tailnet”

在公司内网找一台长期在线且已入网的机器，执行（示例网段）：

> 关键步骤：开启内核 IP 转发（Subnet Router 必须）
>
> ```bash
> echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/99-tailscale.conf
> echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
> sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
> ```

```bash
sudo tailscale up \
  --advertise-routes=192.168.10.0/24 \
  --accept-dns=false
```

在 headscale 上批准路由：

```bash
sudo /usr/local/bin/headscale routes list
sudo /usr/local/bin/headscale routes enable -r <route-id>
```

在家里的机器上接收路由：

```bash
sudo tailscale up --accept-routes
```

