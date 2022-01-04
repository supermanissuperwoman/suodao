<template>
  <div id="rootContainerTime">
      <div class="titleTextTime">平均运行时间&里程</div>
      <div class="chartTimeContainer"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { eventBus } from '@ai-zen/event-bus';
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  name: 'MileageTime',
  data() {
    return {
      // 图表容器
      chartContainer: null,
      // 图表数据
      chartOptions: {},
      // x轴数据
      xData: [],
      // 柱形图y轴数据
      yDataPillar: [],
      // 折线图y轴数据
      yDataLine: [],
      // 项目编号
      projectCode: '',
      // 选择日期
      reportDate: ''
    }
  },
  created() {
    eventBus.on('getCode', (data) => {
      this.projectCode = data.currentProjectCode;
      this.reportDate = data.reportDate;
      if(data.isWeekDisable) {
        this.getImageData(this.projectCode,this.reportDate);
      }
    })
},
  mounted() {
    let dom = document.getElementsByClassName("chartTimeContainer")[0];
    this.chartContainer = echarts.init(dom);
  },
  watch: {
    chartOptions() {
      this.$nextTick(() => {
        let dom = document.getElementsByClassName('chartTimeContainer')[0];
        this.chartContainer.dispose();
        this.chartContainer = echarts.init(dom)
        this.chartOptions && unwarp(this.chartContainer).setOption(this.chartOptions);
      })
    }
  },
  methods: {
    myResize() {
      this.chartContainer.resize();
    },
    // 请求数据
    async getImageData(projectCode,reportDate) {
      const res = await this.$http.post(this.$urlObj.queryImageContent,{
        projectCode: projectCode,
        reportDate: reportDate
      });
      if(res.status === 200 && res.data.resultCode == "0000") {
        this.xData = [];
        this.yDataPillar = [];
        this.yDataLine = [];
        if(res.data.hasOwnProperty("data") && res.data.data) {
          this.xData = res.data.data.dateStringArr;
          this.yDataPillar = res.data.data.runningDistanceArr;
          this.yDataLine = res.data.data.runningTimeArr;
        }
        this.chartOptions = this.initChartOptions(this.xData, this.yDataPillar,this.yDataLine);
      }
    },
    // 初始化图表数据
    initChartOptions(xData, yDataPillar, yDataLine) {
      return {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line'
        }
    },
    grid: {
        right: '65px',
        top:'20%',
        left: '40px',
        bottom: '14%'
    },
    toolbox: {
        feature: {
            dataView: {show: false, readOnly: false},
            dataZoom: {show: true},
        },
        top: "-8px"
    },
    legend: {
        top: "5%",
        right: "32%",
        orient:'vertical',
        // itemWidth: 4,
        itemHeight:6,
        itemGap:5,
        data: [{
          name: '平均运行里程(km)',
          textStyle:{
            color:'#fff',
            fontSize: '10px'
          },
          itemStyle: {
            borderWidth: '10'
          }
        },
        {
          name: '平均运行时间(h)',
          textStyle:{
            color:'#fff',
            fontSize: '10px'
          },
          // icon: "circle",
        }]
    },
    xAxis: [
        {
            type: 'category',
            name: '日期',
            nameTextStyle: {
              color: '#fff',
            },
            nameGap: 40,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
              color: '#fff'
            },
            data: xData,
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '平均运行里程(km)',
            min: 0,
            // max: 250,
            position: 'right',
            splitLine: {//分割线配置
                    show:false,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    // color: 'blue'
                }
            },
            axisLabel: {
                formatter: '{value} km',
                color: '#fff'
            },
            nameTextStyle: {
              color: '#fff'
            },
            
        },
        {
            type: 'value',
            name: '平均运行时间(h)',
            // value:[0,10,20,30,40],
            position: 'left',
            axisLine: {
                show: true,
                lineStyle: {
                    // color: 'red'
                }
            },
            axisLabel: {
                formatter: '{value}h',
                color: '#fff'
            },
            nameLocation: 'end',
            nameTextStyle: {
              color: '#fff',
              padding: [0,0,0,40]
            },
        }
    ],
    series: [
        {
            name: '平均运行里程(km)',
            type: 'bar',
            itemStyle:{
              color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#83bff6'},
                        {offset: 0.5, color: '#188df0'},
                        {offset: 1, color: '#188df0'}
                    ]
                ),
            },
            barWidth:10,
            data: yDataPillar
        },
        {
            name: '平均运行时间(h)',
            type: 'line',
            yAxisIndex: 1,
            itemStyle:{color:'#9562F7'},
            lineStyle: {
              color: '#9562F7'
            },
            data: yDataLine
        }
    ]
};
    }
  }
}
</script>

<style lang="scss" scoped>
  #rootContainerTime {
    width: 100%;
    height: 100%;
    background-color: #1C1F30;
    padding-top: 10px;
    box-sizing: border-box;
    .titleTextTime {
      margin-left: 2%;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
    }
    .chartTimeContainer {
      width: 100%;
      height: 92.2%;
    }
    
  }
</style>