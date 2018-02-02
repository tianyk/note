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


curl -XPOST --cookie "token:abc;sesson_id:def" --header "HOST: www.baidu.com" --header "Content-Length: 0" http://127.0.0.1/dopost