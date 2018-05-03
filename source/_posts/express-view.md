---
title: express-view.md
date: 2016-08-23 09:49:10
tags: express
---
```
app.set('views', path.join(__dirname, 'views'));
// 注册模板引擎
app.set('view engine', 'html');
// 注册模板引擎实现
app.engine('html', ejs.renderFile);
```
