[TOC]

# 微瓴数字空间基础能力服务接口

# **1.**   **概述**

 

## 1.1.简介

微瓴DataSpace即微瓴数字空间，提供所有关于数据的计算、存储、管理与分发，包括**静态地理**数据的格式规范、编码体系、数据管理、模型构建；**动态物联设备**数据的系统对接、协议标准、数据上报、解析转换、分析清洗、逻辑流转、规则联动等服务。

应用开发商、设备开发者可通过数字空间提供的可视化配置，实现简单易用的配置管理和规则联动，以微服务架构来设计分布式调用逻辑，基于简单、实用、灵活的理念，每一个服务拥有各自的某一端到端业务场景（功能）与数据（数据库），服务之间互相不共享，避免产生依赖或继承抽象的接口、服务、模块。

## 1.2.特性与定义

接入微瓴：见微瓴开放平台说明：

（https://open.welink.qq.com/#/dev-resource/guide/platform）

你可以上报设备数据（状态、位置、）

通过微瓴可以获得的数据：

**A.** **静态数据（低频变化）**

​	基础地理

​	地图

​	路线

​	地点

​	设备地理

**B.** **动态数据（高频变化）**

​	物联设备

​	水电煤气表

​	能源、空调、冷机、给排水、消防、报警、广播、变配电、电梯、门禁等

​	移动对象（人、车、Robot位置）

​	上报位置

​	获取实时定位

**C.** **数据挖掘服务**

​      统计与分析

​      数据学习

## 1.3.应用场景

应用场景举例，见章节5

## 1.4.名词解释

**wId** 

为唯一ID，可理解为身份证，全平台通用字段，以参数形式使用。

wid可代表

静态的（建筑、楼层、房间、地点），

动态的（物联设备、移动对象人、车、机器人）

某种组合服务等。

**POIID**

地理层级ID，可表达地理嵌套关系，具体可参考下图地理层级关系图。

![Alt text](~@pic/dili.png)

父子包含关系通过POIID规则继承示意图

**POICODE**

分类编码，区分不同种类。查询方法 见2.2.9

**Projectid**

项目id号。

与物联设备控制有关

**DIN**

物联设备唯一标识，可以是物联网关

**Subid**

子设备id，同一个物联网关可级联多个子设备，通过子设备id实现独立控制。

与权限验证及登录有关

**token**

动态密钥，有效时间20分钟，需重新登录。所有访问均需要带着token来获取。

**appid**

应用系统的 id，由平台分配，在开放平台注册申请。

https://open.welink.qq.com/#/dev-resource/guide/app-access

**appsecret**

同上。

**app_ticket**

用于登录API的应用票据，app_ticket有时间期限，请注意及时更新票据

**Sig**

加密的密文，用于登录API使用，生成方式见生成签名样例

生成规则，参考以下链接中的“签名机制”。

https://open.welink.qq.com/#/dev-resource/api/user-guide

**DP**

Datapoint,在微瓴物联平台申请的功能 ID

**message_type**

| **message_type** | **说明**                                                     |
| ---------------- | ------------------------------------------------------------ |
| 1000100          | 文本消息广播至相关联的应用系统                               |
| 1000101          | Json消息广播至相关联的应用系统                               |
| 1000200          | 发送文本消息至其他应用系统                                   |
| 1000201          | 发送Json消息至其他应用系统                                   |
| 1000300          | 推送告警类消息给微瓴平台，不直接推送给应用，微瓴平台会针对告警消息的业务类别推送给相应的业务应用 |
| 1000302          | 推送告警类消息给微瓴平台，不直接推送给应用，微瓴平台会针对告警消息的业务类别推送给相应的业务应用 |
| 1000400          | 推送通知类消息给微瓴平台，不直接推送给应用，微瓴平台会针对通知消息的业务类别推送给相应的业务应用 |
| 1000500          | 推送普通消息给微瓴平台作为数据存储，不推送给应用             |

**设备影子**

设备影子是服务器端为设备缓存的一份状态和配置数据，代表着物理设备的一个数字化映射。

(TODO )

**消息订阅**

(TODO 实现能力、 websocket 等)

# **2.**   **微瓴静态数据接口**

 

## 2.1.对象地理object-geo

### 2.1.1.  WID查询坐标

-   **功能描述**
获取某对象的基本空间信息。
-   **请求URL:**`/space/geo/object/getByWId`
-   **请求方式:**`GET`
-   **请求参数**

| **参数名** | **类型**   | 必填   | **数据约束**                | **描述**                                     |
| ------ | ------ | ------ | ----------------------- | ---------------------------------------- |
| token  | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录       |
| wId    | String | 是   | 非空且长度固定36位      | （**注意是wId路径参数**） 对象的唯一标识 |

-   **请求示例**

```
/space/geo/object/getByWId
?wId=0007e43d-45d7-44c0-acfc-fc5539b6516a
&token=
```

-   **返回参数**

 <table>
   <tr>
      <td colspan="2">名称</td>
      <td>类型</td>
      <td>说明</td>
      <td>示范值</td>
   </tr>
   <tr>
      <td colspan="2">code</td>
      <td>number</td>
      <td>返回码</td>
      <td>返回码；0表示成功，非0表示出错</td>
   </tr>
   <tr>
      <td colspan="2">success</td>
      <td>Boolean</td>
      <td>错误信息</td>
      <td>返回信息；true 表示成功，false 表示出错</td>
   </tr>
   <tr>
      <td colspan="2">data</td>
      <td>array</td>
      <td>对象数组</td>
      <td></td>
   </tr>
   <tr>
      <td style="width:90px"></td>
      <td>wId</td>
      <td>string</td>
      <td>对象的唯一标识</td>
      <td>"0007e43d-45d7-44c0-acfc-fc5539b6516a",</td>
   </tr>
   <tr>
      <td></td>
      <td>poiId</td>
      <td>string</td>
      <td>POI编号</td>
      <td>"4403002230221018_9",</td>
   </tr>
   <tr>
      <td></td>
      <td>name</td>
      <td>string</td>
      <td>设备名称</td>
      <td>"蓝牙ibeacon",</td>
   </tr>
   <tr>
      <td></td>
      <td>boothId</td>
      <td>string</td>
      <td>现场编号</td>
      <td>"",</td>
   </tr>
   <tr>
      <td></td>
      <td>level</td>
      <td>number</td>
      <td>对象所属层级</td>
      <td>9,</td>
   </tr>
   <tr>
      <td></td>
      <td>longitude</td>
      <td>number</td>
      <td>经度gcj20</td>
      <td>113.935327719,</td>
   </tr>
   <tr>
      <td></td>
      <td>latitude</td>
      <td>number</td>
      <td>纬度</td>
      <td>22.522594372,</td>
   </tr>
   <tr>
      <td></td>
      <td>height</td>
      <td>number</td>
      <td>绝对高度</td>
      <td>86.45,</td>
   </tr>
   <tr>
      <td></td>
      <td>poiCode</td>
      <td>string</td>
      <td>分类编码</td>
      <td>"w0907015",</td>
   </tr>
   <tr>
      <td></td>
      <td>sn</td>
      <td>string</td>
      <td>设备SN实际编码</td>
      <td>"1918FC0636A0",</td>
   </tr>
   <tr>
      <td></td>
      <td>positionText</td>
      <td>string</td>
      <td>位置描述</td>
      <td>"腾讯滨海大厦滨海南塔F18"</td>
   </tr>
</table>

-   **返回示例**

```json
{
  ​"code": 0,
  ​"data": {
    ​"wId": "0007e43d-45d7-44c0-acfc-fc5539b6516a",
    ​"poiId": "4403002230221018_9",
    ​"name": "蓝牙ibeacon",
    ​"boothId": "",
    ​"level": 9,
    ​"longitude": 113.935327719,
    ​"latitude": 22.522594372,
    ​"height": 86.45,
    ​"poiCode": "w0907015",
    ​"sn": "1918FC0636A0",
    ​"positionText": "腾讯滨海大厦_滨海南塔_F18"
  },
  ​"success": true
}
```

### 2.1.2.  坐标查询WID

-   **功能描述**

获取包含指定坐标位置和指定父级空间对象的空间对象列表，如已知某设备对象的坐标和设备所在楼层，查询空间范围上包含该设备的自定义区域等。

-   **请求URL:**`/space/geo/getObjectsContainLocation`
-   **请求方式:**`GET`
-   **请求参数**

| **参数名**  | **类型** | <div style="width:35px">**必填**</div> | **数据约束**            | **描述**                                                    |
| :---------- | -------- | -------- | ----------------------- | ----------------------------------------------------------- |
| token       | String   | 是       | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录                          |
| location    | String   | 是       | 非空                    | 坐标位置，经纬度，格式：“纬度,经度”，如22.522646,113.935486 |
| parentPoiId | String   | 是       | 非空                    | 父级对象的空间id ，如滨海大厦 '440300223022'                |

-   **请求示例** 

```
/space/geo/getObjectsContainLocation
?location=22.522646%2C113.935486
&parentPoiId=44030022
&token=
```

-   **返回参数**

 <table>
   <tr>
      <td colspan="2">名称</td>
      <td>类型</td>
      <td>说明</td>
      <td>示范值</td>
   </tr>
   <tr>
      <td colspan="2">code</td>
      <td>number</td>
      <td>返回码</td>
      <td>返回码；0表示成功，非0表示出错</td>
   </tr>
   <tr>
      <td colspan="2">success</td>
      <td>Boolean</td>
      <td>错误信息</td>
      <td>返回信息；true 表示成功，false 表示出错</td>
   </tr>
   <tr>
      <td colspan="2">data</td>
      <td>array</td>
      <td>对象数组</td>
      <td></td>
   </tr>
   <tr>
      <td style="width:100px">　</td>
      <td>wId</td>
      <td>string</td>
      <td>对象的唯一标识</td>
      <td>"638d5b0a-744d-4643-a7a6-cfc489875105",</td>
   </tr>
   <tr>
      <td></td>
      <td>poiId</td>
      <td>string</td>
      <td>POI编号</td>
      <td>"4403002230221007",</td>
   </tr>
   <tr>
      <td></td>
      <td>name</td>
      <td>string</td>
      <td>设备名称</td>
      <td>"F7",</td>
   </tr>
   <tr>
      <td></td>
      <td>level</td>
      <td>number</td>
      <td>对象所属层级</td>
      <td>7,</td>
   </tr>
   <tr>
      <td></td>
      <td>longitude</td>
      <td>number</td>
      <td>经度gcj20</td>
      <td>113.935327719,</td>
   </tr>
   <tr>
      <td></td>
      <td>latitude</td>
      <td>number</td>
      <td>纬度</td>
      <td>22.522594372,</td>
   </tr>
   <tr>
      <td></td>
      <td>height</td>
      <td>number</td>
      <td>绝对高度</td>
      <td>35,</td>
   </tr>
   <tr>
      <td></td>
      <td>poiCode</td>
      <td>string</td>
      <td>分类编码</td>
      <td>" m99999000",</td>
   </tr>
   <tr>
      <td></td>
      <td>positionText</td>
      <td>string</td>
      <td>位置描述</td>
      <td>"腾讯滨海大厦_F7"</td>
   </tr>
</table>

-   **返回示例**

```json
{
  ​"code": 0,
  ​"data": [
    ​{
      ​"wId": "638d5b0a-744d-4643-a7a6-cfc489875105",
      ​"poiId": "4403002230221007",
      ​"name": "F7",
      ​"level": 7,
      ​"longitude": 113.93536231722,
      ​"latitude": 22.5228742683381,
      ​"height": 35,
      ​"poiCode": "m99999000",
      ​"positionText": "腾讯滨海大厦_F7"​
    }
  ],
  ​"success": true
}
```



### 2.1.3.  WID查询父级包含位置信息

-   **功能描述**

通过WID查询对象的父级空间包含关系及位置信息。例如：某个智能设备level9，查询此设备所处的level8房间名、level7楼层、level6建筑名等。

-   **请求URL:**`/space/geo/object/getLocationByWId`
-   **请求方式:**`GET`
-   **请求参数**

| **参数名** | **类型** | **必填** | **数据约束**      | **描述**                                 |
| ---------- | -------- | -------- | ----------------- | ---------------------------------------- |
| token      | String   | 是       | 非空长度固定128位 | 动态密钥，有效期20分钟，需重新登录       |
| wId        | String   | 是       | 非空长度固定36位  | （**注意是wId路径参数**） 对象的唯一标识 |

-   **请求示例** 

```
/space/geo/object/getLocationByWId
?wId=00019062-f1bd-4538-b5bf-14030ce7970d
&token=
```

- **返回参数**

  <table>
     <tr>
        <td colspan="3">名称</td>
        <td>类型</td>
        <td>说明</td>
        <td>示范值</td>
     </tr>
     <tr>
        <td colspan="3">code</td>
        <td>number</td>
        <td>返回码</td>
        <td>返回码；0表示成功，非0表示出错</td>
     </tr>
     <tr>
        <td colspan="3">success</td>
        <td>Boolean</td>
        <td>错误信息</td>
        <td>返回信息；true 表示成功，false 表示出错</td>
     </tr>
     <tr>
        <td colspan="3">data</td>
        <td>array</td>
        <td>对象数组</td>
        <td>　</td>
     </tr>
     <tr>
        <td>　</td>
        <td colspan="2">wId</td>
        <td>string</td>
        <td>对象的唯一标识</td>
        <td>"0007e43d-45d7-44c0-acfc-fc5539b6516a",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">poiId</td>
        <td>string</td>
        <td>POI编号</td>
        <td>"4403002230221018_9",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">name</td>
        <td>string</td>
        <td>设备名称</td>
        <td>"蓝牙ibeacon",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">level</td>
        <td>number</td>
        <td>对象所属层级</td>
        <td>9,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">longitude</td>
        <td>number</td>
        <td>经度gcj20</td>
        <td>113.935327719,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">latitude</td>
        <td>number</td>
        <td>纬度</td>
        <td>22.522594372,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">height</td>
        <td>number</td>
        <td>绝对高度</td>
        <td>86.45,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">poiCode</td>
        <td>string</td>
        <td>分类编码</td>
        <td>"w0907015",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">positionText</td>
        <td>string</td>
        <td>位置描述</td>
        <td>"腾讯滨海大厦_滨海南塔_F18"</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">location</td>
        <td>array</td>
        <td>数组（父级别）</td>
        <td></td>
     </tr>
     <tr>
        <td></td>
        <td>　</td>
        <td>wId</td>
        <td>string</td>
        <td>对象的唯一标识</td>
        <td> </td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>poiId</td>
        <td>string</td>
        <td>POI编号</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>name</td>
        <td>string</td>
        <td>设备名称</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>level</td>
        <td>number</td>
        <td>对象所属层级</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>longitude</td>
        <td>number</td>
        <td>经度gcj20</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>latitude</td>
        <td>number</td>
        <td>纬度</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>height</td>
        <td>number</td>
        <td>绝对高度</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>poiCode</td>
        <td>string</td>
        <td>分类编码</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>positionText</td>
        <td>string</td>
        <td>位置描述</td>
        <td>　</td>
     </tr>
  </table>

-   **返回示例**

```json
{
  "code": 0,
  "data": {
    "wId": "00019062-f1bd-4538-b5bf-14030ce7970d",
    "poiId": "44030022302210280510308",
    "name": "工位",
    "level": 8,
    "longitude": 113.935115841964,
    "latitude": 22.5230798095138,
    "height": 128.9,
    "poiCode": "m00403000",
    "positionText": "腾讯滨海大厦_F28_工位",
    "location": [
      {
        "wId": "a66348f2-0700-1000-abcd-35269c4636aa",
        "poiId": "440300223022",
        "name": "腾讯滨海大厦",
        "level": 6,
        "longitude": 113.935131878688,
        "latitude": 22.52347513938,
        "height": -6.3
      },
      {
        "wId": "e0ace2f8-3823-4acc-989a-4db7bcf35f54",
        "poiId": "4403002230221028",
        "name": "F28",
        "level": 7,
        "longitude": 113.93536231722,
        "latitude": 22.5228742683381,
        "height": 128.9,
        "poiCode": "m99999000",
        "positionText": "腾讯滨海大厦_F28"
      }
    ]
  },
  "success": true
}
```



### 2.1.4.  批量查询对象

-   **功能描述**

​        批量返回某个建筑范围内的所有父子对象列表，如：已知某建筑wId（level6），查询本建筑的所有楼层（level7）、某层楼的所有房间（level8）等。关于不同层级对象的 POIID 与 Level 定义，见“名词解释”中 POIID 的介绍。

-   **请求URL:**`/space/geo/object/getSubObjects`
-   **请求方式:**`GET`
-   **请求参数**

| **参数名**  | **类型** | **必填** | **数据约束**            | **描述**                                                     |
| ----------- | -------- | -------- | ----------------------- | ------------------------------------------------------------ |
| token       | String   | 是       | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录                           |
| wId         | String   | 是       | 非空且长度固定36位      | 对象的唯一标识，例如填入大厦wid或者楼层wid                   |
| poiCode     | String   | 是       | 不超过64个字符          | 分类编码，详见2.2.9查询分类编码接口，</br>例如：洗手间m00201、车位号m00500000、照明灯具w0107006 |
| level       | String   | 是       |                         | 7（楼层）、8（房间）、9（设备点）                            |
| offset      | String   | 是       |                         | 偏移量，默认为0                                              |
| limit       | String   | 是       |                         |                                                              |
| name        | String   | 否       |                         |                                                              |
| srid        | String   | 否       |                         | 默认值为4326                                                 |
| dinNotEmpty | Boolean  | 否       |                         | 默认值为False                                                |

-   **请求示例** 

```
/space/geo/object/getSubObjects
?level=8
&offset=0
&limit=2
&wId=a66348f2-0700-1000-abcd-35269c4636aa
&poiCode=m
&token=
&name=
&srid=
&dinNotEmpty=
```

- **返回参数**

  <table>
     <tr>
        <td colspan="2">名称</td>
        <td >类型</td>
        <td>描述</td>
     </tr>
     <tr>
        <td colspan="2">code</td>
        <td>String</td>
        <td>0表示成功，非0表示出错</td>
     </tr>
     <tr>
        <td colspan="2">success</td>
        <td>Boolean</td>
        <td>true 表示成功，false 表示出错</td>
     </tr>
     <tr>
        <td colspan="2">data</td>
        <td>array</td>
        <td>对象数组</td>
     </tr>
     <tr>
        <td>　</td>
        <td>wId</td>
        <td>String</td>
        <td>对象的唯一标识，例如填入大厦wid或者楼层wid</td>
     </tr>
     <tr>
        <td></td>
        <td>poiId</td>
        <td>String</td>
        <td>poiID见继承规则</td>
     </tr>
     <tr>
        <td></td>
        <td>Name</td>
        <td>String</td>
        <td>名称</td>
     </tr>
     <tr>
        <td></td>
        <td>Level</td>
        <td>Number</td>
        <td>7（楼层）、8（房间）、9（设备点）</td>
     </tr>
     <tr>
        <td></td>
        <td>Longitude</td>
        <td>Number</td>
        <td>经度，</td>
     </tr>
     <tr>
        <td></td>
        <td>Latitude</td>
        <td>Number</td>
        <td>纬度，</td>
     </tr>
     <tr>
        <td></td>
        <td>Height</td>
        <td>Number</td>
        <td>高度，相对高度，非绝对海拔</td>
     </tr>
     <tr>
        <td></td>
        <td>PoiCode</td>
        <td>String</td>
        <td>分类编码，详见查询分类编码接口，例如：洗手间m00201、车位号m00500000、照明灯具w0107006</td>
     </tr>
     <tr>
        <td></td>
        <td>totalRow</td>
        <td>Number</td>
        <td>返回数量</td>
     </tr>
  </table>

-   **返回示例**

```json
{
  "code": 0,
  "data": {
    ​"features": [
      ​{
        ​"level": 7,
        ​"latitude": 22.523381873802,
        ​"wId": "bae86426-d9b5-43ed-9e94-3e7238d7b83b",
        ​"name": "F31",
        ​"poiId": "4403002230221031",
        ​"poiCode": "m99999000",
        ​"height": 141.95,
        ​"longitude": 113.935474696462​
      }
    ],
    "totalRow": 12​
  },
  "success": true
}
```



### 2.1.5.  批量查询地理对象

-   **功能描述**

批量返回某个空间范围内的所有对象列表，如：某栋建筑的所有楼层（level7）、某层楼的所有房间（level8）、某个房间内的某种设备（level9）等。

-   **请求URL:**`/space/geo/object/getGeoSubObjects`
-   **请求方式:**`GET`
-   **请求参数**

| **参数名** | **类型** | **必填** | **数据约束**            | **描述**                                                     |
| ---------- | -------- | -------- | ----------------------- | ------------------------------------------------------------ |
| token      | String   | 是       | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录                           |
| wId        | String   | 是       | 非空且长度固定36位      | 对象的唯一标识，例如填入大厦wid或者楼层wid                   |
| poiCode    | String   | 是       | 不超过64个字符          | 分类编码，详见2.2.9查询分类编码接口，</br>例如：洗手间m00201、车位号m00500000、照明灯具w0107006 |
| level      | String   | 是       |                         | 7（楼层）、8（房间）、9（设备点）                            |
| name       | String   | 否       |                         |                                                              |

-   **请求示例** 

```
/space/geo/object/getGeoSubObjects
?poiCode=m99
&level=7
&name=F7
&token=
&wId=a66348f2-0700-1000-abcd-35269c4636aa
```

- **返回参数**

  <table>
     <tr>
        <td colspan="5">名称</td>
        <td>类型</td>
        <td>说明</td>
        <td>示范值</td>
     </tr>
     <tr>
        <td colspan="5">code</td>
        <td>number</td>
        <td>返回码</td>
        <td>返回码；0表示成功，非0表示出错</td>
     </tr>
     <tr>
        <td colspan="5">success</td>
        <td>Boolean</td>
        <td>错误信息</td>
        <td>返回信息；true 表示成功，false 表示出错</td>
     </tr>
     <tr>
        <td colspan="5">data</td>
        <td>array</td>
        <td>对象数组</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="4">totalRow</td>
        <td>number</td>
        <td>　</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="4">type</td>
        <td>string</td>
        <td>　</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="4">features</td>
        <td>array</td>
        <td>　</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td colspan="3">geometry</td>
        <td>array</td>
        <td>空间对象</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">coordinates</td>
        <td>array</td>
        <td>对象坐标串</td>
        <td>如果是面第一个点与最后一个点相同</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>longitude,Latitude</td>
        <td>Number</td>
        <td>经度，纬度</td>
        <td>点1</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>longitude,Latitude</td>
        <td>Number</td>
        <td>经度，纬度</td>
        <td>点N</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">type</td>
        <td>string</td>
        <td>空间对象的几何类型</td>
        <td>例如：复合多线'MultiLineString', 多边形'Polygon',复合多边形 'MultiPolygon', </td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td colspan="3">id</td>
        <td>string</td>
        <td>对象的唯一标识</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td colspan="3">type</td>
        <td>string</td>
        <td>类型</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td colspan="3">properties</td>
        <td>array</td>
        <td>数组（属性）</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">wId</td>
        <td>string</td>
        <td>对象的唯一标识</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">poiId</td>
        <td>string</td>
        <td>POI编号</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">name</td>
        <td>string</td>
        <td>设备名称</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">level</td>
        <td>number</td>
        <td>对象所属层级</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">longitude</td>
        <td>number</td>
        <td>经度gcj20</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">latitude</td>
        <td>number</td>
        <td>纬度</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">height</td>
        <td>number</td>
        <td>绝对高度</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">poiCode</td>
        <td>string</td>
        <td>分类编码</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="2">positionText</td>
        <td>string</td>
        <td>位置描述</td>
        <td>　</td>
     </tr>
  </table>

-   **返回示例**

```json
{
  "code": 0,
  "data": {
    ​"features": [
      ​{
        ​"geometry": {
          ​"coordinates": [
            ​[
              ​[
                ​[
                  ​113.935474696462,
                  ​22.523381873802​
                ],
                ​[
                  ​113.935487513624,
                  ​22.5233446500345​
                ]​
              ]​
            ]​
          ],
          ​"type": "MultiPolygon"​
        },
        ​"id": "bae86426-d9b5-43ed-9e94-3e7238d7b83b",
        ​"type": "Feature",
        ​"properties": {
          ​"gid": 18196,
          ​"level": 7,
          ​"latitude": 22.523381873802,
          ​"wId": "bae86426-d9b5-43ed-9e94-3e7238d7b83b",
          ​"name": "F31",
          ​"poiId": "4403002230221031",
          ​"poiCode": "m99999000",
          ​"height": 141.95,
          ​"longitude": 113.935474696462​
        }​
      }​
    ],
    ​"type": "FeatureCollection"
  },
  "success": true
}
```



### 2.1.6.  保存/编辑自定义边界

-   **功能描述**

保存或者编辑自定义边界对象。

-   **请求URL:**`/space/geo/saveMetaArea`
-   **请求方式:**`POST`
-   **请求参数**

| **参数名** | **类型** | **必填** | **数据约束**            | **描述**                           |
| ---------- | -------- | -------- | ----------------------- | ---------------------------------- |
| token      | String   | 是       | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录 |

-   **请求示例**

```
https://api.weiling.qq.com/space/geo/saveMetaArea?token=
```

-   **请求包体**

**格式： application/json**

**中心点模式的自定义边界：**

```json
{
  "name": "测试123",
  "level": 8,
  "height": -6.3,
  "poiCode": 99901000,
  "extMetaArea": {
    ​"parentPoiId": "4403002230220001",
    ​"mode": "point",
    ​"center": {
      ​"longitude": 113.935250639562,
      ​"latitude": 22.522482718566​
    },
    ​"radius": 400
  }
}
```

**多边形模式的自定义边界：**

```json
{
  "wId": "1db2977f-466c-4dae-95f0-83624e4d4c6d",
  "name": "测试1234",
  "level": 8,
  "height": -6.3,
  "extMetaArea": {
    ​"parentPoiId": "4403002230220001",
    ​"mode": "polygon",
    ​"points": [
      ​{
        ​"longitude": 113.935250639562,
        ​"latitude": 22.522482718566​
      },
      ​{
        ​"longitude": 113.935250639562,
        ​"latitude": 22.622482718566​
      },
      ​{
        ​"longitude": 113.965250639562,
        ​"latitude": 22.622482718566​
      },
      ​{
        ​"longitude": 113.965250639562,
        ​"latitude": 22.522482718566​
      }​
    ]
  }
}
```

-   **包体参数**

| <div style="width:48px">**参数名**</div>  | <div style="width:45px">**类型**</div> | <div style="width:35px">**必填**</div> | **数据约束**              | **描述**                                                     |
| ----------- | -------- | -------- | ------------------------- | ------------------------------------------------------------ |
| wId         | String   | 否       | 长度固定36位              | 对象的唯一标识；**若有 wId，表示更新；若无wId，表示新增**    |
| level       | Integer  | 是       | 数字，范围1-9             | 自定义空间对象所在空间层级                                   |
| poiCode     | String   | 是       | 非空                      | 自定义空间对象的空间分类编码                                 |
| parentPoiId | String   | 是       | 非空                      | 自定义空间对象的父级对象的 PoiId                             |
| **mode**    | String   | 是       | 非空，point 或 polygon    | 自定义空间的模式；point 表示中心点模式，使用中心点和半径表示；polygon 表示多边形模式，使用多个顺序点表示 |
| center      | Object   | 否       | 当mode为 point时为必须    | 中心点模式的自定义边界对象的中心点坐标，经纬度               |
| radius      | Number   | 否       | 当 mode 为 point 时为必须 | 中心点模式的自定义边界对象的半径，单位米                     |
| points      | List     | 否       | 当mode为 polygon时必须    | 多边形模式的自定义边界对象的各点坐标，经纬度；注意顺序有关   |

- **返回参数**

  <table>
     <tr>
        <td colspan="4">名称</td>
        <td>类型</td>
        <td>说明</td>
        <td>示范值</td>
     </tr>
     <tr>
        <td colspan="4">code</td>
        <td>number</td>
        <td>返回码</td>
        <td>返回码；0表示成功，非0表示出错</td>
     </tr>
     <tr>
        <td colspan="4">success</td>
        <td>Boolean</td>
        <td>错误信息</td>
        <td>返回信息；true 表示成功，false 表示出错</td>
     </tr>
     <tr>
        <td colspan="4">data</td>
        <td>array</td>
        <td>对象数组</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="3">wId</td>
        <td>string</td>
        <td>对象的唯一标识</td>
        <td>"0007e43d-45d7-44c0-acfc-fc5539b6516a",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="3">poiId</td>
        <td>string</td>
        <td>POI编号</td>
        <td>"4403002230221018_9",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="3">name</td>
        <td>string</td>
        <td>设备名称</td>
        <td>"蓝牙ibeacon",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="3">level</td>
        <td>number</td>
        <td>对象所属层级</td>
        <td>9,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="3">longitude</td>
        <td>number</td>
        <td>经度gcj20</td>
        <td>113.935327719,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="3">latitude</td>
        <td>number</td>
        <td>纬度</td>
        <td>22.522594372,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="3">height</td>
        <td>number</td>
        <td>绝对高度</td>
        <td>86.45,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="3">poiCode</td>
        <td>string</td>
        <td>分类编码</td>
        <td>"w0907015",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="3">extMetaArea</td>
        <td>array</td>
        <td>数组</td>
        <td>自定义区域边界</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td colspan="2">parentPoiId</td>
        <td>array</td>
        <td>父级别POI编号</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td colspan="2">radius</td>
        <td>string</td>
        <td>对象的唯一标识</td>
        <td>中心点模式的自定义边界对象的半径，单位米</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td colspan="2">points</td>
        <td>array</td>
        <td>坐标串数组</td>
        <td>多边形模式的自定义边界对象的各点坐标，经纬度；注意顺序有关</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>longitude</td>
        <td>number</td>
        <td>经度gcj20</td>
        <td></td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>latitude</td>
        <td>number</td>
        <td>纬度</td>
        <td></td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td colspan="2">mode</td>
        <td>string</td>
        <td>自定义空间的模式</td>
        <td>例如：多边形'Polygon' </td>
     </tr>
  </table>

-   **返回示例**

```json
{
  "code": 0,
  "data": {
    ​"wId": "c11e6aed-8033-44c7-8113-b5af0816fd8e",
    ​"poiId": "4403002230220001_ma",
    ​"level": 8,
    ​"longitude": 113.950250639562,
    ​"latitude": 22.572482718566,
    ​"height": -6.3,
    ​"extMetaArea": {
      ​"parentPoiId": "4403002230220001",
      ​"radius": 0,
      ​"points": [
        ​{
          ​"latitude": 22.522482718566,
          ​"longitude": 113.935250639562​
        },
        ​{
          ​"latitude": 22.622482718566,
          ​"longitude": 113.935250639562​
        },
        ​{
          ​"latitude": 22.622482718566,
          ​"longitude": 113.965250639562​
        },
        ​{
          ​"latitude": 22.522482718566,
          ​"longitude": 113.965250639562​
        }​
      ],
      ​"mode": "polygon"​
    }
  },
  "success": true
}
```



### 2.1.7.  查询POICODE分类编码

-   **功能描述**

查询分类编码（即 PoiCode）。

-   **请求URL:**`/space/geo/getCatalog`
-   **请求方式:**`GET`
-   **请求参数**

| **参数名** | **类型** | **必填** | **数据约束**            | **描述**                                 |
| ---------- | -------- | -------- | ----------------------- | ---------------------------------------- |
| token      | String   | 是       | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录       |
| projectId  | Integer  | 是       | Int32                   | 项目id，如11                             |
| page       | Integer  | 是       | Int32                   | 页码，第一页为page为1                    |
| count      | Integer  | 是       | 不超过100               | 一页的条目数目                           |
| poiCode    | String   | 是       | 不超过64个字符          | 空间对象的poiCode分类编码,例如：w02或m02 |

-   **请求示例**

```
/space/geo/getCatalog
?projectId=11
&page=1
&count=10
&poiCode= w0701003
&token= 
```

- **返回参数**

  <table>
     <tr>
        <td colspan="3">名称</td>
        <td>类型</td>
        <td>说明</td>
        <td>示范值</td>
     </tr>
     <tr>
        <td colspan="3">code</td>
        <td>String</td>
        <td>0表示成功，非0表示出错</td>
        <td>　</td>
     </tr>
     <tr>
        <td colspan="3">success</td>
        <td>Boolean</td>
        <td>错误信息</td>
        <td>返回信息；true 表示成功，false 表示出错</td>
     </tr>
     <tr>
        <td colspan="3">data</td>
        <td>array</td>
        <td>数组</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">List</td>
        <td>array</td>
        <td>数组</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>Id</td>
        <td>number</td>
        <td>分类编码表顺序</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>Name</td>
        <td>String</td>
        <td>名称</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>Level</td>
        <td>number</td>
        <td>分类编码等级</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>ParentId</td>
        <td>number</td>
        <td>上一级id号</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>ProjectId</td>
        <td>number</td>
        <td>项目编号</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>isAssets</td>
        <td>Boolean</td>
        <td>是否资产</td>
        <td>true 为真，false 为否</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>PoiCode</td>
        <td>String</td>
        <td>分类编码</td>
        <td>例如：洗手间m00201、车位号m00500000、照明灯具w0107006</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">pageNumber</td>
        <td>number</td>
        <td>当前页码</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">pageSize</td>
        <td>number</td>
        <td>页行数</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">totalPage</td>
        <td>number</td>
        <td>总页数</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">totalRow</td>
        <td>number</td>
        <td>返回数量</td>
        <td>　</td>
     </tr>
  </table>

-   **返回示例**

```json
{
  "code": 0,
  "data": {
    ​"list": [
      ​{
        ​"id": 4886,
        ​"name": "服务设施-未分类",
        ​"level": 2,
        ​"parentId": 1,
        ​"projectId": 11,
        ​"isAssets": false,
        ​"poiCode": "m00200"​
      },
      ​{
        ​"id": 4888,
        ​"name": "卫生间",
        ​"level": 2,
        ​"parentId": 4886,
        ​"projectId": 11,
        ​"isAssets": false,
        ​"poiCode": "m00201"​
      },
      ​{
        ​"id": 4894,
        ​"name": "便民设施",
        ​"level": 2,
        ​"parentId": 4888,
        ​"projectId": 11,
        ​"isAssets": false,
        ​"poiCode": "m00202"​
      }​...​
    ],
    ​"pageNumber": 1,
    ​"pageSize": 10,
    ​"totalPage": 2,
    ​"totalRow": 12
  },
  "success": true
}
```

### 2.1.8.  DIN查询设备信息

-   **功能描述**

用DIN查询对象地理信息。

-   **请求URL:**`/space/inner/device/getDeviceByDeviceId`
-   **请求方式:**`GET`
-   **请求参数**

| **参数名** | **类型** | **必填** | **数据约束**            | **描述**                           |
| ---------- | -------- | -------- | ----------------------- | ---------------------------------- |
| token      | String   | 是       | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录 |
| din        | string   | 是       | 通常为18位数字          |                                    |

-   **请求示例**

```
/space/inner/device/getDeviceByDeviceId
?din=144115194541786483
&token=
```

- **返回参数**

  <table>
     <tr>
        <td colspan="2">名称</td>
        <td>类型</td>
        <td>描述</td>
     </tr>
     <tr>
        <td colspan="2">code</td>
        <td>String</td>
        <td>返回码；0表示成功，非0表示出错</td>
     </tr>
     <tr>
        <td colspan="2">success</td>
        <td>Boolean</td>
        <td>返回信息；true 表示成功，false 表示出错</td>
     </tr>
     <tr>
        <td colspan="2">data</td>
        <td>array</td>
        <td>数组</td>
     </tr>
     <tr>
        <td>　</td>
        <td>wid</td>
        <td>String</td>
        <td>对象的唯一标识，例如填入大厦wid或者楼层wid</td>
     </tr>
     <tr>
        <td></td>
        <td>poiId</td>
        <td>String</td>
        <td>Poi编号</td>
     </tr>
     <tr>
        <td></td>
        <td>boothId</td>
        <td>string</td>
        <td>现场编号</td>
     </tr>
     <tr>
        <td></td>
        <td>name</td>
        <td>String</td>
        <td>名称</td>
     </tr>
     <tr>
        <td></td>
        <td>level</td>
        <td>number</td>
        <td>层级关系: 例如7（楼层）、8（房间）、9（设备点）</td>
     </tr>
     <tr>
        <td></td>
        <td>longitude</td>
        <td>number</td>
        <td>经度</td>
     </tr>
     <tr>
        <td></td>
        <td>latitude</td>
        <td>number</td>
        <td>纬度</td>
     </tr>
     <tr>
        <td></td>
        <td>height</td>
        <td>number</td>
        <td>高度</td>
     </tr>
     <tr>
        <td></td>
        <td>poiCode</td>
        <td>String</td>
        <td>分类编码，详见查询分类编码接口，例如：洗手间m00201、车位号m00500000、照明灯具w0107006</td>
     </tr>
     <tr>
        <td></td>
        <td>sn</td>
        <td>String</td>
        <td>厂家编号</td>
     </tr>
     <tr>
        <td></td>
        <td>din</td>
        <td>String</td>
        <td>物联设备唯一标识，可以是物联网关</td>
     </tr>
     <tr>
        <td></td>
        <td>subID</td>
        <td>String</td>
        <td>子设备id，同一个物联网关可级联多个子设备，通过子设备id实现独立控制</td>
     </tr>
     <tr>
        <td></td>
        <td>positionText</td>
        <td>String</td>
        <td>位置描述信息</td>
     </tr>
  </table>

-   **返回示例**

```json
{
  ​"code": 0,
  ​"data": {
    ​"wId": "c25f5978-27e5-45be-8b49-dc4ce6e0b857",
    ​"poiId": "44030022302210250200047_9",
    ​"name": "优图盒子",
    ​"boothId": "北门_2501",
    ​"level": 9,
    ​"longitude": 113.935307547835,
    ​"latitude": 22.5231118649662,
    ​"height": 115.7,
    ​"poiCode": "w0713002",
    ​"sn": "52E8DFBD562D41a0",
    ​"din": "144115194541786483",
    ​"subId": "",
    ​"positionText": "滨海大厦_北塔_25F_西梯-北门_2501"​
  },
  ​"success": true
}
```



### 2.1.9.  DIN查询信息及设备父级地理包含关系

-   **功能描述**

用DIN查询对象地理信息。

-   **请求URL:**`/space/geo/object/getLocationByDin`
-   **请求方式:**`GET`
-   **请求参数**

| **参数名** | **类型** | **必填** | **数据约束**            | **描述**                           |
| ---------- | -------- | -------- | ----------------------- | ---------------------------------- |
| token      | String   | 是       | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录 |
| din        | string   | 是       |                         | 项目id，如11                       |

-   **请求示例**

```
/space/geo/object/getLocationByDin
?din=144115194541786483
&token=
```

- **返回参数**

  <table>
     <tr>
        <td colspan="3">名称</td>
        <td>类型</td>
        <td>说明</td>
        <td>示范值</td>
     </tr>
     <tr>
        <td colspan="3">code</td>
        <td>number</td>
        <td>返回码</td>
        <td>返回码；0表示成功，非0表示出错</td>
     </tr>
     <tr>
        <td colspan="3">success</td>
        <td>Boolean</td>
        <td>错误信息</td>
        <td>返回信息；true 表示成功，false 表示出错</td>
     </tr>
     <tr>
        <td colspan="3">data</td>
        <td>array</td>
        <td>对象数组</td>
        <td>　</td>
     </tr>
     <tr>
        <td>　</td>
        <td colspan="2">wId</td>
        <td>string</td>
        <td>对象的唯一标识</td>
        <td>"0007e43d-45d7-44c0-acfc-fc5539b6516a",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">poiId</td>
        <td>string</td>
        <td>POI编号</td>
        <td>"4403002230221018_9",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">name</td>
        <td>string</td>
        <td>设备名称</td>
        <td>"蓝牙ibeacon",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">boothId</td>
        <td>string</td>
        <td>现场编号</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">level</td>
        <td>number</td>
        <td>对象所属层级</td>
        <td>9,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">longitude</td>
        <td>number</td>
        <td>经度gcj20</td>
        <td>113.935327719,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">latitude</td>
        <td>number</td>
        <td>纬度</td>
        <td>22.522594372,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">height</td>
        <td>number</td>
        <td>绝对高度</td>
        <td>86.45,</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">poiCode</td>
        <td>string</td>
        <td>分类编码</td>
        <td>"w0907015",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">sn</td>
        <td>String</td>
        <td>厂家编号</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">din</td>
        <td>String</td>
        <td>物联设备唯一标识，可以是物联网关</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">subID</td>
        <td>String</td>
        <td>子设备id，同一个物联网关可级联多个子设备，通过子设备id实现独立控制</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">positionText</td>
        <td>string</td>
        <td>位置描述</td>
        <td>"腾讯滨海大厦_滨海南塔_F18"</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">location</td>
        <td>array</td>
        <td>数组（父级别）</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td>　</td>
        <td>wId</td>
        <td>string</td>
        <td>对象的唯一标识</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>poiId</td>
        <td>string</td>
        <td>POI编号</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>name</td>
        <td>string</td>
        <td>设备名称</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>level</td>
        <td>number</td>
        <td>对象所属层级</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>longitude</td>
        <td>number</td>
        <td>经度gcj20</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>latitude</td>
        <td>number</td>
        <td>纬度</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>height</td>
        <td>number</td>
        <td>绝对高度</td>
        <td>　</td>
     </tr>
  </table>

-   **返回示例**

```json
{
  ​"code": 0,
  ​"data": {
    ​"wId": "c25f5978-27e5-45be-8b49-dc4ce6e0b857",
    ​"poiId": "44030022302210250200047_9",
    ​"name": "优图盒子",
    ​"boothId": "北门_2501",
    ​"level": 9,
    ​"longitude": 113.935307547835,
    ​"latitude": 22.5231118649662,
    ​"height": 115.7,
    ​"poiCode": "w0713002",
    ​"sn": "52E8DFBD562D41a0",
    ​"din": "144115194541786483",
    ​"subId": "",
    ​"positionText": "腾讯滨海大厦_滨海北塔_25F_西梯-北门_2501",
    ​"location": [
      ​{
        ​"wId": "a66348f2-0700-1000-abcd-35269c4636aa",
        ​"poiId": "440300223022",
        ​"name": "腾讯滨海大厦",
        ​"level": 6,
        ​"longitude": 113.935131878688,
        ​"latitude": 22.52347513938,
        ​"height": -6.3​
      },
      ​{
        ​"wId": "fcbd41c0-dc95-46f8-9616-68e8b96f8c3d",
        ​"poiId": "44030022302210250200047",
        ​"name": "辅助分区（业务上无意义）",
        ​"level": 8,
        ​"longitude": 113.935337645889,
        ​"latitude": 22.5230878195398,
        ​"height": 115.7,
        ​"poiCode": "m99901000",
        ​"positionText": "腾讯滨海大厦_F25_辅助分区（业务上无意义）"​
      },
      ​{
        ​"wId": "6a1dcf46-f51f-4e39-893f-744d0220f70a",
        ​"poiId": "4403002230221025",
        ​"name": "F25",
        ​"level": 7,
        ​"longitude": 113.935356522636,
        ​"latitude": 22.5228336837518,
        ​"height": 115.7,
        ​"poiCode": "m99999000",
        ​"positionText": "腾讯滨海大厦_F25"​
      }​
    ]​
  },
  ​"success": true
}
```



# **3.**   **微瓴动态数据服务及接口**

 

## 3.1.设备影子

(TODO 增加对设备影子的解释，放在这里或此处提示指向“名词解释”处)

 

 

### 3.1.1.  获取设备影子数据

-   **请求URL:**`/space/shadow/getDeviceShadow`
-   **请求方式:**`GET`
-   **请求参数**

| **参数名称** | **数据类型** | **必填** | **描述**                                        |
| ------------ | ------------ | -------- | ----------------------------------------------- |
| wId          | String       | 是       | 对象的唯一标识，非空且长度固定36位              |
| din          | String       | 是       | 设备编号                                        |
| Path         | String       | 否       | 查询的某个子属性，格式类似xxx,xxx，英文逗号分隔 |
| token        | String       | 是       | 动态密钥，有效期20分钟，需重新登录              |

-   **请求示例** 

```
/space/shadow/getDeviceShadow
?din=
&path=
&token
&wId=a66348f2-0700-1000-abcd-35269c4636aa
```

-   **返回参数**

 <table>
   <tr>
      <td colspan="5">名称</td>
      <td>类型</td>
      <td>说明</td>
      <td>示范值</td>
   </tr>
   <tr>
      <td colspan="5">code</td>
      <td>number</td>
      <td>返回码</td>
      <td>返回码；0表示成功，非0表示出错</td>
   </tr>
   <tr>
      <td colspan="5">success</td>
      <td>Boolean</td>
      <td>错误信息</td>
      <td>返回信息；true 表示成功，false 表示出错</td>
   </tr>
   <tr>
      <td colspan="5">data</td>
      <td>array</td>
      <td>对象数组</td>
      <td>　</td>
   </tr>
   <tr>
      <td>　</td>
      <td colspan="4">metadata</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td>　</td>
      <td colspan="3">desired</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td>　</td>
      <td colspan="2">SRS</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>　</td>
      <td>timestamp</td>
      <td>time</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td colspan="3">reported</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td>　</td>
      <td colspan="2">SRS</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>　</td>
      <td>timestamp</td>
      <td>time</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td colspan="4">state</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td>　</td>
      <td colspan="3">desired</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td>　</td>
      <td colspan="2">SRS</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td colspan="3">data</td>
      <td>time</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td>　</td>
      <td colspan="2">SRS</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>　</td>
      <td>KK</td>
      <td>string</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>SS</td>
      <td>number</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td colspan="3">reported</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td>　</td>
      <td colspan="2">SRS</td>
      <td>array</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>　</td>
      <td>KK</td>
      <td>string</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>SS</td>
      <td>number</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td colspan="4">version</td>
      <td>string</td>
      <td>　</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td colspan="4">timestamp</td>
      <td>string</td>
      <td>　</td>
      <td>　</td>
   </tr>
</table>

-   **返回示例**

```json
{
  ​"code": 0,
  ​"data": {
    ​"metadata": {
      ​"desired": {
        ​"SRS": {
          ​"timestamp": 1564057658312​
        }​
      },
      ​"reported": {
        ​"SRS": {
          ​"timestamp": 1564056186881​
        }​
      }​
    },
    ​"state": {
      ​"desired": {
        ​"SRS": "4326"​
      },
      ​"data": {
        ​"SRS": {
          ​"KK": "AAAA",
          ​"SS": 4326​
        }​
      },
      ​"reported": {
        ​"SRS": {
          ​"KK": "AAAA",
          ​"SS": 4326​
        }​
      }​
    },
    ​"version": "9",
    ​"timestamp": "2019-07-25T05:28:01.517+0000"​
  },
  ​"success": true
}
```



### 3.1.2.  更新设备影子期望数据接口

 

-   **请求URL:**`/space/shadow/updateDesired`
-   **请求方式:**`POST`
-   **请求参数**

| **参数名** | **类型** | **必填** | **数据约束**            | **描述**                           |
| ---------- | -------- | -------- | ----------------------- | ---------------------------------- |
| token      | String   | 是       | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录 |
| wId        | String   | 是       | 非空且长度固定36位      | 对象的唯一标识                     |
| din        | String   | 是       |                         | 设备编号                           |
| version    | String   | 是       |                         | 影子版本version                    |

-   **请求示例** 

```
/space/shadow/updateDesired
?din=
&version=
&token=xxx_xxx
&wId=a66348f2-0700-1000-abcd-35269c4636aa
```

-   **请求包体**

 

**格式： application/json**

**body: JSON  Object**

{"SRS": 4326, "MSG_ID": 100004529, "Order_ID": [0], "Robot_ID": "111111111111111113", "Robot_Pose": [0, 0], "Robot_EStop": 0, "Robot_Power": 0, "Robot_Bumper": 0, "Robot_Velocity": 0.00, "Robot_Temperature": 0.00}

-   **返回参数**

| **参数名** | **类型** | **必填** | **描述**                                |
| ---------- | -------- | -------- | --------------------------------------- |
| code       | String   | 是       | 返回码；0表示成功，非0表示出错          |
| success    | Boolean  | 是       | 返回信息；true 表示成功，false 表示出错 |

-   **返回示例**

```json
{
​  "code": 20029,
​  "success": true
}
```



## 3.2.业务历史数据

 

### 3.2.1.  获取设备原始历史数据

-   **请求URL:**`/space/datahub/raw-data/getDeviceData`
-   **请求方式:**`GET`

注意：有权限控制，拉取对应的数据需要配置权限。

-   **请求参数**

| **参数名**    | **类型** | **必填** | **描述**                                                    | **数据约束** |
| ------------- | -------- | -------- | ----------------------------------------------------------- | ------------ |
| din           | String   | 是       | 要拉取的设备的appId                                         |              |
| dp            | String   | 是       | 对应datapoint                                               |              |
| beginRecordId | String   | 否       | 起始记录id，可从返回结果中获取, beginRecordId第一次可以不填 |              |
| endRecordId   | String   | 否       | 终止记录id                                                  |              |
| limit         | int      | 否       | 拉取数量限制，最大500                                       |              |
| token         | String   | 是       | 鉴权token                                                   |              |
| beginTime     | Long     | 否       | 开始时间，毫秒时间戳                                        |              |
| endTime       | Long     | 否       | 结束时间，毫秒时间戳                                        |              |
| timeDesc      | Boolean  | 否       | true 从最近记录查询     false 从最早记录查询                |              |

- **返回参数**

  <table>
     <tr>
        <td colspan="3">名称</td>
        <td>类型</td>
        <td>说明</td>
        <td>示范值</td>
     </tr>
     <tr>
        <td colspan="3">code</td>
        <td>number</td>
        <td>返回码</td>
        <td>返回码；0表示成功，非0表示出错</td>
     </tr>
     <tr>
        <td colspan="3">success</td>
        <td>Boolean</td>
        <td>错误信息</td>
        <td>返回信息；true 表示成功，false 表示出错</td>
     </tr>
     <tr>
        <td colspan="3">data</td>
        <td>array</td>
        <td>对象数组</td>
        <td>　</td>
     </tr>
     <tr>
        <td>　</td>
        <td colspan="2">UinType</td>
        <td>string</td>
        <td>设备标识类型，可是第三方ID体系</td>
        <td>"DIN","UUID","WID"等都可以</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">DP</td>
        <td>string</td>
        <td>上报方式</td>
        <td>100005552</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">Year</td>
        <td>number</td>
        <td>年</td>
        <td>2019</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">Month</td>
        <td>number</td>
        <td>月</td>
        <td>12</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">DayInMonth</td>
        <td>number</td>
        <td>当月的第几天</td>
        <td>11</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">Hour</td>
        <td>string</td>
        <td>小时</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">Minute</td>
        <td>number</td>
        <td>分</td>
        <td>5</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">Second</td>
        <td>number</td>
        <td>秒</td>
        <td>5</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">DayInWeek</td>
        <td>number</td>
        <td>当周的第几天</td>
        <td>2</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">record_id</td>
        <td>string</td>
        <td>记录id</td>
        <td>"5c0f1b519aa3c470455af079"</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">MsgTS</td>
        <td>number</td>
        <td>时间戳</td>
        <td>1544493905</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">Api</td>
        <td>string</td>
        <td>API类型</td>
        <td>report data Point</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">Uin</td>
        <td>String</td>
        <td>DIN物联设备唯一标识，可以是物联网关</td>
        <td>DIN："144115194553693415",</br>wId："0007e43d-45d7-44c0-acfc-fc5539b6516a",</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">Seq</td>
        <td>String</td>
        <td>　</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td colspan="2">value</td>
        <td>array</td>
        <td>数组（父级别）</td>
        <td>自定义消息体</td>
     </tr>
     <tr>
        <td></td>
        <td>　</td>
        <td>status</td>
        <td>number</td>
        <td>根据项目可变消息体</td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>Robot_ID</td>
        <td>string</td>
        <td></td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>Msg_ID</td>
        <td>number</td>
        <td></td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>Lock_ID</td>
        <td>string</td>
        <td></td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>longitude</td>
        <td>number</td>
        <td></td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>latitude</td>
        <td>number</td>
        <td></td>
        <td>　</td>
     </tr>
     <tr>
        <td></td>
        <td></td>
        <td>height</td>
        <td>number</td>
        <td></td>
        <td>　</td>
     </tr>
  </table>

-   **请求示例**

```
/space/datahub/raw-data/getDeviceData
?din=
&dp=
&token=
&wId=a66348f2-0700-1000-abcd-35269c4636aa
```

-   **返回示例**

```json
{
  ​"code": 0,
  ​"data": [
    ​{
      ​"UinType": "din",
      ​"Hour": 10,
      ​"DP": 100005552,
      ​"DayInWeek": 2,
      ​"Month": 12,
      ​"record_id": "5c0f1b519aa3c470455af079",
      ​"MsgTS": 1544493905,
      ​"DayInMonth": 11,
      ​"Minute": 5,
      ​"Second": 5,
      ​"Year": 2018,
      ​"Api": "report_data_point",
      ​"Uin": "144115194553693415",
      ​"value": {
        ​"Status": 1,
        ​"Robot_ID": "144115194553693415",
        ​"MSG_ID": 100005552,
        ​"Lock_ID": "2"​
      },
      ​"seq": "277"​
    }​
  ],
  ​"success": true
}
```



### 3.2.2.  获取应用原始历史数据

-   **请求URL:**`/space/datahub/raw-data/getAppData`
-   **请求方式:**`GET`
-   **请求参数**

| **参数名**    | **类型** | **必填** | **描述**                                                  | **数据约束 ** |
| ------------- | -------- | -------- | --------------------------------------------------------- | ------------- |
| appId         | Long     | 是       | 要拉取的应用的appId                                       |               |
| beginRecordId | String   | 否       | 起始记录id，可从返回结果中获取beginRecordId第一次可以不填 |               |
| endRecordId   | String   | 否       | 终止记录id                                                |               |
| limit         | int      | 否       | 拉取数量限制，最大500                                     |               |
| token         | String   | 是       | 动态密钥，有效期20分钟，需重新登录                        |               |
| beginTime     | Long     | 否       | 开始时间，毫秒时间戳                                      |               |
| endTime       | Long     | 否       | 结束时间，毫秒时间戳                                      |               |
| timeDesc      | Boolean  | 否       | true 从最近记录查询 false 从最早记录查询                  |               |

-   **返回参数**

 <table>
   <tr>
      <td colspan="2">名称</td>
      <td>类型</td>
      <td>说明</td>
      <td>示范值</td>
   </tr>
   <tr>
      <td colspan="2">code</td>
      <td>number</td>
      <td>返回码</td>
      <td>返回码；0表示成功，非0表示出错</td>
   </tr>
   <tr>
      <td colspan="2">success</td>
      <td>Boolean</td>
      <td>错误信息</td>
      <td>返回信息；true 表示成功，false 表示出错</td>
   </tr>
   <tr>
      <td colspan="2">data</td>
      <td>array</td>
      <td>对象数组</td>
      <td>　</td>
   </tr>
   <tr>
      <td>　</td>
      <td>record_id</td>
      <td>string</td>
      <td>记录id</td>
      <td>"5c0f1b519aa3c470455af079"</td>
   </tr>
   <tr>
      <td></td>
      <td>message_type</td>
      <td>string</td>
      <td>消息体类型</td>
      <td>1000201</td>
   </tr>
   <tr>
      <td></td>
      <td>to_appid</td>
      <td>string</td>
      <td>到应用id</td>
      <td>　</td>
   </tr>
   <tr>
      <td></td>
      <td>msg_attribute</td>
      <td>string</td>
      <td>消息属性</td>
      <td>ack</td>
   </tr>
   <tr>
      <td></td>
      <td>content</td>
      <td>object</td>
      <td>内容字段</td>
      <td>待补充，不用应用不同包体</td>
   </tr>
</table>

-   **请求示例** 

```
/space/datahub/raw-data/getAppData
?appId=40309
&beginRecordId=5cbfc05abf8e647ef1cb84bc
&limit=10
&token=
```

-   **返回示例**

```json
{
  ​
  "code": 0,
  ​"data": [
    ​{
      ​
      "record_id": "5cc94b4e14fe80600897a522",
      ​"message_type": "1000201",
      ​"to_appid": "40191",
      ​"msg_attribute": "ack",
      ​"content": {
        ​
        "ai_token": "token",
        ​"device_id": "144115192401798329",
        ​"ai_client_id": 1001,
        ​"ai_cmd": 5,
        ​"task_id": "62bf3279-2550-4d22-a020-34e72f9855c4",
        ​"ai_type": 7,
        ​"ai_version": "v1.0",
        ​"ai_body": {
        ​
          "start_time": {
          ​
          "$numberLong": "1555904506687"
          ​
          },
        ​"similarity": 4,
        ​"end_time": {
          ​
          "$numberLong": "1555904516687"
          ​
          },
          ​"device_ids": [
            ​"144115192401798329"
            ​
            ],
          ​"time_interval": 600,
          ​"person_id": "98242671-5F46-47E6-98AB-15A4A865475C",
          ​"top_num": 50
          ​
          },
          ​"ex_info": "ARMTASK",
          ​"client_id": "40338"
          ​
          }
        ​
        }
      ​
	],
  ​"success": true
}
```

## 3.3.消息订阅

## 3.4.告警/通知消息上报

 

 

 

 