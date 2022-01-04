<template>
  <div class="statusRootWrap">
    <div class="title">设备状态概览</div>
    <div class="stateUpdateTime">评估时间:{{assessTime}}</div>
    <div class="pieRootWrap" style="display:none;">
    </div>
    <div class="fenkai" style="display:block;">
      <div class="pieOne"></div>
      <div class="pieTwo"></div>
      <div class="pieThree"></div>
      <div class="pieFour"></div>
      <div class="pieFive"></div>
    </div>
  </div>  
</template>

<script>
import * as echarts from "echarts";
import {getItem} from "../../api/index"
export default {
  name: "StateOverview",
  data() {
    return {
      // 图表设置数据
      chartOption: {},
      // 状态文字(健康,轻度,中度,重度,超限)提示开关
      statusTxtShow: false,
      // 风险等级数据
      riskLevel: {},
      // 初始化图表的容器
      healthChart: '',

      oneChart: null,
      twoChart: null,
      threeChart: null,
      fourChart: null,
      fiveChart: null,
      // 评估时间
      assessTime: ""
    };
  },
  async created() {
    let data = { userCode: getItem("userData").userCode };
    // 获取风险等级数据
    this.initPieData(data);
  },
  watch: {
    chartOption() {
      this.$nextTick(() => {
        // this.chartOption && this.healthChart.setOption(this.chartOption);
        this.oneChart.setOption(this.getHealthOption(this.riskLevel))
      this.twoChart.setOption(this.getSmallOption(this.riskLevel))
      this.threeChart.setOption(this.getMiddleOption(this.riskLevel))
      this.fourChart.setOption(this.getHeavyOption(this.riskLevel))
      this.fiveChart.setOption(this.getOutOption(this.riskLevel))
      })
    }
  },
  mounted() { 
    this.$nextTick(() => {
      this.pieEchart();
      this.statusTxtShow = true;
    });
  },
  methods: {
    myResize() {
      this.oneChart.resize();
      this.twoChart.resize();
      this.threeChart.resize();
      this.fourChart.resize();
      this.fiveChart.resize();
    },
    // 初始化环形图
    pieEchart() {
      let oneChartDom = document.getElementsByClassName("pieOne")[0];
      let twoChartDom = document.getElementsByClassName("pieTwo")[0];
      let threeChartDom = document.getElementsByClassName("pieThree")[0];
      let fourChartDom = document.getElementsByClassName("pieFour")[0];
      let fiveChartDom = document.getElementsByClassName("pieFive")[0];
      this.oneChart = echarts.init(oneChartDom);
      this.twoChart = echarts.init(twoChartDom);
      this.threeChart = echarts.init(threeChartDom);
      this.fourChart = echarts.init(fourChartDom);
      this.fiveChart = echarts.init(fiveChartDom);
      // 获取容器初始化的数据
      this.oneChart.setOption(this.getHealthOption(this.riskLevel))
      this.twoChart.setOption(this.getSmallOption(this.riskLevel))
      this.threeChart.setOption(this.getMiddleOption(this.riskLevel))
      this.fourChart.setOption(this.getHeavyOption(this.riskLevel))
      this.fiveChart.setOption(this.getOutOption(this.riskLevel))
    },
    // 初始化环形图状态数据
    async initPieData(reqData) {
      let healthNum = 0;
      let lightNum = 0;
      let middleNum = 0;
      let severeNum = 0;
      let overrunNum = 0;
      const {data: res} = await this.$http.post(this.$urlObj.queryEquip, reqData);
      if(res.resultMessage === 'Success') {
        let data = res.data;
        if(data.length > 0) {
          this.assessTime = data[0].assessTime
        }
        data.forEach(item => {
          if(item.riskLevel == 0) {
            healthNum += 1;
          }else if(item.riskLevel == 1) {
            lightNum += 1;
          }else if(item.riskLevel == 2) {
            middleNum += 1;
          }else if(item.riskLevel == 3) {
            severeNum += 1;
          }else {
            overrunNum += 1;
          }
        });
        this.riskLevel.healthLeval = Math.round(((healthNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.lightLeval = Math.round(((lightNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.middleLeval = Math.round(((middleNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.severeLeval = Math.round(((severeNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.overrunLeval = Math.round(((overrunNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.healthNum = healthNum;
        this.riskLevel.lightNum = lightNum;
        this.riskLevel.middleNum = middleNum;
        this.riskLevel.severeNum = severeNum;
        this.riskLevel.overrunNum = overrunNum;
        this.riskLevel.length = data.length;
        this.oneChart.setOption(this.getHealthOption(this.riskLevel))
      this.twoChart.setOption(this.getSmallOption(this.riskLevel))
      this.threeChart.setOption(this.getMiddleOption(this.riskLevel))
      this.fourChart.setOption(this.getHeavyOption(this.riskLevel))
      this.fiveChart.setOption(this.getOutOption(this.riskLevel))
      }
    },
    // 获取单个项目的所有设备的状态数据
    async getOneProjectState(params) {
      let healthNum = 0;
      let lightNum = 0;
      let middleNum = 0;
      let severeNum = 0;
      let overrunNum = 0;
      const {data: res} = await this.$http.post(this.$urlObj.queryEquip, { userCode: getItem("userData").userCode, projectCode: params.projectCode})
      if(res.resultMessage == 'Success') {
        let data = res.data;
        if(res.data.length) {
          res.data.forEach(item => {
          if(item.riskLevel == 0) {
            healthNum += 1;
          }else if(item.riskLevel == 1) {
            lightNum += 1;
          }else if(item.riskLevel == 2) {
            middleNum += 1;
          }else if(item.riskLevel == 3) {
            severeNum += 1;
          }else {
            overrunNum += 1;
          }
        });
        this.riskLevel.healthLeval = Math.round(((healthNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.lightLeval = Math.round(((lightNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.middleLeval = Math.round(((middleNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.severeLeval = Math.round(((severeNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.overrunLeval = Math.round(((overrunNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.healthNum = healthNum;
        this.riskLevel.lightNum = lightNum;
        this.riskLevel.middleNum = middleNum;
        this.riskLevel.severeNum = severeNum;
        this.riskLevel.overrunNum = overrunNum;
        this.riskLevel.length = data.length;
        this.oneChart.setOption(this.getHealthOption(this.riskLevel))
        this.twoChart.setOption(this.getSmallOption(this.riskLevel))
        this.threeChart.setOption(this.getMiddleOption(this.riskLevel))
        this.fourChart.setOption(this.getHeavyOption(this.riskLevel))
        this.fiveChart.setOption(this.getOutOption(this.riskLevel))
        } else {
        this.riskLevel.healthLeval = '0%';
        this.riskLevel.lightLeval = '0%';
        this.riskLevel.middleLeval = '0%';
        this.riskLevel.severeLeval = '0%';
        this.riskLevel.overrunLeval = '0%';
        this.chartOption.series.forEach(item => {
          item.name = '其他';
          item.data = [{ value: 0, itemStyle: {color: '#DAE1E9'}}];
        })
        this.oneChart.setOption(this.getHealthOption(this.riskLevel))
        this.twoChart.setOption(this.getSmallOption(this.riskLevel))
        this.threeChart.setOption(this.getMiddleOption(this.riskLevel))
        this.fourChart.setOption(this.getHeavyOption(this.riskLevel))
        this.fiveChart.setOption(this.getOutOption(this.riskLevel))
      }
      }
    },
    // 获取所有项目的所有设备的状态数据
    async getAllProjectState(projectGroup) {
      let healthNum = 0;
      let lightNum = 0;
      let middleNum = 0;
      let severeNum = 0;
      let overrunNum = 0;
      const {data: res} = await this.$http.post(this.$urlObj.queryEquip, { userCode: getItem("userData").userCode})
      if(res.resultMessage === 'Success') {
        let data = res.data;
        data.forEach(item => {
          if(item.riskLevel == 0) {
            healthNum += 1;
          }else if(item.riskLevel == 1) {
            lightNum += 1;
          }else if(item.riskLevel == 2) {
            middleNum += 1;
          }else if(item.riskLevel == 3) {
            severeNum += 1;
          }else {
            overrunNum += 1;
          }
        });
        
        this.riskLevel.healthLeval = Math.round(((healthNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.lightLeval = Math.round(((lightNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.middleLeval = Math.round(((middleNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.severeLeval = Math.round(((severeNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.overrunLeval = Math.round(((overrunNum / data.length) * 10000)/100).toFixed(0) + '%';
        this.riskLevel.healthNum = healthNum;
        this.riskLevel.lightNum = lightNum;
        this.riskLevel.middleNum = middleNum;
        this.riskLevel.severeNum = severeNum;
        this.riskLevel.overrunNum = overrunNum;
        this.riskLevel.length = data.length;
      }
      this.oneChart.setOption(this.getHealthOption(this.riskLevel))
      this.twoChart.setOption(this.getSmallOption(this.riskLevel))
      this.threeChart.setOption(this.getMiddleOption(this.riskLevel))
      this.fourChart.setOption(this.getHeavyOption(this.riskLevel))
      this.fiveChart.setOption(this.getOutOption(this.riskLevel))
    },
    // 获取健康图标的数据
    getHealthOption(riskLevel) {
      return {
        tooltip: {
          trigger: "item",
        },
        title: {
          text: '健康',
          textStyle:{
            color:'#fff',
            fontSize: 12,
            fontWeight: 'normal'
          },
          left: 'center',
          top:'80%'
        },
        media:[{
          query:{minWidth: 100},
          option: {title:{
            top: 'bottom'
          }},
        },
        {option:{title:{top:'80%'}}}
        ],
        series: [
          {
            name: '健康',
            type: "pie",
            radius: ["80%", "90%"],
            label: {
              show: true,
              position: "center",
              formatter: function(a) {
                return a.percent.toFixed(0)+'%';
              },
              // formatter: '{d}%',
              color: '#fff',
              fontSize: '14px'
            },
            center: ['50%','50%'],
            // 取消环形图事件
            silent: true,
            labelLine: {
              show: false,
            },
            data: riskLevel.healthNum > 0 ? [{value: riskLevel.healthNum,  itemStyle: {color: '#35C78C'},
            label:{show:true,color:'#fff',fontSize:'14px'}}, 
            { value: riskLevel.length - riskLevel.healthNum, itemStyle: {color: '#DAE1E9'}}]:
            [{ value: 0 ,itemStyle: {color: '#DAE1E9'},label:{show:true,color:'#fff',fontSize:'14px'}}],
          },
        ]
      }
    },
    getSmallOption(riskLevel) {
      return {
        tooltip: {
          trigger: "item",
        },
       title: {
          text: '轻度',
          textStyle:{
            color:'#fff',
            fontSize: 12,
            fontWeight: 'normal'
          },
          left: 'center',
          top:'80%'
        },
        media:[{
          query:{minWidth: 100},
          option: {title:{
            top: 'bottom'
          }},
        },
        {option:{title:{top:'80%'}}}
        ],
        series:[
          {
            name: "轻度",
            // name: riskLevel.lightNum > 0 ? "轻度" : "其他",
            type: "pie",
            radius: ["80%", "90%"],
            label: {
              show: true,
              position: "center",
              formatter: function(a) {
                return a.percent.toFixed(0)+'%';
              },
              color: '#fff',
              fontSize: '14px'
            },
            silent: true,
            color: ["#35C78C", "red"],
            labelLine: {
              show: false,
            },
            data: riskLevel.lightNum > 0 ? [
              { value: riskLevel.lightNum,selected:true,itemStyle: {color: '#8bd26c'}}, 
              { value: riskLevel.length - riskLevel.lightNum ,itemStyle: {color: '#DAE1E9'},label:{show:false}}
              ]
            :[{ value: 0 ,itemStyle: {color: '#DAE1E9'}}],
          },
        ]
      }
    },
    getMiddleOption(riskLevel) {
      return {
        tooltip: {
          trigger: "item",
        },
        title: {
          text: '中度',
          textStyle:{
            color:'#fff',
            fontSize: 12,
            fontWeight: 'normal'
          },
          left: 'center',
          top:'80%'
        },
        media:[{
          query:{minWidth: 100},
          option: {title:{
            top: 'bottom'
          }},
        },
        {option:{title:{top:'80%'}}}
        ],
        series:[
          {
            name:"中度",
            // name:riskLevel.middleNum > 0 ? "中度" : "其他",
            type: "pie",
            radius: ["80%", "90%"],
            label: {
              show: true,
              position: "center",
              formatter: function(a) {
                return a.percent.toFixed(0)+'%';
              },
              color: '#fff',
              fontSize: '14px'
            },
            silent: true,
            color: ["#35C78C", "#DAE1E9"],
            labelLine: {
              show: false,
            },
            data: riskLevel.middleNum > 0 ? [{ value: riskLevel.middleNum,itemStyle: {color: '#f79f3d'}}, 
            { value: riskLevel.length-riskLevel.middleNum,itemStyle: {color: '#DAE1E9'},label:{show:false} }]:
            [{ value: 0,itemStyle: {color: '#DAE1E9'},label:{show:true,color:'#fff',fontSize:'14px'} }],
          },
        ]
        
        
    }
    
    
    },
    getHeavyOption(riskLevel) {
      return {
        tooltip: {
          trigger: "item",
        },
        title: {
          text: '重度',
          textStyle:{
            color:'#fff',
            fontSize: 12,
            fontWeight: 'normal'
          },
          left: 'center',
          top:'80%'
        },
        media:[{
          query:{minWidth: 100},
          option: {title:{
            top: 'bottom'
          }},
        },
        {option:{title:{top:'80%'}}}
        ],
        series:[
          {
            name:"重度",
            // name: riskLevel.lightNum > 0 ? "重度" : "其他",
            type: "pie",
            radius: ["80%", "90%"],
            label: {
              show: true,
              position: "center",
              formatter: function(a) {
                return a.percent.toFixed(0)+'%';
              },
              color: '#fff',
              fontSize: '14px'
            },
            silent: true,
            color: ["#35C78C", "#DAE1E9"],
            labelLine: {
              show: false,
            },
            data: riskLevel.severeNum>0?[{ value: riskLevel.severeNum,itemStyle: {color: '#f8de42'}}, 
            { value: riskLevel.length-riskLevel.severeNum,itemStyle: {color: '#DAE1E9'},label:{show:false}}]:
            [{ value: 0,itemStyle: {color: '#DAE1E9'},label:{show:true,color:'#fff',fontSize:'14px'} }],
          },
        ]
      }
    },
    getOutOption(riskLevel) {
      return {
        tooltip: {
          trigger: "item",
        },
        title: {
          text: '超限',
          textStyle:{
            color:'#fff',
            fontSize: 12,
            fontWeight: 'normal'
          },
          left: 'center',
          top:'80%'
        },
        media:[{
          query:{minWidth: 100},
          option: {title:{
            top: 'bottom'
          }},
        },
        {option:{title:{top:'80%'}}}
        ],
        series:[
          {
            name: "超限",
            // name: riskLevel.lightNum > 0 ? "超限" : "其他",
            type: "pie",
            radius: ["80%", "90%"],
            label: {
              show: true,
              position: "center",
              formatter: function(a) {
                return a.percent.toFixed(0)+'%';
              },
              color: '#fff',
              fontSize: '14px'
            },
            silent: true,
            color: ["#35C78C", "#DAE1E9"],
            labelLine: {
              show: false,
            },
            data: riskLevel.overrunNum>0?[{ value: riskLevel.overrunNum,itemStyle: {color: '#f54b36'}}, 
            { value: riskLevel.length-riskLevel.overrunNum,itemStyle: {color: '#DAE1E9'},label:{show:false} }]:
            [{ value: 0,itemStyle: {color: '#DAE1E9'},label:{show:true,color:'#fff',fontSize:'14px'} }],
          },
        ]
      }
    }

  },
};
</script>

<style lang="scss" scoped>
.statusRootWrap {
  position: relative;
  height: 100%;
  width: 100%;
  .title {
    position: absolute;
    left: 18px;
    top: 18px;
    height: 18px;
    font-size: 18px;
    line-height: 16px;
    font-weight: 600;
    color: #fff;
  }
  .stateUpdateTime {
    color: #555C7E;
    position: absolute;
    right: 16px;
    top: 21px;
    font-size: 14px;
  }
  @media screen and (min-width:500px) {
      .stateUpdateTime {
        font-size: 16px;
      }
    }
  .pieRootWrap {
    width: 89.47%;
    height: 80%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .commonStyle {
      width: 120px;
      height: 120px;
      float: left;
      margin-left: 20px;
    }
    .healthy {
      margin-left: 0;
    }
  }
  .fenkai {
    width: 89.47%;
    height: 80%;
    position: absolute;
    left: 50%;
    top: 55%;
    transform: translate(-50%,-50%);
    // z-index: 999;
    div {
      width: 20%;
      height: 100%;
      float: left;
    }
    div:nth-child(2n+1) {
    }
  }
  .stateText {
    position: absolute;
    left: 0;
    top: 232px;
    padding-left: 13px;
    li {
      float: left;
      margin-left: 64px;
      margin-right: 41px;
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }
  }
  .common {
    color:#E8E8E8;
    font-size: 24px;
    position: absolute;
     top: 147px;
  }
  .health {
   
    left: 80px;
  }
  .light {
    left: 220px;
  }
  .middle {
    left: 352px;
  }
  .hard {
    left: 492px;
  }
  .overrun {
    left: 630px;
  }
}

</style>
