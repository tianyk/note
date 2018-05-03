---
title: mongoose-validation
date: 2016-10-10 12:06:27
tags: 
---
<http://mongoosejs.com/docs/validation.html>
``` javascript
var schema = new Schema({
  name: {
    type: String,
    required: true
  }
});
var Cat = db.model('Cat', schema);

// This cat has no name :(
var cat = new Cat();
cat.save(function(error) {
  assert.equal(error.errors['name'].message,
    'Path `name` is required.');

  error = cat.validateSync();
  assert.equal(error.errors['name'].message,
    'Path `name` is required.');
});
```


<http://cnodejs.org/topic/504b4924e2b84515770103dd>
``` javascript
var PersonSchema = new Schema({
  name:{
    type:'String',
    required:true //姓名非空
  },
  age:{
    type:'Nunmer',
    min:18,       //年龄最小18
    max:120     //年龄最大120
  },
  city:{
    type:'String',
    enum:['北京','上海']  //只能是北京、上海人
  },
  other:{
    type:'String',
    validate:[validator,err]  //validator是一个验证函数，err是验证失败的错误信息
  }
});
```
