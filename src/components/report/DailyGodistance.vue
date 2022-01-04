<template>
  <div class="rootDistance">
    <div class="distanceTitle">当日运行里程</div>
    <div class="distanceContainer"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { eventBus } from "@ai-zen/event-bus";
import { getItem } from "../../api/index";
import { number } from "echarts";
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  name: "GoDistance",
  data() {
    return {
      //   图表容器
      container: null,
      // 图表数据
      chartOptions: {},
      // X轴坐标值
      xdata: [],
      // Y轴坐标值
      ydata: [],
    };
  },
  created() {
    eventBus.on("getCode", (data) => {
      if (!data.isWeekDisable) {
        // this.chartContainer.dispose();
        this.getDistanceOptions(data.currentEquipCode, data.reportDate);
      }
    });
    this.chartOptions = this.getOptions();
  },
  mounted() {
    let container = document.getElementsByClassName("distanceContainer")[0];
    this.container = echarts.init(container);
  },
  methods: {
    myResize() {
      if (this.container) {
        this.container.resize();
      }
    },
    //   获取图表数据
    async getDistanceOptions(currentEquipCode, reportDate) {
      const res = await this.$http.post(this.$urlObj.queryImage, {
        equipmentCode: currentEquipCode,
        reportDate,
      });
      if (res.status === 200) {
        this.xdata = [];
        this.ydata = [];
        let data = res.data.data.runningDistanceList;
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          this.xdata.push(data[i].time);
          this.ydata.push(data[i].runningDistance);
          sum += parseFloat(data[i].runningDistance);
        }
        this.chartOptions.xAxis[0].data = this.xdata;
        this.chartOptions.series[0].data = this.ydata;
        // 通过回调函数设置tooltip提示框
        this.chartOptions.tooltip.formatter = function(params) {
          let str = "";
          str =
            "时间: " +
            params.name +
            "<br />" +
            "运行里程: " +
            params.data +
            "km" +
            "<br />" +
            "运行里程/总里程: " +
            ((params.data / sum) * 100).toFixed(2) +
            "%";
          return str;
        };
        this.$nextTick(() => {
          let dom = document.getElementsByClassName("distanceContainer")[0];
          this.container.dispose();
          this.container = echarts.init(dom);
          this.chartOptions &&
            unwarp(this.container).setOption(this.chartOptions);
        });
      }
    },
    // 图表初始化数据
    getOptions() {
      return {
        color: ["#5470C6", "#91CC75", "#EE6666"],

        tooltip: {
          formatter: "",
        },
        grid: {
          right: "50px",
          bottom: "26px",
          left: "50px",
          top: "12%",
        },
        toolbox: {
          feature: {
            dataZoom: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            name: "时间(h)",
            nameGap: 8,
            nameLocation: "end",
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: "#B9B9B9", //更改坐标轴文字颜色
            },
            nameTextStyle: {
              // padding: [0,0,0,650]
              color: "#fff",
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            data: [
              "01:00",
              "02:00",
              "03:00",
              "04:00",
              "05:00",
              "06:00",
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
              "20:00",
              "21:00",
              "22:00",
              "23:00",
              "24:00",
            ],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "运行里程(km)",
            min: 0,
            // max: 2,
            splitNumber: 10,
            position: "left",
            nameTextStyle: {
              color: "#fff",
            },
            splitLine: {
              //分割线配置
              show: true,
              lineStyle: {
                color: "#292B3D",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#B9B9B9",
              },
            },
            axisLabel: {
              formatter: "{value}km",
            },
          },
        ],
        series: [
          {
            name: "运行里程",
            type: "bar",
            yAxisIndex: 0,
            data: this.ydata,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" },
                ]),
              },
            },
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.rootDistance {
  width: 100%;
  height: 100%;
  padding-top: 10px;
  box-sizing: border-box;
  background-color: #1c1f30;
  .distanceTitle {
    color: #ffffff;
    margin-left: 17px;
    font-size: 18px;
    font-weight: bold;
  }
  .distanceContainer {
    height: 81.25%;
    // min-height: 378px;
    width: 100%;
    background-color: #1c1f30;
  }
}
</style>
