### Node.js模块查找策略

首先在当前项目中`node_modules`目录中找，找不到去父文件夹`node_modules`找，一直到根目录下的`node_modules`。

可以在项目目录下建一个文件`module_path.js`，内为`console.log(module.paths);`。执行它就可以看到类似下面的结果了。

```
[ '/Users/doog/Documents/Workspaces/node/node-wxbot/node_modules',
  '/Users/doog/Documents/Workspaces/node/node_modules',
  '/Users/doog/Documents/Workspaces/node_modules',
  '/Users/doog/Documents/node_modules',
  '/Users/doog/node_modules',
  '/Users/node_modules',
  '/node_modules' ]
```

#### NODE_PATH
另外，如果在上所说的`node_modules`中都没有找到，它会去看有没有一个叫`NODE_PATH`的换几个变量。如果有，就去它下面找。`NODE_PATH`虽然可以解决安装的依赖包过多问题，但是用起来不方便，移植性不好。容易给不了解的人造成困惑，不建议使用。
