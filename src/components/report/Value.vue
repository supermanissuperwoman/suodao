<template>
  <div class="rootValue">
    <div class="valueTitle">损伤量值分布</div>
    <div class="valueContainer"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getItem } from "../../api/index";
import { eventBus } from "@ai-zen/event-bus";
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  data() {
    return {
      // 图表数据
      chartOptions: {},
      // 图表容器
      chartContainer: null,
      // x轴数据
      xData: [],
      // y轴数据
      yData: [],
    };
  },
  created() {
    eventBus.on("getCode", (data) => {
      if (!data.isWeekDisable) {
        // this.chartContainer.dispose();
        this.getDamageOptions(data.currentEquipCode, data.reportDate);
      }
    });
    this.chartOptions = this.optionsInit();
  },
  mounted() {
    let container = document.getElementsByClassName("valueContainer")[0];
    this.chartContainer = echarts.init(container);
    // this.chartOptions && this.chartContainer.setOption(this.chartOptions);
  },
  methods: {
    myResize() {
      if (this.chartContainer) {
        this.chartContainer.resize();
      }
    },
    // 初始化图表数据
    optionsInit() {
      return {
        tooltip: {
          formatter: "",
        },

        grid: {
          right: "75px",
          bottom: "10%",
          left: "30px",
          top: "14%",
        },
        toolbox: {
          feature: {
            dataZoom: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            name: "损伤区间(%)",
            nameGap: 8,
            nameLocation: "end",
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: "#fff", //更改坐标轴文字颜色
            },
            nameTextStyle: {
              color: "#fff",
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "f (次数)",
            min: 0,
            position: "left",
            nameTextStyle: {
              color: "#fff",
            },
            nameGap: 20,
            axisLine: {
              show: false,
              lineStyle: {
                color: "#B9B9B9",
              },
            },
            splitLine: {
              //分割线配置
              show: true,
              lineStyle: {
                color: "#292B3D",
              },
            },
            axisLabel: {
              formatter: "{value}",
              color: "#FFF",
            },
          },
        ],
        series: [
          {
            type: "bar",
            yAxisIndex: 0,
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#00e5e2" },
                { offset: 1, color: "#00b5b3" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#00b5b3" },
                  { offset: 1, color: "#00e5e2" },
                ]),
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#CCCCCC",
              },
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
      };
    },

    // 获取损伤值数据
    async getDamageOptions(equipmentCode, reportDate) {
      this.xData = [];
      this.yData = [];
      const res = await this.$http.post(this.$urlObj.queryImage, {
        equipmentCode: equipmentCode,
        reportDate: reportDate,
      });
      if (res.data.resultCode === "0000") {
        let dom = document.getElementsByClassName("valueContainer")[0];
        let data = res.data.data;
        this.xData = data.damageCountXArr;
        this.yData = data.damageCountArr;
        this.chartOptions.xAxis[0].data = this.xData;
        this.chartOptions.series[0].data = this.yData;
        // 通过回调函数设备tooltip提示框
        this.chartOptions.tooltip.formatter = function(params) {
          let str = "";
          str = "损伤区间: " + params.name + "<br />" + "次数: " + params.data;
          return str;
        };
        this.$nextTick(() => {
          let dom = document.getElementsByClassName("valueContainer")[0];
          // 销毁echarts实例
          this.chartContainer.dispose();
          this.chartContainer = echarts.init(dom);
          unwarp(this.chartContainer).setOption(this.chartOptions);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rootValue {
  width: 100%;
  height: 100%;
  padding-top: 10px;
  box-sizing: border-box;
  background-color: #1c1f30;
  .valueTitle {
    color: #ffffff;
    margin-left: 17px;
    font-size: 18px;
    font-weight: bold;
  }
  .valueContainer {
    height: 81.25%;
    // min-height: 378px;
    width: 100%;
    background-color: #1c1f30;
  }
}
</style>
