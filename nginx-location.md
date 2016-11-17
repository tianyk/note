### location 表达式类型

|syntax|说明                                                                       |
| ---- |----                                                                      |   
| ~    | 表示执行一个正则匹配，区分大小写                                               |
| ~*   | 表示执行一个正则匹配，不区分大小写                                             |
| ^~   | 表示普通字符匹配（表示 uri 以某个常规字符串开头）。使用前缀匹配，如果匹配成功则不再匹配其他 location。|
| =    | 进行普通字符精确匹配。也就是完全匹配。                                          |
| @    | "@" 定义一个命名的 location，使用在内部定向时，例如 error_page, try_files       |
|      | 无任何前缀的都属于普通location                                               |


### location 优先级说明
在nginx的location和配置中location的顺序没有太大关系。正location表达式的类型有关。相同类型的表达式，字符串长的会优先匹配。
以下是按优先级排列说明：   
第一优先级：等号类型（=）的优先级最高。一旦匹配成功，则不再查找其他匹配项。    
第二优先级：^~类型表达式。一旦匹配成功，则不再查找其他匹配项。    
第三优先级：正则表达式类型（~ ~* ）的优先级次之。如果有多个location的正则能匹配的话，则使用正则表达式最长的那个。   
第四优先级：常规字符串匹配类型。按前缀匹配。

> 普通匹配，遵循最长匹配规则，假设一个请求匹配到了两个普通规则，则选择匹配长度大的那个


### 实验
```
# RULE_1 精确匹配
location = / {
    return 600;
}

# RULE_2 精确匹配
location = /images/favicon.ico {
    return 601;
}

# RULE_4 无前缀匹配 不能和`^~ /images/`一起配置，冲突。
# location /images/ {
#   return 602;     
# }

# RULE_5 普通字符匹配 字符匹配优先级大于正则
location ^~ /images/ {
    return 602;
}

# RULE_6 普通字符匹配
location ^~ /images/fruit/ {
    return 603;
}

# RULE_7 正则匹配
location ~ ^/images/ {
    return 604;
}

# RULE_8 正则匹配
location ~ \.(jpg|png|ico)$ {
    return 605;
}

# RULE_9 正则匹配
location ~ /^documents/ {   
    return 606;
}

# RULE_10 正则匹配 **正则匹配时和顺序有关**
location ~ \.(docx|pptx|pdf)$ {
    return 607;
}

# RULE_11 无前缀
location /files/ {
    return 608;
}

# RULE_12 无前缀
location /files/videos/ {
    return 609;
}

# 无前缀 RULE_13
location / {
        return 699;
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
[【1】](http://www.bo56.com/nginx-location%E5%9C%A8%E9%85%8D%E7%BD%AE%E4%B8%AD%E7%9A%84%E4%BC%98%E5%85%88%E7%BA%A7/) [【2】](https://gist.github.com/luxixing/7262911)[【3】](http://eyesmore.iteye.com/blog/1141660)[【4】](http://denglz.blog.51cto.com/3617037/1341841)
