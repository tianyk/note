---
title: timemachine-exclusion
author: tyk
date: 2021-02-19 11:29:14
tags:
---
## Time Machine 批量排除文件

1. 批量排除文件

	timemachine 不支持通配符匹配排除，需要添加多条规则来排除。

	``` bash
	# 排除所有的 `node_modules` 文件夹
	find . -maxdepth 3 -type d -name 'node_modules' | xargs -n 1 tmutil addexclusion

	# 排除所有的 `.git` 目录
	find . -maxdepth 3 -type d -name '.git' | xargs -n 1 tmutil addexclusion
	```

2. 检查文件是否被排除 

	```
	find . -exec tmutil isexcluded {} + | grep -F "[Excluded]" | sed -E 's/^\[Excluded\][[:space:]]*//'
	```

### 参考

1. [Exclude node_modules in timemachine](https://gist.github.com/peterdemartini/4c918635208943e7a042ff5ffa789fc1)