---
title: phantomjs
author: tyk
date: 2018-05-07 14:37:53
tags:
---

```
var webPage = require('webpage');
var page = webPage.create();

page.viewportSize = { width: 1920, height: 1080 };
page.open("http://ccss.51talk.com/text/ccs/704861/09/index.html", function start(status) {
    // setTimeout(function() {
        page.render('ccss1.jpeg', {format: 'jpeg', quality: '100'});
        phantom.exit();

    //}, 2000);
});
```