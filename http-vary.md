<https://imququ.com/post/vary-header-in-http.html>

好多时候我们在客户端和网站间有一层缓存层，如果缓存成只是根据`URL`来来作为`Key`缓存会出现一些问题。这主要是HTTP内容协商（Content Negotiation），同一个URL的对应的内容可能是不一样的。

例如，我们可以返回gzip压缩版本和未压缩版本两种内容，还可以返回`JSON`类型和`HTML`类型。如果我们只根据`URL`来生成缓存Key肯定是有问题的，例如前一个请求客户端支持压缩版本，缓存成就会缓存下来一个压缩版本的内容，如果后面一个请求客户端不支持gzip压缩这时就出问题了。要解决这种问题，我就就要告诉缓存服务器遇到同一个 URL 对应着不同版本文档的情况时，如何缓存和筛选合适的版本。

|请求头字段|说明|响应头字段|
|----|----|----|
| Accept	      | 告知服务器发送何种媒体类型 | Content-Type |
| Accept-Language |	告知服务器发送何种语言	   | Content-Language |
| Accept-Charset  | 告知服务器发送何种字符集   | Content-Type |
| Accept-Encoding |	告知服务器采用何种压缩方式 | Content-Encoding| 