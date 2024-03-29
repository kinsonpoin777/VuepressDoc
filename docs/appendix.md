#  附录

## 消息格式

### 消息同步格式

#### 消息类型

| message_type |                                               说明                                               |
| :----------: | :----------------------------------------------------------------------------------------------: |
|   1000100    |                                  文本消息上报至平台作为数据存储                                  |
|   1000101    |                                 Json 消息上报至平台作为数据存储                                  |
|   1000200    |                                    发送文本消息至其他应用系统                                    |
|   1000201    |                                   发送 Json 消息至其他应用系统                                   |
|   1000300    | 推送告警类消息给微瓴平台，不直接推送给应用，微瓴平台会针对告警消息的业务类别推送给相应的业务应用 |
|   1000302    | 推送告警类消息给微瓴平台，不直接推送给应用，微瓴平台会针对告警消息的业务类别推送给相应的业务应用 |
|   1000400    | 推送通知类消息给微瓴平台，不直接推送给应用，微瓴平台会针对通知消息的业务类别推送给相应的业务应用 |
|   1000500    |                         推送普通消息给微瓴平台作为数据存储，不推送给应用                         |

##### 1000100

- 请求参数

| 请求参数 | 参数类型 | 参数说明 |
| :------: | :------: | :------: |
| content  |  String  | 消息内容 |

- 示例

```json
{"message_type":1000100,"content":"test content"}
```

##### 1000101

- 请求参数

| 请求参数 | 参数类型 | 参数说明 |
| :------: | :------: | :------: |
| content  |   json   | 消息内容 |

- 示例:

```json
{
  "message_type": 1000101,
  "content": { "key1": "val1", "key2": "val2" }
}
```

##### 1000200

- 请求参数

|   请求参数    | 参数类型 |                      参数说明                       |
| :-----------: | :------: | :-------------------------------------------------: |
|   to_appid    |  String  |                     目标 appid                      |
| msg_attribute |  String  | 消息属性。ack：根据之前的消息返回，active：主动发起 |
|    msg_id     | Integer  |   当消息属性为 ack 时，该字段为必填项，否则不用填   |
|    content    |  String  |                      消息内容                       |

- 示例:

```json
{
 "message_type": 1000101,
  "to_appid": "10000",
  "msg_attribute": "ack",
 "msg_id": 85581,
 "content": "text test!"
}
```

##### 1000201

- 请求参数

|   请求参数    |  参数类型  |                      参数说明                       |
| :-----------: | :--------: | :-------------------------------------------------: |
|   to_appid    |   String   |                     目标 appid                      |
| msg_attribute |   String   | 消息属性。ack：根据之前的消息返回，active：主动发起 |
|    msg_id     |  Integer   |   当消息属性为 ack 时，该字段为必填项，否则不用填   |
|    content    | JsonObject |                      消息内容                       |

- 示例:

```json
{
 "message_type": 1000101,
  "to_appid": "*****",
  "msg_attribute": "ack",
  "msg_id": 85581,
  "content": { "key1": "val1", "key2": "val2" }
}
```

##### [1000300|告警数据](#告警数据)

##### [1000302|消警数据格式说明](#消警数据格式说明)

##### [1000400|通知类数据](#通知类数据)

##### [1000500|普通推送上报](#1-普通上报)

### 回复推送消息

- 收到推送消息后，需要回复一个 json 格式如下

| 请求参数 | 参数类型 |      参数说明       |
| :------: | :------: | :-----------------: |
|   code   |  number  |      回复为 0       |
|  cookie  |  String  | 推送报文中的 cookie |

- 示例

```json
// mvs 推送的消息为
// 注意这里的cookie需要回复给接收端
{
  "apiName": "report_data_point",
  "cookie": "16198_577418",
  "din": "********",
  "errmsg": "",
  "id": 20134,
  "time": 1511802600575,
  "type": "string",
  "value":"{\"V\":1,\"subid\":\"0900009\",\"list\":[{\"func\":\"CO2\",\"value\":\"972180.00\"}],\"timestamp\":1511802557768}",
  "seq": "0"
}
//接收方应该回复
{ "code": 0, "cookie": "16198_577418" }
```
