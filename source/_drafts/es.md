GET _search
{
   "query": {
      "match_all": {}
   }
}
    
GET ?pretty


GET _count?pretty

GET access/access/_search

GET access/access/AVZs_XWoGpp1VYvsWygE

GET access/access/_search?q=pid:12790

GET ccsbase/template/_count

GET ccsbase/template/19

GET ccsbase/template/_search
{
    "query": {
        "match": {
           "_id": "19"
        }
    }
}

GET access/access/_search 
{
    "query": {
        "match": {
           "user_agent": "YunFarm"
        }
    }
}

GET access/access/_search 
{
    "query": {
        "match_phrase": {
           "user_agent": "Linux/3.4.39 Android/4.3"
        }
    },
    "highlight": {
        "fields" : {
            "user_agent" : {}
        }
    }
}


GET access/access/_search
{
    "aggs": {
        "all_interests": {
            "terms": { "field": "http_status_code" }
        }
    }
}

GET access/_mapping/access

GET access/_analyze

GET /_template/logstash 

PUT /access/_mapping
{
    "access" :{
        "properties": {
            "http_status_code": {"type": "string", "index": "not_analyzed"}
        }
    }
}

PUT /index

POST /access/_mapping
{
    "access" :{
        "properties": {
            "http_status_code": {"type": "string", "index": "not_analyzed"}
        }
    }
}


GET /access/_analyze

GET /access/_mapping


GET _cat/indices?v

PUT /access
{
  "mappings": {
    "access": {
      "properties": {
        "properties": {
            "http_status_code": {"type": "string", "index": "not_analyzed"}
        }
      }
    }
  }
}


PUT /access
{
  "mappings": {
    "access": {
      "properties": {
            "http_status_code": {"type": "string", "index": "not_analyzed"}
      }
    }
  }
}

GET /ccsbase/template/_count

GET /ccsbase/template/_mapping

GET /ccsbase/template/_search
{
   "query": {
      "match_all": {}
   }
}

POST  /ccsbase/template/_delete_by_query
{
   "query": {
      "match_all": {}
   }
}

PUT /ccsbase 
{
    "mappings": {
        "template": {
            "properties": {
                "id": {
                    "type": "long",
                    "index": "not_analyzed"
                }, 
                "name": {
                    "type": "string"
                }, 
                "cover": {
                    "type": "string",
                    "index": "not_analyzed"
                }, 
                "description": {
                    "type": "string"
                }, 
                "version": {
                    "type": "string",
                    "index": "not_analyzed"
                }, 
                "proper_description": {
                    "type": "string"
                },
                "shelf_status": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "operation_video": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "operation_doc": {
                    "type": "string"
                },
                "template_type": {
                    "type": "long"
                },
                "proper_type": {
                    "type": "long"
                },
                "style_type": {
                    "type": "long"
                },
                "created_at": {
                    "type": "long"
                },
                "created_by": {
                    "type": "long"
                },
                "updated_at": {
                    "type": "long"
                },
                "updated_by": {
                    "type": "long"
                },
                "deleted_at": {
                    "type": "long"
                },
                "deleted_by": {
                    "type": "long"
                },
                "type": {
                    "type": "long"
                }
            }
        }
    }
}

PUT /naccess
{
    "mappings": {
        "access": {
            "properties": {
                "@version": {
                  "type": "string",
                  "index": "not_analyzed"
               },
               "content_length": {
                  "type": "long",
                  "index": "not_analyzed"
               },
               "host": {
                  "type": "string",
                  "index": "not_analyzed"
               },
               "http_request": {
                  "type": "string"
               },
               "http_status_code": {
                  "type": "short",
                  "index": "not_analyzed"
               },
               "http_version": {
                  "type": "string",
                  "index": "not_analyzed"
               },
               "level": {
                  "type": "string",
                  "index": "not_analyzed"
               },
               "message": {
                  "type": "string"
               },
               "method": {
                  "type": "string",
                  "index": "not_analyzed"
               },
               "mobile": {
                  "type": "string",
                  "index": "not_analyzed"
               },
               "path": {
                  "type": "string",
                  "index": "not_analyzed"
               },
               "pid": {
                  "type": "integer",
                  "index": "not_analyzed"
               },
               "port": {
                  "type": "integer",
                  "index": "not_analyzed"
               },
               "referrer": {
                  "type": "string"
               },
               "remote-addr": {
                  "type": "ip",
                  "index": "not_analyzed"
               },
               "response_time": {
                  "type": "integer",
                  "index": "not_analyzed"
               },
               "sid": {
                  "type": "string",
                  "index": "not_analyzed"
               },
               "type": {
                  "type": "string",
                  "index": "not_analyzed"
               },
               "user_agent": {
                  "type": "string"
               }
            }
        }
    }
}

GET /naccess/_search


PUT /platform
{
    "mappings": {
        "_default_": {
            "properties": {
                "client_ip": {
                    "type": "ip"
                },
                "host": {
                    "type": "ip"
                },
                "response": {
                  "type": "short",
                  "index": "not_analyzed"
               },
               "bytes": {
                  "type": "long"
               }
            }
        }
    }
}


GET /platform/_stats


GET /resource/_mapping

PUT /resource 
{
    "mappings": {
        "words": {
            "properties": {
                "id": {
                    "type": "long",
                    "index": "not_analyzed"
                }, 
                "key": {
                    "type": "string"
                }, 
                "videos": {
                    "properties": {
                        "id" : {"type": "long","index": "not_analyzed"},
                        "url" : {"type" : "string", "index": "not_analyzed"}
                    }
                }
            }
        }
    }
}

POST /resource/words/2
{
    "id": 123,
    "key": "apple",
    "videos": [
        {
            "id": 1,
            "url": "http://www.baidu.com"
        }    
    ]
}


GET /51resource/gif/_search


POST /resource/words/1/_update/
{
    "script": "ctx._source.key = \"apple\""
}

POST /resource/words/2/_update/
{
    "script": "if (ctx._source.containsKey(\"videos\")) { ctx._source.videos.add(video) }",
    "params": {
        "video": {
            "id": 2,
            "url": "http://www.baidu.com/1"
        }
    },
    "lang": "groovy",
    "upsert": {
       "videos": [
            {
                "id": 2,
                "url": "http://www.baidu.com/1"
            }
        ] 
    }
}

POST /resource/words/2/_update/
{
    "script": "if (ctx._source.containsKey(\"videos\")) { ctx._source.videos.add(video) }",
    "params": {
        "video": {
            "id": 2,
            "url": "http://www.baidu.com/1"
        }
    },
    "upsert": {
       "videos": [
            {
                "id": 2,
                "url": "http://www.baidu.com/1"
            }
        ] 
    }
}

POST /resource/words/2/_update/
{
    "script": "if (ctx._source.containsKey(\"videos\")) { def need_remove_item = []; for (item in ctx._source.videos) { if (item.id == id) { need_remove_item.add(item);} }; for (item in need_remove_item) { ctx._source.videos.remove(item);} }",
    "params": {
        "id": 3
    }
}

POST /resource/words/3/_update/
{
    "script": "if (ctx._source.containsKey(\"videos\")) { def idx = ctx._source.videos.findIndexOf { video -> video.id == id }; if (-1 != idx) {ctx._source.videos[idx] = video }  else { ctx._source.videos.add(video) } }",
    "params": {
        "id": 3,
        "video": {
            "id": 3,
            "url": "http://www.google.com/3"
        }
    },
    "upsert": {
       "videos": [
            {
                "id": 3,
                "url": "http://www.google.com/2"
            }
        ] 
    }
}

GET /resource/_search

POST /resource/words/4/_update/
{
    "body": {
        "script": "for (field in fields) {ctx._source.remove(field)}",
        "params": {
            "fields": ["sound_en", "sound_us", "sound_fast", "sound_slow", "created_at", "updated_at", "key", "videos"]
        }
    }
}

DELETE /51resource 

GET /51resource/words/25


GET /51resource/word/_count

POST /51resource/words/5/_update
{
    "script": "if (ctx._source.containsKey(\"means\")) { def idx = ctx._source.means.findIndexOf { mean -> mean.id == id }; if (-1 != idx) { ctx._source.means[idx] = mean; } else { ctx._source.means.add(mean); } } else { ctx._source.means = [mean] } ",
    "params":{
        "id": 34,
        "mean":{ 
            "id": "34",
            "wid": "5",
            "nominal": "adj",
            "translate": "标准的，合格的;普遍的，一般的;公认为优秀的",
            "explain": "standar",
            "created_at": "1495439763875",
            "updated_at": "1495439763875" 
        }
    },
    "upsert": {
        "means": [{ 
            "id": "34",
            "wid": "5",
            "nominal": "adj",
            "translate": "标准的，合格的;普遍的，一般的;公认为优秀的",
            "explain": "standar",
            "created_at": "1495439763875",
            "updated_at": "1495439763875" 
        }]
    }
}




PUT /51resource 
{
    "mappings": {
        "words": {
            "properties": {
                "id": {
                    "type": "long",
                    "index": "not_analyzed"
                }, 
                "key": {
                    "type": "string",
                    "index": "analyzed",
                    "analyzer": "english"
                }, 
                "phonet_en": {
                    "type": "string",
                    "index": "no"
                }, 
                "phonet_us": {
                    "type": "string",
                    "index": "no"
                }, 
                "sound_en" : {
                     "type": "string",
                     "index": "no"
                },
                "sound_us" : {
                     "type": "string",
                     "index": "no"
                },
                "sound_fast" : {
                     "type": "string",
                     "index": "no"
                },
                "sound_slow" : {
                     "type": "string",
                     "index": "no"
                },
                "gifs": {
                    "properties": {
                        "id" : {
                            "type": "long",
                            "index": "no"
                        },
                        "url" : {
                            "type" : "string",
                            "index": "no"
                        },
                        "created_at": {
                            "ignore_malformed": true,
                            "type": "date",
                            "format": "epoch_millis"
                        },
                        "updated_at": {
                            "ignore_malformed": true,
                            "type": "date",
                            "format": "epoch_millis"
                        }
                    }
                },
                "pictures": {
                    "properties": {
                        "id" : {
                            "type": "long",
                            "index": "no"
                        },
                        "url" : {
                            "type" : "string",
                            "index": "no"
                        },
                        "created_at": {
                            "ignore_malformed": true,
                            "type": "date",
                            "format": "epoch_millis"
                        },
                        "updated_at": {
                            "ignore_malformed": true,
                            "type": "date",
                            "format": "epoch_millis"
                        }
                    }
                },
                "videos": {
                    "properties": {
                        "id" : {
                            "type": "long",
                            "index": "no"
                        },
                        "url" : {
                            "type" : "string",
                            "index": "no"
                        },
                        "created_at": {
                            "ignore_malformed": true,
                            "type": "date",
                            "format": "epoch_millis"
                        },
                        "updated_at": {
                            "ignore_malformed": true,
                            "type": "date",
                            "format": "epoch_millis"
                        }
                    }
                },
                "means": {
                    "properties": {
                        "id" : {
                            "type": "long",
                            "index": "no"
                        },
                        "nominal" : {
                            "type" : "string",
                            "index": "not_analyzed"
                        },
                        "translate" : {
                            "type" : "string",
                            "index": "analyzed",
                            "analyzer": "ik_smart",
                            "search_analyzer": "ik_smart"
                        },
                        "explain": {
                            "type" : "string",
                            "index": "analyzed",
                            "analyzer": "english"
                        },
                        "created_at": {
                            "ignore_malformed": true,
                            "type": "date",
                            "format": "epoch_millis"
                        },
                        "updated_at": {
                            "ignore_malformed": true,
                            "type": "date",
                            "format": "epoch_millis"
                        }
                    }
                },
                "created_at": {
                    "ignore_malformed": true,
                    "type": "date",
                    "format": "epoch_millis"
                },
                "updated_at": {
                    "ignore_malformed": true,
                    "type": "date",
                    "format": "epoch_millis"
                }
            }
        }
    }
}


GET /abc/words/_mapping

GET /abc/words/_search


POST /abc/words/1
{
    "id": 1, 
    "key": "apple",
    "phonet_en": "['æp(ə)l]",
    "phonet_us": "['æpl]",
    "sound_en": "http://videos.51talk.com/sound_en",
    "sound_us": "http://videos.51talk.com/sound_us",
    "sound_fast": "http://videos.51talk.com/sound_fast",
    "sound_slow": "http://videos.51talk.com/sound_slow",
    "gifs": [
        {
            "id": 1,
            "url": "http://gif.51talk.com/gif/2",
            "created_at": 1494921306410,
            "updated_at": 1494921306410
        },
        {
            "id": 2,
            "url": "http://gif.51talk.com/gif/2",
            "created_at": 1494921306410,
            "updated_at": 1494921306410
        }
    ],
    "pictures": [
        {
            "id": 1,
            "url": "http://picture.51talk.com/gif/1",
            "created_at": 1494921306410,
            "updated_at": 1494921306410
        },
        {
            "id": 2,
            "url": "http://pictures.51talk.com/gif/2",
            "created_at": 1494921306410,
            "updated_at": 1494921306410
        }
    ],
    "videos": [
        {
            "id": 1,
            "url": "http://video.51talk.com/gif/1",
            "created_at": 1494921306410,
            "updated_at": 1494921306410
        },
        {
            "id": 2,
            "url": "http://video.51talk.com/gif/2",
            "created_at": 1494921306410,
            "updated_at": 1494921306410
        }
    ],
    "means": [
        {
            "id" : 1,
            "nominal" : "noun",
            "translate" : "苹果，苹果树，苹果似的东西；[美俚]炸弹，手榴弹，（棒球的）球；[美俚]人，家伙。",
            "explain": "his ongoing search for the finest varieties of apple.",
            "created_at": 1494921306410,
            "updated_at": 1494921306410
        },
        {
            "id" : 2,
            "nominal" : "noun",
            "translate" : "苹果公司（英语：Apple Inc.，NASDAQ：AAPL，LSE：ACP），原稱苹果电脑公司（英语：Apple Computer, Inc.），於2007年1月9日在舊金山Macworld Expo（英语：Macworld Expo）上宣佈改为现名。苹果公司是一家美国跨国公司，总部位于美国加利福尼亞庫比蒂諾，致力于设计、开发和销售消费电子、计算机软件、在线服务和个人计算机。苹果的Apple II於1970年代助长了个人电脑革命，其後的Macintosh接力於1980年代持续发展。该公司最著名的硬件产品是Mac电脑系列、iPod媒体播放器、iPhone智慧型手机和iPad平板电脑；在线服务包括iCloud、iTunes Store和App Store；消费软件包括macOS和iOS操作系统、iTunes多媒体浏览器、Safari网络浏览器，还有iLife和iWork创意和生产力套件。",
            "explain": "Apple is an American multinational technology company headquartered in Cupertino, California that designs, develops, and sells consumer electronics, computer software, and online services. The company's hardware products include the iPhone smartphone, the iPad tablet computer, the Mac personal computer, the iPod portable media player, the Apple smartwatch, and the Apple TV digital media player. Apple's consumer software includes the macOS and iOS operating systems, the iTunes media player, the Safari web browser, and the iLife and iWork creativity and productivity suites. Its online services include the iTunes Store, the iOS App Store and Mac App Store, Apple Music, and iCloud.",
            "created_at": 1494921306410,
            "updated_at": 1494921306410
        }
    ]
}


GET /51resource/question_bank/19


DELETE /51resource/word/_query
{
    "query" : { 
        "match_all" : {}
    }
}


POST /51resource/word/10503/_update
{   
    "script":"if (ctx._source.containsKey(\"means\")) { def need_remove_item = []; for (item in ctx._source.means) { if (item.id == id) need_remove_item.add(item); }; for (item in need_remove_item) { ctx._source.means.remove(item); } ctx._source.means.add(doc); } else { ctx._source.means = [doc]; }",
    "params":{
        "id":"14557",
        "doc":{"id":"14557","wid":"10503","nominal":"adj","translate":" 迅速的","created_at":"1499047603099","updated_at":"1499047603100"}
    },
    "upsert":{
        "means":[
            {"id":"14557","wid":"10503","nominal":"adj","translate":" 迅速的","created_at":"1499047603099","updated_at":"1499047603100"}
            ]
    }
}


GET /51resource/question_bank/_count

DELETE /51resource/word_sentence/_query
{
    "query" : { 
        "match_all" : {}
    }
}

GET /51resource/word/10

GET /51resource/word_sentence/_count

DELETE /library

GET /library/books/_count





