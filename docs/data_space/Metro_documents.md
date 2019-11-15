# **1.**    **地铁系统**

## 1.1.   车站信息发布系统

### 1.1.1.  获取指定线路，车站，站台的站台全量信息

-   功能描述 返回指定线路，车站或者站台的站台全量信息
-   请求URL:`/space/datahub/metro/broadcasting/v1.0/current/getStationStatus `
-   请求方式：`GET`   
-   请求参数

| 参数名         | 类型   | 必填 | 数据约束                | 描述                               |
| -------------- | ------ | ---- | ----------------------- | ---------------------------------- |
| token          | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录 |
| **lineId**     | string | 否   | 无                      | 线路编号，若为空则返回全部线路     |
| **stationId**  | string | 否   | 无                      | 站点编号，若为空返回全部站点       |
| **platformId** | string | 否   | 无                      | 站台编号，若为空则返回全部站台     |

-   请求示例

```
/space/datahub/metro/broadcasting/v1.0/current/getStationStatus
?lineId=youngtram
&stationId=11
&platformId=1
&token= 
```



-   返回参数

| 名称                | 元素               | 描述       | 类型                                                         | 备注                          |
| ------------------- | ------------------ | ---------- | ------------------------------------------------------------ | ----------------------------- |
| code                | /                  | 处理状态码 | Integer                                                      | 0：正常   其它：异常，        |
| message             | /                  | 错误信息   | String                                                       | Code非0的时候，错误信息       |
| data                | /                  | 数据列表   | List                                                         |                               |
|               | lineId           | 线路编号     | String               | "youngtram"(有轨电车),</br>"03"(3号线)，</br>"apm"(APM线)                               |
|             | lineName           | 线路名称     | String                                                             |                               |
|            | stationId           | 站点编号     | String                                                             |                               |
|           | platformId           | 站台编号     | String                                                             |                               |
|              | eventTs       | 事件发生时间     | Number                                                 | 毫秒级时间戳                              |
|            | eventTime       | 事件发生时间   | datetime                                                             |                               |
|   | stationDescription           | 站点描述     | String                                                             |                               |
|  | crowdingDescription                   |      | String                                                             |                               |
|      | environmentInfo           | 环境信息     | Object       | "weather": 天气,</br>"temperature":   气温,</br>"humidity": 湿度                              |
|  | operationPeriodInfo       | 首末班车时间     | Object      | "firstTrainTime": 首班车时间,</br>"lastTrainTime":末班车时间                              |
|       | firstTrainInfo | 下一辆进站列车信息           |  | "trainID1": 车辆编号,</br>"destination1":   目的地,</br>"trainStatus1": 车辆状态,</br>"trainNum1": 车次编号,</br>"arriveDistance1":   到站距离,</br>"arriveTime1": 到站时间,</br>"btiaoting1":   是否跳停,</br>"bzaike1": 是否载客,</br>"bLast1": 是否为末班车                              |
|      | secondTrainInfo | 下两辆进站列车信息     | Object | "trainID2": 车辆编号,</br>"destination2":   目的地,</br>"trainStatus2": 车辆状态,</br>"trainNum2": 车次编号,</br>"arriveDistance2":   到站距离,</br>"arriveTime2": 到站时间,</br>"btiaoting2":是否跳停,</br>"bzaike2": 是否载客,</br>"bLast2": 是否为末班车                              |
| success             |                    | 消息       | Boolean                                                      | true 表示成功，false 表示出错 |

-   返回示例

```json
{
  ​"code": 0,
  ​"data": [
    {
      ​"lineId": "youngtram",
      ​"lineName": "有轨电车",
      ​"stationId": "11",
      ​"platformId": "1",
      ​"eventTs": 1563766576061,
      ​"eventTime": "2019-07-22 03:36:16",
      ​"stationDescription": "广州塔下行",
      ​"crowdingDescription": "",
      ​"environmentInfo": {
        ​"weather": "",
        ​"temperature": "",
        ​"humidity": "",
        ​"stationSurInfo": ""​
      },
      ​"operationPeriodInfo": {
        ​"firstTrainTime": "",
        ​"lastTrainTime": ""​
      },
      ​"firstTrainInfo": {
        ​"trainID1": "T02",
        ​"destination1": "万胜围",
        ​"trainStatus1": "",
        ​"trainNum1": "01100613",
        ​"arriveDistance1": "180",
        ​"arriveTime1": "36",
        ​"btiaoting1": false,
        ​"bzaike1": true,
        ​"bLast1": false​
      },
      ​"secondTrainInfo": {
        ​"trainID2": "T04",
        ​"trainNum2": "01100213",
        ​"bzaike2": true,
        ​"arriveDistance2": "4750",
        ​"arriveTime2": "950",
        ​"destination2": "万胜围",
        ​"trainStatus2": "",
        ​"btiaoting2": false,
        ​"bLast2": false​
      }​
    }
  ],
  ​"success": true
}
```



### 1.1.2.  获取指定线路，车站，设备的电子导向全量信息

-   功能描述 返回指定线路，车站或者设备的电子导向全量信息
-   请求URL：`/space/datahub/metro/broadcasting/v1.0/current/getNavigationStatus`
-   请求方式：`GET`
-   请求参数

| 参数名    | 类型   | 必填 | 数据约束                | 描述                               |
| --------- | ------ | ---- | ----------------------- | ---------------------------------- |
| token     | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录 |
| lineId    | String | 否   | 无                      | 若为空，则返回全部线路电子导向设备 |
| stationId | String | 否   | 无                      | 若为空，则返回全部站点电子导向设备 |
| din       | String | 否   | 无                      | 若为空，则返回全部类型电子导向设备 |
- 请求示例

  ```
  /space/datahub/ metro/broadcasting/v1.0/current/getNavigationStatus
  ?stationId=3-09
  &token= 
  ```

-   返回参数

| 名称         | 元素 | 描述           | 类型     | 备注                                                         |
| ------------ | ---- | -------------- | -------- | ------------------------------------------------------------ |
| code         | /    | 处理状态码     | Integer  | 0：正常   其它：异常，                                       |
| message      | /    | 错误信息       | String   | Code非0的时候，说明错误信息                                  |
| data         | /    | 数据列表       | List     |                                                              |
|           | din     | 设备唯一编号   | String   |                                                              |
|        | lineId     | 线路编号       |          |                                                              |
|      | lineName     | 线路名称       |          |                                                              |
|     | stationId     | 站点编号       | String   |                                                              |
|   | stationName     | 站点名称       | String   |                                                              |
|       | eventTs     | 事件发生时间戳 | Number   | 毫秒级时间戳                                                 |
|     | eventTime     | 事件发生时间   | datetime |                                                              |
|  | deviceStatus     | 设备状态       | Object   | {<br/>  "controller_status": //当前设备所属控制器状态{<br/>    "lcdCnt": "2",//控制器下屏数<br/>    "devId": "S001-001",//控制器id<br/>    "devStatus": "0",//控制器状态<br/>    "curRunningMode": "0"//控制运行状态0普通1紧急模式<br/>  },<br/>  "lcd_status": {<br/>  "assetNumber": "",//资产编号"<br/>  "sn": "",//子设备sn<br/>  "subDevStatus": "0",//电视机状态0正常1故障<br/>  "subDevId": "S001-001-01",//电视机id<br/>  "subDevRuningInfo": "0",//控制运行状态0普通1紧急模式<br/>    "subDevName": "A端闸机1号屏"//电视机名字<br/>  }<br/>} |
|       | content     | 内容字段       | Object   | 暂无，待后续系统接入后补充                                   |
| success      |      | 消息           | Boolean  | 返回信息；true 表示成功，false 表示出错                      |

-   返回示例

### 1.1.3.  获取指定线路，车站，设备的广播系统全量信息

- 功能描述 返回指定线路，车站或者设备的广播系统全量信息

- 请求URL:`/space/datahub/metro/broadcasting/v1.0/current/getStatus`

- 请求方式：`GET`

- 请求参数

  | 参数名     | 类型   | 必填 | 数据约束                | 描述                               |
  | ---------- | ------ | ---- | ----------------------- | ---------------------------------- |
  | token      | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录 |
  | lineId     | String | 否   | 无                      | 若为空，则返回全部线路广播系统设备 |
  | stationId  | String | 否   | 无                      | 若为空，则返回全部站点广播系统设备 |
  | din        | String | 否   | 无                      | 若为空，则返回全部广播系统设备     |
  | deviceType | String | 否   | 无                      | 若为空，则返回全部类型广播系统设备 |

- 请求示例
  
```
  /space/datahub/metro/broadcasting/v1.0/current/getStatus
  ?stationId=3-09
  &deviceType=broadcast
  &token= 
```

- 返回参数

  | 名称    | 元素                         | 描述               | 类型     | 备注                                                         |
  | ------- | ---------------------------- | ------------------ | -------- | ------------------------------------------------------------ |
  | code    | /                            | 处理状态码         | Integer  | 0：正常   其它：异常，                                       |
  | message | /                            | 错误信息           | String   | Code非0的时候，说明错误信息                                  |
  | data    | /                            | 数据列表           | List     |                                                              |
  |         | din                          | 设备唯一编号       | String   |                                                              |
  |         | deviceType                   | 设备类型           | String   | navigation：电子导向设备，broadcast：站内广播设备            |
  |         | lineId                       | 线路编号           |          |                                                              |
  |         | lineName                     | 线路名称           |          |                                                              |
  |         | stationId                    | 站点编号           | String   |                                                              |
  |         | stationName                  | 站点名称           | String   |                                                              |
  |         | eventTs                      | 事件发生时间戳     | Number   | 毫秒级时间戳                                                 |
  |         | eventTime                    | 事件发生时间       | datetime |                                                              |
  |         | deviceStatus</br>(broadcast) | 设备状态(站内广播) | Object   | devId:"S001-001",//设备唯一标识</br>    devStatus:,0,//设备状态</br>   curRunningMode:,0,// 0，当前是待机的状态，不播放广播；1，客控模式</br>    curPlayingTimes:,32//当前播放的模式下的播放时长</br>   curPlayingDurartion:,3//当前播放的模式下的播放时长</br>   cmdRunningMode:,1//命令站厅广播运行模式</br>    playDuration:,10 //播放时长, 以秒为单位；最长播放时间1800秒 |
  |         | content                      | 内容字段           | Object   | 暂无，待后续系统接入后补充                                   |
  | success |                              | 消息               | Boolean  | 返回信息；true 表示成功，false 表示出错                      |
  
-   返回示例
{}

## 1.2.   车站站台门系统

### 1.2.1车站站台门当前状态

- 功能描述 返回指定车站，站台门的站台门状态

- 请求URL:`/space/datahub/metro/platform-gate/v1.0/current/getPlatformGateStatus`

- 请求方式：`GET`    

- 请求参数

  | 参数名    | 类型   | 必填 | 数据约束                | 描述                               |
  | --------- | ------ | ---- | ----------------------- | ---------------------------------- |
  | token     | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录 |
  | stationId | String | 否   | 无                      | 若为空，则返回全部站点车门         |
  | din       | String | 否   | 无                      | 若为空，则返回指定站点全部车门     |
  
- 请求示例
  
```
  /space/datahub/metro/platform-gate/v1.0/current/getPlatformGateStatus
  ?din=200000000000000074
  &token=
```

- 返回参数

  | <div style="width:77px">名称</div>        | <div style="width:85px">元素</div>           | <div style="width:70px">描述</div>       | 类型                                                         | 备注                                    |
  | ----------- | -------------- | ---------- | ------------------------------------------------------------ | --------------------------------------- |
  | code        | /              | 处理状态码 | Integer                                                      | 0：正常   其它：异常，                  |
  | message     | /              | 错误信息   | String                                                       | Code非0的时候，说明错误信息             |
  | data        | /              | 数据列表   | List                                                         |                                         |
  |          | din   | 设备唯一编号     | String                                                             |                                         |
  |    | stationId       | 站点编号     | String                                                             |                                         |
  |  | stationName       | 站台名称     | String                                                             |                                         |
  |      | eventTs | 事件发生时间戳     | Number                                                 | 毫秒级时间戳                                        |
  |    | eventTime   | 事件发生时间   | datetime                                                             |                                         |
  |  | radarStatus   | 防夹雷达信息     | Object | "mcRunningStatus":0, //设备房控制器信息, 正常/故障（0：正常，1：故障）</br>   "fjmDispInfo":0, //端门显示器故障,正常/故障（0：正常，1：故障）</br>   "runningTimes":6, //开关次数，整体的所有整侧所有站台门门作为一个</br>   "forceResetEvent":0, //单侧报警复位事件,发生/不发生（0：不发生，1：发生）</br>   "fjmMasterDev":0, //旁路，自动（0：自动，1：旁路）</br>   "gateDirection":0, //上行，下行（0：上行，1：下行 )</br>  "assetNumber":""//资产编号</br>   "sn":""//子设备 sn</br>   "pid":""//子设备   pid</br>   "subdin":""//子设备 din</br>   "devId":1, //具体一个门的雷达设备id（integer整型：1~24）</br>   "devName":"01, //01~24（遵循进站出站管理规定）</br>   "status":0, //探测中，未探测。（0：探测中，1：未探测）</br>   "doorRadarTestStatus":0, //有异物报警，无异物报警（0：无异物报警，1：有异物报警）</br>   "failureStatus":0, //正常/故障（0：正常，1：故障）</br>"radarMirrorWarnning":0   //有/无（0：雷达镜头无污损，1：雷达镜头有无损）                                        |
  | success     |                | 消息       | Boolean                                                      | 返回信息；true 表示成功，false 表示出错 |
  
- 返回示例

  ```json
  {
    ​"code": 0,
    ​"data": [
      {
        ​"eventTs": 1563763411645,
        ​"eventTime": "2019-07-22 02:43:31",
        ​"stationId": "40430445",
        ​"stationName": "3-05",
        ​"din": "200000000000000074",
        ​"radarStatus": {
          ​"devId": 1,
          ​"gateDirection": 0,
          ​"forceResetEvent": 0,
          ​"fjmMasterDev": 0,
          ​"doorRadarTestStatus": 0,
          ​"pid": "",
          ​"fjmDispInfo": 0,
          ​"devName": "01",
          ​"mcRunningStatus": 0,
          ​"assetNumber": "",
          ​"runningTimes": 15663,
          ​"sn": "",
          ​"failureStatus": 0,
          ​"status": 0,
          ​"radarMirrorWarnning": 0​
        }​
      }
    ],
    ​"success": true
  }
  ```

  

## 1.3.   车站进出控制

### 1.3.1车站进出控制系统子设备当前状态

- 功能描述 返回指定车站，指定设备类型，指定设备，当前状态

- 请求URL:`/space/datahub/metro/access-control/v1.0/current/getAccessControlStatus`

-   请求方式：`GET`

- 请求参数

  | 参数名     | 类型   | 必填 | 数据约束                | 描述                                                         |
  | ---------- | ------ | ---- | ----------------------- | ------------------------------------------------------------ |
  | token      | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录                           |
  | lineId     | String | 否   | 无                      | 若为空，则返回全部线路进出控制设备                           |
  | stationId  | String | 否   | 无                      | 若为空，则返回全部站点进出控制设备                           |
  | deviceType | String | 否   | 无                      | 若为空，则返回全部类型进出控制设备,</br>目前已具有设备类型：</br>"security_gate ":安检门;</br>"x_ray":x光设备;"</br> "explosive_detection":炸探;</br>    "liquid_detection":液探，</br>"ticketbarrier":闸机</br>   "ticketbarrier_side":边门，</br>"rolling_shutter":卷闸门 |
  | din        | String | 否   | 无                      | 若为空，则返回指定站点指定类型全部设备                       |
  
- 请求示例
  
```
  /space/datahub/metro/access-control/v1.0/current/ getAccessControlStatus
  ?din=200000000000000074
  &token= 
```

- 返回参数

  | 名称    | 元素                                                         | 描述                            | 类型     | 备注                                                         |
  | ------- | ------------------------------------------------------------ | ------------------------------- | -------- | ------------------------------------------------------------ |
  | code    | /                                                            | 处理状态码                      | Integer  | 0：正常   其它：异常，                                       |
  | message | /                                                            | 错误信息                        | String   | Code非0的时候，说明错误信息                                  |
  | data    | /                                                            | 数据列表                        | List     |                                                              |
  |         | din                                                          | 设备唯一编号                    | String   |                                                              |
  |         | lineId                                                       | 线路编号                        |          |                                                              |
  |         | lineName                                                     | 线路名称                        |          |                                                              |
  |         | stationId                                                    | 站点编号                        | String   |                                                              |
  |         | stationName                                                  | 站点名称                        | String   |                                                              |
  |         | eventTs                                                      | 事件发生时间戳                  | Number   | 毫秒级时间戳                                                 |
  |         | eventTime                                                    | 事件发生时间                    | datetime |                                                              |
  |         | deviceType                                                   | 设备类型                        | String   | "security_gate":安检门;</br>"x_ray":x光设备;</br>" explosive_detection":炸探;</br>    "liquid_detection":液探，</br>"ticketbarrier":闸机，</br>"ticketbarrier_side":边门，</br>"rolling_shutter":卷闸门 |
  |         | deviceStatus </br>("x_ray",</br>"explosive_detection", </br>   "liquid_detection") | 设备状态（x光设备，炸探, 液探） | Object   | "devId":"",    //设备id</br>   "assetNumber":""//资产编号</br>   "devStatus":"0"   //设备状态</br>（0正常，1故障，2,离线 故障是由设备上报；</br>离线是系统判断，设备每分钟上传一次状态，</br>如果超过5分钟没上传，系统判定为设备离线）</br>   "exitName"："A出口" |
  |         | deviceStatus</br>(security_gate)                             | 设备状态(安检门)                | Object   | "devId":"",    //设备id </br>  "assetNumber":""//资产编号 </br>  "positionName":"",  //所在位置（A，b出口）</br>   "registerTime":"",    //注册时间</br>（设备注册到安检系统的时间）</br>   "devStatus":"",        //设备状态</br>（0正常，1故障，2,离线 故障是由设备上报；</br>离线是系统判断，设备每分钟上传一次状态，</br>如果超过5分钟没上传，系统判定为设备离线） </br>  passPersonCnt":"",  //通过总人数  </br> "warningCnt":"",     //报警总人数 </br>  "modeCmdSend":"" //安检门模式命令</br>（0正常，1紧急，2火灾） |
  |         | deviceStatus</br>(ticketbarrier,</br>ticketbarrier_side)     | 设备状态(闸机，闸机)            | Object   | "business_type": 10, 业务类型</br>   "currentTOD": "20190625180103", 闸机时间 </br>  "operatorID": "1232132", // 操作员ID</br>   " statusID_$":    1.  {状态码} |
  |         | deviceStatus</br>(rolling)shutter)                           | 设备状态(卷帘门)                | Object   | "devId":"",    //设备id </br>  "positionName":"",  //所在位置（A，b出口）</br>   "registerTime":"",    //注册时间</br>（设备注册到安检系统的时间）</br>   "devStatus":0,//设备状态 </br>0正常，1故障，2,离线  </br> "opDoorCmd ": 0,   //操作卷闸门指令,</br>0:无指令,1:开卷闸门,2:关卷闸门,3:暂停卷闸门操作   "doorOpenFinish":1 , //卷闸门开到位(卷闸门已经打开)  </br> "doorCloseFinish":1, //卷闸门关到位(卷闸门已经关闭) |
  | success |                                                              | 消息                            | Boolean  | 返回信息；true 表示成功，false 表示出错                      |

注：每条数据里面只有一个deviceStatus字段，但是根据deviceType的不同，deviceStatus内数据项会不相同

 

## 1.4.   车站环境

### 1.4.1车站环境当前状态

- 功能描述 返回指定线路，指定车站，指定环境分类，指定上报设备 当前状态

- 请求URL:`/space/datahub /metro/environment/v1.0/current/getEnvironmentStatus`

- 请求方式：`GET`

- 请求参数

  | 参数名    | 类型   | 必填 | 数据约束                | 描述                                                         |
  | --------- | ------ | ---- | ----------------------- | ------------------------------------------------------------ |
  | token     | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录                           |
  | lineId    | String | 否   | 无                      | 若为空，则返回全部线路环境参数                               |
  | stationId | String | 否   | 无                      | 若为空，则返回全部站点环境参数                               |
  | dataType  | String | 否   | 无                      | 若为空，则返回全部类型环境参数,目前已具有设备类型："indoor":室内环境参数;"outdoor":室外天气参数;" indoor_pollution":室内污染物;"outdoor_pollution"：室外污染 |
  | din       | String | 否   | 无                      | 若为空，则返回指定站点指定类型全部设备                       |
  
- 请求示例
  
```
  /space/datahub/metro/environment/v1.0/current/getEnvironmentStatus
```

- 返回参数

  | 名称                                                        | 元素                                                         | 描述        | 类型                                                         | 备注                                    |
  | ------------------------------------------------------------ | ------------------------------------------------------------ | ---------- | ------------------------------------------------------------ | --------------------------------------- |
  | code                                                         | /                                                            | 处理状态码 | Integer                                                      | 0：正常   其它：异常，                  |
  | message                                                      | /                                                            | 错误信息   | String                                                       | Code非0的时候，说明错误信息             |
  | data                                                         | /                                                            | 数据列表   | List                                                         |                                         |
  |                                                           | din                                                 | 设备唯一编号     | String    | 若由设备上报则放回上报din，若为系统上报则返回"app_report"                                        |
  |                                                        | lineId                                                     | 线路编号           |                                                              |                                         |
  |                                                      | lineName                                                     | 线路名称           |                                                              |                                         |
  |                                                     | stationId                                                     | 站点编号     | String                                                             |                                         |
  |                                                   | stationName                                                     | 站点名称     | String                                                             |                                         |
  |                                                       | eventTs                                               | 事件发生时间戳     | Number                                                 | 毫秒级时间戳                                        |
  |                                                     | eventTime                                                 | 事件发生时间   | datetime                                                             |                                         |
  |                                                      | dataType                                                     | 设备类型     | String | "indoor":室内环境参数; </br>  "outdoor":室外天气参数; </br>   "air_quality_sensor":室内空气质量;</br>    "CO2_sensor": 二氧化碳传感器;</br>   "CH4_sensor": 甲烷传感器;</br>   "CO_H2S_sensor": 一氧化碳二氧化硫传感器; </br>  "SO2_sensor": 二氧化硫传感器;</br>   "C3H8_sensor": 丙烷传感器;</br>   "H2_sensor": 氢气传感器;</br>    "outdoor_pollution"：室外污染                                        |
  |                                                | status(indoor)                                           | 环境状态(室内环境)     | Object  | "temperature":"29"   //温度；</br>   "humidity ":"78"     //湿度                                        |
  |                                               | status(outdoor)                                           | 环境状态(室外环境)     | Object | "windpower" : "≤3", </br>  "temperature" : "29", </br>  "weather" : "阴", </br>  "humidity" : "79", </br>  "winddirection" : "东"                                        |
  |                                    | status(air_quality_sensor)                                       | 设备状态(室内空气质量)     | Object | "sensor_id":   "1", //传感器ID </br>      "sensor_name": "pm2.5-pm10", //传感器名字 </br>      "sensor_type":0, // 传感器类型，空气质量固定为0 </br>      "pm25_concentration": 12.2, // pm2.5浓度</br>       "pm10_concentration": 12.2, // pm10浓度 </br>       "system_status": 0, // 主机状态，取值范围：0,1,2。</br>//0表示正常；</br>//1表示更换传感器模，2表示通信错误</br>       "time_stamp": 1566200295683 //时间戳                                        |
  |                                            | status(CO2_sensor)                                     | 设备状态(二氧化碳传感器)     | Object | "sensor_id":   "1", //传感器ID </br>      "sensor_name": "二氧化碳传感器", //传感器名字</br>       "sensor_type":8, // 传感器类型，二氧化碳固定为8 </br>      "concentration": 12.2, //浓度</br>       "time_stamp": 1566200295683 //时间戳                                        |
  |  | status(CH4_sensor;</br>CO_H2S_sensor;</br>SO2_sensor;</br>C3H8_sensor;</br>H2_sensor) | 设备状态(甲烷传感器;</br>一氧化碳二氧化硫传感器;</br>二氧化硫传感器;</br>丙烷传感器;</br>氢气传感器;)     | Object | "sensor_id":   "1", </br>      "sensor_name": "气体传感器名", </br>      "sensor_type": 1~6 , //1表示甲烷,2表示丙烷,3表示氢气,4表示一氧化碳,5表示硫化氢,6表示二氧化硫</br>       "concentration": 12.2,</br>       "system_status": 1, //取值范围：0和1。0表示正常；1故障 </br>      "gas_warn_status": 0, //取值范围：0和1。0表示正常；1警示</br>       "gas_alarm_status": 0, //取值范围：0和1。0表示正常；1告警</br>       "gas_module_status": 0, //取值范围：0和1。0表示正常；1故障</br>       "time_stamp": 1566200295683                                        |
  | success                                                      |                                                              | 消息       | Boolean                                                      | 返回信息；true 表示成功，false 表示出错 |
## 1.5.   车站扶梯系统

### 1.5.1车站扶梯当前状态及各子设备状态

-   **功能描述** 返回指定线路，指定车站，指定扶梯的当前状态及各子设备状态

- 请求URL:`/space/datahub/metro/escalator/v1.0/current/getEscalatorStatus`

- 请求方式：`GET`

- 请求参数

  | 参数名    | 类型   | 必填 | 数据约束                | 描述                               |
  | --------- | ------ | ---- | ----------------------- | ---------------------------------- |
  | token     | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录 |
  | lineId    | String | 否   | 无                      | 若为空，则返回全部线路扶梯         |
  | stationId | String | 否   | 无                      | 若为空，则返回全部站点扶梯         |
  | din       | String | 否   | 无                      | 若为空，则返回指定站点全部扶梯     |
  
- 请求示例

  ```
  space/datahub/metro/escalator/v1.0/current/getEscalator Status
  ?din=200000000000000074
  &token= 
  ```

  

-   返回参数

| 名称            | 元素          | 描述       | 类型                                                         | 备注                                    |
| --------------- | -------------- | ---------- | ------------------------------------------------------------ | --------------------------------------- |
| code            | /              | 处理状态码 | Integer                                                      | 0：正常   其它：异常，                  |
| message         | /              | 错误信息   | String                                                       | Code非0的时候，</br>说明错误信息             |
| data            | /              | 数据列表   | List                                                         |                                         |
|              | din | 设备唯一编号 | String |                                         |
|           | lineId | 线路编号 | String |                                         |
|         | lineName | 线路名称 | String |                                         |
|        | stationId | 站点编号 | String |                                         |
|      | stationName | 站台名称 | String |                                         |
|          | eventTs | 事件发生时间戳 | Number                                           | 毫秒级时间戳 |
|        | eventTime | 事件发生时间 | datetime |                                         |
|     | deviceStatus | 设备状态 | Object | "DevName": "8#",//设备名称</br>   "Rate": -1.0, //运行速率</br>   "PartCurrent_A": 9.344482,//电机电流</br>    "Faults": 0,//故障次数</br>    "RunningStatus": 1,</br> //运行状态，1表示上行，2表示下行，</br>3表示正常停止（自动模式），4表示正常停止（手动模式）, </br>5表示故障，6表示检修状态，</br>7 表示边缘处理器离线0表示无状态信息</br>    "PartEnvirionTemp": -9999.0,//环境温度</br>    "DevID":   "3500-440105-200505-0013"//设备Id |
|  | subdeviceStatus | 子设备状态 | Object | "partMotorStatus":2, //电机输出端诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "PartHigspeedGearStatus":2, //减速器输入端诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "PartLowspeedGearStatus":2, //减速器输出端诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "PartDrivingBearingStatus":2, //主驱动驱动端轴承诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "PartUndrivingBearingStatus":2, //主驱动从动端轴承诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "PartTensionerDriBearingStatus":2, //涨紧架驱动端轴承诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "PartTensionerUndrivBearingStatus":2, //涨紧架从动端轴承诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "PartDrivHandrailStatus":2, //左扶手带诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "PartUndrivHandrailStatus":2, //右扶手带诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "StepChainDrivingStatus":2, //梯级链主动端诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "StepChainUndrivingStatus":2, //梯级链从动端诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "DrivingChainStatus":2, //主驱动链诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "BrakingSysStatus":2 //主机刹车诊断结果</br>0：正常，1：欠佳，2：故障，3：传感器故障</br>   "partMotorHeath":2, //电机输出端健康度</br>   "PartHigspeedGearHeath":2, //减速器输入端健康度</br>   "PartLowspeedGearHeath":2, //减速器输出端健康度</br>   "PartDrivingBearingHeath":2, //主驱动驱动端轴承健康度</br>   "PartUndrivingBearingHeath":2, //主驱动从动端轴承健康度</br>   "PartTensionerDriBearingHeath":2, //涨紧架驱动端轴承健康度</br>   "PartTensionerUndrivBearingHeath":2, //涨紧架从动端轴承健康度</br>   "PartDrivHandrailHeath":2, //左扶手带健康度</br>   "PartUndrivHandrailHeath":2, //右扶手带健康度</br>   "StepChainDrivingHeath":2, //梯级链主动端健康度</br>   "StepChainUndrivingHeath":2, //梯级链从动端健康度</br>   "DrivingChainHeath":2, //主驱动链健康度</br>   "BrakingSysHeath":2 //主机刹车健康度 |
| success         |                | 消息       | Boolean                                                      | 返回信息；</br>true 表示成功，</br>false 表示出错 |

## 1.6.   车站照明系统

### 1.6.1车站照明设备当前状态

-   **功能描述** 返回指定线路，指定车站，指定照明设备类型，指定照明设备的当前状态及各子设备状态
-   请求URL:`/space/datahub/metro/illumination/v1.0/current/getIlluminationStatus`
-   请求方式:`GET`
-   请求参数

| 参数名     | 类型   | 必填 | 数据约束                | 描述                               |
| ---------- | ------ | ---- | ----------------------- | ---------------------------------- |
| token      | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录 |
| lineId     | String | 否   | 无                      | 若为空，则返回全部线路照明设备     |
| stationId  | String | 否   | 无                      | 若为空，则返回全部站点照明设备     |
| deviceType | String | 否   | 无                      | 若为空，则返回全被类型照明设备     |
| din        | String | 否   | 无                      | 若为空，则返回指定站点全部照明设备 |
- 请求示例

  ```
  /space/datahub/metro/illumination/v1.0/current/getIlluminationStatus
  ?din=200000000000000074
  &token= 
  ```

-  返回参数

| 名称                              | <div style="width:40px">元素</div> | <div style="width:70px">描述</div>           | <div style="width:60px">类型</div>     | 备注                                                         |
| --------------------------------- | ---- | -------------- | -------- | ------------------------------------------------------------ |
| code                              | /    | 处理状态码     | Integer  | 0：正常   其它：异常，                                       |
| message                           | /    | 错误信息       | String   | Code非0的时候，说明错误信息                                  |
| data                              | /    | 数据列表       | List     |                                                              |
|                                | din | 设备唯一编号   | String   |                                                              |
|                             | lineId | 线路编号       | String   |                                                              |
|                           | lineName | 线路名称       | String   |                                                              |
|                          | stationId | 站点编号       | String   |                                                              |
|                        | stationName | 站台名称       | String   |                                                              |
|                            | eventTs | 事件发生时间戳 | Number   | 毫秒级时间戳                                                 |
|                          | eventTime | 事件发生时间   | datetime |                                                              |
|                         | deviceType | 设备类型       | String   | "smart_light":智能照明；"light_control_panel":灯控面板       |
|          | deviceStatus(smart_light) | 设备状态       | Object   | LightBrightness:"89"; //智能灯具亮度, 1~100                  |
|  | deviceStatus(light_control_panel) | 设备状态       |          | LightScene："1"   //场景1：高峰模式;   场景2：平峰模式;场景3：低峰模式;场景4：停运模式;场景5：典礼模式 |
| success                           |      | 消息           |          | 返回信息；true 表示成功，false 表示出错                      |

 

 

# 2.       基础能力

## 2.1.   告警接口

### 2.1.1 获取告警列表

- **功能描述** 返回指定类别，子类型，状态，等级，appid等的告警数据列表

- 请求URL:`/space/datahub/alarm/v0.1/getAlarmList`

- 请求方式：`GET`                         

- 请求参数

  | 参数名    | 类型    | 必填 | 数据约束                | 描述                                  |
  | --------- | ------- | ---- | ----------------------- | ------------------------------------- |
  | token     | String  | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录    |
  | type      | String  | 否   | 无                      | 告警类型                              |
  | subType   | String  | 否   | 无                      | 告警子类型                            |
  | status    | String  | 否   | 无                      | 状态 processed unprocessed processing |
  | level     | int     | 否   | 无                      | 告警级别 1-5                          |
  | beginTime | String  | 否   | 无                      | 开始时间 yyyyMMddHHmmss               |
  | endTime   | String  | 否   | 无                      | 结束时间 yyyyMMddHHmmss               |
  | id        | String  | 否   | 无                      | 告警id                                |
  | appIds    | String  | 否   | 无                      | 上报的appid列表，英文,分隔            |
  | imgFlag   | boolean | 否   | 无                      | 是否返回告警的图片信息                |
  | page      | int     | 否   | 无                      | 页码，默认1                           |
  | size      | int     | 否   | 无                      | 每页数量，默认10                      |
  
- 请求示例
  
```
  /space/datahub/alarm/v0.1/getAlarmList
  ?type=
  &status=processed
  &token=
  &subType=invade
  &page=1
  &size=10
  &level=1
```

- 返回参数

  | 名称    | 元素 | 描述       | 类型    | 备注                                    |
  | ------- | ---- | ---------- | ------- | --------------------------------------- |
  | code    | /    | 处理状态码 | Integer | 0：正常   其它：异常，                  |
  | data    |      | 数据列表   | List    | 请求数据的列表                          |
  | success |      | 消息       | Boolean | 返回信息；true 表示成功，false 表示出错 |
  
-   返回示例

```json
{
  "code": 0,
  ​"data": {
    ​"size": 1,
    ​"data": [
      ​{
        ​"handler": {
          
        },
        ​"sub_type": "online",
        ​"level": 1,
        ​"advice": "",
        ​"description": "",
        ​"id": "",
        ​"time": "1552640930201",
        ​"position": {
          ​"wId": "b474ce98-04e2-4b5c-b9fd-abf3f7d8600d",
          ​"level": 9,
          ​"sub_id": "",
          ​"din": "144115192382209921"​
        },
        ​"type": "device",
        ​"processor": {
          
        },
        ​"status": "processed"​
      }​
    ],
    ​"count": 5201,
    ​"page": 1​
  },
  ​"success": true
}
```

### 2.2.2处理告警

- **功能描述** 处理或消除之前发生过的告警

- 请求URL:`/space/datahub/alarm/v0.1/changeStatus`

-   请求方式：`GET`

- 请求参数

  | 参数名             | 类型   | 必填 | 数据约束                | 描述                                      |
  | ------------------ | ------ | ---- | ----------------------- | ----------------------------------------- |
  | token              | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录        |
  | uuid               | String | 是   | 无                      | 告警的uuid，返回的列表中的id              |
  | status             | String | 是   | 无                      | 告警状态 processed unprocessed processing |
  | processor          | String | 是   | 无                      | 告警处理人，可以为JSON字符串              |
  | processTime        | Long   | 是   | 无                      | 告警处理时间                              |
  | advice             | String | 否   | 无                      | 告警处理建议                              |
  | processDescription | String | 否   | 无                      | 告警处理的描述信息                        |
  | processExtend      | String | 否   | 无                      | 告警处理的扩展信息，可以为JSON字符串      |
  
- 请求示例

  ```
  /space/datahub/alarm/v0.1/changeStatus
  ?uuid=ddkkbb
  &status=processed
  &processor={"name":"haiboliu"}
  &token=
  &processDescription=
  &processExtend={}
  ```

-   返回参数

| 名称    | 元素 | 描述       | 类型    | 备注                                    |
| ------- | ---- | ---------- | ------- | --------------------------------------- |
| code    | /    | 处理状态码 | Integer | 0：正常   其它：异常，                  |
| success |      | 消息       | Boolean | 返回信息；true 表示成功，false 表示出错 |

-   返回示例

```json
{
​  "code": 0,
​  "success": true
}
```

## 2.2.   设备状态

### 2.2.1全量设备设备当前状态接口

-   **功能描述** 返回指定车站，指定设备类型，指定设备，当前状态
-   请求URL:`/space/datahub/metro/common/v1.0/current/getDeviceStatus`
-   请求方式：`GET`
-   请求参数

| 参数名    | 类型   | 必填 | 数据约束                | 描述                                   |
| --------- | ------ | ---- | ----------------------- | -------------------------------------- |
| token     | String | 是   | 非空且长度固定128个字符 | 动态密钥，有效期20分钟，需重新登录     |
| lineId    | String | 否   | 无                      | 若为空，则返回全部线路设备             |
| stationId | String | 否   | 无                      | 若为空，则返回全部站点设备             |
| poiCode   | String | 否   | 无                      | 若为空，则返回全部poiCode设备          |
| din       | String | 否   | 无                      | 若为空，则返回指定站点指定类型全部设备 |

- 请求示例

  ```
  /space/datahub/metro/common/v1.0/current/ getDeviceStatus
  ?din=200000000000000074
  &token= 
  ```

-   返回参数

| 名称    | 元素         | 描述           | 类型     | 备注                                    |
| ------- | ------------ | -------------- | -------- | --------------------------------------- |
| code    | /            | 处理状态码     | Integer  | 0：正常   其它：异常，                  |
| message | /            | 错误信息       | String   | Code非0的时候，说明错误信息             |
| data    | /            | 数据列表       | List     |                                         |
|         | din          | 设备唯一编号   | String   |                                         |
|         | lineId       | 线路编号       |          |                                         |
|         | lineName     | 线路名称       |          |                                         |
|         | stationId    | 站点编号       | String   |                                         |
|         | stationName  | 站点名称       | String   |                                         |
|         | eventTs      | 事件发生时间戳 | Number   | 毫秒级时间戳                            |
|         | eventTime    | 事件发生时间   | datetime |                                         |
|         | wId          | 微瓴id         | String   |                                         |
|         | poiCode      | 设备类型编号   | String   |                                         |
|         | productId    | 厂商pid        | String   |                                         |
|         | sn           | 设备sn         | String   |                                         |
|         | deviceStatus | 设备当前状态   | int      | 0：正常；1：故障；2；离线               |
|         | deviceType   | 设备类型       | String   | 对应于poiCode                           |
|         | content      | 设备参数值（） | Object   |                                         |
| success |              | 消息           | Boolean  | 返回信息；true 表示成功，false 表示出错 |

 

注：每条数据里面只有一个content字段，但是根据poiCode的不同，content内数据项会不相同