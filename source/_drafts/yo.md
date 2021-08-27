---
title: yo
author: tyk
date: 2021-06-09 16:44:32
tags:
---

## yo

```bash
npm i yo -g
```

### 创建 Generator

```bash
npm i generator-generator -g
```

初始化项目
```bash
yo generator
```

填写项目信息
```bash
? Your generator name generator-node-web
? The name above already exists on npm, choose another? No
Your generator must be inside a folder named generator-node-web
I'll automatically create this folder.
? Description Node.js webserver
? Project homepage url 
? Author's Name tyk
? Author's Email yongketian@gmail.com
? Author's Homepage 
? Package keywords (comma to split) node,express
? Send coverage reports to coveralls No
? Enter Node versions (comma separated) 10,12,14,16
? GitHub username or organization tianyk
? Which license do you want to use? MIT
   create package.json
   create README.md
   create .editorconfig
   create .gitattributes
   create .gitignore
   create generators/app/index.js
   create generators/app/templates/dummyfile.txt
   create __tests__/app.js
   create .travis.yml
   create .eslintignore
   create LICENSE
```

`generators/app/templates` 用来放项目模板。