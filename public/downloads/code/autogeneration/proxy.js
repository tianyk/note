// 2018-08-24 17:20:00
const http = require('http');
const net = require('net');
const url = require('url');

const PORT = process.env.PORT || 1337;
const HOST = process.env.HOST || '127.0.0.1';
const MY_IP = '0.0.0.0';

const SERVER_TIMEOUT = 2 * 60 * 1000; // 2mins
const SEND_TIMEOUT  = 1000;
const PROXY_TIMEOUT = 60 * 1000; // 1mins


// 创建一个 HTTP 代理服务器
const proxy = http.createServer();

proxy.on('request', (cReq, cRes) => {
    const cUrl = cReq.url;
    console.log(cUrl);

    // 代理模式
    if (cUrl.startsWith('http')) {
        const { method, headers } = cReq;
        const { hostname, port = 80, path } = url.parse(cReq.url);

        // via
        let via = headers['via'];
        if (via) {
            via = via += ', 1.1 proxy.kekek.cc (KEKE-Proxy)';
        } else {
            via = '1.1 proxy.kekek.cc (KEKE-Proxy)';
        }
        headers['via'] = via;

        // x-forward-for
        let ips = headers['x-forward-for'];
        if (ips) {
            ips += `, ${MY_IP}`;
        } else {
            ips = MY_IP;
        }
        headers['x-forward-for'] = ips;
        
        // Max-Forwards
        
        // 服务器响应超时
        // cRes.setTimeout(SEND_TIMEOUT, () => {
        //     cRes.writeHead(504, { 'content-type': 'text/plain' });
        //     cRes.end('Send Timeout');
        // });

        // <http.ClientRequest>
        const pReq = http.request({ hostname, port, path, method, headers });
        pReq
            .setTimeout(PROXY_TIMEOUT)
            .on('response', (pRes) => {
                // <http.IncomingMessage>
                console.log(`[response] [proxy] ${cUrl}`);

                cRes.writeHead(pRes.statusCode, pRes.headers);
                pRes.pipe(cRes);
            })
            .on('timeout', () => {
                // 代理请求超时
                console.log(`[timeout] [proxy-req] ${cUrl}`);
                pReq.abort();
            })
            .on('abort', () => {
                console.log(`[abort] [proxy-req] ${cUrl}`);
            })
            .on('close', () => {
                console.log(`[close] [proxy-req] ${cUrl}`);
            })
            .on('error', (err) => {
                console.log(`[error] [proxy-req] ${cUrl} \r\n${err.stack}`);
                cRes.writeHead(500, { 'content-type': 'text/plain' });
                cRes.end(`Proxy Error: ${err.code || err.message || err.name}`);
            });

        // 请求重定向
        cReq.pipe(pReq);

        // 客户端中止
        cReq.on('aborted', () => {
            console.log(`[aborted] [client] ${cUrl}`);
            // 中止代理
            pReq.abort();
        });
    } else {
        // http-server
        if (cUrl === '/proxy.pac') {
            cRes.setHeader('content-type', 'application/x-ns-proxy-autoconfig');
            const pac = `// Proxy Auto-Configuration (PAC) file
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_(PAC)_file
// DIRECT	        不经过任何代理，直接进行连接
// PROXY host:port	应该使用指定的代理
// SOCKS host:port	应该使用指定的 SOCKS 服务器

var proxy = "PROXY proxy.kekek.cc:1337; DIRECT;";
var direct = 'DIRECT;';
function FindProxyForURL(url, host){
    if (/\.\kekek\.cc$/.test(host)) {
        return proxy;
    } else {
        return direct;
    }
}`;

            cRes.end(pac);
        } else {
            cRes.setHeader('content-type', 'text/plain');
            cRes.end('proxy: proxy.kekek.cc\r\nport: 1337\r\npac: http://proxy.kekek.cc:1337/proxy.pac');
        }
    }
});


// https
proxy.on('connect', (req, cltSocket, head) => {
    console.log(req.url, head.length)
    // 连接到一个服务器
    const { port, hostname } = url.parse(`http://${req.url}`);

    const srvSocket = net.connect(port, hostname);

    srvSocket.on('connect', () => {
        cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
            'Proxy-agent: Node.js-Proxy\r\n' +
            '\r\n');
        srvSocket.write(head);
        // 连接管道
        srvSocket.pipe(cltSocket);
        cltSocket.pipe(srvSocket);
    });

    // srvSocket.on('end', () => {
    //     // 远程服务器断开
    //     console.log(`[end] ${req.url}`);
    //     cltSocket.end();
    // });

    // srvSocket.on('timeout', () => {
    //     console.log(`[timeout] ${req.url}`);
    //     srvSocket.end();
    //     cltSocket.end();
    // });

    // srvSocket.on('close', (hasError) => {
    //     // 远程服务器完全断开
    //     console.log(`[close] ${req.url} ${hasError}`);
    // });

    srvSocket.on('error', (err) => {
        // 远程服务器报错
        console.log(`[error] ${req.url} \r\n${err.stack}`);
        const error = `Proxy Error: ${err.code || err.message || err.name}`
        cltSocket.end(`HTTP/1.1 500 Internal Server Error\r\ncontent-type:text/plain\r\ncontent-length:${err.length}\r\n\r\n${error}`);
    });
});

proxy.on('listening', () => {
    console.log(`Proxy-Server running on http://${HOST}:${PORT}`);
});

// 代理服务器正在运行
proxy.listen(PORT, HOST);