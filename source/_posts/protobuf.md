---
title: protobuf
date: 2016-12-02 17:46:50
tags: 
---
### Protocol Buffers

``` shell
npm -i -g protobufjs
```

``` shell
pbjs -t json file1.proto file2.proto > bundle.json
```


``` javascript
const protobuf = require('protobufjs');
const root = protobuf.Root.fromJSON(require('bundle.json'));

const AwesomeMessage = root.lookup('awesomepackage.AwesomeMessage');
var message = {
    id: 1,
    name: '类型1',
    status: 'on',
    type: 'type'
};

var buffer = AwesomeMessage.encode(message).finish();

message = AwesomeMessage.decode(buffer);
```
