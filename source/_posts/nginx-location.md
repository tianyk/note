---
title: nginx-location
date: 2016-11-17 18:23:50
tags: 
---
### location 表达式类型

|syntax|说明                                                                       |
| ---- |----                                                                      |   
| =    | 进行普通字符精确匹配。也就是完全匹配。                                          |
| ^~   | 表示普通字符匹配（表示 uri 以某个常规字符串开头）。使用前缀匹配，如果匹配成功则不再匹配其他 location。|
| ~    | 表示执行一个正则匹配，区分大小写                                               |
| ~*   | 表示执行一个正则匹配，不区分大小写                                             |
|      | 无任何前缀的都属于普通location                                               |
| @    | "@" 定义一个命名的 location，使用在内部定向时，例如 error_page, try_files       |


### location 优先级说明
在nginx的location和配置中location的顺序没有太大关系。正location表达式的类型有关。相同类型的表达式，字符串长的会优先匹配。
以下是按优先级排列说明：   
第一优先级：等号类型（=）的优先级最高。一旦匹配成功，则不再查找其他匹配项。    
第二优先级：^\~类型表达式。一旦匹配成功，则不再查找其他匹配项。    
第三优先级：正则表达式类型（\~ \~* ）的优先级次之。如果有多个location的正则能匹配的话，则使用正则表达式最长的那个。   
第四优先级：常规字符串匹配类型。按前缀匹配。

> 普通匹配，遵循最长匹配规则，假设一个请求匹配到了两个普通规则，则选择匹配长度大的那个


### 实验
```
# RULE_1 精确匹配
location = / {
    echo "600";
}

# RULE_2 精确匹配
location = /images/favicon.ico {
    echo "601";
}

# RULE_4 无前缀匹配 不能和`^~ /images/`一起配置，冲突。
# location /images/ {
#   echo "602;    " 
# }

# RULE_5 普通字符匹配 字符匹配优先级大于正则
location ^~ /images/ {
    echo "602";
}

# RULE_6 普通字符匹配
location ^~ /images/fruit/ {
    echo "603";
}

# RULE_7 正则匹配
location ~ ^/images/ {
    echo "604";
}

# RULE_8 正则匹配
location ~ \.(jpg|png|ico)$ {
    echo "605";
}

# RULE_9 正则匹配
location ~ /^documents/ {   
    echo "606";
}

# RULE_10 正则匹配 **正则匹配时和顺序有关**
location ~ \.(docx|pptx|pdf)$ {
    echo "607";
}

# RULE_11 无前缀
location /files/ {
    echo "608";
}

# RULE_12 无前缀
location /files/videos/ {
    echo "609";
}

# 无前缀 RULE_13
location / {
    echo "699";
}
```

`/` => 600;    
`/images/favicon.ico` => 601;    
`/images/head.jpg` => 602;    
`/images/person/ming.jpg` => 602;    
`/images/fruit/watermelon.jpg` => 603;
`/head.png` => 605;      
`/documents/project.docx` => 606;   
`files/The-Lord-of-the-Rings.mp4` => 608;    
`files/videos/The-Lord-of-the-Rings.mp4` => 609;    
`/fruit.html` => 699;    


### 结论
1. 精确匹配`=`优先级最大。
2. 普通字符匹配`^~`比正则优先级大`~`，多个普通字符串规则都匹配时，匹配最长的优先级最高。
3. 正则匹配时，如果多条规则都符合排在前面的的优先级最大。
4. 无前缀最后匹配优先级最低，多个都匹配时，匹配最长的优先级最高。


### 参考
- [nginx location在配置中的优先级](http://www.bo56.com/nginx-location在配置中的优先级/) 
- [ginx-location](https://gist.github.com/luxixing/7262911)
- [Nginx 关于 location 的匹配规则详解](http://eyesmore.iteye.com/blog/1141660)
- [NGINX 的 location 语法规则](http://denglz.blog.51cto.com/3617037/1341841)
