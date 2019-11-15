# 数字空间数据上报及实时数据获取指南-建筑类 V1.6

[TOC]


## 1 应用接入(上报及下发)

接入微瓴物联平台的应用, 无论此应用用于数据上报还是用于数据接收, 均需要在[微瓴开放平台](https://open.welink.qq.com)进行应用接入申请, 并获取appid等一系列与平台通讯所必须票据

### 1.1 选择接入环境名称及对应域名

***文档中所有示例域名均为沙箱环境的域名, 用户需根据自身项目所在环境进行选择, 不同环境之间相互独立, 所申请所有资源不互通***

| 网络环境 |           域名           | 备注 |
| :------: | :----------------------: | :--: |
| 沙箱环境 | sandboxapi.welink.qq.com |      |
| 广州环境 |   api-gz.welink.qq.com   |      |

### 1.2 应用接入及权限申请

通过 <https://open.welink.qq.com/#/dev-resource/guide/app-access> 的指引,完成在对应的项目下完成项目应用的入驻, 然后获取appid, app_key及app_ticket等参数

***APP ID***: 应用唯一标识符, 每创建一个新应用, 后台会为其配置一个新的应用ID, 且后续不可更改
创建过的应用即使在删除后, 其应用ID仍然不能被新创建的应用所占有, 在所属环境中具有特定性,唯一性,不可更改性及永久性

***APP Ticket***: 应用票据, 在进行鉴权获取定时token时使用, 所获取票据用于登录微瓴openAPI, 票据具有有效期限的, 在沙箱阶段, 默认有效期限是一年(一年按365天计算)
在距离到期时间前15天内, 您可以根据自身需要对App Ticket进行重置, 重置后会生成新的App Ticket, 有效期限重置

### 1.3 登入鉴权方式及token获取

通过https://open.welink.qq.com/#/dev-resource/api/login-auth 的指引, 获取对应的token, 文档中提供了多种登入鉴权以及token的获取方式, token有效期为20分钟

## 2 应用数据上报

### 2.1 普通上报

使用 Welink OpenApi 消息推送接口 `/common/msg/report`进行上报

- **接口**：/common/msg/report
- **描述**：消息广播接口, 发送消息到平台
- **请求方法**：POST

#### 2.1.1请求参数

|   请求参数   | 参数类型 | 是否必填 | 参数说明                                                     |
| :----------: | :------: | :------: | :----------------------------------------------------------- |
|    token     |  String  |    是    | 登入鉴权获参数：登录微瓴鉴权接口获取的动态密钥(token)        |
| iotim_ticket |  String  |    是    | 应用接入微瓴时, 平台分配的鉴权参数：登录获取的物联票据       |
| message_type | Integer  |    是    | 消息类型,上报数字空间数据默认使用的 **message_type** 为 ***1000500*** |
|   content    |  Object  |    是    | 消息内容, 1000500默认为通知内容字段                          |

####  2.1.2 请求示例

**请求URL**: `https://api.weiling.qq.com/common/msg/report`

**请求body**:

```json
{
  "message_type": 1000500,
  "content":{
    "key1": "xxxx",
    "key2": 123454678000,
    "key3": "",
    "key4": {}
  }
}
//a.请求头：Content-Type:application/json
//b.请求参数:"token": "********","iotim_ticket": "************"
//c.请求包体:{"message_type":1000100,"content":"test content"}
```

#### 2.1.3 返回参数

| 返回参数 | 参数类型 | 参数说明                                                     |
| :------: | :------: | :----------------------------------------------------------- |
|   code   |  String  | 错误码, 0表示请求成功, 非0则请求失败,具体错误详见[错误码](#131-错误码说明) |
| message  |  String  | 执行结果消息                                                 |
|   data   |   Json   | 操作结果                                                     |
|   seq    |  String  | 消息的seq                                                    |

#### 2.1.4 返回示例

**返回body**:

```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "seq": 5031740
  }
}
```

### 2.2 特殊上报

暂无,待更新

## 3 实时应用数据接收

实时推送数据主要针对于人脸门禁的进出, 停车场车辆的驶入驶出, 电梯实时状态, 各系统及设备的告警等, 此类数据通过 ***websocket*** 方式接入, 具体接入步骤参见微瓴websocket订阅文档, 微瓴根据用户所在项目分发所能获取到的数据的权限, 实时推送的数据分为三类: ***告警数据，消警数据，通知数据***


### 3.1 技术概述

***SWMP***（Space web message protocol）应用于分流分权限向外提供数字空间实时推送数据消息, 结合STOMP设计全部使用UTF-8, 头名统一大写, 非body部分统一英文
SEND,RECEIPT暂不提供首先通过websocket与后端endpoint建立连接, 一个客户端只需要建立一个websocket连接, 可以建立备用连接

### 3.2 接入流程

#### 3.2.1 接入websocket并与datahub建立长连接

从上述登入鉴权接口中通过appid及app_ticket获取token,与websocket连接的请求地址为为`wss://api.weiling.qq.com/space/websocket/datahub/swmp/messageHub?token=xxxxxxx`

#### 3.2.2 订阅所需topic

通过下文中告警及通知子类型可获取数字空间所有现行topic, 微瓴权限服务可控制及分配应用订阅数据权限, 订阅前请先确定是否有权限订阅所需topic,然后发出订阅请求

- 请求示例
  
```shell
websocket.send("SUBSCRIBE 0.1\r\nFRAME-ID:151215125\r\nTOPIC:/space/datahub/***订阅type***/***订阅subtype***\r\n\0")
```

***注：FRAME-ID建议使用当前毫秒级时间戳***

如若订阅成功, 返回以下数据

- 返回示例

```shell
RESPONSE 0.1
FRAME-ID: **************
STATUS: 200
REQUEST-FRAME-ID: ********
CONTENT-LENGTH:2

SUBSCRIBE SUCCESS
```

#### 3.2.3 维持连接

如果应用所订阅topic ***60秒*** 内没有数据推送, websocket将断开连接, 若要保持连接, 则需发送定时发送维持连接请求

- 请求示例

```shell
websocket.send("REQUEST 0.1\r\nFRAME-ID:fdsafsaf\r\nCONTENT-TYPE:text/plain;charset=utf-8\r\nCONTENT-LENGTH:4\r\nDESTINATION:/swmp/heartbeat\r\n\r\n\0keep\r\n\0")
```

如若维持连接成功, 返回以下数据

- 返回示例

```shell
RESPONSE 0.1
FRAME-ID: **************
STATUS: 200
REQUEST-FRAME-ID: ********
CONTENT-LENGTH:2

OK
```

#### 3.2.4 取消订阅

将需要取消订阅的topic 发送websocket server端

- 请求示例

```shell
websocket.send("UNSUBSCRIBE 0.1\r\nFRAME-ID:151215125\r\nTOPIC:/space/datahub/face_access/inout\r\n\0")
```

如若断开连接成功, 返回以下数据

- 返回示例

```shell
RESPONSE 0.1
FRAME-ID: **************
STATUS: 200
REQUEST-FRAME-ID: ********
CONTENT-LENGTH:2

UNSUBSCRIBE SUCCESS
```

## 4. 告警数据说明

### 4.1 告警数据格式说明

|   字段名称   |    字段类型    | 级别 |                           字段描述                           | 必须 |          备注           |
| :----------: | :------------: | :--: | :----------------------------------------------------------: | :--: | :---------------------: |
| message_type |    integer     |  1   |       用于判断该消息的分类, 告警级别消息固定为1000300        |  是  |                         |
|   content    |     object     |  1   |                         告警内容字段                         |  是  |                         |
|      id      |     string     |  2   |             告警的唯一标识, 以uuid形式存储, 小写             |  是  |  隶属于一级字段content  |
|     time     |     string     |  2   |                       时间, 毫秒时间戳                       |  是  |  隶属于一级字段content  |
|     type     |     string     |  2   |                           告警类型                           |  是  |  隶属于一级字段content  |
|   sub_type   |     string     |  2   |                          告警子类型                          |  是  |  隶属于一级字段content  |
|    level     |     intger     |  2   | 告警级别: 1-通知类警告, 2-轻警告:48小时内处理, 3-中级警告:12小时内处理, 4-严重警告:2小时内处理, 5-致命警告:需要立即处理 |  是  |  隶属于一级字段content  |
|   position   |     object     |  2   |                   位置信息, 若无, 则保留{}                   |  是  |  隶属于一级字段content  |
|     din      |     string     |  3   |              设备 din,若非设备告警,可为空字符串              |  否  | 隶属于二级字段position  |
|     wId      |     string     |  3   |            设备或位置 wId,若无该信息,可为空字符串            |  否  | 隶属于二级字段position  |
|     text     |     string     |  3   |                         位置文字描述                         |  否  | 隶属于二级字段position  |
| description  |     string     |  2   |                告警补充描述信息,若无,则返回""                |  是  |  隶属于一级字段content  |
|    advice    |     string     |  2   |                     处理建议,若无,则为""                     |  是  |  隶属于一级字段content  |
|   handler    |     object     |  2   |                   处理工具, 若无, 则保留{}                   |  是  |  隶属于一级字段content  |
|     type     |     intger     |  3   |   处理方式："url" (打开链接处理) , "other"（其他处理方式）   |  否  |  隶属于二级字段handler  |
|     data     |     string     |  3   |                 对应的url或者其他的处理方式                  |  否  |  隶属于二级字段handler  |
|    status    |     string     |  2   |                固定为"ununprocessed",未被处理                |  是  |  隶属于一级字段content  |
|  processor   |     array      |  2   | 处理人员的所有信息，若无，则返回[],数组中每个元素为由id和name组成的object,{"id":  "someid","name": "someone" } |  是  |  隶属于一级字段content  |
|      id      |     string     |  3   |                          处理人的id                          |  否  | 隶属于二级字段processor |
|     name     |     string     |  3   |                         处理人的名字                         |  否  | 隶属于二级字段processor |
|    image     |     object     |  2   |                   告警图像, 若无, 则保留{}                   |  是  |  隶属于一级字段content  |
|     type     |     string     |  3   |         图像类型, 1: base64编码, 2: url, 3:image_id          |  否  |   隶属于二级字段image   |
|     data     | *base on type* |  3   |      图片数据, type1:base64, type2:String, type3:String      |  是  |   隶属于二级字段image   |
|    extend    |     object     |  2   |     告警扩展信息, 具体字段根据业务作区分, 若无,则返回{}      |  是  |  隶属于一级字段content  |

### 4.2 告警数据格式样例

```json
{
 "message_type":  1000300,
 "content": {
    "id":  "xxxx",
    "time":  "123454678000",  
    "type":  "security_monitoring",  
    "sub_type":  "invade",
    "level":  1,
    "position": {
      "din":  "",  
      "wId":  "",  
      "text": ""
    },
    "description": "xxx",
    "advice":  "xxx",  
    "handler": {
      "type":  "",  
      "data":  ""  
    },
    "status": "xxxxxx",
    "processor": [
      {
        "id":  "someid",
        "name": "someone"
      }
    ],
    "image": {
      "type":  1,
      "data": "base64 data"
    },
    "extend": {}  
    }
}

```
## 5.消警数据说明

### 5.1 消警数据格式说明

|      字段名称       | 字段类型 | 字段级别 |                           字段描述                           | 是否必须 |          备注           |
| :-----------------: | :------: | :------: | :----------------------------------------------------------: | :------: | :---------------------: |
|    message_type     | integer  |    1     |       用于判断该消息的分类，告警级别消息固定为1000302        |    是    |                         |
|       content       |  object  |    1     |                         告警内容字段                         |    是    |                         |
|         id          |  string  |    2     |            告警的唯一标识，与之前告警的id信息对应            |    是    |  隶属于一级字段content  |
|        time         | integer  |    2     |                       时间，毫秒时间戳                       |    是    |  隶属于一级字段content  |
|       status        |  string  |    2     |                 若处理完成则为processed状态                  |    是    |  隶属于一级字段content  |
|      processor      |  array   |    2     | 处理人员的所有信息，若无，则返回[],数组中每个元素为由id和name组成的object,{"id":  "someid","name": "someone" } |    是    |  隶属于一级字段content  |
|         id          |  string  |    3     |                          处理人的id                          |    否    | 隶属于二级字段processor |
|        name         |  string  |    3     |                         处理人的名字                         |    否    | 隶属于二级字段processor |
| process_description |  string  |    2     |                告警补充描述信息,若无,则返回""                |    是    |  隶属于一级字段content  |
|   process_extend    |  object  |    2     | 告警扩展信息, 具体字段根据业务作区分,详见 ***告警类型***,若无,则返回{} |    是    |  隶属于一级字段content  |

###  5.2 消警数据格式样例

```json
{
 "message_type":  1000302,
 "content": {
    "id":  "xxxx",
    "time":  "123454678000",  
    "status": "processed",
    "processor": [
      {
        "id":  "someid",
        "name": "someone"
      }
    ],
    "process_description":"",
    "process_extend": {}  
    }
}

```




## 6. 通知类数据说明

### 6.1 通知数据格式说明

|   字段名称   |    字段类型    | 级别 |                      字段描述                      | 必须 |          备注          |
| :----------: | :------------: | :--: | :------------------------------------------------: | :--: | :--------------------: |
| message_type |    integer     |  1   |  用于判断该消息的分类, 通知级别消息固定为1000400   |  是  |                        |
|   content    |     object     |  1   |                    通知内容字段                    |  是  |                        |
|      id      |     string     |  2   |        通知的唯一标识, 以uuid形式存储, 小写        |  是  | 隶属于一级字段content  |
|     time     |     string     |  2   |                  时间, 毫秒时间戳                  |  是  | 隶属于一级字段content  |
|     type     |     string     |  2   |                      通知类型                      |  是  | 隶属于一级字段content  |
|   sub_type   |     string     |  2   |                     通知子类型                     |  是  | 隶属于一级字段content  |
|   position   |     object     |  2   |              位置信息, 若无, 则保留{}              |  是  | 隶属于一级字段content  |
|     din      |     string     |  3   |         设备 din,若非设备通知,可为空字符串         |  否  | 隶属于二级字段position |
|     wId      |     string     |  3   |       设备或位置 wId,若无该信息,可为空字符串       |  否  | 隶属于二级字段position |
|     text     |     string     |  3   |                    位置文字描述                    |  否  | 隶属于二级字段position |
| description  |     string     |  2   |          通知补充描述信息, 若无则放回 ""           |  是  | 隶属于一级字段content  |
|    image     |     object     |  2   |              通知图像, 若无, 则保留{}              |  是  | 隶属于一级字段content  |
|     type     |    integer     |  3   |    图像类型, 1: base64编码, 2: url, 3:image_id     |  否  |  隶属于二级字段image   |
|     data     | *base on type* |  3   | 图片数据, type1:base64, type2:String, type3:String |  否  |  隶属于二级字段image   |
|    extend    |     object     |  2   |  扩展信息, 具体字段根据业务作区分; 若无,则保留{}   |  是  | 隶属于一级字段content  |

### 6.2 通知数据格式样例

```json
{
 "message_type":  1000400,
 "content": {
    "id":  "xxxx",
    "time":  "123454678000",  
    "type":  "security-monitoring",  
    "sub_type":  "invade",  
    "position": {
      "din":  "",  
      "wId":  "",  
      "text": ""
      },
    "description": "xxx",  
    "image": {
      "type":  1,
      "data": "base64 data"
    },
    "extend": {}  
    }
}

```
## 7. 告警及消警数据子类型

针对于不同的告警子分类, 告警消息的 ***extend*** 字段中, 包含有不同的字段
### 7.1. security_monitoring(安防告警)

#### 7.1.1 invade（入侵检测）
- ***extend对象中所含字段详情***

  
| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |



#### 7.1.2 retention（非法滞留）

- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

#### 7.1.3 fire（火灾监控）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

#### 7.1.4 crowd（异常聚集）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

#### 7.1.5 tumble（摔倒）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

### 7.2. energy(能耗告警)

#### 7.2.1 excessive（能耗用度异常）
- ***extend对象中所含字段详情***



|  扩展字段名   | 扩展字段数据类型 | 扩展字段描述 |            示例            |
| :-----------: | :--------------: | :----------: | :------------------------: |
| current_value |      intger      |   电量用度   | "current_value" : 520.1314 |

### 7.3. energy_efficiency(能效告警)

### 7.4. parking(停车场告警)

### 7.5. conference(会议室告警)

###7.6 face_access(人脸门禁告警)

### 7.7 elevator(电梯告警)
#### 7.7.1 block（滞留）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

#### 7.7.2 delayed（延误）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

### 7.8 illumination(照明告警)

### 7.9 people_flow(人流告警)

#### 7.9.1 excessive（人流数量异常）
- ***extend对象中所含字段详情***



|  扩展字段名   | 扩展字段数据类型 | 扩展字段描述 |          示例          |
| :-----------: | :--------------: | :----------: | :--------------------: |
| current_value |      intger      |   当前人流   | "current_value" : 1024 |

### 7.10 fire_protecting(消防告警)

#### 7.10.1 fire_alarm(火警)
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|     -      |        -         |      -       |  -   |
- ***数据示例***

```json
  {
   "message_type":  1000300,
   "content": {
      "id":  "xxxx",
      "time":  "123454678000",  
      "type":  "fire_protecting",  
      "sub_type":  "fire_alarm",
      "level":  5,
      "position": {
        "din":  "",  
        "wId":  "",  
        "text": ""
      },
      "description": "xxx",
      "advice":  "xxx",  
      "handler": {
        "type":  "",  
        "data":  ""  
      },
      "status": "processed",
      "processor": [],
      "image": {
      },
      "extend": {}  
      }
  }
```

  

### 7.11 access_control(门禁告警)

### 7.12 HAVC(暖通空调系统告警)

### 7.13 robot(机器人告警)

### 7.14 enviornment(环境告警)

### 7.15 work_order(工单系统)

####  7.15.1 order_response(工单回复)

- ***extend对象中所含字段详情***



|字段名称| 字段类型 |字段描述|示例|备注|层级隶属|
|:--:| :--: |:--: |:------------: | :-------- |:--: |
|guid|string|唯一编号|"guid":"xxxxxxxxxxxxx"|||
|visitTime|struct|回访时间|"visitTime":""|||
|recorder|int|回访人|"recorder":""|||
|reviewContext|string|回访记录|"reviewContext":""|||
|customerSatify|string|客户满意度|"customerSatify":""|0:满意<br/>1:不满意||
|finishTime|string|报修人电子邮件|"finishTime":""|||
|  remark   |string|故障工作记录|"remark":""|||
|satisfaction|enum|工程维修满意度|"satisfaction":""|0:满意<br/>1:不满意||
|reason|enum|不满意原因|"reason":""|||
|owner|string|维修人|"owner":""|||
|      state      |string|表单状态|"state":""|0:待分派<br/>1:故障处理中<br/>2:已完成<br/>3:已回访<br/>4:待物料<br/>5:待承包商||
| stateChangeTime |enum|   状态更新时间   |"stateChangeTime":1|                                                              ||
|receivedTime|string|表单接收时间|"receivedTime":|||
|stateCode|enum|状态码|"stateCode":0|0 可用<br />1 不可用||

#### 7.15.2 order_report(工单上报)

- ***extend对象中所含字段详情***



|字段名称| 字段类型 |字段描述|示例|备注|层级隶属|
|:--:| :--: |:--: |:------------: | :-------- |:--: |
|guid|string|唯一编号|"guid":"xxxxxxxxxxxxx"||events.order_report|
|reportedPersonInfo|struct|上报人信息|"reportedPersonInfo":{}||events.order_report|
|requestorType|int|报修人类型|"requestorType":""||reportedPersonInfo|
|requestorName|string|报修人姓名|"requestorName":""||reportedPersonInfo|
|phoneNumber|string|报修人手机号码|"phoneNumber":""||reportedPersonInfo|
|email|string|报修人电子邮件|"email":""||reportedPersonInfo|
|fax|string|报修人传真|"fax":""||reportedPersonInfo|
|repairType|enum|报修方式|"repairType":2|0: 电话<br/>1:Email<br/>2:微信<br/>3:上门<br/>4:保安巡逻|events.order_report|
|level|enum|紧急级别|"level":3|1:常规<br/>3:重要<br/>5:紧急|events.order_report|
|describe|string|故障说明|"describe":""||events.order_report|
|remark|string|备注|"remark":""||events.order_report|
|formType|enum|表单类型|"formType":1|0:正常<br/>1:补单|events.order_report|
|address|struct|地址对象|"address":{}||events.order_report|
|roomName|string|房间号|"roomName":""||address|
|floor|string|楼层|"floor":""||address|
|buildingName|string|楼栋名称|"buildingName":""||address|
|stateCode|enum|状态码|"stateCode":0|0 可用<br />1 不可用|address|



#### 7.15.3 order_cancel(工单取消)
- ***extend对象中所含字段详情***



|字段名称| 字段类型 |字段描述|示例|备注|层级隶属|
|:--:| :--: |:--: |:------------: | :-------- |:--: |
|guid|string|唯一编号|"guid":"xxxxxxxxxxxxx"|||
|reportedPersonInfo|struct|上报人信息|"reportedPersonInfo":{}|||
|requestorType|int|报修人类型|"requestorType":""||reportedPersonInfo|
|requestorName|string|报修人姓名|"requestorName":""||reportedPersonInfo|
|phoneNumber|string|报修人手机号码|"phoneNumber":""||reportedPersonInfo|
|email|string|报修人电子邮件|"email":""||reportedPersonInfo|
|fax|string|报修人传真|"fax":""||reportedPersonInfo|
|repairType|enum|报修方式|"repairType":2|0: 电话<br/>1:Email<br/>2:微信<br/>3:上门<br/>4:保安巡逻||
|level|enum|紧急级别|"level":3|1:常规<br/>3:重要<br/>5:紧急||
|describe|string|故障说明|"describe":""|||
|remark|string|备注|"remark":""|||
|formType|enum|表单类型|"formType":1|0:正常<br/>1:补单||
|address|struct|地址对象|"address":{}|||
|roomName|string|房间号|"roomName":""||address|
|floor|string|楼层|"floor":""||address|
|buildingName|string|楼栋名称|"buildingName":""||address|
|stateCode|enum|状态码|"stateCode":0|0 可用<br />1 不可用|address|

### 7.16 device(设备告警)

#### 7.16.1 online（上线）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例  |
| :--------: | :--------------: | :----------: | :---: |
|    Null    |        -         |      -       |   -   |

#### 7.16.2 offline（离线）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例  |
| :--------: | :--------------: | :----------: | :---: |
|    Null    |        -         |      -       |   -   |

#### 7.16.3 fault（报错）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例  |
| :--------: | :--------------: | :----------: | :---: |
|    Null    |        -         |      -       |   -   |



## 8. 通知数据子类型

针对于不同的告警子分类, 告警消息的 ***extend*** 字段中, 所必须包含的子字段及其类型属性

### 8.1 security_monitoring(安防通知)

#### 8.1.1 trace_start(任务开始)
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 |          扩展字段描述          |                       示例                       |
| :--------: | :--------------: | :----------------------------: | :----------------------------------------------: |
|  success   |     Boolean      |    轨迹追踪任务是否成功开启    |                  "success":True                  |
| error_msg  |      string      | 错误信息, 若无报错, 则返回"OK" |                 "error_msg":"OK"                 |
|  task_id   |      string      |             任务id             | "task_id":"03189df8-4b00-4041-9b2a-81ce1a2a94fc" |

#### 8.1.2 trace_end(任务结束)
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 |          扩展字段描述          |                       示例                       |
| :--------: | :--------------: | :----------------------------: | :----------------------------------------------: |
|  success   |     Boolean      |    轨迹追踪任务是否成功结束    |                  "success":True                  |
| error_msg  |      string      | 错误信息, 若无报错, 则返回"OK" |                 "error_msg":"OK"                 |
|  task_id   |      string      |             任务id             | "task_id":"03189df8-4b00-4041-9b2a-81ce1a2a94fc" |

#### 8.1.3 trace_result(任务返回结果)
- ***extend对象中所含字段详情***



| 扩展字段名  | 扩展字段数据类型 |                         扩展字段描述                         |                             示例                             |
| :---------: | :--------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|   success   |     Boolean      |                   轨迹追踪任务是否查询成功                   |                        "success":True                        |
|  error_msg  |      string      |                错误信息, 若无报错, 则返回"OK"                |                       "error_msg":"OK"                       |
|   task_id   |      string      |                            任务id                            |       "task_id":"03189df8-4b00-4041-9b2a-81ce1a2a94fc"       |
| is_finished |     Boolean      | 结果返回为异步,查询可能返回多次result,该字段返回true时说明此次结果返回结束 |                      "is_finished":True                      |
| trace_list  |      array       | 轨迹追踪的记录,为对象的数组,对象内部包括设备din,设备经纬度,高度,时间戳,image_id,person_id,相似度等 | [{'timestamp': '1556071040858', 'din': '144115194532172045', 'image_id': '9c6d1104-0bc3-424c-aa2e-2eac8920dc44', 'person_id': 'B0CD2705-5C4E-4CD3-8D3A-41B901BED094', 'similarity': 4}, {'timestamp': '1556071042609', 'din': '144115194549121985', 'image_id': '955a4bc1-e1f5-4638-8e2c-489eba62c0e4', 'person_id': '3240A4BB-93D6-4B3B-A679-6DD1B281906E', 'similarity': 3}] |

### 8.2 energy(能耗通知)

### 8.3 energy_efficiency(能效通知)

### 8.4 parking(停车场通知)

#### 8.4.1 inout(车辆进出)

- ***extend对象中所含字段详情***



|  扩展字段名  | 扩展字段数据类型 |           扩展字段描述            |          备注          |
| :----------: | :--------------: | :-------------------------------- | :--------------------: |
| inout_status |      String      | 0:进场车辆，1:出场车辆 |  "inout_status":0  |
|  plate_num   |      String      |          当前事件车牌号           | "plate_num":"粤B88888" |
|car_type|intger|车辆类型：0:未知<br/> 1:临时⻋车辆; <br />2:⽉月卡⻋车辆; <br />3:固定⻋车位; <br />4:VIP; <br />5:预约⻋车辆;<br />6:⿊黑名单⻋车辆;|"car_type":1|
|vehicle_type|intger|车辆类型：0:未知<br/>1：大型车<br />2：中型车<br />3：小型车|"vehicle_type":1|
|lane_type|intger|车辆类型：0:未知<br/> 1：人工<br />2：自动（ETC，无感）<br />9：其他|"lane_type":1|
|parking_lot_id|string|停⻋车场id|"parking_lot_id":"xxxxxxxxx"|
|parking_lot_name|string|停⻋车场名称|"parking_lot_name": "腾大停车场"|
|free_berth|integer|停车场空余车位数|"free_berth":12|
|occupy_berth|integer|停车场当前车位数|"occupy_berth":435|



#### 8.4.2 pay(车辆支付数据)

- ***extend对象中所含字段详情***



|  扩展字段名  | 扩展字段数据类型 |           扩展字段描述            |                    |
| :----------: | :--------------: | :-------------------------------- | :--------------------: |
|  plate_num   |      String      |          当前事件车牌号           | "plate_num":"粤B88888" |
|car_type|intger|车辆类型：0:未知<br/> 1:临时⻋车辆; <br />2:⽉月卡⻋车辆; <br />3:固定⻋车位; <br />4:VIP; <br />5:预约⻋车辆;<br />6:⿊黑名单⻋车辆;|"car_type":1|
|pay_type|intger|0:免费; <br />1:现⾦金金; <br />2:账户余额; <br />3:购物码; <br />4:月卡;<br /> 5:微信⽀支付; <br />6:微信免密; <br />7:支付宝; <br />8:支付宝免密 <br />9:混合⽀支付;<br /> 99:其他(未知)|"pay_type":99|
|in_time|integer||"in_time":148813512323|
|park_duration|integer| 停车时长，以毫秒为单位                                       |"park_duration":1000|
|charge_duration|integer|收费时长，以毫秒为单位|"charge_duration":11111|
|amount|double|收费金额，以元为单位|"amount"：20.00|
|parking_lot_id|string|停⻋车场id|"parking_lot_id":"xxxxxxxxx"|
|parking_lot_name|string|停⻋车场名称|"parking_lot_name": "腾大停车场"|

#### 8.4.3 reserved(车辆预约)

- ***extend对象中所含字段详情***



|  扩展字段名  | 扩展字段数据类型 |           扩展字段描述            |          备注          |
| :----------: | :--------------: | :-------------------------------- | :--------------------: |
| reservationId |      String      | 预约事件唯一标识                                             |   "reservationId":“xxxxxxxxxx”   |
| visitorId |      String      |          访客唯一标示     | "visitorId":"66666" |
|contact_number|string|车辆类型：0:未知<br/> 1:临时⻋车辆; <br />2:⽉月卡⻋车辆; <br />3:固定⻋车位; <br />4:VIP; <br />5:预约⻋车辆;<br />6:⿊黑名单⻋车辆;|"car_type":1|
|car_description|string|车辆描述|"car_description":"迈巴赫S680"|
|plate_number|string|车牌号码|"plate_number":"粤B66666"|
|start_ts|timestamp|允许通过起始时间|"start_ts":148813512323|
|expire_ts|timestamp|允许通过截止时间|"expire_ts"148813912323|
|parking_lot_id|string|停⻋车场id|"parking_lot_id":"xxxxxxxxx"|
|parking_lot_name|string|停⻋车场名称|"parking_lot_name": "腾大停车场"|


#### 8.4.4 canceled(车辆取消预约)





### 8.5 conference(会议室通知)

#### 8.5.1 start(会议开始)
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

#### 8.5.2 end(会议结束)
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

#### 8.5.3 reserved(已被预定)
- ***extend对象中所含字段详情*******



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |


#### 8.5.4 canceled（已取消）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

### 8.6 face_access(人脸门禁通知)

#### 8.6.1 inout（人流进出）
- ***extend对象中所含字段详情***



|   扩展字段名   | 扩展字段数据类型 |           扩展字段描述            |              示例              |
| :------------: | :--------------: | :-------------------------------: | :----------------------------: |
|  inout_status  |      String      | 人员进出, in代表进入, out代表离开 |      "inout_status":"in"       |
| recognition_id |      String      |        当前通过的人员的id         | "recognition_id":"weilinktest" |

### 8.7 device(设备通知)

### 8.8 elevator(电梯通知)

#### 8.8.1 operational_parameter（运行参数）
- ***extend对象中所含字段详情***



|   扩展字段名    | 扩展字段数据类型 |         扩展字段描述         |         示例         |
| :-------------: | :--------------: | :--------------------------: | :------------------: |
|   weight_load   |      intger      | 电梯轿厢内负载情况, 单位为KG |  "weight_load":120   |
| subdoor_status  |      intger      | 电梯副门状态,0代表关,1代表开 | "subdoor_status": 1  |
| maindoor_status |      intger      | 电梯主门状态,0代表关,1代表开 | "maindoor_status": 1 |
|  current_floor  |      intger      |       电梯当前所在楼层       | "current_floor": 15  |

### 8.9 illumination(照明通知)

#### 8.9.1 light_on（开灯）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

#### 8.9.2 light_off（关灯）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|    Null    |        -         |      -       |  -   |

#### 8.9.3 brightness_switch（亮度调节）
- ***extend对象中所含字段详情***



| 扩展字段名 | 扩展字段数据类型 | 扩展字段描述 | 示例 |
| :--------: | :--------------: | :----------: | :--: |
|light_brightness|integer|灯光亮度|"light_brightness":100|

### 8.10 people_flow(人流通知)

### 8.11 fire_protecting(消防通知)

### 8.12 access_control(门禁通知)
#### 8.12.1 inout（通过闸机）
- ***extend对象中所含字段详情***

  

|    扩展字段名    | 扩展字段数据类型 | 扩展字段描述                                                 | 示例 | 字段级别 |
| :--------------: | :--------------: | :----------------------------------------------------------- | :--: | -------- |
| ***personInfo*** |      struct      | 人员信息                                                     |      | 1        |
|  recognitionId   |      string      | 人员系统唯一标号                                             |      | 2        |
|    personName    |      string      | 人员姓名                                                     |      | 2        |
|    personType    |     integer      | 人员类型<br />0：临时可通过<br /> 1：定时可通过<br /> 2：管理员<br /> 3：未授权通过<br /> 4：黑名单  <br />9：未知 |      | 2        |
|    accessType    |     integer      | 通过闸机类型<br />0：人脸验证<br /> 1：RFID卡验证 <br />2：二维码验证<br /> 3：手掌验证<br /> 9：未知类型 |      | 1        |
|      event       |     integer      | 进出事件<br />0：进入，1：离开                               |      | 1        |

### 8.13 robot(机器人通知)
#### 8.13.1 running_status（运行状态参数）
- ***extend对象中所含字段详情***
***除经纬度外所有number，integer型数据值为-1时代表底层未上报此数据***



| 扩展字段名 | 扩展字段描述 |扩展字段数据类型  | 示例 |
| :-------------: | :--------------: | :--------------------------: | :------------------: |
|RobotType|机器人类型<br />1：服务机器人<br />2：安防机器人|integer||






#### 8.13.1 server_robot（机器人通知）
- ***extend对象中所含字段详情***
***除经纬度外所有number，integer型数据值为-1时代表底层未上报此数据***



| 扩展字段名 | 扩展字段描述 |扩展字段数据类型  | 示例 |字段级别|
| :-------------: | :--------------: | :--------------------------: | :------------------: |:-:|
|***RobotType***|机器人类型<br />1：服务机器人<br />2：安防机器人|integer||***1***|
|***Status***|机器人状态Object|object||***1***|
| |机器人坐标系统|string||2|
|x |机器人所在坐标X|number||2|
|y |机器人所在坐标Y|number||2|
|azimuth|机器人朝向（坐标方位角）|number||2|
|velocity |机器人速度|number||2|
|powerPer | 机器人电量百分比|number||2|
|runTemperature|机器人温度|number||2|
|estop |机器人急停状态|Boolean||2|
|bumper |机器人碰撞信息|Boolean||2|
|curFloor |当前楼层|string||2|
|taskStatus |任务状态|Boolean||2|
|***environmentSensor***|环境传感器object|object||***1***|
|temperature|环境温度|numbern||2|
|humidity|环境湿度|number||2|
|noiseDecibel|环境噪音|number||2|
|smokeDetector|环境烟雾|number||2|
|AQI|空气质量指数|number||2|
|PM1_0|环境PM1.0|number||2|
|PM2_5|环境PM2.5|number||2|
|PM10|环境PM10|number||2|
|CO|一氧化碳|number||2|
|CO2|二氧化碳|number||2|
|H2|氢气|number||2|
|SO2|二氧化硫|number||2|
|H2S|硫化氢|number||2|
|Nox|氮氧化物|number||2|
|CL|氯气|number||2|
|HCHO|甲醛|number||2|
|TVOC|挥发性有机物|number||2|
|IR|红外强度|number||2|
|UV|紫外强度|number||2|
|radiation|放射强度|number||2|
|***Task***|任务Object|object||***1***|
|taskStatus|用户id<br />1：执行中，2：成功，3：失败，4：被取消|string||2|
|taskID|任务编号|integer||2|
|destinationName|目的地名称|string||2|
|destinationX|目的地坐标X|number||2|
|destinationY|目的地坐标Y|number||2|
|destinationFloor|目标楼层|string||2|
|startTime|任务开始时间|long||2|
|endTime|任务结束时间|long||2|


