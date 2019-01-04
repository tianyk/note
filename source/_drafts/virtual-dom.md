---
title: 虚拟DOM
author: tyk
drafts: true
date: 2019-01-04 18:05:33
tags:
---
## 虚拟DOM

data => vdom => dom 

为什么说虚拟dom会快？

虚拟dom就是简单的 diff data 找到 变化的dom，批处理更新了这个变化dom。虚拟dom快正是快在这个批量更新。