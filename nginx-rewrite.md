### rewrite指令

使用rewrite指令我们可以改写URL，实现外部和内部重定向。

|||
|---|---|
|语法 | rewrite regex replacement flag |
|默认值 | none |
|使用环境 | server, location, if | 

#### regex 
正则匹配规则，Nginx正则采用PCRE正则表达式语法，和Java、JavaScript等语言一样。

#### replacement 
这个部分可以使用字符串、Nginx变量、以及正则匹配到的元组（从$1到$9）

#### flag
flag 一共四种，用来说明匹配到后内部如何处理。

|flag|解释|  
|---|---|
|permanent|301 永久重定向|    
|redirect |302 临时重定向|    
|last     |内部重定向，会在内部重新发起请求。|
|break    |不会像last一样重新发起请求，终止匹配。直接使用新URL在当前location中请求。|


#### last 与 break 
last标记在本条rewrite规则执行完毕后，会对其所在的server{...}标签重新发起请求，而break标记则在本条规则匹配完成后，终止匹配，不再匹配后面的规则。 
使用alias指令时必须用last标记，使用proxy_pass指令时要使用break标记。

