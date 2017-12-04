```
curl -XGET 'http:/example.com/_search?pretty=true' -d ' 
{
    "query": {
        "match": {
            "title": {
                "query": "白鹿原"
            }
        }
    }
} '
```

<http://dbajun.iteye.com/blog/1813801>
<http://dbajun.iteye.com/blog/1813801>