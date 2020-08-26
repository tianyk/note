---
title: 前端二进制
author: tyk
date: 2020-04-16 15:56:09
tags:
---
## 前端的二进制

### ArrayBuffer

ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。必须将其转换为 TypedArray 或者 DataView 才能操作。

``` js
new UintArray(buffer : ArrayBuffer)
```

### TypedArray

- Int8Array

	8 位有符号缓冲区。每位1个字节（bytes）8位（bits），值取值范围[-128,127]

- Uint8Array

	8 位无符号缓冲区。每位1个字节，值取值范围[0,256]

- Uint8ClampedArray

	8 位无符号固定缓冲区。

- Int16Array

	16 位有符号缓冲区。每位2个字节(bytes) [−32768,32767]

- Uint16Array

	[0,65535]

- Int32Array

	[−2147483648,2147483647]

- Uint32Array
	
	[0,4294967295]

- Float32Array

- Float64Array

- BigInt64Array

	[−9223372036854775808,9223372036854775807]

- BigUint64Arra

	[0,18446744073709551615]


```js
// 默认一个字符俩字节
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
```

### DataView

提供对 buffer 的操作，类似Node.js里面的 Buffer 。


{% jsfiddle zw01gdck js,result %}

### 参考

- [Base64的编码与解码](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/Base64_encoding_and_decoding)
- [聊聊JS的二进制家族：Blob、ArrayBuffer和Buffer](https://zhuanlan.zhihu.com/p/97768916)