---
title: https2
author: tyk
date: 2018-07-26 15:35:41
tags: 
- tls
- ssl
---
## HTTPS

### SSL与TLS
- SSL: Secure Sockets Layer

    安全套接字层。
    
- TLS: Transport Layer Security

    传输安全层。

- PKI: PUblic Key Infrastructure

    公钥基础设施。

`SSL`协议由`Netscape`公司开发，历史可以追溯到`Netscape Navigator`浏览器统治互联网的时代。协议的第一个版本从未发布过，第二版则于1994年11月发布。第一次部署是在`Netscape Navigator 1.1`浏览器上，发行于1995年3月。

`SSL 2`的开发基本上没有与`Netscape`以外的安全专家进行过商讨，所以有严重的弱点，被认为是失败的协议，最终退出了历史的舞台。这次失败使`Netscape`专注于`SSL 3`，并于1995年年底发布。虽然名称与早先的协议版本相同，但`SSL 3`是完全重新设计的协议。该设计一直沿用到今天。

1996年5月，`TLS`工作组2成立，开始将`SSL`从`Netscape`迁移至IETF。由于`Microsoft`和`Netscape`当时正在为Web的统治权争得不可开交，整个迁移过程进行得非常缓慢、艰难。最终，`TLS 1.0`于1999年1月问世，见[RFC 2246](https://www.ietf.org/rfc/rfc2246.txt)。尽管与`SSL 3`相比，版本修改并不大，但是为了取悦`Microsoft`，协议还是进行了更名。

2006年4月，下一个版本`TLS 1.1`问世。

2008年8月，`TLS 1.2`发布。

> `TLS 1.0`通常被标示为`SSL 3.1`，`TLS 1.1`为`SSL 3.2`，`TLS 1.2`为`SSL 3.3`。

### 密码学
1. 对称加密

    对称密钥加密（英语：Symmetric-key algorithm）又称为对称加密、私钥加密、共享密钥加密。这类演算法在加密和解密时使用**相同的密钥**，或是使用两个可以简单地相互推算的密钥。

    常见的对称加密算法有DES、3DES、AES、Blowfish、IDEA、RC5、RC6。
    
    对称加密的速度比公钥加密快很多，在很多场合都需要对称加密。

    ![](/images/440px-Asymmetric_cryptography_-_step_2.svg.png)
    
2. 散列函数

    散列函数（hash function）是将任意长度的输入转化为定长输出的算法。散列函数的结果经常被简称为散列（hash）。散列函数经常被称为**指纹**、**消息摘要**，或者简单称为摘要。

    ![](/images/640px-Hash_function.svg.png)

3. 消息验证代码

    散列函数可以用于验证数据完整性，但仅在数据的散列与数据本身分开传输的条件下如此。否则攻击者可以同时修改数据和散列，从而轻易地避开检测。消息验证代码（message authentication code，MAC）或者使用密钥的散列（keyed-hash）是以身份验证扩展了散列函数的密码学函数。
    
4. 分组密码模式
分组密码模式是为了加密任意长度的数据而设计的密码学方案，是对分组密码的扩展。

ECB、CBC、CFB、OFB、CTR、GCM

5. 非对称加密
非对称加密（asymmetric encryption）又称为公钥加密（public key cryptography），它是另一种方法，使用两个密钥，而不是一个；其中一个密钥是私密的，另一个是公开的。

RSA（得名于三个人的姓氏首字母：Ron Rivest、Adi Shamir和Leonard Adleman）是目前最普遍部署的非对称加密算法。

6. 数字签名



### 密码分类


### 参考
- [HTTPS权威指南](https://book.douban.com/subject/26869219/)
- [爱丽丝与鲍伯](https://www.wikiwand.com/zh-hans/%E6%84%9B%E9%BA%97%E7%B5%B2%E8%88%87%E9%AE%91%E4%BC%AF)
- [对称密钥加密](https://www.wikiwand.com/zh-hans/%E5%B0%8D%E7%A8%B1%E5%AF%86%E9%91%B0%E5%8A%A0%E5%AF%86)
