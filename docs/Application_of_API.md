[TOC]
# 微瓴应用API

## 1. API概述

Hi，您好，欢迎使用腾讯微瓴开放平台服务。
本文档主要介绍腾讯微瓴开放平台API快速使用流程，如果您对文档内容有任何疑问，可以通过以下方式联系我们：    联系邮箱：`welink@tencent.com`

---


## 2. 使用流程

### 2.1 成为开发者

[https://open.welink.qq.com/#/dev-resource/guide/qualification](https://open.welink.qq.com/#/dev-resource/guide/qualification)
点击顶部导航栏右侧控制台或者底部快速入门-管理控制台，首次登录将会跳转到注册界面，完成企业资质注册即可进入控制台页面。

### 2.2 创建应用

在控制台页面，您可以在【应用管理】板块点击新增应用，填写应用的相关信息，自动生成应用AppID、AppKey和应用票据[将后台审核描述去掉，更改为“自动生成应用AppID、AppKey和应用票据”]，完成应用的创建。

### 2.3 获取密钥

在您的应用创建成功之后，可以在应用调试或应用详情中查看此应用的接入凭证AppID和AppKey。这是您的应用接入微瓴的主要凭证，每个应用有唯一标识，互不相同，请您妥善保管。

### 2.4 生成签名

您的应用在调用微瓴API之前，首先需要获取接口鉴权的签名。您需要使用应用所分配的AppID和AppKey，参考签名Demo，生成API接口鉴权签名。

### 2.5 开始开发

腾讯微瓴开放了REST API形式的服务，您可以点击【开发资源-API文档】查看具体调用参数及方法。

---

## 3. 调用方式

### 3.1 服务地址

  本文档列举了微瓴开放平台可提供的全部 API 功能，但是在具体项目中，对接使用的 API 接口应该是 API 文档中的部分接口，开发者可以查看平台可使用的API 接口列表，通过指定域名访问，在实际项目对应的环境中进行联调。

- 目前支持的环境和域名列表为：

|     接入地域     |     环境类别     |              域名               |
| :--------------: | :--------------: | :-----------------------------: |
| 西南地区（重庆） | 开放平台沙箱环境 |    sandboxapi.welink.qq.com     |
| 西南地区（重庆） |    公有云环境    | openapi.weiling.qq.com/chongqin |
| 华南地区（广州） |    公有云环境    |      api-gz.welink.qq.com       |

### 3.2 通信协议

  微瓴开放平台提供的所有API接口均通过HTTPS协议传输，提供高安全性的通讯。

### 3.3 请求方法

微瓴支持的 HTTP 请求方法:

- POST（推荐）
- GET

POST 请求支持的 Content-Type 类型：

- application/json（推荐），必须使用 HMAC-SHA1 签名方法。
- GET 请求的请求包大小不得超过 32 KB。
- POST 请求使用签名方法为 HMAC-SHA1时不得超过 1 MB。

### 3.4 字符编码

- 均使用UTF-8编码。

### 3.5 公共参数

- 公共参数是用于标识接口鉴权的参数，每次请求均需要携带这些参数，才能正常发起请求

|     参数     |                                                 参数描述                                                 |
| :----------: | :------------------------------------------------------------------------------------------------------: |
|    appid     |                         应用接入微瓴的唯一标识App ID，新增应用通过后系统自动生成                         |
|  app_ticket  | 用于登录API的应用票据，app_ticket有时间期限，由管理员决定app_ticket的期限，推荐3个月，请注意及时更新票据 |
|     sig      |                             加密的密文，用于登录API使用，生成方式见生成签名                              |
|    token     |                          动态密钥，20分钟有效期，每一次调用API均需要带上该密钥                           |
| iotim_ticket |                                 物联票据，每一次调用API均需要带上该票据                                  |

---

## 4. 签名机制

### 4.1 签名机制简介

  微瓴开放平台HTTP API使用签名机制来验证请求的合法性。应用在调用微瓴API时必须带上接口请求签名，其中签名信息由接口请求参数和应用密钥根据本文提供的HMAC-SHA1算法生成，使用Base64编码。对于校验不通过的请求，API将拒绝处理，并返回鉴权失败错误。

### 4.2 获取应用密钥

  登录微瓴开放平台，进入控制台-应用管理页面，如您未创建应用，可通过新增应用功能创建应用，获取AppID和AppKey。

### 4.3 签名生成样例

  获取到AppID和AppKey之后，您需要自行实现生成签名的功能。签名的生成推荐使用我们提供的各语言Demo。具体样例如下：

#### 4.3.1 JAVA签名示例

```java
private static String encrypt(String key,long times,long num){
  byte[] k = key.getBytes();
  byte[] t = getBytesByLong(times);
  byte[] n = getBytesByLong(num);
  byte[] np = new byte[k.length+t.length+n.length];
  int i=0;
  for(int j=0;j<k.length;j++,i++){
    np[i]=k[j];
  }
  for(int j=0;j<t.length;j++,i++){
    np[i]=t[j];
  }
  for(int j=0;j<n.length;j++,i++){
    np[i]=n[j];
  }
  String sha1 = getSHA1(np);
  return sha1;
}

private static byte[] getBytesByLong(long data){
  byte[] bytes = new byte[8];
  bytes[0] = (byte) (data & 0xff);
  bytes[1] = (byte) ((data >> 8) & 0xff);
  bytes[2] = (byte) ((data >> 16) & 0xff);
  bytes[3] = (byte) ((data >> 24) & 0xff);
  bytes[4] = (byte) ((data >> 32) & 0xff);
  bytes[5] = (byte) ((data >> 40) & 0xff);
  bytes[6] = (byte) ((data >> 48) & 0xff);
  bytes[7] = (byte) ((data >> 56) & 0xff);
  return bytes;
}

private static String getSHA1(byte[] str) {
  String sha1 = "";

  try {
    MessageDigest digest = MessageDigest.getInstance("SHA-1");
    digest.update(str);

    byte[] messageDigest = digest.digest();
    StringBuilder hexString = new StringBuilder();
    for (int i = 0; i < messageDigest.length; i++) {
      String shaHex = Integer.toHexString(messageDigest[i] & 0xFF);
      if (shaHex.length() < 2) {
          hexString.append(0);
        }
        hexString.append(shaHex);
    }

    sha1 = hexString.toString();
  } catch (Exception e) {
    e.printStackTrace();
  }

  return sha1.toUpperCase();
}
```

#### 4.3.2 Python签名示例

```python
import time
import struct
import hashlib

timestamp = str(int(round(time.time() * 1000)))
#timestamp = '1494502392528'
nonceStr = '4561615'
KEYS = '************'
#12sqq 中的 12s 表示KEYS的长度为12
signature_str = struct.pack('=12sqq',KEYS,long(timestamp),long(nonceStr))

signature = hashlib.sha1(signature_str).hexdigest()
```

#### 4.3.3 PHP签名示例

```php
$key='testtesttesttest1';
$times = 1479693497852;
$num = 4516316;

var_dump(encrypt($key,$times,$num));

function encrypt($key,$times, $num){
  $k = getBytes($key);
  $t = getBytesByLong($times);
  $n = getBytesByLong($num);
  $np = array();
  $i=0;

  for($j=0;$j<count($k);$j++,$i++){
    $np[$i]=$k[$j];
  }

  for($j=0;$j<count($t);$j++,$i++){
    $np[$i]=$t[$j];
  }

  for($j=0;$j<count($n);$j++,$i++){
    $np[$i]=$n[$j];
  }
  //var_dump($np);
  $sha1 = sha1(toStr($np));
  return $sha1;
}

function toStr($bytes) {
  $str = '';
  foreach($bytes as $ch) {
    $str .= chr($ch);
  }
  return $str;
}

/**
* 转换一个String字符串为byte数组
* @param $str 需要转换的字符串
* @param $bytes 目标byte数组
* @author weling
*/
function getBytes($string) {
  $bytes = array();
  for($i = 0; $i < strlen($string); $i++){
    $bytes[] = ord($string[$i]);
  }
  return $bytes;
}

/**
* 转换一个long为byte数组
* @param $byt 目标byte数组
* @param $val 需要转换的字符串
*/
function getBytesBylong($val) {
  if(PHP_INT_SIZE == 4) { //整型为 32 位
    $byt = array();
    $byt[0] = ($val & 0xff);
    $byt[1] = ($val >> 8 & 0xff);
    $byt[2] = ($val >> 16 & 0xff);
    $byt[3] = ($val >> 24 & 0xff);
    if($val > PHP_INT_MAX) {
      $high = intval($val / 4294967296);
      $byt[4] = ($high & 0xff);
      $byt[5] = ($high >> 8 & 0xff);
      $byt[6] = ($high >> 16 & 0xff);
      $byt[7] = ($high >> 24 & 0xff);
    } else {
      $byt[4] = $byt[5] = $byt[6] = $byt[7] = 0;
    }
    return $byt;
  } else {                //整型为 64 位
    $byt = array();
    $byt[0] = ($val & 0xff);
    $byt[1] = ($val >> 8 & 0xff);
    $byt[2] = ($val >> 16 & 0xff);
    $byt[3] = ($val >> 24 & 0xff);
    $byt[4] = ($val >> 32 & 0xff);
    $byt[5] = ($val >> 40 & 0xff);
    $byt[6] = ($val >> 48 & 0xff);
    $byt[7] = ($val >> 56 & 0xff);
    return $byt;
  }
}
```

#### 4.3.4 NodeJS签名示例

```js
// if not browser env, then require node.js's util. otherwise just use window's
const TextEncoder = (typeof window === 'undefined') ? require('util').TextEncoder : window.TextEncoder

const crypto = require('crypto')

const encryptSig = function (appKey, timeStamp, randomNum) {
  let keyBytes = getBytesByStr(appKey)
  let timestampBytes = getBytesByInt64LE(timeStamp)
  let numberBytes = getBytesByInt64LE(randomNum)
  let concatBuffer = new Uint8Array(keyBytes.length + 16)
  concatBuffer.set(keyBytes)
  concatBuffer.set(timestampBytes, keyBytes.length)
  concatBuffer.set(numberBytes, keyBytes.length + 8)
  let sha1 = crypto.createHash('SHA1')
  sha1.update(concatBuffer)
  let sigResult = sha1.digest('hex')
  return sigResult
}

const getBytesByStr = function (str) {
  // always utf-8
  let encoder = new TextEncoder()
  let strBuffer = encoder.encode(appKey)
  return strBuffer
}

const getBytesByInt64LE = function (number) {
  let w = 4294967296
  let high = ((number / w) & 0xffffffff)
  let low = number % w
  // transfer to LE
  let numberLEArray = new Uint8Array(8)
  numberLEArray[0] = low & 0xff
  numberLEArray[1] = low >> 8 & 0xff
  numberLEArray[2] = low >> 16 & 0xff
  numberLEArray[3] = low >> 24 & 0xff
  numberLEArray[4] = high & 0xff
  numberLEArray[5] = high >> 8 & 0xff
  numberLEArray[6] = high >> 16 & 0xff
  numberLEArray[7] = high >> 24 & 0xff
  return numberLEArray
}

let loginTimestamp = new Date().getTime()
let loginNum = Math.round(Math.random() * 100000)
let appKey = '********' // change it to your own app key
let sig = encryptSig(appKey, loginTimestamp, loginNum)
```

---

## 5. 接口鉴权

### 5.1 使用用户信息登录（邮箱/QQ/微信账号登录）

- 请求url: `/common/ticket/loginByUser`
- 请求方式: `get`
- 描述: 用于获取token和iotim_ticket。适用于先登录过微瓴开放平台，已经有用户登录态的情况。例如从微瓴开放平台拉起客户端，从session中获取用户登录信息，然后使用该接口调用API获取动态密钥token和物联票据iotim_ticket。
- 参数列表:

| 字段名称 | 字段类型 | 是否必须 |                           字段描述                           |
| :------: | :------: | :------: | :----------------------------------------------------------: |
|  appid   |   Long   |   Yes    |           应用系统的appid，新增应用后系统自动生成            |
|   time   |   Long   |    是    |                     当前北京时间的时间戳                     |
|   num    |   Long   |    是    |                        加密时的随机数                        |
|   sig    |  String  |    是    |            用于鉴权的密文，生成方式见签名生成样例            |
| loginKey |  String  |    是    | cookie中mvs_unified_login_token_key字段的值。支持QQ、微信、邮箱账号登录。 |

- 请求示例：

```shell
/common/ticket/loginByUser
?appid=10000
&time=1494765993240
&num=1518
&sig=*****************************
&loginKey=************************************
```

- 返回参数:

|   字段名称   | 字段类型 |              字段描述               |
| :----------: | :------: | :---------------------------------: |
|     code     |  String  | 错误码，0表示成功，其他见错误码说明 |
|   message    |  String  |            执行结果消息             |
|     data     |   Json   |              查询结果               |
|    token     |  String  |        动态密钥，20分钟过期         |
| iotim_ticket |  String  |              物联票据               |

- 返回格式:

```json
{
  "code": 0,
  "data": {
    "iotim_ticket": "*****************",
    "token": "******************"
  },
  "message": "OK"
}
```

### 5.2 使用后台方式登录

- 请求url: `/common/ticket/loginByApp`
- 请求方式: `get`
- 描述: 用于获取token和iotim_ticket。适用于不关注用户信息，通过后台方式获取调用API的访问权限的场景。开发者可以使用开放平台分配的app_ticket通过该接口获取动态密钥token和物联票据iotim_ticket。
- 参数列表:

|  字段名称  | 字段类型 | 是否必须 |                字段描述                |
| :--------: | :------: | :------: | :------------------------------------: |
|   appid    |   Long   |    是    |    应用系统的App ID，由系统自动分配    |
|    time    |   Long   |    是    |          当前北京时间的时间戳          |
|    num     |   Long   |    是    |             加密时的随机数             |
|    sig     |  String  |    是    | 用于鉴权的密文，生成方式见签名生成样例 |
| app_ticket |  String  |    是    |    开放平台分配的票据，用于登录鉴权    |

- 请求示例：

```shell
/common/ticket/loginByApp
?time=1520231107761
&num=1
&sig=*****************************
&appid=*****
&app_ticket=*******************************************
```

- 返回参数:

|   字段名称   | 字段类型 |              字段描述               |
| :----------: | :------: | :---------------------------------: |
|     code     |  String  | 错误码，0表示成功，其他见错误码说明 |
|   message    |  String  |            执行结果消息             |
|     data     |   Json   |              查询结果               |
|    token     |  String  |        动态密钥，20分钟过期         |
| iotim_ticket |  String  |              物联票据               |

- 返回格式:

```json
{
  "code": 0,
  "data": {
    "iotim_ticket":
      "*******************************************************",
    "token":
      "*******************************************************"
  },
  "message": "OK"
}
```

## 6. 设备管理

### 6.1 获取设备列表

- 请求url: `/common/device/getDeviceList`
- 请求方式: `get`
- 描述: 根据条件查询设备列表信息

|   字段名称   | 字段类型 | 是否必须 |             字段描述              |
| :----------: | :------: | :------: | :-------------------------------: |
|    token     |  String  |    是    |   鉴权参数：登录获取的动态密钥    |
| iotim_ticket |  String  |    是    |   鉴权参数：登录获取的物联票据    |
|     num      | Integer  |    是    | 分页参数：每页记录数，最大返回100 |
|     page     | Integer  |    是    |        分页参数：当前页码         |
|     pid      |   Long   |    否    |   查询条件：设备所属的产品的id    |
|      sn      |  String  |    否    |       查询条件：设备序列号        |
|     din      |  String  |    否    |  查询条件：设备在微瓴的唯一标志   |
|parent_din | String| 否 | 查询条件：父设备|

- 请求示例：

```shell
/common/device/getDeviceList?page=1
&num=999
&token=***************
&iotim_ticket=*********************
```

- 返回参数:

|   字段名称    | 字段类型  |                字段描述                 |
| :-----------: | :-------: | :-------------------------------------: |
|     code      |  String   |   错误码，0表示成功，其他见错误码说明   |
|    message    |  String   |              执行结果消息               |
|     data      |   Json    |                查询结果                 |
|   totalpage   |  Integer  |                 总页数                  |
|   totalrow    |  Integer  |                 总数量                  |
|     list      | JsonArray |            设备详细信息列表             |
|      din      |  String   |          设备在微瓴的唯一标志           |
|  product_id   |  Integer  |             设备所属产品id              |
|   position    |  String   |              设备位置信息               |
| device_status |  String   | 设备在线状态，online-在线，offline-离线 |
|    isLive     |  boolean  |      推流状态（仅摄像机有该状态）       |
|  device_name  |  String   |                设备名称                 |
|  device_nick  |  String   |                设备昵称                 |
|  device_type  |  Integer  |              设备类型编码               |
|    dt_name    |  String   |              设备类型名称               |
|      sn       |  String   |               设备序列号                |
|  point_name   |  String   |              设备点位名称               |
|  coordinate   |  String   |         设备坐标点，格式(x,y,z)         |
|parent_din |    String     |        父设备|

- 返回格式:

```json
{
  "code": 0,
  "data": {
    "totalpage": 1,
    "totalrow": 1,
    "list": [{
      "device_status": "offline",
      "device_name": "GB9ZA0O0QL000001",
      "coordinate": "",
      "dt_name": "人脸识别一体机",
      "product_id": 1700005883,
      "din": "300000000000000081",
      "parent_din": "300000000000000080",
      "device_nick": "GB9ZA0O0QL000001",
      "device_type": 67,
      "sn": "GB9ZA0O0QL000001",
      "position": "_飞亚达大厦_4楼_办公室_x,y(非必填)",
      "point_name": ""
    }]
  },
  "message": "OK"
}
```



---

## 7. 服务管理

### 7.1 调用第三方服务

- 请求url: `/common/logic/call`
- 请求方式: `POST`
- 描述: 应用通过该接口访问开放平台上发布的服务。
- 参数列表:

|   字段名称   | 字段类型  | 是否必须 |           字段描述           |
| :----------: | :-------: | :------: | :--------------------------: |
|    token     |  String   |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String   |    是    | 鉴权参数：登录获取的物联票据 |
|  service_id  |   Long    |    是    |        访问的服务的id        |
|    api_id    |   Long    |    是    |  访问的服务下的某个api的id   |
|    params    | JsonArray |    否    |     服务的api的参数数组      |
|     name     |  String   |    否    |            参数名            |
|    value     |    All    |    否    |            参数值            |

- 请求示例：

```shell
 /common/logic/call?
service_id=******
&api_id=******
&iotim_ticket=*********************************************************
&token=*********************************************************
a.headers：Content-Type: application/json
b.body: {"params": [{"name":"a", "value":"a"},{"name":"b", "value":"2"}]}
```

- 返回参数:

| 字段名称 | 字段类型 |              字段描述               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| message  |  String  |            执行结果消息             |

- 返回格式:

```json
{
  "code": 0,
  "message": "OK"
}
```

---

## 8. 帐号权限

### 8.1 获取当前用户信息

- 请求url: `/common/account/getCurrentUserInfo`
- 请求方式: `get`
- 描述: 获取当前登录用户的的信息，包括用户的角色列表
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |

- 请求示例：

```shell
 /common/account/getCurrentUserInfo?
token=************************************************************
&iotim_ticket=*********************************************************
```

- 返回参数:

|    字段名称    | 字段类型  |              字段描述               |
| :------------: | :-------: | :---------------------------------: |
|      code      |  String   | 错误码，0表示成功，其他见错误码说明 |
|    message     |  String   |            执行结果消息             |
|      data      |   Json    |              查询结果               |
|    user_id     |  Integer  |               用户id                |
| head_image_url |  String   |             用户头像url             |
|    username    |  String   |             用户中文名              |
|  username_en   |  String   |             用户英文名              |
|   role_list    | JSONArray |            用户角色列表             |
|   role_code    |  String   |              角色代码               |

- 返回格式:

```json
{
  "code": 0,
  "data": {
    "user_id": "999",
    "head_img_url":
      "http://wx.qlogo.cn/mmopen/vi_32/WEFSDFS2MjCsaH7ib3AwMZ5fldlF2bJW9nFxIemMYCvVJHkjtzNTibap7eNdAyHW9NekueIvuFibVV6pkG7pb9bW5A/0",
    "username": "测试用户名",
    "username_en": "testuser",
    "role_list": [{ "role_code": "admin" }]
  },
  "message": "OK"
}
```

### 8.2 新增角色

- 请求url: `/common/account/addAPIRole`
- 请求方式: `get`
- 描述: 给当前应用新增一个API角色
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |
|  role_name   |  String  |    是    |   角色名，中文请用utf8编码   |
|  role_code   |  String  |    是    |  角色代码，中文请用utf8编码  |
| description  |  String  |    是    |  角色描述，中文请用utf8编码  |

- 请求示例：

```shell
 /common/account/addAPIRole?
token=*******************************************************
&role_name=管理员
&role_code=admin5
&description=测试帐号
&iotim_ticket=*******************************************************
```

- 返回参数:

| 字段名称 | 字段类型 |              字段描述               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| message  |  String  |            执行结果消息             |

- 返回格式:

```json
{
  "code": 0,
  "message": "OK"
}
```

### 8.3 删除角色

- 请求url: `/common/account/delAPIRole`
- 请求方式: `get`
- 描述: 删除当前应用的一个API角色，被删除的角色代码不能再使用
- 参数列表:
|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |  |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |  |
|  role_code   |  String  |    是    |  角色代码，中文请用utf8编码  |  |

- 请求示例：

```shell
 /common/account/delAPIRole?
token=*******************************************************
&role_code=admin5
&iotim_ticket=*******************************************************
```

- 返回参数:

| 字段名称 | 字段类型 |              字段描述               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |  |  |
| message  |  String  |            执行结果消息             |  |  |

- 返回格式:

```json
{
  "code": 0,
  "message": "OK"
}
```

### 8.4 查询角色

- 请求url: `/common/account/findAPIRoleList`
- 请求方式: `get`
- 描述: 根据角色代码查询角色信息
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |
|  role_code   |  String  |    是    |  角色代码，中文请用utf8编码  |

- 请求示例：

```shell
 /common/account/delAPIRole?
token=*******************************************************
&iotim_ticket=*******************************************************
```

- 返回参数:

| 字段名称 | 字段类型  |              字段描述               |
| :------: | :-------: | :---------------------------------: |
|   code   |  String   | 错误码，0表示成功，其他见错误码说明 |
| message  |  String   |            执行结果消息             |
|   data   | JSONArray |            角色信息列表             |

- 返回格式:

```json
{
"code": 0,
"data": [
    {
      "role_name": "管理员",
      "role_code": "admin1",
      "description": "测试帐号"
    }
],
"message": "OK"}
```

### 8.5 新增角色与设备关系

- 请求url: `/common/account/addRoleDeviceRelation`
- 请求方式: `GET`
- 描述: 该接口用于添加角色和设备之间的关系，例如给角色赋予设备的读权限。如果应用有这个角色，应用就可以读取该设备的数据。
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |
|  role_code   |  String  |    是    |  角色代码，中文请用utf8编码  |
|     din      |  String  |    是    |     设备在微瓴的唯一标识     |

- 请求示例：

```shell
 /common/account/addRoleDeviceRelation?
token=*******************************************************
&role_code=admin1
&din=******************
&iotim_ticket=*******************************************************
```

- 返回参数:

| 字段名称 | 字段类型 |              字段描述               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| message  |  String  |            执行结果消息             |

- 返回格式:

```json
{
  "code": 0,
  "message": "OK"
}
```

### 8.6 删除角色与设备关系

- 请求url: `/common/account/delRoleDeviceRelation`
- 请求方式: `GET`
- 描述: 用于删除角色和设备之间的关系，删除角色对设备的控制权限
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |
|  role_code   |  String  |    是    |  角色代码，中文请用utf8编码  |
|     din      |  String  |    是    |     设备在微瓴的唯一标识     |

- 请求示例：

```shell
 /common/account/delRoleDeviceRelation?
token=*******************************************************
&role_code=admin1
&din=******************
&iotim_ticket=*******************************************************
```

- 返回参数:

| 字段名称  | 字段类型 |              字段描述               |
| :-------: | :------: | :---------------------------------: |
|   code    |  String  | 错误码，0表示成功，其他见错误码说明 |
|  message  |  String  |            执行结果消息             |
| del_count | Integer  |            删除的记录数             |

- 返回格式:

```json
{
  "code": 0,
  "data": { "del_count": 1 },
  "message": "OK"
}
```

### 8.7 查询角色与设备关系

- 请求url: `/common/account/findRoleDeviceRelation`
- 请求方式: `GET`
- 描述: 该接口用于查询该应用下某个角色有权限的设备列表信息。
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数：登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数：登录获取的物联票据 |
|  role_code   |  String  |    是    |  角色代码，中文请用utf8编码  |
|     num      | Integer  |    是    |   分页参数：每页显示的数量   |
|     page     | Integer  |    是    |     分页参数：返回的页码     |

- 请求示例：

```shell
 /common/account/findRoleDeviceRelation?
token=*******************************************************
&role_code=admin1
&page=1
&num=999
&iotim_ticket=*******************************************************
```

- 返回参数:

| 字段名称  | 字段类型  |              字段描述               |
| :-------: | :-------: | :---------------------------------: |
|   code    |  String   | 错误码，0表示成功，其他见错误码说明 |
|  message  |  String   |            执行结果消息             |
|   data    | JSONArray |              查询结果               |
| totalPage |  Integer  |            返回的总页数             |
| totalRow  |  Integer  |             返回的总量              |
|    din    |  String   |           设备的唯一标识            |

- 返回格式:

```json
{
  "code": 0,
  "data": {
    "totalpage": 1,
    "totalrow": 2,
    "list": [
      {
        "din": "******************"
      },
      {
        "din": "******************"
      }
    ]
  },
  "message": "OK"
}
```

---

## 9. 消息广播

### 9.1 发送消息到设备

- 请求url: `/common/msg/send`
- 请求方式: `GET`
- 描述: 用于发送自定义数据格式的消息，通过微瓴透传给智能设备，并在设备中进行协议解析。
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |              字段描述              |
| :----------: | :------: | :------: | :--------------------------------: |
|    token     |  String  |    是    |    鉴权参数：登录获取的动态密钥    |
| iotim_ticket |  String  |    是    |    鉴权参数：登录获取的物联票据    |
|     din      |  String  |    是    |           设备的唯一标识           |
|  datapoint   |   Long   |    是    |    在微瓴物联平台申请的功能 ID     |
|     cmd      |  String  |    是    | 给设备发送消息的内容，需 UrlEncode |

- 请求示例：

```shell
 /common/msg/send?
token=*******************************************************
&din=******************
&datapoint=100001548
&cmd=test
&iotim_ticket=*******************************************************
```

- 返回参数:

| 字段名称 | 字段类型 |              字段描述               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| message  |  String  |            执行结果消息             |
|   data   |   Json   |              返回数据               |
|   seq    |  String  |            该次请求的seq            |

- 返回格式:

```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "seq": 5031738
  }
}
```

### 9.2 智能设备控制

- 请求url: `/common/msg/controller`
- 请求方式: `GET`
- 描述: 用于发送消息到设备，需要实现对应设备协议。
- 参数列表:

|   字段名称   | 字段类型  | 是否必须 |                               字段描述                               |
| :----------: | :-------: | :------: | :------------------------------------------------------------------: |
|    token     |  String   |    是    |                     鉴权参数：登录获取的动态密钥                     |
| iotim_ticket |  String   |    是    |                     鉴权参数：登录获取的物联票据                     |
|     din      |  String   |    是    |                            设备的唯一标识                            |
|     data     |  String   |    是    |                        控制内容，需 UrlEncode                        |
|     seq      |  Integer  |    是    | 序列号。在同一个 din 之中相邻的两条请求中，如果 seq 相同则屏蔽后一条 |
|    sub_id    | JsonArray |    否    |     子节点 ID，用于对网关下设备进行群控操作，直连设备忽略该参数      |
|  timestamp   |  String   |    是    |                          时间戳，单位：毫秒                          |
|     cmd      |  String   |    是    |                               控制命令                               |

- 请求示例：
  
```shell
 /common/msg/controller?
token=*******************************************************
&din=***************
&data={
  "timestamp":1494919323720,
  "sub_id":["031605230002","031605230003"],
  "seq":1,
  "cmd":{
    "bri":50,
    "on":true,
    "rgb":[100,100,100],
    "ct":100}
    }
&iotim_ticket=*******************************************************
```

- 返回参数:

|  字段名称  | 字段类型 |              字段描述               |
| :--------: | :------: | :---------------------------------: |
|    code    |  String  | 错误码，0表示成功，其他见错误码说明 |
|  message   |  String  |            执行结果消息             |
|    data    |   Json   |              操作结果               |
| update_num | Integer  |          录像记录修改数量           |

- 返回格式:

```json
{
      "code": 0,
      "message": "OK",
      "data": {
         "update_num": 1000
      }
  }
```

### 9.3 获取文件上传

- 请求url: `/common/msg/sendFile`
- 请求方式: `GET`
- 描述: 通过对象存储（Cloud Object Storage，简称：COS）发送文件到设备，获取文件在COS上的信息。
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |                字段描述                 |
| :----------: | :------: | :------: | :-------------------------------------: |
|    token     |  String  |    是    |      鉴权参数：登录获取的动态密钥       |
| iotim_ticket |  String  |    是    |      鉴权参数：登录获取的物联票据       |
|     dins     |  String  |    是    | 设备 din，可以以","分隔，发送给多个设备 |
|   fileName   |  String  |    是    |              上传的文件名               |
|   fileSize   | Integer  |    是    |       上传的文件大小，单位：byte        |
|   hashCode   |  String  |    是    |         本次上传文件的 hash 值          |
|   fileMD5    |  String  |    是    |          本次上传文件的 MD5 值          |
|     data     |  String  |    是    |       给设备发送的自定义消息内容        |

- 请求示例：

```shell
 /common/msg/sendFileToDeviceCOS?
token=*******************************************************
&dins=***************
&fileName=aaaaaaaaa.txt
&fileSize=309
&hashCode=1f621eb56afd3fb3ef34f32aa32c8d2b8da1d8a4
&fileMD5=3559f27db06b63c1255eee91423f2a33
&data=CustomMessage
&iotim_ticket=*******************************************************
```

- 返回参数:

|      字段名称      | 字段类型 |              字段描述               |
| :----------------: | :------: | :---------------------------------: |
|        code        |  String  | 错误码，0表示成功，其他见错误码说明 |
|      message       |  String  |            执行结果消息             |
|        data        |   Json   |              操作结果               |
|      file_id       |  String  |          该次发送的文件 ID          |
| cos_authorization  |  String  |     上传至 COS 系统所需的授权码     |
|        url         |  String  |            上传文件路径             |
|        host        |  String  |       上传至 cos 时的 header        |
| x-cos-content-sha1 |  String  |       上传至 cos 时的 header        |

- 返回格式:

```json
{
  "code": 0,
  "data": {
    "cos_authorization":
      "q-sign-algorithm=sha1&q-ak=JwxbdHXcgrqZyWxNsqqdDnN0&q-sign-time=1508341748;1508345348&q-key-time=1508341748;1508345348&q-header-list=host;x-cos-content-sha1&q-url-param-list=&q-signature=d5d56419e4c962df6d49771ac248fd83791a58c6",
    "url":
      "http://mvsfile-30035.sz.gfp.tencent-cloud.com/download/20171018/aaaaaaaaa.txt",
    "file_id": "a7fd2ca2-78b9-42e8-b153-8724cbdec5bf",
    "host": "mvsfile-30035.sz.gfp.tencent-cloud.com",
    "x-cos-content-sha1": "a1a16419e4c962d5e149771ac248fd83791845ea"
  },
  "message": "OK"
}
```

### 9.4 通知平台文件已上传

- 请求url: `/common/msg/fileNotify`
- 请求方式: `GET`
- 描述: 通知平台发送文件在COS上链接到具体的设备。
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |                字段描述                 |
| :----------: | :------: | :------: | :-------------------------------------: |
|    token     |  String  |    是    |      鉴权参数：登录获取的动态密钥       |
| iotim_ticket |  String  |    是    |      鉴权参数：登录获取的物联票据       |
|    fileId    |  String  |    是    |                 文件 ID                 |
| uploadResult |  String  |    是    | 上传文件结果，success：成功，fail：失败 |

- 请求示例：

```shell
 /common/msg/controller?
token=*******************************************************
&fileId=0fdb0373-1921-4b87-90ff-41740670bff0
&uploadResult=success
&iotim_ticket=*******************************************************
```

- 返回参数:

| 字段名称 | 字段类型 |              字段描述               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| message  |  String  |            执行结果消息             |

- 返回格式:

```json
{
  "code": 0,
  "message": "OK"
}
```

### 9.5 消息推送接口

- 请求url: `/common/msg/report`
- 请求方式: `POST`
- 描述: 消息广播接口，发送消息到平台。
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
|    token     |  String  |    是    | 鉴权参数，登录获取的动态密钥 |
| iotim_ticket |  String  |    是    | 鉴权参数，登录获取的物联票据 |
| message_type | Integer  |    是    |      消息类型，详见附录      |
|   content    |  Object  |    是    |      消息内容，详见附录      |

- 请求示例：

```shell
 /common/msg/report?
token=*******************************************************
&iotim_ticket=*******************************************************
a.请求头：Content-Type:application/json
b.请求包体:{"message_type":1000100,"content":"test content"}
```

- 返回参数:

| 字段名称 | 字段类型 |              字段描述               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| message  |  String  |            执行结果消息             |
|   data   |   Json   |              操作结果               |
|   seq    | Integer  |              消息的seq              |

- 返回格式:

```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "seq": 5031740
  }
}
```

### 9.6 应用接收消息格式（来源应用）

- 请求方式: `POST`
- 描述: 微瓴主动推送消息给到应用端的消息格式。
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
| cookie |  String  |    是    | 本条消息的cookie，接收到需要返回 |
|    apiName     |  String  |    是    | 消息类型，"report_data_point"：表示设备主动上报，</br>"set_data_point_res"：表示设备是根据某条下发消息所回应的数据，</br>“api_broadcast ”来自于api 调用 |
| from_app | Integer  |    是    |      消息来源的appid      |
|   time    |  Object  |    是    |      消息发送时间      |
|   value    |  Object  |    是    |      自定义消息内容      |
|   seq    |  Object  |    是    |      消息唯一编号      |

- 请求示例：

```shell
a.请求头：Content-Type:application/json
b.请求包体:{"apiName":"api_broadcaster","cookie":"29412_1063711","from_app":"40291","time":1561014001593,"value":"value text","seq":"13015327"}
```

- 返回参数:
`需要消息接收方返回的内容`

| 字段名称 | 字段类型 |              字段描述               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| cookie   |  String  |            请求时所带参数             |

- 返回格式:

```json
{
  "code": 0,
  "cookie": "29412_1063711"
}
```

### 9.7 应用接收消息格式（来源设备）

- 请求方式: `POST`
- 描述: 微瓴主动推送消息给到应用端的消息格式。
- 参数列表:

|   字段名称   | 字段类型 | 是否必须 |           字段描述           |
| :----------: | :------: | :------: | :--------------------------: |
| cookie |  String  |    是    | 本条消息的cookie，接收到需要返回 |
|    apiName     |  String  |    是    | 消息类型，"report_data_point"：表示设备主动上报，</br>"set_data_point_res"：表示设备是根据某条下发消息所回应的数据，</br>“api_broadcast ”来自于api 调用 |
| din | Integer  |    是    |      设备唯一标识      |
|   errmsg    |  Object  |    是    |     异常消息内容      |
|   id    |  Object  |    是    |      datapoint id 表示功能ID 可选，硬件会上报，app也是可选项      |
|   time    |  Object  |    是    |      消息发送时间      |
|   type    |  Object  |    是    |      消息格式      |
|   value    |  Object  |    是    |      自定义消息内容      |
|   seq    |  Object  |    是    |      消息唯一编号      |

- 请求示例：

```shell
a.请求头：Content-Type:application/json
b.请求包体:{
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
```

- 返回参数:
`需要消息接收方返回的内容`

| 字段名称 | 字段类型 |              字段描述               |
| :------: | :------: | :---------------------------------: |
|   code   |  String  | 错误码，0表示成功，其他见错误码说明 |
| cookie   |  String  |            请求时所带参数             |

- 返回格式:

```json
{
  "code": 0,
  "cookie": "29412_1063711"
}
```



