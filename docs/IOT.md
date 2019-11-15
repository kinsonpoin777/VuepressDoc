[TOC]


# 微瓴IOT通讯协议

通讯协议采用 `TLV` 结构，既type，length，value，其中type占2个字节，length占4字节（32位无符号整型），value的长度根据length的值来定义。 `密文使用16进制文本传输`。
value的格式使用json字符串，采用utf-8编码
服务端公钥找微瓴对接人获取

> 注册服务器IP地址找微瓴对接人获取
> 挑战应答、登录的IP地址来源于注册时返回的accessAddr

```text
本文档示例中使用的设备SM2非对称秘钥如下（需要设备接入方自己生成，并提供公钥给微瓴侧）
私钥：649AFC433B485AF5B35D3A32647FECE8DBD4DD667990F46B691431DEE79F56C9
公钥：E7B81823186EE3C932ACF4CA4C3813A026ECD3FD1CDEF10F7D870E0701BB537B369EC087753E1034EAAF697D9A0BA0164AF2A5002ED18A82C8F011E3A2455C2D
```

## 1. 设备接入
### 1.1 注册v2

- 协议字
`0x000D`
- 通讯协议
- 客户端请求包

| key  | type       | description                            |
| ---- | ---------- | -------------------------------------- |
| v    | Integer    | 数据协议版本号,此版本号为2             |
| pid  | String     | productId，产品IP，从微瓴开放平台申请  |
| data | jsonObject | 数据内容，通过`服务器公钥加密传输`     |
| sn   | String     | 设备序列号，厂商自己生成               |
| lic  | String     | 通过设备私钥生成的licence，SM2(pid+sn)，签名时使用的userId为当前pid  |
| ts   | Long       | 当前时间                               |
| mac  | String     | 加密后的data所计算的md5值              |

- 示例

明文

```json
{
  "v":2,
  "pid": "1700001111",
  "data": {
    "sn": "3882DAE344F746a5",
    "lic": "304602210086F7246ED83540A5706053BB80B5A4F0BFEC4EB8CFC392410FD0EA4033595056022100EE56B4973705C5D1B75DD1B8178BFDA4D0A36C5E1F45EA51A12E3BCAB2461BD7",
    "ts": 1551605124123
  },
  "mac": "ffdc6e3389dd6403af559ccad0d2f6e4"
}
```

SM2加密后

```json
{
  "v":2,
  "pid": "1700001111",
  "data": "308201190221009C5AE288D27D55ACCBF76F1B843996AB985FC3465365FA62268E4683846A56B0022073CCA17DEDBD132A82778D7D1B9E0E52E5458DA1E087AFD05A0BFA3E6D92B41B0420177FE436608BB469404611D7794B540440E7353527FBE7BB76ADBE10395C4BE00481AFAC6FB448A5C58692B61FBA855A23F5B3525F3DE0730917B6ECF6B6C0FEB07938F15A48D05FED53E075B63F7254A3D763EC11B959D83CB8CCF14CEC299F21ABD2D89B2C21B37963ADB3FD9E1109C150231A9AD45FE43968D945FBBFAC4805AFB567692E24175D4B0317B66FB0DFE683C758B52A31D260AFCE165F7BF7BAF7C3758B9FD78AD95C9FD1AAE24DE5B58B59D30674E457AA57F7ACD993DD793F980FCC0E05154AAC80F69C814125E96710C7",
  "mac": "ffdc6e3389dd6403af559ccad0d2f6e4"
}
```

TCP传输的完整内容

```text
000D000002C07B2264617461223A2233303832303134323032323037363633313438343541413938304130433731324437344531303636464445424331313245363233364439324231313133454439303738333630344530463936303232313030424444434533444537393432443943333938384644374436383146423046354343333342304237364230313741324134343942303641394232374443424343383034323034363343363146453841354131433844413231334336363739343036463937443236364230384238303946423533414439443343333346463545463534423635303438314438364434413141443834443545463542443039343931333446453741363337344236354432353937383044383041383643364231343441304441434533343731433644454343414442373941464436303642444145334341313446463733313441383338353144434643353033333634313337313731394546373437323743353844444133423242333436464236324334414333444242413842384331383634313837423738353238464236383536423441433142324235463135394346373539423939393137443745344142353134454441323337384437344542374243423341373745333744444138313339303835373045394341343932313037424446393934423133423335393346443831453041423836384536363141413542354235364232394145443939454541454543333844363439343542314246413333374532464132394145374635463239384233363433324232394333463741393231444245343734394144433145413246363137424445463446454643414339444536343844323139353646384346463632453643353545443331314235373638363735434136433339374331343945363331222C226D6163223A226666646336653333383964643634303361663535396363616430643266366534227D
```

- 服务端返回包

| key              | type       | description                                                                 |
| ---------------- | ---------- | --------------------------------------------------------------------------- |
| *v               | Integer    | 数据协议版本号,此版本号为2                                                  |
| *code            | Integer    | 请求错误码，0为成功                                                         |
| *msg             | String     | 消息返回错误信息                                                            |
| *data            | jsonObject | 数据内容，通过`设备公钥加密`                                                |
| *din             | String     | 设备在云端的唯一标识，后续登录和通讯都已din为准。                           |
| *mqttServer      | String     | MQTT服务链接地址                                                            |
| *mqttClientId    | String     | MQTT服务客户端ID，目前同din                                                 |
| *mqttUser        | String     | MQTT服务登录用户名                                                          |
| *mqttPassword    | String     | MQTT服务登录密码                                                            |
| *sslType         | String     | 通讯加密类型，none：无加密，PSK：使用psk方式通讯，SSL：按照单向认证方式加密 |
| sslMqttServer    | String     | MQTT服务SSL地址                                                             |
| sslMqttCA        | String     | ca证书，与mqttPSK互斥，二者只会返回一个                                     |
| mqttPSK          | String     | mqtt服务登录的psk，与mqttCA互斥，二者只会返回一个                           |
| *mqttReciveTopic | String     | 设备订阅的topic                                                             |
| *mqttPushTopic   | String     | 设备推送消息使用的topic                                                     |
| *httpDomain      | String     | http通讯请求的地址                                                          |
| *innerUrl        | JSONArray  | http通讯内网请求的地址                                                      |
| *projId          | String     | 设备当前所属项目ID，为0表示未导入项目                                       |
| *projAccessAddr  | jsonArray  | 设备当前所属项目登录地址                                                    |
| *ts              | Long       | 时间戳                                                                      |
| *mac             | String     | 加密后的data所计算的md5值                                                   |

- 示例

返回密文

```json
{
  "v":2,
  "code":0,
  "msg":"ok",
  "data": "308201410221008B8F8EA1FA9E98288607E31EDA64A16C5E48FCC160953D9AE77DB9825B10A0F90220677ED0532D9FB3BEC7830DBCB0C409BF46A7B7773575F097940C0A9E2E4C14CA0420A991380DA426A768A0C6AB976138DC9277920689C8A576341372C88D113D06D50481D74D806A56FC9A4DF7EF6940917588742516BA714A46799CC31E2D6DA7282B616CF65911572DCECC11D1186B539994366F048539989168EAC03EF118531DFF2EC2EC59B8001D854CA0907AE892793D6C1BEB5F6BB49C1641A4F172628B1760AA5FAC4E83E519258E55D90D2D6B1D51E361B07CB5D359E0CBFAE6A08D18F417776D5BE662134E4D7EAAE3270027819F5E9C4313EFDA343446916E653C45FB4251470F112F939169F619DA1EB3EADD16292B6B78CA204B30F1605546496B5AC3C79CD763088D2430BB6930D13D1F829DF9DDE10813199ACE53",
  "mac": "f66b4284b8fa094abac52c7c89a5111c"
}
```

解密后明文

```json
{
  "v":2,
  "code":0,
  "msg":"ok",
  "data": {
    "mqttUser": "welink_client",
    "mqttClientId": "2000000000000001",
    "din": "2000000000000001",
    "mqttServer": "tcp://127.0.0.1:18833",
    "mqttPassword":"abcx123v",
    "sslMqttServer": "ssl://127.0.0.1:8883",
    "sslMqttCA":"-----BEGIN CERTIFICATE-----\nMIID9TCCAt2gAwIBAgIJALoDrw8H0UW0MA0GCSqGSIb3DQEBCwUAMIGQMQswCQYD\nVQQGEwJDTjESMBAGA1UECAwJR3VhbmdEb25nMREwDwYDVQQHDAhTaGVuemhlbjEQ\nMA4GA1UECgwHVGVuY2VudDEPMA0GA1UECwwGd2VsaW5rMRQwEgYDVQQDDAttcXR0\nIGJyb2tlcjEhMB8GCSqGSIb3DQEJARYSd2VsaW5rQHRlbmNlbnQuY29tMB4XDTE5\nMDQyMjA3NTAwMFoXDTI5MDIyODA3NTAwMFowgZAxCzAJBgNVBAYTAkNOMRIwEAYD\nVQQIDAlHdWFuZ0RvbmcxETAPBgNVBAcMCFNoZW56aGVuMRAwDgYDVQQKDAdUZW5j\nZW50MQ8wDQYDVQQLDAZ3ZWxpbmsxFDASBgNVBAMMC21xdHQgYnJva2VyMSEwHwYJ\nKoZIhvcNAQkBFhJ3ZWxpbmtAdGVuY2VudC5jb20wggEiMA0GCSqGSIb3DQEBAQUA\nA4IBDwAwggEKAoIBAQDmtq0m4nnrbrec/1ncrJnPl0rle+tc5OQvt0t665g4xc5O\nIrDNWk6Nfc7fbjb9EGyieHxtugHGp3sfFbDUgYqr8MpN1/6iq5EkTJ9LGYvuqLWn\ndilFikHJQgAf6863YCL+tKpALst6iAalTe3KV2FWgNXvFNY9JjvkKCg8XnND8tBc\n8jPia/6FMA/MUXruMcI7nO2Z0MMXBsuOjiGsqSYjrjI3COg4zP1NrwXeapjnqBJW\n84mEAKN+7kDDuOoQMK/Bj1OBJa1kxB/HEgOA2/LkRl8c2poyl8LHhW72jeCVcmC0\nHcOxFSM/oHE08Z7qtzPFqlAlhfdvYOomL/41XmzpAgMBAAGjUDBOMB0GA1UdDgQW\nBBRP9R7z4fNYCnl3IyxNSYa/y7/idTAfBgNVHSMEGDAWgBRP9R7z4fNYCnl3IyxN\nSYa/y7/idTAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQCMRMsQWaoA\n1suE5sDKa6Cul/nCcrsgzZCRh60yLxCX3xe8P7wx7rV76mg9seWXB8gLTIvXikiF\ntOkoXyhcGBcAdOI+WbyQO1C7mS0l3ifKZ+ss2rHDqMOO0R4qnViE1Wpgg2xzZtmD\nVgWMp/gzWegPlY+28QN6DKNvqEcJuzUiA3pkJJhL3Uj+ga9XV4djCTaBKZICrL8a\nkro8PaHUggTHONoBYLuCKTvr3McmJw/SllFxkDLbVcXsbar9/4Kp9cuj7v6RqYYB\nunuwXQb/z/nidihp/XFpnvUKazPTGr98D1DsJOQTmkOu9MYZ9dNO23UjAdFlE0SK\nitYOTY5oUfH/\n-----END CERTIFICATE-----",
    "httpDomain":"http://api.weiling.qq.com",
    "innerUrl":["http://127.0.0.1:8094","http://127.0.0.1:8095"],
    "projId":"5",
    "projAccessAddr":"192.168.1.2:18831",
    "ts": 1543302296148
    },
  "mac": "615e6a32de3178eb4c31812cb271f84a"
}
```

- 错误码

| code          | description              |
| ------------- | -------------------------|
| 10000    | 上报数据格式异常   |
| 10001    | sn格式非法或未放号   |
| 10002    | 没有上传设备公钥        |
| 10003    | mac验证失败        |

> 1.licence生成，使用SM2算法用设备私钥加密pid+sn字符串获得，签名的userId使用pid
> 2.示例的内容是明文，实际传输需要加密后再传输。

---

### 1.2 挑战应答

- 协议字
`0x000B`
- 通讯协议
- 客户端请求包
01

- 示例
以下为完整报文

```text
000B0000000101
```

- 服务端返回包

| key  | type    | description         |
| ---- | ------- | ------------------- |
| v    | Integer | 数据协议版本号      |
| code | Integer | 请求错误码，0为成功 |
| msg  | String  | 消息返回错误信息    |
| data | Integer | 随机数              |

- 示例

```json
{
  "v":1,
  "code":0,
  "msg":"ok",
  "data": 89741245
}
```

---

### 1.3 登录V2

- 协议字
`0x000E`
- 通讯协议
- 客户端请求包

| key           | type       | description                                                                      |
| ------------- | ---------- | -------------------------------------------------------------------------------- |
| v             | Integer    | 数据协议版本号,此版本号为2                                                       |
| pid           | String     | productId，产品IP，从微瓴开放平台申请                                            |
| data          | jsonObject | 数据内容，通过`服务器公钥加密`                                                   |
| din           | String     | 注册时获得的din                                                                  |
| challenge_ran | Integer    | 挑战应答的随机数，非必填                                                         |
| ran           | String     | SM4，向量参数，长度：16，格式：大小写字母+数字                                   |
| lic           | String     | 通过设备私钥加密pid，sn，挑战应答返回的random所生成的licence，SM2(pid+sn+random)，签名时使用的userId为当前pid  |
| mac           | String     | 加密后的data所计算的md5值                                                        |

- 示例

```json
{
  "v":2,
  "pid": "1700001111",
  "data": {
    "din": "2000000000000001",
    "challenge_ran": 89741245,
    "ran": "1234567890ABCDEF",
    "lic": "304402201E89D67349E6FFCA6F07BDC7FC6D5F9D90F91D8C750FA1021D68A79D0C66755E0220690A7733BDB8EA7AC88CDFF9F6A0DD018DCA4CA30D05EA970B31BBFB576E850B"
  },
  "mac": "8fe88143292101072aea6f43b2628e78"
}
```

SM2加密后

```json
{
  "v":2,
  "pid": "1700001111",
  "data": "3082014A02202139F013948043846E0C7C715BE03880D8BC951CE481EEE1AC671B71FE4DCAD402207244A20A40C8ABCDE4B984E3D8B8EEF64A457EE6255CFC11AD214CF01E6F737D0420DDEC40FD51866F6C6EC236D358E504E60777F49BB22E51F7B112264D421FAFF80481E1B55666D3EBB45235FF0C5654BED731FFA6B71A45E6455D482B772CCE98424C10F16A6455835E9A079D7CB39DAA388EA7B6830BF833B57BDAC69B780CA70AEE7E27D853D2D3C90A1F49C8D456BD8A43877A2F83A7034238D0E836AEC9234F6D42AAD1F84EA25647F0CFDD4BAC4795646B81CC7F2CBC7F351664C7F15EBDFDE2413348E6446BA54BD44A472C496590AC380B9AF3E925791F15F425439790852DBC4D0AB515C0A353AEBED11ACBF8593323321CCBA8E9A6681E9B5D7FD5F68FCE3326C595E2F0B60478B783DD654BC3FE5CC8296DECA77FEEA40A599DE63F3052C6EB",
  "mac": "8fe88143292101072aea6f43b2628e78"
}
```

TCP传输的完整内容

```text
000C000002D07B2264617461223A223330383230313441303232303231333946303133393438303433383436453043374337313542453033383830443842433935314345343831454545314143363731423731464534444341443430323230373234344132304134304338414243444534423938344533443842384545463634413435374545363235354346433131414432313443463031453646373337443034323044444543343046443531383636463643364543323336443335384535303445363037373746343942423232453531463742313132323634443432314641464638303438314531423535363636443345424234353233354646304335363534424544373331464641364237314134354536343535443438324237373243434539383432344331304631364136343535383335453941303739443743423339444141333838454137423638333042463833334235374244414336394237383043413730414545374532374438353344324433433930413146343943384434353642443841343338373741324638334137303334323338443045383336414543393233344636443432414144314638344541323536343746304346444434424143343739353634364238314343374632434243374633353136363443374631354542444644453234313333343845363434364241353442443434413437324334393635393041433338304239414633453932353739314631354634323534333937393038353244424334443041423531354330413335334145424544313141434246383539333332333332314343424138453941363638314539423544374644354636384643453333323643353935453246304236303437384237383344443635344243334645354343383239364445434137374645454134304135393944453633463330353243364542222C226D6163223A223866653838313433323932313031303732616561366634336232363238653738227D
```

- 服务端返回包

| key           | type       | description                                                               |
| ------------- | ---------- | ------------------------------------------------------------------------- |
| v             | Integer    | 数据协议版本号,此版本号为2                                                |
| code          | Integer    | 请求错误码，0为成功                                                       |
| msg           | String     | 消息返回错误信息                                                          |
| data          | jsonObject | 数据内容，通过 `设备公钥加密`                                             |
| ran           | String     | SM4，加密KEY，有效期：24小时，需要24小时内重新登录获取新秘钥              |
| httpToken     | String     | http协议通讯时使用的token，有效期：24小时，需要24小时内重新登录获取新秘钥 |
| ts            | Long       | 时间戳                                                                    |
| keyUsefulTime | Integer    | 对称秘钥以及httpToken的有效时间，单位：秒                                 |
| mac           | String     | 加密后的data所计算的md5值                                                 |

- 示例

返回密文

```json
{
  "v":2,
  "code":0,
  "msg":"ok",
  "data": "3081C7022100D223EBADDC629EAEA0E6BEB090A8DBFFAA05C66F78717D5317B62F519914390C0221008D7BAC3C9A8E659B3233FE01593B3E506EA6E0269DD0F1421654EDCA461942160420CC1A47F18261EDA2705D691F2A88EC4A513D08D09B392FE8DE89685A3EE9C825045DB9A6269BCC8382773A6FA601092B956F236F713364175AA4C499536B787C9D4CA66E522C5394A6264D3E92166FE47B8DD1ED905923D3E4AB02B44D41D372E9071036C40A1A4F30E702FD29E4F16D1E1FB6F2E7532FBDAC9A93BE6C5CBB",
  "mac": "615e6a32de3178eb4c31812cb271f84a"
}
```

解密后明文

```json
{
  "v":2,
  "code":0,
  "msg":"ok",
  "data": {
    "ran": "ABCDEF0123456789",
    "httpToken": "e636fe89-13d7-470a-84da-4c0514ebb727",
    "ts": 1532179338,
    "keyUsefulTime": 86400
  },
  "mac": "a1935c8783a912ba4ca53381cc16f330"
}

```

> 登录成功后，后续的消息传输使用SM4算法，由客户端提供加密的向量，服务端返回加密的KEY值。

---

## 2 自定义消息

### 2.1 MQTT

- 相关配置
- mqttURL：`mqtt服务链接地址`
- din：`设备唯一标识`
- user：`mqtt登录用户名`
- password：`mqtt登录密码`
- 消息订阅路径：`/welink/msg/receive/v1/{din}`
- 消息发布路径：`/welink/msg/push/v1/{din}`

- 消息体（String）

| key       | value   | description                     |
| --------- | ------- | ------------------------------- |
| din       | String  | 设备唯一标识                    |
| subDin    | String  | 子设备唯一标识，非必填            |
| msgType   | String  | report：主动发送，ack：查询返回 |
| seq       | Long    | 消息序号                        |
| random    | Integer | 随机数                          |
| timeStamp | Long    | 时间戳，单位：毫秒              |
| datapoint | Integer | datapoint id                    |
| value     | Object  | 消息自定义内容                  |

- 举例

- 加密key：JeF8U9wHFOMfs2Y8
- 向量：UISwD9fW6cFh9SNS
- 明文

```json
{
  "timeStamp": 1536151747890,
  "random": 1149701758,
  "datapoint": 222222,
  "msgType": "ack",
  "din": "WL_11111111",
  "value": "自定义消息",
  "seq": 1149701758
}
```

- 密文（以下示例用16进制展示，实际传输直接使用byte[]）

> ```
> C148FCB1CA89F4CE7D058A3AFD5220BB89D06A0EEDB9F0AD20E0CD4FA7C3D9CA4130870170C01608C16105CA9C99265A3F58EA4ED3B014E771E1FEE8419928B6548D66BAAA7854DC1FF31AC0D3F28C477D6DC137ACB1A091CDBAF026FF00074C1E3DC7EB0F6B0C51283340DD8908E8D939500B6062B65F1EB5F46B965673D82E515BAC22C32E341E2C9ED4C4E1DD8D107F49CCE9A6201F06C963518DFAF9A3C6
> ```

### 2.2 HTTP

- 消息上报（V1）

- URL
- `https://domain/iotmsg/httpmsg/v1/send`

- 请求方法
- POST

- Header

| key          | value  | description                    |
| ------------ | ------ | ------------------------------ |
| Content-Type | String | 固定为application/octet-stream |
| din          | String | 设备唯一标识                   |
| token        | String | 登录取到的临时票据             |

- Param
- 无
- body
`body内容为SM4加密的密文byte[]传输，以下格式为明文格式示意`
- 格式：json

| key       | value   | description                     |
| --------- | ------- | ------------------------------- |
| din       | String  | 设备唯一标识                    |
| subDin    | String  | 子设备唯一标识，非必填            |
| msgType   | String  | report：主动发送，ack：查询返回 |
| seq       | Long    | 消息序号                        |
| random    | Integer | 随机数                          |
| timeStamp | Long    | 时间戳，单位：毫秒              |
| datapoint | Integer | datapoint id                    |
| value     | Object  | 消息自定义内容                  |

- 示例

`url`

> `http://api.weiling.qq.com/iotmsg/httpmsg/v1/send`

`head`
> din=200000000000000
>
> token=e636fe89-13d7-470a-84da-4c0514ebb727

- 加密key：JeF8U9wHFOMfs2Y8
- 向量：UISwD9fW6cFh9SNS
- 明文

```json
{
  "din": "2000000000000001",
  "subDin": "2000000000000004",
  "msgType": "report",
  "seq": 123456,
  "random": 57295,
  "timestamp": 1543302296148,
  "datapoint": 30004,
  "value": "welink"
}
```

SM4加密后（实际传输以byte[]传输，示例用16进制展示）

```text
BA9D148FD6ACFC4415F6B9EF12DA8E9E06C013F3CA44B2B66C0A254DD2F1CB0BE287018A006E551E254C13F3C6C0AF44F781A233CAA15F6F8B8ABF3EB2DDC2B95654D7AC2751FAB8CDBC951685A5C7ADDD44262F3D58F9EC6614AF04AD80F8B920AB028D0AC07DC0C2E75E79727023F5978567428A51C77D5BF5569993533C50A3AA44BDBB4FCF9FC148E7895562030A48A81D056CD5A7714BFE3085A72BB4319DA47DAE3136
```

- 返回
`明文返回，格式为json`

| key     | value   | description       |
| ------- | ------- | ----------------- |
| code    | Integer | 错误码，0表示成功 |
| message | String  | 执行结果消息      |

- 错误码

| code    | description       |
| ------- | ----------------- |
| 20002   | 未登录，需要先调用登录接口 |
| 20003   | SM4解密失败    |
| 20004   | send内容中的din与header中的din不一致    |
| 20005   | 微瓴消息模块错误    |
| 20000   | 微瓴内部错误    |

- 消息拉取

- URL
- `https://domain/iotmsg/httpmsg/v1/pull`

- 请求方法
- GET

- Header

| key   | value  | description        |
| ----- | ------ | ------------------ |
| din   | String | 设备唯一标识       |
| token | String | 登录取到的临时票据 |

- Param

| key | value  | description                              |
| --- | ------ | ---------------------------------------- |
| seq | String | 收到的上一条消息的seq，第一次拉取消息传0 |

- 示例

`url`
> `http://api.weiling.qq.com/iotmsg/httpmsg/v1/pull?seq=2`

`head`
> din=200000000000000
>
> token=e636fe89-13d7-470a-84da-4c0514ebb727

#### 返回

`服务端等待数据超时时间为30s，即客户端需要保持至少30s的readtimeout，避免服务端收到消息推送时无法通过此链接response给客户端`
`返回内容为SM4加密的密文byte[]传输，以下格式为明文格式示意`

- 格式：json

| key       | value   | description                                                          |
| --------- | ------- | -------------------------------------------------------------------- |
| din       | String  | 设备唯一标识                                                         |
| subDin    | String  | 子设备唯一标识，非必填属性                                           |
| msgType   | String  | report：主动发送，reportack：设备查询返回             |
| seq       | Long    | 消息序号                                                             |
| ackSeq    | Long    | 服务端ack回复时会带上的设备上报的seq，当msgType为"reportack"才会有这个字段 |
| random    | Integer | 随机数                                                               |
| timeStamp | Long    | 时间戳，单位：毫秒                                                   |
| datapoint | Integer | datapoint id                                                         |
| value     | Object  | 消息自定义内容                                                       |

- 明文

```json
{
  "din": "2000000000000001",
  "msgType": "reportack",
  "seq": 53,
  "ackSeq": 2,
  "random": 3572295,
  "timestamp": 1543302296148,
  "datapoint": 30001,
  "value": "welink"
}
```

- http statusCode 状态码释义

| code | description                                                                     |
| ---- | ------------------------------------------------------------------------------- |
| 200  | 为空或者为null的话表示没有消息可以拉取，有数据的话，就直接是SM4加密的密文byte[] |
| 400  | 缺少参数                                                                        |
| 401  | 未调用登录接口，服务端无法获取到SM4对称密钥                                     |
| 403  | http token错误                                                                  |

## 3 微瓴IOT基础协议

> 通讯使用微瓴IOT的消息格式进行通讯

### 3.1 标准消息格式（byte[]）

| key       | value   | description                                      |
| --------- | ------- | ------------------------------------------------ |
| din       | String  | 设备唯一标识                                     |
| subDin    | String  | 子设备唯一标识，为空或者无此字段表示直连设备消息 |
| msgType   | String  | report：主动发送，ack：查询返回                  |
| seq       | Long    | 消息序号                                         |
| random    | Integer | 随机数                                           |
| timeStamp | Long    | 时间戳，单位：毫秒                               |
| datapoint | Integer | datapoint id                                     |
| value     | String  | 消息自定义内容                                   |

### 3.2 直连设备心跳消息（byte[]）

| key       | value   | description                                 |
| --------- | ------- | ------------------------------------------- |
| din       | String  | 设备唯一标识                                |
| msgType   | String  | report：主动发送，ack：查询返回，固定report |
| seq       | Long    | 消息序号                                    |
| random    | Integer | 随机数                                      |
| timeStamp | Long    | 时间戳，单位：毫秒                          |
| datapoint | Integer | datapoint id，固定心跳dp：30001             |
| value     | String  | 消息自定义内容，固定为welink                |

- 举例

- 加密key：JeF8U9wHFOMfs2Y8
- 向量：UISwD9fW6cFh9SNS
- 明文

```json
{
  "timeStamp": 1536151747890,
  "random": 1149701758,
  "datapoint": 30001,
  "msgType": "report",
  "din": "11111111",
  "value": "welink",
  "seq": 1149701758
}
```

- 密文

> ```
> C148FCB1CA89F4CE7D058A3AFD5220BB89D06A0EEDB9F0AD20E0CD4FA7C3D9CA4130870170C01608C16105CA9C99265A2F42E94FE49A675E857BFDC303304715A5C393E1470B975E076C81E4F34F7E3A4DB9BD9D4522BD83042CACBF3039DFFA9370302B411B160DEB0BFDA3378C51DBD54DAB3FE614ABAB1A76EA3A80F6B9603638CCB14954123008460AE0A1E78D7A
> ```

### 3.3 网关上报子设备注册消息（byte[]）

| key       | value   | description                                 |
| --------- | ------- | ------------------------------------------- |
| din       | String  | 网关设备唯一标识                            |
| msgType   | String  | report：主动发送，ack：查询返回，固定report |
| seq       | Long    | 消息序号                                    |
| random    | Integer | 随机数                                      |
| timeStamp | Long    | 时间戳，单位：毫秒                          |
| datapoint | Integer | datapoint id，通电后上报dp：30010           |
| value     | String  | 消息自定义内容                              |
| pid       | String  | 产品id                                      |
| sn        | String  | 设备sn                                      |
| page      | Integer | 第几页                                      |
| pageSize  | Integer | 一页多少记录,最多100                        |
| total     | Integer | 总记录数                                    |

- 举例

- 加密key：JeF8U9wHFOMfs2Y8
- 向量：UISwD9fW6cFh9SNS
- 明文

```json
{
    "timeStamp": 1536151747890,
    "random": 1149701758,
    "datapoint": 30010,
    "msgType": "report",
    "din": "11111111",
    "value": {
        "page": 1,
        "pageSize": 5,
        "total": 2,
        "deviceList": [
            {
                "pid": "1700005449",
                "sn": "pppanchong_12345ddd1016"
            },
            {
                "pid": "1700002550",
                "sn": "sn201800001"
            }
        ]
    },
    "seq": 1149701758
}
```

- 密文

> ```
> C148FCB1CA89F4CE7D058A3AFD5220BB89D06A0EEDB9F0AD20E0CD4FA7C3D9CA4130870170C01608C16105CA9C99265A2F42E94FE49A675E857BFDC303304715CA00795A315FE26B69D35FACD1524E1C5532A7F23BD154BB00D3C2C0ABAE66739546806AFF7635BC4084929E3B1F5C9251E96C0935F72C92A717E0C600F8D3F5D4ACEB42FC4E7D6A42CB29C4E36F3B8504CDBE80F042111C08A4C993359451F105C355FCB9CC48C120A2279B78F169089160C53ECB793B4B3402084F63294155FD568774CBF4195A0A7B614E5C03F42FA6180AC3AAF903AD350B4A469D6C90967C537002C7AD7B1ED7B5DBA646D6CE502DF44FFC15AFE665DF73D9D4D0EC491D743BE939C3D29F36476787EEBF232485
> ```

### 3.4 子设备列表接收（byte[]）

| key       | value   | description                                 |
| --------- | ------- | ------------------------------------------- |
| din       | String  | 设备唯一标识                                |
| msgType   | String  | report：主动发送，ack：查询返回，固定report |
| seq       | Long    | 消息序号                                    |
| random    | Integer | 随机数                                      |
| timeStamp | Long    | 时间戳，单位：毫秒                          |
| datapoint | Integer | datapoint id，固定datapoint：30006             |
| value     | String  | 消息自定义内容，jsonArray格式               |
| din       | String  | 子设备din                                   |
| sn        | String  | 子设备唯一序列号                            |
| pid       | Integer | 子设备的product id                          |

- 举例

- 加密key：JeF8U9wHFOMfs2Y8
- 向量：UISwD9fW6cFh9SNS
- 明文

```json
{
  "timeStamp": 1536151747890,
  "random": 1149701758,
  "datapoint": 30006,
  "msgType": "report",
  "din": "11111111",
  "value": "[{\"din\":\"200200000000000126\",\"pid\":1700005449,\"sn\":\"pppanchong_12345ddd1016\"},{\"din\":\"200200000000000127\",\"pid\":1700002550,\"sn\":\"sn201800001\"}]",
  "seq": 1149701758
}
```

- 密文

> ```
> C148FCB1CA89F4CE7D058A3AFD5220BB89D06A0EEDB9F0AD20E0CD4FA7C3D9CA4130870170C01608C16105CA9C99265A2F42E94FE49A675E857BFDC303304715CA00795A315FE26B69D35FACD1524E1C5532A7F23BD154BB00D3C2C0ABAE66739546806AFF7635BC4084929E3B1F5C9251E96C0935F72C92A717E0C600F8D3F5D4ACEB42FC4E7D6A42CB29C4E36F3B8504CDBE80F042111C08A4C993359451F105C355FCB9CC48C120A2279B78F169089160C53ECB793B4B3402084F63294155FD568774CBF4195A0A7B614E5C03F42FA6180AC3AAF903AD350B4A469D6C90967C537002C7AD7B1ED7B5DBA646D6CE502DF44FFC15AFE665DF73D9D4D0EC491D743BE939C3D29F36476787EEBF232485
> ```

### 3.5 获取云端子设备列表信息（byte[]）

| key       | value   | description                                 |
| --------- | ------- | ------------------------------------------- |
| din       | String  | 设备唯一标识                                |
| msgType   | String  | report：主动发送，ack：查询返回，固定report |
| seq       | Long    | 消息序号                                    |
| random    | Integer | 随机数                                      |
| timeStamp | Long    | 时间戳，单位：毫秒                          |
| datapoint | Integer | datapoint id，固定datapoint：30013             |
| value     | String  | 消息自定义内容，jsonArray格式               |
| din       | String  | 子设备din                                   |
| sn        | String  | 子设备唯一序列号                            |
| pid       | Integer | 子设备的product id                          |

- 举例

- 加密key：JeF8U9wHFOMfs2Y8
- 向量：UISwD9fW6cFh9SNS
- 明文

```json
{
  "timeStamp": 1536151747890,
  "random": 1149701758,
  "datapoint": 30013,
  "msgType": "report",
  "din": "11111111",
  "value": {
    "page": 1,
    "pageSize": 5,
    "total": 10,
    "deviceList": [
      {
        "pid": "1700005449",
        "sn": "pppanchong_12345ddd1016"
      },
      {
        "pid": "1700002550",
        "sn": "sn201800001"
      }
    ]
  },
  "seq": 1149701758
}
```

- 密文

> ```
> C148FCB1CA89F4CE7D058A3AFD5220BB89D06A0EEDB9F0AD20E0CD4FA7C3D9CA4130870170C01608C16105CA9C99265A2F42E94FE49A675E857BFDC303304715CA00795A315FE26B69D35FACD1524E1C5532A7F23BD154BB00D3C2C0ABAE66739546806AFF7635BC4084929E3B1F5C9251E96C0935F72C92A717E0C600F8D3F5D4ACEB42FC4E7D6A42CB29C4E36F3B8504CDBE80F042111C08A4C993359451F105C355FCB9CC48C120A2279B78F169089160C53ECB793B4B3402084F63294155FD568774CBF4195A0A7B614E5C03F42FA6180AC3AAF903AD350B4A469D6C90967C537002C7AD7B1ED7B5DBA646D6CE502DF44FFC15AFE665DF73D9D4D0EC491D743BE939C3D29F36476787EEBF232485
> ```

### 3.6 子设备状态列表上报（byte[]）

| key       | value   | description                                 |
| --------- | ------- | ------------------------------------------- |
| din       | String  | 设备唯一标识                                |
| msgType   | String  | report：主动发送，ack：查询返回，固定report |
| seq       | Long    | 消息序号                                    |
| random    | Integer | 随机数                                      |
| timeStamp | Long    | 时间戳，单位：毫秒                          |
| datapoint | Integer | datapoint id，固定datapoint：30002             |
| value     | String  | 消息自定义内容                              |
| page     | Integer  | 当前页码                              |
| pagesize     | Integer  | 总页码                              |
| total     | Integer  | 设备总数                              |
| deviceList     | jsonArray  | 子设备状态列表                  |
| din     | String  | 子设备din                              |
| status     | String  | 子设备状态                              |

- 举例

- 加密key：JeF8U9wHFOMfs2Y8
- 向量：UISwD9fW6cFh9SNS
- 明文

```json
{
  "timeStamp": 1536151747890,
  "random": 1149701758,
  "datapoint": 30002,
  "msgType": "report",
  "din": "11111111",
  "value": {
    "page": 1,
    "pagesize": 1,
    "total": 5,
    "deviceList": [
      {
        "din": "200200000000000010",
        "status": "offline"
      },
      {
        "din": "200200000000000011",
        "status": "online"
      }
    ]
  },
  "seq": 1149701758
}
```

- 密文

> ```
> C148FCB1CA89F4CE7D058A3AFD5220BB89D06A0EEDB9F0AD20E0CD4FA7C3D9CA4130870170C01608C16105CA9C99265A2F42E94FE49A675E857BFDC303304715CA00795A315FE26B69D35FACD1524E1C5532A7F23BD154BB00D3C2C0ABAE66739546806AFF7635BC4084929E3B1F5C9251E96C0935F72C92A717E0C600F8D3F5D4ACEB42FC4E7D6A42CB29C4E36F3B8504CDBE80F042111C08A4C993359451F105C355FCB9CC48C120A2279B78F169089160C53ECB793B4B3402084F63294155FD568774CBF4195A0A7B614E5C03F42FA6180AC3AAF903AD350B4A469D6C90967C537002C7AD7B1ED7B5DBA646D6CE502DF44FFC15AFE665DF73D9D4D0EC491D743BE939C3D29F36476787EEBF232485
> ```

### 3.7 设备下载文件

- 设备收到的消息格式

- dataponit id:30003

> **下面表格表示 value格式**

| key      | value   | description                           |
| -------- | ------- | ------------------------------------- |
| fileId   | Stirng  | 文件唯一标识                          |
| fileName | Stirng  | 文件名                                |
| length   | Integer | 上传文件大小                          |
| hash     | String  | 文件内容做SHA-256的hash，格式为16进制 |
| url      | String  | 文件下载地址                          |
| data     | String  | 自定义透传消息                        |

> **实例**

```json
{"timeStamp":1536151747890,"random":1149701758,"datapoint":30003,"msgType":"report","din":"11111111","value":{"fileId":"3364aef0-ca60-450a-b694-9dedae930b05","fileName":"testupload.jpg","length":25,"hash":"73b48297c6ebac071ac66a03a8dabccbc9d0377c9b0b525d31e8cd14f5892713","url":"http://10.56.63.195:8504/file/upload/200200000000000008/2018-12-21/testupload?save_type=bigfiletodevice&wl_auth_sign=06f8789de2741cb7a29e40fa847a7e9cb2adcdc1fd27f9241515aa233566fe1b&wl_expire_time=1545406322095&wl_file_length=25&wl_file_sign=73b48297c6ebac071ac66a03a8dabccbc9d0377c9b0b525d31e8cd14f5892713&write_disk=d5","data":"photo"},"seq":1149701758}
```

### 3.8 设备上传文件

设备上传文件分成三个步骤

- 设备请求上传

- 微瓴异步回复设备上传url

- 设备完成上传，上报给微瓴

- 设备请求上传格式

- dataponit id:`30004`

  **下面表格表示 value格式**

| key      | value   | description                           |
| -------- | ------- | ------------------------------------- |
| fileName | Stirng  | 文件名                                |
| length   | Integer | 上传文件大小                          |
| hash     | String  | 文件内容做SHA-256的hash，格式为16进制 |
| data     | String  | 自定义透传消息                        |

> **实例**

```json
{"timeStamp":1536151747890,"random":1149701758,"datapoint":30004,"msgType":"report","din":"11111111","value":{"fileName":"testupload.jpg","data":"photo","length":25,"hash":"73b48297c6ebac071ac66a03a8dabccbc9d0377c9b0b525d31e8cd14f5892713"},"seq":1149701758}
```

- 微瓴异步回复设备上传url

| key    | value  | description  |
| ------ | ------ | ------------ |
| fileId | Stirng | 文件唯一标识 |
| url    | String | 文件上传url  |

> **实例**

```json
{"timeStamp":1536151747890,"random":1149701758,"datapoint":30004,"msgType":"reportack","ackSeq":1149701758,"din":"11111111","value":"{\"sign\":\"\",\"url\":\"http://10.56.63.195:8504/file/upload/200200000000000008/2018-12-21/testupload?save_type=bigfiletodevice&wl_auth_sign=06f8789de2741cb7a29e40fa847a7e9cb2adcdc1fd27f9241515aa233566fe1b&wl_expire_time=1545406322095&wl_file_length=25&wl_file_sign=73b48297c6ebac071ac66a03a8dabccbc9d0377c9b0b525d31e8cd14f5892713&write_disk=d5\",\"fileId\":\"3364aef0-ca60-450a-b694-9dedae930b05\"}","seq":1149701759}
```

- 设备发送文件上传结果

> **参数格式**

datapoint:30005

| key    | value  | description                 |
| ------ | ------ | --------------------------- |
| fileId | Stirng | 文件唯一标识                |
| result | String | 固定参数，"success"、"fail" |
| data   | String | 自定义透传消息              |

> **实例**

```json
{"timeStamp":1536151747890,"random":1149701758,"datapoint":30005,"msgType":"report","din":"11111111","value":{"fileId":"3364aef0-ca60-450a-b694-9dedae930b05","result":"success","data":"photo"},"seq":1149701760}
```

### 3.9 网关请求子设备列表

| key       | value   | description                                 |
| --------- | ------- | ------------------------------------------- |
| din       | String  | 设备唯一标识                                |
| msgType   | String  | report：主动发送，ack：查询返回，固定report |
| seq       | Long    | 消息序号                                    |
| random    | Integer | 随机数                                      |
| timeStamp | Long    | 时间戳，单位：毫秒                          |
| datapoint | Integer | datapoint id，固定心跳dp：30007             |
| value     | String  | 消息自定义内容，固定为welink                |

- 举例

- 加密key：JeF8U9wHFOMfs2Y8
- 向量：UISwD9fW6cFh9SNS
- 明文

```json
{
  "timeStamp": 1536151747890,
  "random": 1149701758,
  "datapoint": 30007,
  "msgType": "report",
  "din": "11111111",
  "value": "welink",
  "seq": 1149701758
}
```

- 密文

> ```
> C148FCB1CA89F4CE7D058A3AFD5220BB89D06A0EEDB9F0AD20E0CD4FA7C3D9CA4130870170C01608C16105CA9C99265A2F42E94FE49A675E857BFDC303304715A5C393E1470B975E076C81E4F34F7E3A4DB9BD9D4522BD83042CACBF3039DFFA9370302B411B160DEB0BFDA3378C51DBD54DAB3FE614ABAB1A76EA3A80F6B9603638CCB14954123008460AE0A1E78D7A
> ```

### 3.10 OTA更新

- dataponit id:`30011`

- value内字段示意

| key      | value   | description                                        |
| -------- | ------- | -------------------------------------------------- |
| fileId   | Stirng  | 文件唯一标识                                       |
| fileName | Stirng  | 文件名                                             |
| length   | Integer | 上传文件大小,单位：byte                            |
| hash     | String  | 文件内容做SHA-256的hash，格式为16进制              |
| url      | String  | 文件下载地址                                       |
| data     | String  | 自定义消息                                         |
| ota_id   | String  | ota升级包的id值                                    |
| cmd      | String  | 升级指令，full：全量更新包 ，increment：增量更新包 |

- 示例

```json
{
  "timeStamp": 1536151747890,
  "random": 1149701758,
  "datapoint": 222222,
  "msgType": "report",
  "din": "WL_11111111",
  "value": {
    "fileId": "UUID",
    "fileName": "WELINK-TH82S1-V1.0.0.0-build-20180509173508_test.bin",
    "length": 1234,
    "hash": "1234567890ABCDEF",
    "url": "https://mvs-30035.sz.gfp.tencent-cloud.com//emulated/0/tencent/device/accesslog/1551345059794?sign=q-sign-algorithms6q-akDJwxbdHXcgrqZyWxNOcqdDnNq-sign-tim1551345059",
    "data": "{\"ota_id\":\"12\",\"cmd\":\"full\"}"
  },
  "seq": 1149701758
}
```

### 3.11 设备升级成功后上报升级结果

- 请求格式
- dataponit id:`30012`
- 字段示意

| key             | value   | description                                           |
| --------------- | ------- | ----------------------------------------------------- |
| fileId          | Stirng  | 文件唯一标识                                          |
| fileName        | Stirng  | 文件名                                                |
| length          | Integer | 下载的文件大小,单位：byte                             |
| hash            | String  | 文件内容做SHA-256的hash，格式为16进制                 |
| firmwareVersion | String  | 当前固件版本号                                        |
| ota_id          | String  | 当前ota升级包的id值，如果升级失败则保持之前的ota_id值 |
| result          | String  | 升级结果，success：成功 ，fail：失败                  |

- 示例
  
```json
{
  "timeStamp": 1536151769890,
  "random": 3390683214,
  "datapoint": 30012,
  "msgType": "ack",
  "din": "1234567890",
  "value": {
    "fileId": "UUID",
    "fileName": "WELINK-TH82S1-V1.0.0.0-build-20180509173508_test.bin",
    "length": 1234,
    "hash": "1234567890ABCDEF",
    "firmwareVersion": "WELINK-TH82S1-V1.0.0.0",
    "ota_id": "12",
    "result": "success"
  },
  "seq": 1149701758
}
```
