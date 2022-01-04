<template>
  <el-row>
    <el-col style="height: 100%" :span="24">
      <div class="damageValueWrap">
        <div class="title">
          <h4>损伤量值分布</h4>
        </div>
        <div class="barContainer"></div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { getItem } from "../../api/index";
import { eventBus } from "@ai-zen/event-bus";
import * as echarts from "echarts";
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  name: "DamageValue",
  data() {
    return {
      // 柱形图配置数据
      barOptions: {},
      // 图形容器
      barContainer: null,
      // X轴 值
      xData: [],
      // Y轴 值
      yData: [],
    };
  },
  created() {
    // 初始化图表数据
    this.barOptions = this.optionsInit();
    // 获取从全局概览页面跳转过来的设备的图表数据
    this.getEquipDamageValue();
    eventBus.on("queryEquipInfo", (data) => {
      this.currentEquipBarOptions(data.currentEquipCode);
    });
  },
  mounted() {
    let container = document.getElementsByClassName("barContainer")[0];
    this.barContainer = echarts.init(container);
    //   this.barOptions && this.barContainer.setOption(this.barOptions);
    // 监听search组件注册事件，得到设备编码
    //   eventBus.on('queryEquipInfo', data => {
    //     this.currentEquipBarOptions(data.currentEquipCode);
    //   })
  },
  methods: {
    myResize() {
      this.barContainer.resize();
    },
    // 初始化图形数据
    optionsInit() {
      return {
        tooltip: {
          formatter: "",
        },

        grid: {
          right: "86px",
          bottom: "28px",
          left: "30px",
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
            name: "损伤区间(%)",
            nameGap: 20,
            nameLocation: "end",
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: "#B9B9B9", //更改坐标轴文字颜色
            },
            nameTextStyle: {
              //   padding: [0,0,0,678]
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
            // max: 40,
            position: "left",
            nameGap: 16,
            nameTextStyle: {
              color: "#fff",
            },
            // splitNumber: 10,
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

    // 获取由全局概览页面跳转过来的设备的损伤量值
    getEquipDamageValue() {
      if (getItem("equipData")) {
        let equipmentCode = getItem("equipData").equipmentCode;
        this.getDamageValue(equipmentCode);
      }
    },

    // 获取当前设备的损伤量值
    currentEquipBarOptions(equipmentCode) {
      this.xData = [];
      this.yData = [];
      this.barContainer.dispose();
      this.getDamageValue(equipmentCode);
    },

    // 获取损伤量值
    async getDamageValue(equipmentCode) {
      const res = await this.$http.post(this.$urlObj.queryDamageCount, {
        userCode: getItem("userData").userCode,
        equipmentCode: equipmentCode,
      });
      if (res.status === 200) {
        let data = res.data.data;
        this.xData = [];
        this.yData = [];
        for (let i = 0; i < data.length; i++) {
          if (i < data.length - 1) {
            this.xData.push(
              data[i].damageScope + "-" + data[i + 1].damageScope
            );
          } else {
            this.xData.push(
              data[i].damageScope +
                "-" +
                ((1.0 + data.length / 2).toFixed(1) + "%")
            );
          }

          this.yData.push(data[i].damageCount);
        }
        this.barOptions.xAxis[0].data = this.xData;
        this.barOptions.series[0].data = this.yData;
        // 通过回调函数设备tooltip提示框
        this.barOptions.tooltip.formatter = function (params) {
          let str = "";
          str = "损伤区间: " + params.name + "<br />" + "次数: " + params.data;
          return str;
        };
        this.$nextTick(() => {
          let dom = document.getElementsByClassName("barContainer")[0];
          this.barContainer.dispose();
          this.barContainer = echarts.init(dom);
          this.barOptions &&
            unwarp(this.barContainer).setOption(this.barOptions);
        });
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.el-row {
  width: 100%;
  height: 100%;
  .damageValueWrap {
    width: 100%;
    height: 100%;
    padding-top: 2.45%;
    background-color: #1c1f30;
    box-sizing: border-box;
    .title {
      margin-left: 2.45%;
      color: #ffffff;
      h4 {
        font-size: 18px;
      }
    }
    .barContainer {
      width: 100%;
      height: 88.66%;
      margin-top: 18px;
    }
  }
}
</style>