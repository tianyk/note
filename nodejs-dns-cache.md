### Node.js DNS缓存

Node.js默认不会缓存DNS信息，如果需要发大量请求时，使用带缓存的`dns.lookup`可以提高性能。  

*lookup只支持http，https不会生效*

![](images/QQ20170118-0@2x.jpg)

### 示例

#### 使用http模块
```javascript
var http = require('http');
var dns = require('dnscache')({
    enable: true,
    ttl: 300,
    cachesize: 1000
});

var options = {
    hostname: 'www.baidu.com',
    port: 80,
    path: '/fe0a164b-06f9-4d27-a689-c554e69a9d82.jpg',
    method: 'GET',
    lookup: dns.lookup
};

var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    // res.setEncoding('utf8');
    res.on('data', (chunk) => {
        // console.log(`BODY: ${chunk}`);
    });

    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
});

// write data to request body
req.end();
```

#### 使用request模块
```javascript
var request = require('request');
var dns = require('dnscache')({
    enable: true,
    ttl: 300,
    cachesize: 1000
});

request = request.defaults({
    lookup: dns.lookup
});

request.get('http://www.baidu.com/fe0a164b-06f9-4d27-a689-c554e69a9d82.jpg', function (error, response, body) {
    if (error) return console.error('request failed:', error);

    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
});
```

### 参考
[【1】](https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener)
