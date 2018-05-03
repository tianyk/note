---
title: Java Lambda
date: 2017-06-01 17:26:31
tags: 
- java
- lambda
---
## Lambda 
![](/images/Java+Lambda.png)
<<http://naotu.baidu.com/file/6f48a8bf61f964bd63b986bdb83c2e79?token=11d0ce93b785bbf2>>

### 示例

单词转大写
``` java
String sentence = "Start Using Java Lambda Expressions";
List<String> words = Arrays.stream(sentence.split(" "))
                .map(String::toUpperCase)
                .collect(toList());
```

获取字符串的单词长度和
``` java
String sentence = "Start Using Java Lambda Expressions";
int length = Arrays.stream(sentence.split(" "))
                .map(String::length)
                .reduce(0, Integer::sum)
                .intValue();;
```

奇偶数分组
``` java
Map<Boolean, List<Integer>> res = Arrays.asList(1, 2, 3, 4, 5, 6).stream().collect(partitioningBy(i -> (i % 2 == 0)));
```

``` java
Object[] args = ...;
Arrays.stream(args).map(String::valueOf).collect(Collectors.joining(", ", "(", ")"));
```