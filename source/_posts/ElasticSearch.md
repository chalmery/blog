---
title: Elasticsearch
categories:
  - Java
tags:
  - Java
toc: true
---

# Elasticsearch

### 一、现存问题

#### 1.1 现存问题

- 海量数据存储
- 海量数据中完成全文检索
- 如何实现关键字的高亮显示
- 海量数据中完成统计操作

#### 1.2 ES的介绍（搜索引擎）

> Elasticsearch天生分布式，支持海量数据的存储，什么在大数据领域也有应用。
> 
> Elasticsearch采用倒排索引的方式去全文检索数据，亿级数据中检索时间在毫秒级别。
> 
> Elasticsearch提供了highlight高亮查询方式
> 
> Elasticsearch提供了及其丰富和聚合函数
> 
> Elasticsearch基于Java实现，搜索功能是基于先进最流行的Lucene实现……
> 
> Elasticsearch本身是一套技术栈，[ELK]()中的一个组件，ELK是收集日志的一套技术栈……
> 
> 中文官方地址：https://www.elastic.co/cn/elasticsearch/

### 二、安装ES&Kibana&IK分词器

> 采用docker运行Elasticsearch容器和Kibana容器

#### 2.1 安装ES&Kibana

docker-compose.yml

```yml
version: "3.1"
services:
  elasticsearch:
    image: 10.9.12.200:60001/elasticsearch:7.8.0
    # restart: always     # 只要docker启动，当前容器自动启动
    container_name: elasticsearch
    ports:
      - 9200:9200
    environment:
      - "discovery.type=single-node"
      - "ES_JAVA_OPTS=-Xms256m -Xmx256m"
    volumes:
      - ./data:/usr/share/elasticsearch/data
      - ./config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      # 数据卷如果映射文件，需要提前在宿主机中创建好这个文件
  kibana:
    image: 10.9.12.200:60001/kibana:7.8.0
    # restart: always
    container_name: kibana
    ports:
      - 5601:5601
    environment:
      - elasticsearch_url=http://192.168.41.98:9200
    depends_on:
      - elasticsearch
    volumes:
      - ./config/kibana.yml:/usr/share/kibana/config/kibana.yml
```

数据卷映射文件的内容

elasticsearch.yml

```yml
cluster.name: "docker-cluster"
network.host: 0.0.0.0
```

kibana.yml

```yml
server.name: kibana
server.host: "0"
elasticsearch.hosts: [ "http://elasticsearch:9200" ]
xpack.monitoring.ui.container.elasticsearch.enabled: true
```

准备好上述内容后，[docker-compose up -d]()

检测启动是否成功：

- Linux中输入：curl localhost:9200
  
  | 成功访问es                                                                             |
  |:----------------------------------------------------------------------------------:|
  | ![image-20210908144227670](https://img.yangcc.top/img/image-20210908144227670.png) |

- Windows浏览器输入：192.168.41.98:5601
  
  | 启动成功                                                                               |
  |:----------------------------------------------------------------------------------:|
  | ![image-20210908144352004](https://img.yangcc.top/img/image-20210908144352004.png) |

#### 2.2 安装IK分词器

在kibana中基于RESTful的形式和ES交互

需要在kibana上发送HTTP请求并携带JSON参数与ES交互

在kibana的dev tools上测试分词器

| 自带分词器对中文支持不好                                                                       |
|:----------------------------------------------------------------------------------:|
| ![image-20210908150803352](https://img.yangcc.top/img/image-20210908150803352.png) |

安装IK分词器

下载地址：https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.8.0/elasticsearch-analysis-ik-7.8.0.zip

需要将zip压缩包解压的内容放到elasticsearch容器内部的`/usr/share/elasticsearch/plugins/ik_analyzer/`

修改docker-compose.yml文件，给elasticsearch添加了一个数据卷，映射到`/usr/local/docker/es_docker/plugins`

将zip压缩包扔到Linux中，并且放到数据库内的ik_analyzer目录里，通过unzip解压，重启elasticsearch容器

再次通过IK分词器进行分词

| IK分词器效果                                                                            |
|:----------------------------------------------------------------------------------:|
| ![image-20210908151137092](https://img.yangcc.top/img/image-20210908151137092.png) |

### 三、ES的存储结构

| 存储数据结构                                                                             |
|:----------------------------------------------------------------------------------:|
| ![image-20210908153241240](https://img.yangcc.top/img/image-20210908153241240.png) |

> 在ES服务中创建索引，并指定索引的主分片个数，以及备份分片个数。
> 
> 给索引设置存储数据的结构
> 
> 上述搞定后，可以向索引中添加文件……

### 四、索引操作

#### 4.1 创建索引（不指定存储结构）

```json
# 创建索引
PUT /book
{
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 1
  }
}
```

#### 4.2 Elasticsearch数据类型

- 字符串类型：
  
  - text：文本类型，一般用于搜索……
  - keyword：关键字，当前值不允许分词……

- boolean类型：
  
  - boolean：没啥说的…………

- 二进制类型：
  
  - binary：只支持encoding为Base64格式……

- 数值类型：
  
  | `long`          | A signed 64-bit integer with a minimum value of `-263` and a maximum value of `263-1`.         |
  | --------------- | ---------------------------------------------------------------------------------------------- |
  | `integer`       | A signed 32-bit integer with a minimum value of `-231` and a maximum value of `231-1`.         |
  | `short`         | A signed 16-bit integer with a minimum value of `-32,768` and a maximum value of `32,767`.     |
  | `byte`          | A signed 8-bit integer with a minimum value of `-128` and a maximum value of `127`.            |
  | `double`        | A double-precision 64-bit IEEE 754 floating point number, restricted to finite values.         |
  | `float`         | A single-precision 32-bit IEEE 754 floating point number, restricted to finite values.         |
  | `half_float`    | A half-precision 16-bit IEEE 754 floating point number, restricted to finite values.           |
  | `scaled_float`  | A floating point number that is backed by a `long`, scaled by a fixed `double` scaling factor. |
  | `unsigned_long` | An unsigned 64-bit integer with a minimum value of 0 and a maximum value of `264-1`.           |

- 时间类型：
  
  - date：代表时间类型，根据format设置格式化方式
    
    ```json
    "format": "yyyy-MM-dd || yyyy-MM-dd HH:mm:ss || strict_date_optional_time || epoch_millis"
    ```

- ip类型：
  
  - ip：支持ipv4和ipv6类型

- geo类型：
  
  - geo_point：支持经纬度存储……

#### 4.3 创建索引（结构化存储）

```json
# 创建索引并设置存储结构
PUT /novel
{
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text",    # 这样会使用默认的standard分词器，使用IK需要额外添加信息
        "analyzer": "ik_max_word"   # 添加这个才会使用IK分词器  
      },
      "author": {
        "type": "keyword"
      },
      "count": {
        "type": "long"
      },
      "onsale": {
        "type": "date",
        "format": "yyyy-MM-dd || yyyy-MM-dd HH:mm:ss || strict_date_optional_time || epoch_millis"
      }
    }
  }
}
```

创建成功，查看效果

|                                                                                    |
| ---------------------------------------------------------------------------------- |
| ![image-20210908163006480](https://img.yangcc.top/img/image-20210908163006480.png) |

索引构建成功后

- 主分片个数不允许修改……

- 备份分片个数可以随意修改……

- 索引中的属性类型是不允许修改的，但是可以追加属性……
  
  ```json
  PUT /索引/_mapping
  {
    "properties": {
      "field": {
        "type": "datatype"
      }
    }
  }
  ```

#### 4.4 查看索引

> 可以通过图形化界面查看

REST查看

```json
GET /索引
```

#### 4.5 删除索引

> 可以通过图形化界面删除

REST删除

```json
DELETE /索引
```

### 五、文档操作

#### 5.1 添加文档

```json
# 添加文档，指定id添加，自动生成id
POST /novel/_doc/    # 自动生成id
{
  "name": "斗破苍穹",
  "author": "天残土豆",
  "count": 99999,
  "onsale": "2000-01-01"
}

POST /novel/_create/1     # 手动设置id
{
  "name": "斗罗大陆",
  "author": "唐家三少",
  "count": 999999,
  "onsale": "2010-01-01"
}
```

#### 5.2 修改文档

```json
# 修改文档
POST /novel/_update/1
{
  "doc": {
    "name": "倒斗大陆"
  }
}
```

#### 5.3 删除文档

```json
# 删除文档
DELETE /novel/_doc/sXVVyHsB4k1tdHs36v4c
```

#### 5.4 根据id查询文档

```JSON
# 根据_id查询文档
GET /novel/_doc/1
```

| 查询返回结果                                                                             |
| ---------------------------------------------------------------------------------- |
| ![image-20210909102845512](https://img.yangcc.top/img/image-20210909102845512.png) |

### 六、Java操作ES

> Elasticsearch官方推出了两种Java操作的客户端，采用[Rest-High-Level-Client]()。
> 
> 还有另一种与Elasticsearch交互客户端，可以写类似SQL的语句，与Elasticsearch交互。
> 
> 还有另一种与Elasticsearch交互客户端，SpringBoot整合的data-elasticsearch。

#### 6.1 Java连接Elasticsearch服务

##### 6.1.1 导入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.elasticsearch</groupId>
        <artifactId>elasticsearch</artifactId>
        <version>7.8.0</version>
    </dependency>
    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>elasticsearch-rest-high-level-client</artifactId>
        <version>7.8.0</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
</dependencies>
```

##### 6.1.2 编写配置类

```java
public class ESClientUtil {

    /**
     * 获取与ES交互的client对象
     * @return
     */
    public static RestHighLevelClient getClient(){

        HttpHost httpHost = new HttpHost("192.168.41.98",9200);

        RestClientBuilder restClientBuilder = RestClient.builder(httpHost);

        RestHighLevelClient restHighLevelClient = new RestHighLevelClient(restClientBuilder);

        return restHighLevelClient;
    }
}
```

#### 6.2 添加文档

```java
private final String CREATED = "created";

@Test
public void addDoc() throws IOException {
    //1. 创建指定的request对象
    IndexRequest indexRequest = new IndexRequest();

    //2. 设置索引信息，文档id
    indexRequest.index("novel");
    indexRequest.id("3");

    //3. 准备具体文档数据
    Map source = new HashMap<>(8);
    source.put("name","明朝");
    source.put("author","朱元璋");
    source.put("count",88888);
    // 时间推荐使用年月日时分秒格式，虽然kibana显示有问题，但是查询结果没问题
    source.put("onsale",new Date());
    indexRequest.source(source);

    //4. 将request用RestHighLevelClient发送出去，接收ES服务的响应
    IndexResponse resp = ESClientUtil.getClient().index(indexRequest, RequestOptions.DEFAULT);

    //5. 基于响应结果，判断添加是否成功
    if (CREATED.equals(resp.getResult().getLowercase())) {
        System.out.println("文档添加成功！！！");
    }
}
```

#### 6.3 修改文档

```java
@Test
public void updateById() throws IOException {
    //1. 创建指定的request对象
    UpdateRequest request = new UpdateRequest();

    //2. 设置索引信息，文档id
    request.index("novel");
    request.id("3");

    //3. 准备具体文档数据
    Map<String, Object> source = new HashMap<>(4);
    source.put("name","明朝那么多事！");
    request.doc(source);

    //4. 将request用RestHighLevelClient发送出去，接收ES服务的响应
    UpdateResponse resp = ESClientUtil.getClient().update(request, RequestOptions.DEFAULT);

    //5. 基于响应结果，判断操作是否成功
    if (UPDATED.equals(resp.getResult().getLowercase())) {
        System.out.println("文档修改成功！");
    }
}
```

#### 6.5 批量操作

| 批量操作                                                                               |
|:----------------------------------------------------------------------------------:|
| ![image-20210909113231519](https://img.yangcc.top/img/image-20210909113231519.png) |

#### 6.6 根据id查询文档

```java
@Test
public void get() throws IOException {
    //1. 创建指定的request对象
    GetRequest request = new GetRequest();

    //2. 设置索引信息，文档id
    request.index("novel");
    request.id("3");

    //3. 将request用RestHighLevelClient发送出去，接收ES服务的响应
    GetResponse resp = ESClientUtil.getClient().get(request, RequestOptions.DEFAULT);

    //4. 基于响应结果，判断操作是否成功
    System.out.println(resp.getSourceAsMap());
}
```

### 七、ES的基本查询

#### 7.1 倒排/反向索引

| 倒排索引                                                                               |
|:----------------------------------------------------------------------------------:|
| ![image-20210909142550809](https://img.yangcc.top/img/image-20210909142550809.png) |

#### 7.2 term查询

> term是ES最基本的查询，基本上所有的检索方式的底层都是term查询……

##### 7.2.1 term查询

> term查询对比MySQL的话，相当于：where column = ？
> 
> term就是将用户输入的关键字与ES中的某一个属性做等值比较（当前属性的分词库）。
> 
> term不会将用户输入的关键字进行分词，直接拿用户的完整关键字匹配分词库。
> 
> term更适合查询keyword类型的属性

| 查询执行流程                                                                             |
|:----------------------------------------------------------------------------------:|
| ![image-20210909145205115](https://img.yangcc.top/img/image-20210909145205115.png) |

```json
# term查询
POST /sms_logs_index/_search
{
  "query": {
    "term": {
      "smsContent": {
        "value": "滴滴单车平台"
      }
    }
  }
}
```

##### 7.2.2 terms查询

> term查询对比MySQL的话，相当于：where column in (?,?,?)
> 
> 和terms一致，让用户输入多个关键字去匹配一个属性

```json
[[terms查询]]
POST /sms_logs_index/_search
{
  "query": {
    "terms": {
      "smsContent": [
        "滴滴打车",
        "平台"
      ]
    }
  }
}
```

#### 7.3 match查询

> match查询是使用频率最高的查询方式，match查询的底层还是term查询
> 
> match查询会根据查询的field的属性，决定是否将用户输入的关键字进行分词
> 
> - 如果field是keyword类型，match查询不会将用户输入的关键字进行分词
> - 如果field是text类型，match查询会将用户输入的关键字进行分词

##### 7.3.1 match查询

> 用户输入一个关键字去匹配一个Field

```json
# match查询
POST /sms_logs_index/_search
{
  "query": {
    "match": {
      "smsContent": "【招商银行】尊贵的王五先生"
    }
  }
}
```

##### 7.3.2 match_all查询

> 查询全部数据

```json
# match_all 查询
POST /sms_logs_index/_search
{
  "query": {
    "match_all": {}
  },
  "from": 10,           # limit的第一个参数
  "size": 10,           # limit的第二个参数
  "sort": [            # 指定根据哪个field做排序，不根据es的分数进行排序……
    {
      "fee": {
        "order": "asc"
      }
    }
  ]
}
```

##### 7.3.3 multi_match查询

> 一个值匹配多个Field
> 
> 提升ES的查询命中率……

```json
# multi_match
POST /sms_logs_index/_search
{
  "query": {
    "multi_match": {
      "query": "银行",
      "fields": ["corpName","smsContent"]
    }
  }
}
```

#### 7.4 range查询

> range查询可以实现范围检索
> 
> 针对数值，时间和IP地址做范围查询

```json
# range 查询
# 数值范围
POST /sms_logs_index/_search
{
  "query": {
    "range": {
      "fee": {
        "gte": 1,   
        "lt": 5     
      }
    }
  }
}

# 时间范围,      时间格式规定好，推荐都用时分秒，skr~~
POST /sms_logs_index/_search
{
  "query": {
    "range": {
      "sendDate": {
        "gte": "2021-09-09 02:11:11",
        "lte": "2021-09-09 05:59:11",
        "format": "yyyy-MM-dd HH:mm:ss"
      }
    }
  }
}

# ip范围
POST /sms_logs_index/_search
{
  "query": {
    "range": {
      "ipAddr": {
        "gt": "9.126.2.8",
        "lte": "11.126.2.255"       
      }
    }
  }
}
```

#### 7.5 Java与ES交互实现查询操作

```java
public class Demo2Test {

    /**
     *  range范围查询，基于fee，查询1分到5分之间的
     */
    @Test
    public void rangeQuery() throws IOException {
        //1. req
        SearchRequest request = new SearchRequest();

        //2. index
        request.indices("sms_logs_index");

        //3. body
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();

        sourceBuilder.query(QueryBuilders.rangeQuery("fee").gte(1).lte(5));
        sourceBuilder.from(0);
        sourceBuilder.size(2);
        sourceBuilder.sort("fee", SortOrder.ASC);

        request.source(sourceBuilder);

        //4. execute
        SearchResponse resp = ESClientUtil.getClient().search(request, RequestOptions.DEFAULT);

        //5. source
        for (SearchHit hit : resp.getHits().getHits()) {
            System.out.println(hit.getSourceAsMap());
        }

    }
}
```

### 八、ES的其他查询

#### 8.1 ids查询

> ids是根据多个_id的值，直接拉取分片上的数据……

```json
# ids查询
POST /sms_logs_index/_search
{
  "query": {
    "ids": {
      "values": ["1","2","3"]
    }
  }
}
```

#### 8.2 prefix查询

> 将用户输入的关键字去分词库中匹配term的前缀……

```json
# prefix查询
POST /sms_logs_index/_search
{
  "query": {
    "prefix": {
      "corpName": {
        "value": "养车"
      }
    }
  }
}
```

#### 8.3 fuzzy查询

> 真正的模块查询，允许用户输入的关键字有错别字（错别字尽量出现在后面……）

```json
# fuzzy查询
POST /sms_logs_index/_search
{
  "query": {
    "fuzzy": {
      "corpName": {
        "value": "盒马生鲜"
      }
    }
  }
}
```

#### 8.4 wildcard查询

> 和MySQL中的like查询一样的通配、占位查询，
> 
> - MySQL%代表通配，_代表占位
> - wildcard中*代表通配，？代表占位

```json
# wildcard查询
POST /sms_logs_index/_search
{
  "query": {
    "wildcard": {
      "corpName": {
        "value": "中国????????"
      }
    }
  }
}
```

#### 8.5 regexp查询

> 基于正则表达式匹配分词库中的term

```json
# regexp查询
POST /sms_logs_index/_search
{
  "query": {
    "regexp": {
      "mobile": "1390[0-9]{7}"
    }
  }
}
```

### 九、ES的复合查询

> 基于ES的query查询数据时，暂时只能一个条件一个条件的使用，没有办法将多个条件以一定的逻辑方式组合在一起。
> 
> ES也支持查询方式，允许多个条件封装到一起，这种查询叫[bool查询]()
> 
> 只要公司项目用ES做全文检索，[100%用bool查询]()
> 
> bool查询提供了四种组合方式：
> 
> - must：等于MySQL的and
> - should：等于MySQL的or
> - must_not：等于MySQL的!
> - filter：在query的筛选基础上，再次做筛选，这次筛选不会计算分数

```json
# bool查询
# smsContent中包含先生  并且  fee大于等于5分
# 省份要么是北京，要么是上海
# 公司名称不是     滴滴打车
# 将上述结果再次筛选出手机号为 13900000000的
POST /sms_logs_index/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "smsContent": "先生"
          }
        },
        {
          "range": {
            "fee": {
              "gte": 5
            }
          }
        }
      ],
      "should": [
        {
          "term": {
            "province": {
              "value": "北京"
            }
          }
        },
        {
          "term": {
            "province": {
              "value": "西安"
            }
          }
        }
      ],
      "must_not": [
        {
          "term": {
            "corpName": {
              "value": "滴滴打车"
            }
          }
        }
      ],
      "filter": [
        {
          "term": {
            "mobile": "13900000000"
          }
        }
      ],
      "minimum_should_match": 0
    }
  }
}
```

### 十、ES的高亮查询

> 将用户输入的关键字匹配项，以高亮的形式返回。

```json
# 高亮查询
POST /sms_logs_index/_search
{
  "query": {
    "term": {
      "corpName": "滴滴打车"
    }
  },
  "highlight": {
    "pre_tags": "<span style='color:red;'>",
    "post_tags": "</span>",
    "fragment_size": 20,
    "fields": [
      {"corpName": {}}
    ]
  }
}
```

Java代码

```java
public class Demo2Test {

    @Test
    public void matchQuery() throws IOException {
        //1. req
        SearchRequest request = new SearchRequest();

        //2. index
        request.indices("sms_logs_index");

        //3. body
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();

        sourceBuilder.query(QueryBuilders.matchQuery("smsContent","先生"));
        sourceBuilder.from(0);
        sourceBuilder.size(2);
        sourceBuilder.sort("fee", SortOrder.ASC);
        HighlightBuilder highligter = new HighlightBuilder();
        highligter.fragmentSize(20);
        highligter.field("smsContent");
        highligter.preTags("<span style='color:red;'>");
        highligter.postTags("</span>");
        sourceBuilder.highlighter(highligter);

        request.source(sourceBuilder);

        //4. execute
        SearchResponse resp = ESClientUtil.getClient().search(request, RequestOptions.DEFAULT);

        //5. source
        for (SearchHit hit : resp.getHits().getHits()) {
            System.out.println(hit.getSourceAsMap());
            Map<String, HighlightField> highlightFields = hit.getHighlightFields();
            HighlightField smsContent = highlightFields.get("smsContent");
            if(smsContent != null){
                String highlight = smsContent.getFragments()[0].toString();
                System.out.println("highlight:" + highlight);
            }
        }
    }
}
```

### 十一、ES的聚合函数ES

提供了丰富的聚合函数在海量数据中做统计

> 想MySQL提供的5种聚合函数，ES都支持……    
> 
> ES提供的聚合函数特别多，挑几个常用的……

#### 11.1 Extended_stats

> 查询出指定属性的count，min，max，sum，avg，平方和，方差，标准偏差…………

```json
# 聚合函数-Extended stats
POST /sms_logs_index/_search
{
  "aggs": {
    "heiheihei": {
      "extended_stats": {
        "field": "fee"
      }
    }
  }
}
```

#### 11.2 Cardinality

> 针对非text类型的属性做 [去重计数]()

```json
# 聚合函数-Cardinality
POST /sms_logs_index/_search
{
  "aggs": {
    "xixixi": {
      "cardinality": {
        "field": "createDate"
      }
    }
  }
}
```

#### 11.3 Range统计

> ES中针对Range范围统计提供了Range，DateRange，IPRange
> 
> 可以统计范围内出现数据的数量。

```json
# 聚合函数-Range
POST /sms_logs_index/_search
{
  "aggs": {
    "hahaha": {
      "range": {
        "field": "fee",
        "ranges": [
          {"to": 5},
          {"from": 5,"to": 8},
          {"from": 8}
        ]
      }
    }
  }
}

# 聚合函数-DateRange
POST /sms_logs_index/_search
{
  "aggs": {
    "hehehe": {
      "date_range": {
        "field": "createDate",
        "ranges": [
          {"to": "2021-09-09 04:00:00"},
          {"from": "2021-09-09 04:00:00","to": "2021-09-09 12:00:00"},
          {"from": "2021-09-09 12:00:00"}
        ],
        "format": "yyyy-MM-dd HH:mm:ss"
      }
    }
  }
}
```

#### 11.4 histogram

> 根据指定的属性和间隔interval做范围统计

```json
# 聚合函数-histogram
POST /sms_logs_index/_search
{
  "aggs": {
    "eee": {
      "histogram": {
        "field": "fee",
        "interval": 1
      }
    }
  }
}


# 聚合函数-date_histogram
POST /sms_logs_index/_search
{
  "aggs": {
    "yesyesyes": {
      "date_histogram": {
        "field": "createDate",
        "interval": "minute"
      }
    }
  }
}
```

#### 11.5 terms

> 统计某个属性不同值出现的次数，并且可以基于order做排序，基于size做筛选条数

```json
# 聚合函数-terms
POST /sms_logs_index/_search
{
  "aggs": {
    "yiku": {
      "terms": {
        "field": "fee",
        "size": 2,
        "order": {
          "_count": "asc"
        }
      }
    }
  }
}
```

#### 11.6 Java代码实现

> 向下转型问题！

```java
/**
 * 聚合函数Java实现
 * @author zjw
 */
public class Demo3Test {


    @Test
    public void terms() throws IOException {
        // request
        SearchRequest request = new SearchRequest();

        // index
        request.indices("sms_logs_index");

        // body
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        sourceBuilder.aggregation(AggregationBuilders.terms("agg").field("fee").size(10).order(BucketOrder.count(false)));
        request.source(sourceBuilder);

        // send,resp
        SearchResponse resp = ESClientUtil.getClient().search(request, RequestOptions.DEFAULT);

        // getData
        Aggregations aggregations = resp.getAggregations();
        // 根据聚合函数的查询条件向下转型
        Terms agg = aggregations.get("agg");

        for (Terms.Bucket bucket : agg.getBuckets()) {
            System.out.println(bucket.getKey() +"," + bucket.getDocCount());
        }

    }
}
```

### 十二、ES的GEO查询

> GEO查询就是基于经纬度做筛选。
> 
> 一般经纬度筛选无法计算分数，会将基于GEO的查询统统滴放到filter中。
> 
> 创建一个索引，指定一个属性的存储类型是[geo_point]() 

```json
# 玩GEO，创建索引
PUT /map 
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "keyword"
      },
      "location": {
        "type": "geo_point"
      }
    }
  }
}


# 插入三条数据 北科，生命科学园地铁，巩华城地铁
POST /map/_create/1
{
  "name": "北科",
  "location": {
    "lat": 40.125318,
    "lon": 116.258312
  }
}

POST /map/_create/2
{
  "name": "生命科学园地铁",
  "location": {
    "lat": 40.101109,
    "lon": 116.300721
  }
}

POST /map/_create/3
{
  "name": "巩华城地铁",
  "location": {
    "lat": 40.13731,
    "lon": 116.300344
  }
}
```

GEO在ES中提供了三种查询方式

| geo_distance                                                                       |
|:----------------------------------------------------------------------------------:|
| ![image-20210910114724159](https://img.yangcc.top/img/image-20210910114724159.png) |

```json
# 一个点，一个距离（半径）查询圆内数据
POST /map/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "geo_distance": {
            "distance": 4700,
            "location": {
              "lat": 40.125318,
              "lon": 116.258312
            }
          }
        }
      ]
    }
  }
}
```

| geo_bounding_box                                                                   |
|:----------------------------------------------------------------------------------:|
| ![image-20210910114910950](https://img.yangcc.top/img/image-20210910114910950.png) |

```json
# 两个点确定矩形
POST /map/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "geo_bounding_box": {
            "location": {
              "top_left": {
                "lat": 40.109973,
                "lon": 116.278192
              },
              "bottom_right": {
                "lat": 40.093416,
                "lon": 116.32131
              }
            }
          }
        }
      ]
    }
  }
}
```

| geo_polygon                                                                        |
|:----------------------------------------------------------------------------------:|
| ![image-20210910115101114](https://img.yangcc.top/img/image-20210910115101114.png) |

```json
# 多个点确定多边形
POST /map/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "geo_polygon": {
            "location": {
              "points": [
                {
                  "lat": 40.143736,
                  "lon": 116.29084
                },
                {
                  "lat": 40.127132,
                  "lon": 116.306003
                },
                {
                  "lat": 40.148479,
                  "lon": 116.313549
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```
