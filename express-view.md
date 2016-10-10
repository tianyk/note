```
app.set('views', path.join(__dirname, 'views'));
// 注册模板引擎
app.set('view engine', 'html');
// 注册模板引擎实现
app.engine('html', ejs.renderFile);
```
