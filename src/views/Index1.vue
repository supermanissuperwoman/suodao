<template>
          <el-row class="headerRow">
              <el-col :span="24">
                <div class="logo">
                    <img src="../assets/image/lqlogo.svg" alt="">
                </div>
                <div @mouseenter="personFlag = true" @mouseleave="personFlag = false" class="personCount commonHW">
                    <img src="../assets/image/person.svg" alt="">
                    <div v-show="personFlag" class="personWrap">
                        <img src="../assets/image/head.svg" alt="">
                        <span class="company">{{userInfo.userCompany}}</span>
                        <br>
                        <span class="account">账号：{{userInfo.userName}}</span>
                        <button @click="logOut()">退出登录</button>
                    </div>
                </div>
                
            </el-col>
          </el-row>
            <!-- 选择设备 开始 -->
            <el-row class="searchRow">
                <el-col>
                    <el-select v-model="selectValue" value-key="equipmentCode" placeholder="请选择设备"
                    @change="hanleChange">
                        <el-option
                        v-for="item in equipOptions"
                        :key="item.equipmentCode"
                        :label="item.equipmentName"
                        :value="item"
                        >
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="handleSearch(currentEquip)" :disabled="isDisabled">查询</el-button>
                </el-col>
            </el-row>
            <!-- 选择设备结束 -->

            <!-- 实时曲线 开始 -->
            <el-row class="realTimeCurveRoot">
                <el-col :xl="24">
                    <div class="realTimeCurveWrap">
                        <span class="damageTitle">钢丝绳实时损伤曲线</span>
                        <div class="location">
                            <span class="upAndDown">起升位置：{{upLocation+'cm'}}</span>
                            <br>
                            <span class="smallCar">小车位置：{{carLocation+'cm'}}</span>
                        </div>
                        <div class="realTimeChart"></div>
                        <div class="realTimeList">
                            <el-table
                            :data="realTimeListOptions"
                            :header-cell-style="headerStyle"
                            :cell-style="cellStyle"
                            max-height="256"
                            style="width: 100%;backgroundColor:#1C1F30;">
                            <el-table-column
                                prop="equipmentName"
                                label="设备名称"
                                width="115">
                            </el-table-column>
                            <el-table-column
                                prop="isOnline"
                                label="状态"
                                width="115">
                            </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <!-- 实时曲线 结束 -->
            
            <!-- 损伤量值和列表 开始 -->
            <el-row :gutter="2" class="valueAndListTop" v-show="false">
                <el-col :span="12">
                    <div class="chartTitle">检测结果</div>
                    <div class="topLeftChart"></div>
                    <div class="topLeftList" v-show="true">
                        <el-table
                        :data="tableData.topLeft"
                        :header-cell-style="headerStyle"
                        :cell-style="cellStyle"
                        :height="256"
                        style="width: 100%;backgroundColor:#1C1F30">
                        <el-table-column
                            prop="value"
                            label="损伤值"
                            sortable
                            width="115">
                            <template v-slot="scope">
                            {{scope.row.value}}%
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="position"
                            label="损伤位置"
                            sortable
                            width="115">
                            <template v-slot="scope">
                            {{scope.row.position}}cm
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="topRightChart"></div>
                    <div class="topRightList" v-show="false">
                        <el-table
                        :data="tableData.topRight"
                        :header-cell-style="headerStyle"
                        :cell-style="cellStyle"
                        :height="256"
                        style="width: 100%;backgroundColor:#1C1F30">
                        <el-table-column
                            prop="value"
                            label="损伤值"
                            sortable
                            width="115">
                            <template v-slot="scope">
                            {{scope.row.value}}%
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="position"
                            label="损伤位置"
                            sortable
                            width="115">
                            <template v-slot="scope">
                            {{scope.row.position}}cm
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="2" class="valueAndListDown" v-show="false">
                <el-col :span="12">
                    <div class="down">
                        <div class="downLeftChart"></div>
                        <div class="downLeftList" v-show="false">
                            <el-table
                            :data="tableData.downLeft"
                            :header-cell-style="headerStyle"
                            :cell-style="cellStyle"
                            :height="256"
                            style="width: 100%;backgroundColor:#1C1F30">
                            <el-table-column
                                prop="value"
                                label="损伤值"
                                sortable
                                width="115">
                                <template v-slot="scope">
                                {{scope.row.value}}%
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="position"
                                label="损伤位置"
                                sortable
                                width="115">
                                <template v-slot="scope">
                                {{scope.row.position}}cm
                                </template>
                            </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    
                </el-col> 
                <el-col :span="12">
                    <div class="down">
                        <div class="downRightChart"></div>
                    <div class="downRightList" v-show="false">
                        <el-table
                        :data="tableData.downRight"
                        :header-cell-style="headerStyle"
                        :cell-style="cellStyle"
                        :height="256"
                        style="width: 100%;backgroundColor:#1C1F30">
                        <el-table-column
                            prop="value"
                            label="损伤值"
                            sortable
                            width="115">
                            <template v-slot="scope">
                            {{scope.row.value}}%
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="position"
                            label="损伤位置"
                            sortable
                            width="115">
                            <template v-slot="scope">
                            {{scope.row.position}}cm
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                    </div>
                </el-col>   
            </el-row>   
            <!-- 损伤量值和列表 结束 -->
</template>

<script>
import {getItem,clearSessionStorage} from '../api/index'
import { toRaw } from 'vue'
import * as echarts from "echarts";
import * as $ from "../utils/jquery.min.js";
import signalr from "../utils/jquery.signalR-2.4.0.min.js";
import hubs from "../utils/hubs";
import RealTimeCurve from '../components/index1/RealTimeCurve.vue'
export default {
    data() {
        return {
            // 用户信息
            userInfo: {},
            // 用户信息显示开关
            personFlag: false,
            // 下拉框的数据项
            equipOptions: [],
            selectValue: '',
            // 查询按钮开关
            isDisabled: true,
            // 要查询的当前选择设备的设备编码
            currentEquipCode: '',
            probeCommercialConnection: null,
            previousEquipCode: '',
            // 图表容器
            chartContainer: null,
            chartOptions: {},
            // x轴数据
            xData: [],
            // 实时曲线y轴数据
            yData: {"arr1": [], "arr2": [], "arr3": [], "arr4": []},
            // 从远程获取到的损伤值
            valueFromRemote: [0, 0, 0, 0],
            // 起升位置
            upLocation: "0",
            // 小车位置
            carLocation: "",
            // 要注销的设备
            deregisterEquip: "",
            // 当前设备
            currentEquip: '',
            // 传感器数据
            probe1: {},
            probe2: {},
            probe3: {},
            probe4: {},
            // 实时曲线定时器
            realTimer: null,
            // 监测结果容器对象
            containerObj: [
                
            ],
            // 监测结果容器数据配置
            // containerOptions: {
            //     topLeft: {},
            //     topRight: {},
            //     downLeft: {},
            //     downRight: {}
            // },
            containerOptions: {},
            // 设备列表数据
            realTimeListOptions: [],
            // 定时切换列表的定时器
            interval: null,
            // 列表数据
            
            tableData: {
                topLeft: [],
                topRight: [],
                downLeft: [],
                downRight: []
            },
            headerStyle: {
                backgroundColor: "#252838",
                border: 0
            },
            cellStyle: {
                height: "30px",
                margin: 0,
                padding: 0,
                backgroundColor: '#1C1F30',
                boxSizing: "border-box",
                borderRight: "1px solid #292B3D",
                borderBottom: "1px solid #292B3D",
                borderLeft: "1px solid #292B3D",
                textAlign: "center"
            }
        }
    },
    created() {
        

        let copyThis = this;
        // 获取用户信息
        this.getUserInfo();
        // 获取设备信息
        this.getCurrentEquip();
        $.connection.hub.url = "http://47.100.48.219:8090/signalr/hubs";
        this.probeCommercialConnection = $.connection.ProbeConfigWSSHub;
        this.probeCommercialConnection.client.ioT01BBindAlarmData = function(equipmentCode,SerialAndID,result) {
            copyThis.getValueFromRemote(equipmentCode,SerialAndID,result);
        }
        // 注册绑定编码器的方法
        this.probeCommercialConnection.client.bindIoTEncode = function(equipmentCode,serial,user,direction,isMoving) {

        copyThis.bindEncodeDirection(equipmentCode, direction, isMoving);
        };
    },
    mounted() {
        let dom = document.getElementsByClassName("realTimeChart")[0];
        this.chartContainer = echarts.init(dom)
        // this.getDamageData();
        // let dom = document.getElementsByClassName("realTimeChart")[0];
        // let topLeft = document.getElementsByClassName("topLeftChart")[0];
        // let topRight = document.getElementsByClassName("topRightChart")[0];
        // let downLeft = document.getElementsByClassName("downLeftChart")[0];
        // let downRight = document.getElementsByClassName("downRightChart")[0];
        // this.containerObj.push(echarts.init(topLeft));
        // this.containerObj.push(echarts.init(topRight));
        // this.containerObj.push(echarts.init(downLeft));
        // this.containerObj.push(echarts.init(downRight));
        // this.containerObj.topLeft = echarts.init(topLeft);
        // this.containerObj.topRight = echarts.init(topRight);
        // this.containerObj.downLeft = echarts.init(downLeft);
        // this.containerObj.downRight = echarts.init(downRight);
        
        // this.chartContainer = echarts.init(dom)
        // this.chartOptions = this.damageValueInit();
        // this.chartOptions && this.chartContainer.setOption(this.chartOptions)
    },
    methods: {
        // 获取用户信息
        async getUserInfo() {
            this.userInfo = getItem("userData");
        },

        logOut() {
            clearSessionStorage();
            this.$router.push('/login1');
        },
        // 获取当前用户下的设备
        async getCurrentEquip() {
            const res = await this.$http.post(this.$urlObj.queryEquipmentInfo,{"EquipmentModel":"IOT01BHarbor",userCode:getItem("userData").userCode});
            if(res.data.resultCode === "0000") {
                let data = res.data.data;
                this.equipOptions = [];
                this.probeArr = [];
                for(let i = 0; i < data.length; i++) {
                    let obj = {};
                    obj.equipmentCode = data[i].equipmentCode;
                    obj.equipmentName = data[i].equipmentName;
                    this.equipOptions.push(obj)
                }
            }
        },

        // 选择设备后，获取其设备编码
        hanleChange(data) {
            // this.probeArr1 = data.value;
            this.currentEquip = data.equipmentCode;
            this.isDisabled = false;
        },

        // 注册设备
        handleSearch(currentEquip) {
            let copyThis = this;
            this.chartOptions = this.damageValueInit();
            // 获取损伤量值和列表
            this.getDamageValue(currentEquip);
            // 获取传感器数据
            this.getProbeData(currentEquip);
            // 定时刷新设备状态列表
            this.getEquipStateInterval(currentEquip);
            $.connection.hub
            .start()
            .done(function() {
                if(currentEquip) {
                    copyThis.probeCommercialConnection.server.deregisterEquipment(copyThis.deregisterEquip);
                    copyThis.deregisterEquip = currentEquip;
                    copyThis.probeCommercialConnection.server.registerEquipment(currentEquip);
                }
                
            })
            .fail(function() {
                console.log("连接失败");
            });
            this.getDamageData();
            
            this.getListData("609a269b096b506a7c93f103", "topLeft");
            this.getListData("609a26fd096b506a7c93f109", "topRight");
            this.getListData("609a2757096b506a7c93f10f", "downLeft");
            this.getListData("609a2797096b506a7c93f115", "downRight");
        },

        // 初始化损伤值数据
        damageValueInit() {
            return {
    xAxis: {
        type: 'category',
        name: '时间',
        data: this.xData,
        axisTick: {
        show: false
    }
    },
    yAxis: {
        type: 'value',
        name: '损伤量值(%)',
        axisLabel: {
            show: true,
            formatter: '{value}%'
        },
        max: 100,
        splitNumber: 10,
        splitLine: {
            lineStyle: {
                color: '#292B3D'
            }
        }

    },
    grid: {
        top: '11%',
        bottom: '12%',
        left: '4%',
        right: '4%'
    },
    toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: "none"
      },
      dataView: {
        readOnly: false
      },
      magicType: {
        // type: ["line", "bar"]
      },
      // restore: {},
      // saveAsImage: {}
    }
  },
    legend: {
        data: [
            {name: '',
            itemStyle: {
                color: '#9562F7',
                borderColor: '#9562F7'
            },
            lineStyle: {
                color: '#9562F7'
            },
            textStyle: {
                color: '#9562F7'
            },
            },
            {name: '',
            itemStyle: {
                color: '#00d8d5',
                borderColor: '#00d8d5'
            },
            lineStyle: {
                color: '#00d8d5'
            },
            textStyle: {
                color: '#00d8d5'
            }
            },
            {name: '',
            itemStyle: {
                color: '#0099FF',
                borderColor: '#0099FF'
            },
            lineStyle: {
                color: '#0099FF'
            },
            textStyle: {
                color: '#0099FF'
            }
            },
            {name: '',
            itemStyle: {
                color: '#D78400',
                borderColor: '#D78400'
            },
            lineStyle: {
                color: '#D78400'
            },
            textStyle: {
                color: '#D78400'
            }
            },
            
        ],
    },
    
    series: [{
        name: '',
        data: this.yData.arr1,
        type: 'line',
        markLine: {
            silent: false,
            data: [{
              type: 'average',
              yAxis: 17,
            },
            ],
            label: {
              show: true,
              color: '#C93A59',
              fontStyle: 'normal',
              formatter: '{c}%',
              position: 'end'
            },
            lineStyle: {
                color: '#9F383C'
            }
        },
        lineStyle: {
            color: '#9562F7'
        }
    },
    {
        name: '',
        data: this.yData.arr2,
        type: 'line',
        lineStyle: {
            color: '#00d8d5'
        }
    },
    {
        name: '',
        data: this.yData.arr3,
        type: 'line',
        lineStyle: {
            color: '#0099FF'
        }
    },
    {
        name: '',
        data: this.yData.arr4,
        type: 'line',
        lineStyle: {
            color: '#D78400'
        }
    },
    ]
};
        },
        
        // 获取远程发送来的损伤值
        getValueFromRemote(equipmentCode,SerialAndID, result) {
            if(SerialAndID == this.probe1.serial) {
                this.valueFromRemote[0] = result / 10;
            }
            if(SerialAndID == this.probe2.serial) {
                this.valueFromRemote[1] = result / 10;
            }
            if(SerialAndID == this.probe3.serial) {
                this.valueFromRemote[2] = result / 10;
            }
            if(SerialAndID == this.probe4.serial) {
                this.valueFromRemote[3] = result / 10;
            }
        },
        // 动态获取起升位置和小车的位置
        bindEncodeDirection(equipmentCode, direction, isMoving) {
            let low;
            let high;
            if(direction.toString(2).length > 16) {
                low = parseInt(direction.toString(2).slice(-16),2);
                high = parseInt(direction.toString(2).slice(0,direction.toString(2).length-16),2);
            }else {
                low = direction;
                high = 0;
            }
            // 起升位置
            this.upLocation = high;
            // 小车位置
            this.carLocation = low;
        },
        // 获取损伤值数据
        getDamageData(value) {
            let currentTime = "";
            // 点击查询先清除定时器
            clearInterval(this.realTimer);
            this.realTimer = setInterval(() => {
                currentTime = this.oneToTwo(new Date().getHours()) +':'+this.oneToTwo(new Date().getMinutes()) + ':' + this.oneToTwo(new Date().getSeconds());
                if(this.xData.length >= 50) {
                    this.xData.shift();
                }
                this.xData.push(currentTime);

                if(this.yData.arr1.length >= 50) {
                    this.yData.arr1.shift();
                }
                if(this.yData.arr2.length >= 50) {
                    this.yData.arr2.shift();
                }
                if(this.yData.arr3.length >= 50) {
                    this.yData.arr3.shift();
                }
                if(this.yData.arr4.length >= 50) {
                    this.yData.arr4.shift();
                }
                this.yData.arr1.push(this.valueFromRemote[0]);
                this.yData.arr2.push(this.valueFromRemote[1]);
                this.yData.arr3.push(this.valueFromRemote[2]);
                this.yData.arr4.push(this.valueFromRemote[3]);
                this.valueFromRemote = [0,0,0,0];
                this.chartOptions && this.chartContainer.setOption(this.chartOptions)
            },1000)
            
        },


        // 初始化图表数据
        optionsInit(xData,yData,color,sensorName) {
            return  {
      xAxis: {
        type: "category",
        name: "损伤位置(cm)",
        nameTextStyle: {
          color: "#FFFFFF",
          fontSize: 14,
          padding: [0,0,0,1040]
        },
        nameGap: 5,
        data: xData,
        axisLabel: { 
            color: '#B9B9B9',
        },
        nameLocation: "center",
        axisLine: {
          lineStyle: {
            color: '#292B3D'
          }
        },
        axisTick: {
          show: true
        }
      },
      
      yAxis: {
        type: "value",
        name: "损伤量值（%）",
        nameTextStyle: {
          color: "#FFFFFF",
          fontSize: 14
        },
        axisLabel: {
          interval: 5,
          formatter: "{value} %",
          color: '#B9B9B9'
        },
        splitLine: {//分割线配置
                show:true,
                lineStyle: {
                    color: "#292B3D",
                }
        },
        max: 50,
      },
      grid:{
      	 top:"30px",
         left:"55px",
         right:"90px",
         bottom:"20px"
	  },
      legend: {
        data: [
            {name: sensorName,
            itemStyle: {
                color: color,
                borderColor: color
            },
            lineStyle: {
                color: color
            },
            textStyle: {
                color: color
            },
            },
        ]
            },
      series: [
        {
          data: yData,
          name: sensorName, 
          type: "line",
          smooth: true,
          symbol: "none",
          color: color,
          areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(129, 67, 170, 0.4)'
                }, {
                    offset: 1,
                    color: 'rgba(28, 31, 48, 0.4)'
                }])
            },
        //   markLine: {
        //     silent: false,
        //     data: [{
        //       type: 'average',
        //       yAxis: 17,
        //     }],
        //     label: {
        //       show: true,
        //       color: '#C93A59',
        //       fontStyle: 'normal',
        //       formatter: '{c}%',
        //       position: 'end'
        //     },
        //     lineStyle: {
        //       color: '#C93A59'
        //     }
        //   }
        },
        
      ],
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '损伤位置:{b0}<br />损伤量值:{c0}'
      },
      toolbox: {
        show: true,
        feature: {
        dataZoom: {
            show: true,
            yAxisIndex: "none"
        },
        dataView: {
            readOnly: false
        },
        magicType: {
            // type: ["line", "bar"]
        },
        // restore: {},
        // saveAsImage: {}
        }
    },
        };
        },
        // 获取设备状态列表数据
        getEquipStateInterval(equipmentCode) {
            let code = equipmentCode;
            this.getEquipState(code);
            clearInterval(this.interval)
            this.interval = setInterval(async (code) => {
                this.realTimeListOptions = [];
                this.getEquipState(this.currentEquip)  
            }, 60000);
            
        },
        // 获取设备状态数据的请求方法
        getEquipState(equipmentCode) {
            this.realTimeListOptions = [];
            this.$http({
                method: 'post',
                url: this.$urlObj.queryProbeInfo,
                data:{userCode:getItem("userData").userCode, equipmentCode:equipmentCode}
            }).then((res) => {
                if(res.data.resultCode === "0000") {
                    let data = res.data.data;
                    for(let i = 0; i < data.length; i++) {
                        let cache = {};
                        let probe = {};
                        cache.equipmentName = data[i].equipmentName;
                        cache.isOnline = data[i].isOnline == true ? '在线':'离线';
                        this.realTimeListOptions.push(cache);
                    }
                }
            })
        },
        // 获取当前设备的传感器数据
        async getProbeData(equipmentCode) {
            const res = await this.$http.post(this.$urlObj.queryProbeInfo,
            {userCode:getItem("userData").userCode, equipmentCode:equipmentCode});
            if(res.data.resultCode === '0000') {
                let data = res.data.data;
                this.valueFromRemote = [0,0,0,0];
                this.xData = [];
                this.yData.arr1 = [];
                this.yData.arr2 = [];
                this.yData.arr3 = [];
                this.yData.arr4 = [];
                this.chartOptions = this.damageValueInit();
                for(let i = 0; i < data.length; i++) {
                    switch(i) {
                        case 0:
                            this.probe1.equipmentName = data[i].equipmentName;
                            this.probe1.serial = data[i].serial;
                            break;
                        case 1:
                            this.probe2.equipmentName = data[i].equipmentName;
                            this.probe2.serial = data[i].serial;
                            break;
                        case 2:
                            this.probe3.equipmentName = data[i].equipmentName;
                            this.probe3.serial = data[i].serial;
                            break;
                        case 3:
                            this.probe4.equipmentName = data[i].equipmentName;
                            this.probe4.serial = data[i].serial;
                            break;
                    }
                }
                for(let i = 0; i < this.chartOptions.legend.data.length; i++) {
                    if(data.length > 0) {
                        this.chartOptions.legend.data[i].name = data[i].equipmentName;
                        this.chartOptions.series[i].name = data[i].equipmentName;
                    }
                }
                // this.chartOptions.series[0].name = data[0].equipmentName;
                // this.chartOptions.series[1].name = data[1].equipmentName;
                // this.chartOptions.series[2].name = data[2].equipmentName;
                // this.chartOptions.series[3].name = data[3].equipmentName;
                this.chartOptions && this.chartContainer.setOption(this.chartOptions)
            }
        },
        // 获取损伤量值的方法
        async getDamageValue(equipmentCode) {
            // const res = await this.$http.post(this.$urlObj.queryProbeInfo,{userCode:getItem("userData").userCode, equipmentCode:equipmentCode});
            // if(res.data.resultCode === "0000") {
        //   let data = res.data.data;
        let data = [{
            damageArr: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,46,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,58,0,0,0,0],
            "encodeWidth":1.5,
            "sensorName":"010000EA",
        },
        {
            damageArr: [1,2,3,4,5,6,7,8,9,10],
            "encodeWidth":1.5,
            "sensorName":"010000EB",
        },
        {
            damageArr: [1,2,3,4,5,6,7,8,9,10],
            "encodeWidth":1.5,
            "sensorName":"010000EC",
        },
        {
            damageArr: [1,2,3,4,5,6,7,8,9,10],
            "encodeWidth":1.5,
            "sensorName":"010000ED",
        },
        ]
          // 有损伤值的位置两侧，进行损伤值衰减
          for(let i = 0; i < data.length; i++) {
            let arr = new Array(data[i].damageArr.length).fill(0);
            let position = ''
            let xData = [];
            let yData = [];
            let color = "";
            for(let j = 0; j < data[i].damageArr.length; j++) {
                position = j;
                arr[position] = data[i].damageArr[j] / 10;
                for(let j = position-1; j > 0; j++) {
                arr[j] = Math.max(arr[j], arr[j+1] >> 1);
                if(arr[j] <= 1) break;
                }
                for(let j = position+1; j < data[i].damageArr.length; j++) {
                arr[j] = Math.max(arr[j], arr[j - 1] >> 1);
                if(arr[j] <= 1) break;
                }
            }
            for(let j = 0; j < arr.length; j++) {
                xData.push(j*data[i].encodeWidth);
                yData.push(arr[j]);
            }
            if(i == 0) {
                color = "#9562F7";
            }
            if(i == 1) {
                color = "#DB754D";
            }
            if(i == 2) {
                color = "#0099FF";
            }
            if(i == 3) {
                color = "#D78400";
            }
            this.containerOptions[data[i].sensorName] = this.optionsInit(xData, yData, color,data[i].sensorName);
            this.containerObj[i].setOption(this.containerOptions[data[i].sensorName]);
            this.containerObj[i].setOption(this.containerOptions[data[i].sensorName]);
            
          }
          
        // }
        },

        // 获取列表数据
        async getListData(equipmentCode, which) {
            const res = await this.$http.post(this.$urlObj.queryEquipMonitorResult,{userCode:getItem("userData").userCode, equipmentCode:equipmentCode});
            if(res.status === 200) {
                let data = res.data.data;
                for(let i = 0; i < data.damageLocationArr.length; i++) {
                    let cache = {};
                    cache.position = data.damageLocationArr[i].damageLocation;
                    cache.value = data.damageLocationArr[i].damageValue * data.encodeWidth;
                    this.tableData[which].push(cache);
                }
            }
            
        },
        // 将返回的数值转换为两位数
        oneToTwo(time) {
            if(time < 10) {
                time = "0"+time;
                return time;
            }else {
                return time;
            }
        },
        // 获取最小值和最大值之间的随机整数的方法
        randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
            case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
            default:
            return 0;
            break;
        }
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/index1.css';
.headerRow {
    width: 100%;
    background-color: #101324;
    height: 70px;
    border-bottom: 2px solid #394D65;
    .logo {
        width: 20%;
        height: 70px;
        margin-left: 20px;
        margin-top: 20px;
        min-width: 347px
    }
    .personCount {
        position: absolute;
        width: 68px;
        right: 0;
        top: 0;
        
    }
    .personWrap {
            width: 300px;
            height: 180px;
            background-color: #232735;
            position: absolute;
            right: 0px;
            top: 70px;
            z-index: 999;
            img {
                width: 40px;
                height: 40px;
                position: absolute;
                left: 20px;
                top: 29px;
            }
            .company {
                position: absolute;
                left: 74px;
                top: 30px;
                color: #758AAA;
            }
            .account {
                position: absolute;
                left: 74px;
                top: 55px;
                color: #758AAA;
            }
            button {
                width: 270px;
                height: 36px;
                background-color: #33394E;
                border: 0;
                color: #758AAA;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: 35px;
            }
        }
}

.searchRow {
    .el-select {
        margin-top: 16px;
        margin-left: 29px;
    }
    .el-button {
        margin-left: 50px;
    }
}


.realTimeCurveRoot {
    width: 100%;
    background-color: #070A1D;
    height: 300px;
    margin-top: 16px;
    .damageTitle {
            color: #fff;
            position: absolute;
            left: 35px;
            top: 18px;
        }
    .realTimeCurveWrap {
        width: 97.91%;
        height: 100%;
        background-color: #1C1F30;
        margin-left: 20px;
        
        
        .realTimeChart {
            width: 87.76%;
            height: 80%;
            background-color: #1C1F30;
            float: left;
            margin-top: 60px;
        }
        .realTimeList {
            width: 12.24%;
            height: 100%;
            background-color: #1C1F30;
            float: left;
        }
        .location {
            width: 10%;
            color: #0099FF;
            position: absolute;
            right: 20%;
            top: 39px;
        }
    }
}

.valueAndListTop {
    height: 304px;
    width: 97.91%;
    margin-top: 19px;
    background-color: #1C1F30;
    margin-left: 20px !important;
    min-width: 1846px;
    .chartTitle {
        color: #fff;
        margin-left: 15px;
        position: absolute;
        top: 16px;
    }
    .topLeftChart {
        height: 80%;
        width: 71.77%;
        background-color: #1C1F30;
        margin-top: 60px;
        float: left;
    }
    .topRightChart {
        height: 80%;
        width: 71.77%;
        background-color: #1C1F30;
        margin-top: 60px;
        float: left;
        
    }
    .topLeftList {
        float: left;
        width: 24.49%;
        height: 256px;
        min-width: 230px;
        margin-top: 24px;
    }
    .topRightList {
        float: left;
        width: 24.49%;
        height: 256px;
        min-width: 230px;
        margin-top: 24px;
    }
    
}

.valueAndListDown {
    width: 97.91%;
    height: 304px;
    background-color: #1C1F30;
    margin-top: 1px;
    margin-left: 20px !important;
    min-width: 1846px;
    .downLeftChart {
        height: 80%;
        width: 71.77%;
        background-color: #1C1F30;
        margin-top: 60px;
        float: left;
    }
    .downRightChart {
        height: 80%;
        width: 71.77%;
        background-color: #1C1F30;
        margin-top: 60px;
        float: left;
    }
    .downLeftList {
        float: left;
        width: 24.49%;
        height: 256px;
        min-width: 230px;
        margin-top: 24px;
    }
    .downRightList {
        float: left;
        width: 24.49%;
        height: 256px;
        min-width: 230px;
        margin-top: 24px;
    }
}

.down {
    height: 100%;
}
</style>