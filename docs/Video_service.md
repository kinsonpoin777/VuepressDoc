[TOC]
# 视频服务

## 1 获取视频设备扩展信息

- 请求url: `/common/video/getExtend`
- 请求方式: `get`
- 接口描述： 查询摄像机等音视频设备的扩展信息
- 请求参数:

|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |
|     din      |  String  |    是    |        设备的唯一标识        |
|    sub_id    |  String  |    否    |          子摄像头id          |

- 请求示例：

```shell
 /common/video/getExtend?
token=*******************************************************
&din=******************
&iotim_ticket=*******************************************************
```

- 返回参数：

|    返回参数    | 参数类型  |                              参数说明                              |
| :------------: | :-------: | :----------------------------------------------------------------: |
|      code      |  String   |                错误码，0表示成功，其他见错误码说明                 |
|    message     |  String   |                            执行结果消息                            |
|      data      |   JSON    |                              查询结果                              |
|      din       |  String   |                           设备的唯一标识                           |
|    sub_vid     |  String   |                           传统子摄像头id                           |
|    is_live     |  Boolean  |                              是否直播                              |
|  is_recording  |  Boolean  |                              是否录像                              |
|    is_face     |  Boolean  |                         是否是人脸识别设备                         |
|   save_type    |  String   |                              存储方式                              |
|    save_day    |  Integer  |                              存储天数                              |
|  is_web_push   |  Boolean  |                            是否网页推流                            |
| web_resolution |  Integer  | 网页推流分辨率，0：原画，360、720、1080 分别对应 360P、720P、1080P |
|     shell      |  String   |                             摄像机外壳                             |
|  rom_version   |  String   |                           摄像机固件版本                           |
|  sdk_version   |  String   |                           摄像机SDK版本                            |
|      mac       |  String   |                           摄像机mac地址                            |
|      code      |  String   |                             摄像机编码                             |
|    password    |  String   |                           摄像机登录密码                           |
|      lens      |  String   |                             摄像机镜头                             |
|      c_id      |  String   |                             摄像机云id                             |
|  record_data   |  String   |                           摄像机录像规则                           |
| advance_record |  Integer  |                       预录帧数，最大值 1000                        |
|  event_config  | JsonArray |                            智能算法配置                            |

- 返回示例：

```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "din": "***************",
    "is_live": false,
    "is_recording": true,
    "is_face": false,
    "save_type": "hadoop1",
    "save_day": 60,
    "is_web_push": false,
    "web_resolution": 0,
    "shell": "",
    "rom_version": "",
    "sdk_version": "",
    "mac": "**：**：**：**：**：**",
    "code": "",
    "password": "",
    "lens": "4mm",
    "c_id": "2427423",
    "record_data": "",
    "advance_record": 60
  }
}
```

---

## 2 设置视频设备扩展信息

- 接口url： `/common/video/setExtend`
- 接口描述： `设置视频设配的扩展信息`
- 请求方法：`POST`
- 请求参数：

|    请求参数    | 参数类型  | 是否必填 |                              参数说明                              |
| :------------: | :-------: | :------: | :----------------------------------------------------------------: |
|     token      |  String   |    是    |                    鉴权参数：登录获取的动态密钥                    |
|  iotim_ticket  |  String   |    是    |                    鉴权参数：登录获取的物联票据                    |
|      din       |  String   |    是    |                           设备的唯一标识                           |
|     sub_id     |  String   |    否    |                             子摄像头id                             |
|    is_live     |  Boolean  |    是    |                              是否直播                              |
|  is_recording  |  Boolean  |    是    |                              是否录像                              |
|    is_face     |  Boolean  |    是    |                         是否是人脸识别设备                         |
|   save_type    |  String   |    是    |                              存储方式                              |
|    save_day    |  Integer  |    是    |                              存储天数                              |
|  is_web_push   |  Boolean  |    是    |                            是否网页推流                            |
| web_resolution |  Integer  |    是    | 网页推流分辨率，0：原画，360、720、1080 分别对应 360P、720P、1080P |
|     shell      |  String   |    否    |                             摄像机外壳                             |
|  rom_version   |  String   |    否    |                           摄像机固件版本                           |
|  sdk_version   |  String   |    否    |                           摄像机SDK版本                            |
|      mac       |  String   |    否    |                           摄像机mac地址                            |
|      code      |  String   |    否    |                             摄像机编码                             |
|    password    |  String   |    否    |                           摄像机登录密码                           |
|      lens      |  String   |    否    |                             摄像机镜头                             |
|      c_id      |  String   |    否    |                             摄像机云id                             |
|  record_data   |  String   |    否    |                           摄像机录像规则                           |
| advance_record |  Integer  |    否    |                       预录帧数，最大值 1000                        |
|  event_config  | JsonArray |    否    |                            智能算法配置                            |

- 请求示例：

```shell
 /common/video/setExtend?
token=*******************************************************
&iotim_ticket=*******************************************************
```

- a.请求头：Content-Type:application/json
- b.请求包体：

```json
{"shell":"shell","recording":1,"rom_version":"1.0.0","face_recognition":1,"sdk_version":"1.4.203","web_resolution":360,"mac":"00:44:0f:9a:00:26","code":"","lens":"4mm","password":"1234","save_day":30,"din":"144115194519080010","save_type":"hadoop2","c_id":"2427423","record_data":"[{\"record_cron\":\"0 * * * * ?\", \"record_long\":60},{\"record_cron\":\"0 * * * * ?\", \"record_long\":240}]","live":1,"web_push":1}
```

- 返回参数：

| 返回参数 | 参数类型 |              参数说明               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| message  |  String  |            执行结果消息             |

- 返回示例：

```json
{
  "code": 0,
  "message": "OK",
}
```

## 3 获取本地录像

- 接口url： `/common/video/getLocalStream`

- 请求方法： `GET`

- 请求参数：

  | 请求参数      | 参数类型 |                  参数说明 |
  | :------------ | :------: | ------------------------: |
  | *token        |  String  |      动态密码，登录时获得 |
  | *iotim_ticket |  String  |               QQ 物联票据 |
  | *din          |  String  |                  设备 din |
  | *stream_id    |  String  |                  子码流id |
  | *timeBegin    |   long   |                  开始时间 |
  | *length       |   long   | 视频长度，秒，最长获取30s |
  | subDin        |  String  |         子摄像头影像流 id |

- 请求示例：

  ```
  /common/video/getLocalStream?
  token=*************************
  &iotim_ticket=*************************
  &din=*************************
  &subDin=*************************
  &stream_id=*************************
  &timeBegin=*************************
  &length=*************************
  ```

- 返回参数：

  | 返回参数       | 参数类型 | 参数说明                          |
  | -------------- | :------- | :-------------------------------- |
  | code           | Integer  | 错误码                            |
  | message        | String   | 执行结果消息                      |
  | data           | json     | 返回数据                          |
  | sm4_vector     | String   | 加密向量                          |
  | recordHandler  | String   | 本次录像的唯一标识                |
  | timeBegin      | long     | 开始时间，毫秒时间戳              |
  | length         | long     | 秒数，毫秒，最多获取30s的历史视频 |
  | stream_token   | String   | 流token                           |
  | stream_id      | String   | 子码流                            |
  | stream_en_key  | String   | 流加密key                         |
  | server_ip      | String   | 外网地址                          |
  | server_port    | int      | 服务器端口号                      |
  | cmd            | String   | 命令字                            |
  | server_innerip | String   | 内网ip                            |

- 返回示例：

  ```json
  {
    "code": 0,
    "data": {
      "sm4_vector": "2019076905",
      "recordHandler": "0108572e-4881-4644-a3b5-3e2c50286aeb",
      "timeBegin": 2342432,
      "stream_token": "RKzwpUGM",
      "stream_id": 13,
      "stream_en_key": "kO3Ahp6wkuLw6OfP",
      "length": 20,
      "server_ip": "61.241.44.161",
      "server_port": 31001,
      "cmd": "LocalRecordStream",
      "server_innerip": "10.55.130.116"
    },
    "message": "OK"
  }
  ```

## 4 获取设备存储类型及天数

- 接口url： `/common/video/getDeviceSaveTypeAndDays`

- 请求方法： `GET`

- 请求参数：

  | 请求参数      | 参数类型 |             参数说明 |
  | :------------ | :------: | -------------------: |
  | *token        |  String  | 动态密码，登录时获得 |
  | *iotim_ticket |  String  |          QQ 物联票据 |
  | *din          |  String  |             设备 din |
  | sub_din       |  String  |    子摄像头影像流 id |

- 请求示例：

  ```
  /common/video/getDeviceSaveTypeAndDays?
  token==*************************
  &iotim_ticket==*************************
  &din==*************************
  &sub_din==*************************
  ```

- 返回参数：

  | 返回参数  | 参数类型 | 参数说明                             |
  | :-------- | :------- | :----------------------------------- |
  | code      | Integer  | 错误码                               |
  | message   | String   | 执行结果消息                         |
  | data      | json     | 返回数据                             |
  | save_type | String   | 保存类型：cosmtav(云端)，nvr（本地） |
  | save_day  | int      | 录像保存天数                         |
  | din       | String   | 设备id                               |

- 返回示例：

  ```json
  {
    "code": 0,
    "data": {
      "save_type": "nvr",
      "save_day": 65,
      "din": "din"
    },
    "message": "OK"
  }
  ```

## 5 查询设备某段时间确实录像片段

- 接口url： `/common/video/getVideoLostRecord`

- 请求方法： `GET`

- 请求参数：

  | 请求参数      | 参数类型 | 参数说明             |
  | ------------- | :------- | :------------------- |
  | *token        | String   | 动态密码，登录时获得 |
  | *iotim_ticket | String   | QQ 物联票据          |
  | *din          | String   | 设备 din             |
  | subDin        | String   | 子摄像头影像流 id    |
  | *start_time   | long     | 开始时间，毫秒       |
  | *end_time     | long     | 结束时间，毫秒       |

- 请求示例：

  ```
  /common/video/getVideoLostRecord?token=
  &iotim_ticket===*************************
  &din===*************************
  &subDin===*************************
  &start_time===*************************
  &end_time===*************************
  ```

- 返回参数：

  | 返回参数 | 参数类型 | 参数说明     |
  | :------- | :------- | :----------- |
  | code     | Integer  | 错误码       |
  | message  | String   | 执行结果消息 |
  | data     | json     | 返回数据     |
  | handler  | String   | 消息唯一id   |

- 返回示例：

  ```json
  {
    "code": 0,
    "message": "OK",
    "data": {
      "handler": "fdsafasfds"
    }
  }
  ```

## 6 获取本地录像-硬件端

- datapoint:20229

- 设备收到到参数：
  {"din":"din",
  "sub_din":"0",
  "handler":"uuid",
  "start_time":324324324,
  "end_time":3243243243234
  } 

- 设备针对seq返回消息格式：

  {
  code: 0,
  msg: "success",
  data: {
    "handler":"收到值"，
    losts:[
  	{begin_time:XXXX,end_time:XXXX},
  	{begin_time:XXXX,end_time:XXXX}
  ]
  }
  }

## 7 查询SHARP协议视频推流服务器信息

- 接口url： `/common/video/getStreamServer`
- 描述： `查询sharp协议视频推流服务器信息，低延时获取视频方式，1秒钟之内，需要自行开发播放器。`
- 请求方法： `GET`
- 请求参数：

|   请求参数   | 参数类型 | 是否必填 |           参数说明           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |
|     din      |  String  |    是    |        设备的唯一标识        |
|    sub_id    |  String  |    否    |          子摄像头id          |

- 请求示例：

```shell
 /common/video/getStreamServer?
token=*******************************************************
&din=***************
&iotim_ticket=*******************************************************
```

- 返回参数：

|   返回参数    | 参数类型 |                               参数说明                                |
| :-----------: | :------: | :-------------------------------------------------------------------: |
|     code      |  String  |                  错误码，0表示成功，其他见错误码说明                  |
|    message    |  String  |                             执行结果消息                              |  |
|     data      |   Json   |                               查询结果                                |
|      ip       |  String  |                             推流服务器IP                              |
|    innerip    |  String  |                           推流服务器内网IP                            |
| stream_token  |  String  |                          Sharp协议握手token                           |
|     port      | Integer  |           sharp 服务端口号，如果无该返回值端口号默认为30001           |
| stream_en_key |  String  | 视频流加密key,目前为AES128加密KEY，如无该值说明当前环境暂时不支持加密 |

- 返回示例：

```json
{
  "message": "OK",
  "data": {
    "ip": "127.0.0.1",
    "innerip": "127.0.0.1",
    "stream_token":"2C9A8F42",
    "port": 30001,
    "stream_en_key":"AES128AES128AES1"
  },
  "code": 0
}
```

## 8 sharp音视频流推送协议

```shell
•  通讯协议：TCP
•  IP：通过平台接口获取
•  端口：port或30001
•  流程 1.腾讯微瓴-> 业务第三方 (握手)； 2.如果 1 握手成功后面就正常推数据块流，遇到音视频结束 type，推送结束； 3.字节序（大端）
•  握手
------------------------------------------------------------------
|  0   |  1   |  2   |   3   |   4   |   5   |   6   |     7     |
------------------------------------------------------------------
| 0x7f | 0x7f | 0x7f |   V   |        sub_vid        | stream_id |
------------------------------------------------------------------
|                         Device din                             |
------------------------------------------------------------------
|                        stream_token                            |
------------------------------------------------------------------
```

- 说明：

```shell
•  0~2 字节固定为 0x7f
•  第 3 字节为版本号，当前为 3，对于新部署环境只支持版本3
•  第 4~6 字节为子视频流 ID，非网关设备比字段填 0
•  第 7 字节为码流 ID，0 为主码流。（当前版本仅支持主码流）
•  8~15 字节为所请求视频的摄像头 din。
•  16~23 字节为 stream_token。
•  响应包
```

```shell
---------------------------------------------------------------------
|    0  --  7    |    8  --  15   |    16 -- 23    |    24 -- 31    |
---------------------------------------------------------------------
|                              length                               |
---------------------------------------------------------------------
|     result     |       Ver      |   A   |   V    |        E       |
---------------------------------------------------------------------
|                      start timestamp high                         |
---------------------------------------------------------------------
|                      start timestamp low                          |
---------------------------------------------------------------------
|                            error info                             |
---------------------------------------------------------------------
```

- 说明：

```shell
•  length：握手响应包数据总长度(4 字节)
•  result: 响应码（1 字节，非 0 表示失败 if result =0 then errorinfo length=0)
•  Ver: 版本号（1 字节 当前版本：1)
•  A: 音频数据包编码( 4bit 1: AMR 2: AAC 6:G711）
•  V：视频数据包编码( 4bit 1: H.264 2: H.265）
•  E：加密方式(1 字节 0:表示不加密 1: AES-128(AES-128为版本3所使用的加密算法) 2: AES-256 (其中加密key为查询视频推流服务器时返回的stream_en_key值)
•  start timestamp: 视频起始时间戳（8 字节）
•  error info ：失败错误提示字符串(length - 16 字节),result 为 0 时无此节。
•  数据块
```

```shell
---------------------------------------------------------------------
|    0  --  7    |    8  --  15   |    16 -- 23    |    24 -- 31    |
---------------------------------------------------------------------
|                      length                      |  type  | frame |
---------------------------------------------------------------------
|         encryptedLength         | 保留                            |
---------------------------------------------------------------------
|                             timestamp                             |
---------------------------------------------------------------------
|                          sequence number                          |
---------------------------------------------------------------------
```

```shell
•  length：每一帧视频数据和包头总长（长度由前 3 个字节表示)
•  type：(4 bit 1：视频 2: 音频 0xF：结束帧，表示音视频结束，连接可以断开）
•  frame: 帧类型 (4bit：1:表示是关键 I 帧)
•  encryptedLength: 加密数据字节长度(16bit：0表示该帧无加密数据，即为原始数据；如果加密数据长度大于零时，密钥为获取服务器IP地址时返回的stream_en_key,还原原始帧数据方法为：加密数据解密后的数据，加上除去加密数据后的数据，如：收到帧数据为data[encryptedLength]+data[length-16- encryptedLength] 则解密后的数据为：decrypt（data[encryptedLength]）+ data[length-16- encryptedLength])
•  timestamp：时间戳(4 字节) – 这里指的是偏移量
•  sequence number: 序列号(4 字节），后跟视频裸帧数据，长度为：length-16
```

---

## 9 获取web流播放地址

- 接口url： `/common/video/getWebUrl`
- 描述： `查询web流的播放地址。HLS高延时方案，10至20秒，Web端播放， RTMP需要支持flash播放器的组件端播放`
- 请求方法：`GET`
- 请求参数：

|   请求参数   | 参数类型 | 是否必填 |           参数说明           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |
|     din      |  String  |    是    |        设备的唯一标识        |
|    sub_id    |  String  |    否    |          子摄像头id          |

- 请求示例：

```shell
 /common/video/getWebUrl?
token=*******************************************************
&din=***************
&iotim_ticket=*******************************************************
```

- 返回参数：

| 返回参数 | 参数类型 |              参数说明               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| message  |  String  |            执行结果消息             |
|   data   |   JSON   |              查询结果               |
|   rtmp   |  String  |             rtmp推流地址,一次有效，断开后重新获取  |
|   url    |  String  |             hls推流地址，两小时之类有效，过期后重新获取           |

- 返回示例：

```json
{
  "message": "OK",
  "data": {
    "rtmp": "rtmp:// 10.33.22.44:1999/vx134?ticket=7d840b8760754a6c9cbd27fe9f93bc28"
    "url": "https:// api-c.weiling.qq.com/sandbox /hls/144115192371634088.m3u8?ticket=7d840b8760754a6c9cbd27fe9f93bc28"
  },
  "code": 0
}
```



## 10 获取HLS流播放地址

- 接口url： `/common/video/getPlayUrl`
- 描述： `查询HLS流的播放地址。高延时方案，10至20秒，Web端播放`
- 请求方法：`GET`
- 请求参数：

|   请求参数   | 参数类型 | 是否必填 |           参数说明           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |
|     din      |  String  |    是    |        设备的唯一标识        |
|    sub_id    |  String  |    否    |          子摄像头id          |

- 请求示例：

```shell
 /common/video/getPlayUrl?
token=*******************************************************
&din=***************
&iotim_ticket=*******************************************************
```

- 返回参数：

| 返回参数 | 参数类型 |              参数说明               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| message  |  String  |            执行结果消息             |
|   data   |   JSON   |              查询结果               |
|   url    |  String  |             Web推流地址             |

- 返回示例：

```json
{
  "message": "OK",
  "data": {
    "url": "https:// api-c.weiling.qq.com/sandbox /hls/144115192371634088.m3u8?ticket=7d840b8760754a6c9cbd27fe9f93bc28"
  },
  "code": 0
}
```

## 11 查询录像列表

- 接口url： `/common/video/getVideoList`
- 描述： `根据条件查询录像信息，可以跟据月来查询当前月有录像的日期，也可以根据日期和起始以及终止时间来查询录像信息。两种查询条件不能同时为空。`
- 请求方法：`GET`
- 请求参数：

|   请求参数   | 参数类型 |   是否必填   |           参数说明           |
| :----------: | :------: | :----------: | :--------------------------: |
|    token     |  String  |      是      | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |      是      | 鉴权参数：登录获取的物联票据 |
|     din      |  String  |      是      |        设备的唯一标识        |
|    sub_id    |  String  |      否      |          子摄像头id          |
|    month     |  String  | 按月查询必填 |      年月（YYYYMM格式）      |
|     date     |  String  | 日期查询必填 |     日期（YYYYMMDD格式）     |
|    start     |  String  | 日期查询必填 |    开始时间（HHmmss格式）    |
|     end      |  String  | 日期查询必填 |    结束时间（HHmmss格式）    |

- 请求示例：
- a.请求示例1：

```shell
/common/video/getVideoList?
token=*******************************************************
&din=***************
&month=201705
&iotim_ticket=*******************************************************
```

- b.请求示例2：

```shell
/common/video/getVideoList?
token=*******************************************************
&din=***************
&date=20170510
&start=122200
&end=122500
&iotim_ticket=****************************************************
```

- 返回参数：

| 返回参数  | 参数类型 |                                                                          参数说明                                                                          |
| :-------: | :------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------: |
| rec_date  |  String  |                                                                            日期                                                                            |
| rec_count | Integer  |                                                               有无录像，0：无录像，1：有录像                                                               |
|    []     |  String  |                                                                           文件名                                                                           |
|     s     |  String  |                                                                          起始时间                                                                          |
|     d     | Integer  |                                                                  录像文件时长，单位：毫秒                                                                  |
|     t     | Integer  | 文件属性(从低位到高位, 第 0 位表示定时录像; 第 1 位表示手动录像; 第 2 位表示移动侦测录像; 第 3 位表示输入报警; 后面定义的类型以此类推. 0 表示否, 1 表示是) |
|     p     |  String  |                                                                        文件存储路径                                                                        |

- 返回示例：
- a.返回示例1：
  
```json
[
  {
    "rec_date": "2017-05-01",
    "rec_count": 1
  },
  {
    "rec_date": "2017-05-02",
    "rec_count": 1
  }
]
```

- .返回示例2：

 ```shell
 [144115194519265640_20170510_122205.mtav]
  s=12:22:05.853
  d=8007
  t=10000000
  p=hdfs://192.168.1.1:8020/bucket/144115194519265640/2017-05-10/144115194519265640_20170510_122205.mtav
  [144115194519265640_20170510_122213.mtav]
  s=12:22:13.862
  d=7999
  t=10000000
  p=hdfs://192.168.1.1:8020/bucket/144115194519265640/2017-05-10/144115194519265640_20170510_122213.mtav
 ```

## 12 获取录像文件

- 接口url： `/common/video/getVideoStream`
- 描述： `获取录像文件，返回文件流。`
- 请求方法：`GET`
- 请求参数：

|   请求参数   | 参数类型 | 是否必填 |           参数说明           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |
|     din      |  String  |    是    |        设备的唯一标识        |
|      id      |  String  |    是    |     录像列表中返回的参数     |
|    sub_id    |  String  |    否    |          子摄像头id          |

- 请求示例：
  
```shell
 /common/video/getVideoStream?
token=*******************************************************
&din=***************
&id=hdfs://192.168.1.1:8020/bucket/144115194519265640/2017-05-10/144115194519265640_20170510_122205.mtav
&iotim_ticket=*******************************************************
```

- 返回参数：

|  返回参数  |  参数类型  |  参数说明  |
| :--------: | :--------: | :--------: |
| fileStream | fileStream | 录像文件流 |

- 返回示例：

```shell
Content-Type：application/octet-stream
  fileStream……
```

## 13 录像保护

- 接口url： `/common/video/setRecordLife`
- 描述：`用于设置录像的生命周期，设置录像的开始时间、结束时间以及录像删除的时间。单次设置保护的时长最大为 24 小时，start 和 end 的时差超过 24 小时会返回错误。life_time 和当前时间差不能小于一小时。避免误操作导致录像被立即删除。比如当前是北京时间 2017-7-29 12:00:00，那么设置的 life_time 只能大于 2017-7-29 13:00:00`
- 请求方法：`GET`
- 请求参数：

|   请求参数   | 参数类型 | 是否必填 |              参数说明              |
| :----------: | :------: | :------: | :--------------------------------: |
|    token     |  String  |    是    |    鉴权参数：登录获取的动态密钥    |
| iotim_ticket |  String  |    是    |    鉴权参数：登录获取的物联票据    |
|     din      |  String  |    是    |           设备的唯一标识           |
|    start     |   Long   |    是    |    开始时间，时间戳，单位：毫秒    |
|     end      |   Long   |    是    |    结束时间，时间戳，单位：毫秒    |
|  life_time   |   Long   |    是    | 录像删除的时间，时间戳，单位：毫秒 |
|    sub_id    |  String  |    否    |             子摄像头id             |

- 请求示例：

``` shell
/common/video/setRecordLife?
token=*******************************************************
&din=******************
&start=1501120800000
&end=1501128000000
&left_time=1532664000000
&iotim_ticket=*******************************************************
```

- 返回参数：

|  返回参数  | 参数类型 |              参数说明               |
| :--------: | :------: | :---------------------------------: |
|    code    |  String  | 错误码，0表示成功，其他见错误码说明 |
|  message   |  String  |            执行结果消息             |
|    data    |   Json   |              操作结果               |
| update_num | Integer  |          录像记录修改数量           |

- 返回示例：

```json
{
      "code": 0,
      "message": "OK",
      "data": {
         "update_num": 1000
      }
  }
```

## 14 监控信息上报

- 接口url:  `/monitor/addMonitor`
- 描述： `用于上报监控时间，例如上报应用或者设备心跳信息`
- 请求方法：`GET,POST`
- 请求参数：

|  请求参数   | 参数类型 |      是否必填      |                                       参数说明                                        |
| :---------: | :------: | :----------------: | :-----------------------------------------------------------------------------------: |
| monitorType |  String  |         是         | 监控类型：API_MONITOR，VIDEO_PUSH, RPC_MONITOR, WEILINK_API, WEB_API,APP_DATA_MONITOR |
| monitorTime |  String  |         是         |                                      监控时间点                                       |
| serviceName |  String  |         是         |                                       服务名称                                        |
| accessTime  |  String  |         是         |                                       访问时间                                        |
|   result    |  String  |         否         |                                   监控对象访问结果                                    |
|   fromIp    |  String  |         否         |                                   监控对象调用来源                                    |
|  projectId  |  String  |         是         |                                        项目ID                                         |
|    appId    |  String  |         是         |                                        应用ID                                         |
|   useTime   |  String  |         否         |                               监控对象调用耗时，单位ms                                |
|  targetIp   |  String  | 否  监控对象执行ip |
|     din     |  String  |    否  设备din     |
|  reportIp   |  String  |  否  上报监控的ip  |

- 请求示例：

```json
[
  {
    "accessTime": "201902121335",
    "appId": "",
    "din": "",
    "fromIp": "127.0.0.1",
    "monitorTime": "201902121335",
    "monitorType": "API_MONITOR",
    "projectId": "1",
    "reportIp": "127.0.0.1",
    "result": "1",
    "serviceName": "addMonitor",
    "status": "",
    "targetIp": "127.0.0.1",
    "useTime": "122"
  }
]
```

- 返回参数：

|  返回参数  | 参数类型 |              参数说明               |
| :--------: | :------: | :---------------------------------: |
|    code    |  String  | 错误码，0表示成功，其他见错误码说明 |
|  message   |  String  |            执行结果消息             |
|    data    |   Json   |             参数值列表              |
| update_num | Integer  |          录像记录修改数量           |

- 返回示例：

```json
{
  "code": 0,
  "data": [
    {
      "accessTime": 121212121,
      "appId": "",
      "din": "",
      "fromIp": "127.0.0.1",
      "monitorTime": "201902121335",
      "monitorType": "API_MONITOR",
      "projectId": "1",
      "reportIp": "10.56.63.17",
      "result": 1,
      "sequence": "e04869f2-cb09-4ef2-9b99-c25e4cd04139",
      "serviceName": "addMonitor",
      "status": "",
      "targetIp": "127.0.0.1",
      "useTime": 122
    }
  ],
  "message": "OK"
}
```
