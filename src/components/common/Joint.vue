<template>
  <div class="jointRootWrap">
    <div class="jointTitle">接头区长度变化趋势</div>
    <div class="jointPercentageWrap"></div>
  </div>
</template>

<script>
import { eventBus } from "@ai-zen/event-bus";
import { getItem } from "../../api";
import * as echarts from "echarts";
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  name: "Joint",
  data() {
    return {
      // 图表容器
      echartContainer: null,
      // 图标数据
      echartOptions: {},
      // 横坐标数据
      xData: [],
      // 纵坐标数据
      yData: [],
    };
  },
  created() {
    this.echartOptions = this.initEchartOptions();
    // 更新设备损伤监测结果数据
    this.getEquipDamageOptions();
  },
  mounted() {
    let dom = document.getElementsByClassName("jointPercentageWrap")[0];
    this.echartContainer = echarts.init(dom);
    eventBus.on("getCode", (data) => {
      this.currentEquipDamageOptions(data.currentEquipCode);
    });
  },

  methods: {
    myResize() {
      this.echartContainer.resize();
    },
    // 初始化图表数据
    initEchartOptions() {
      return {
        xAxis: {
          type: "category",
          name: "接头区长度(cm)",
          nameTextStyle: {
            color: "#FFFFFF",
            fontSize: 14,
            // padding: [0,0,0,1040]
          },
          nameGap: 5,
          data: this.xData,
          axisLabel: {
            color: "#B9B9B9",
          },
          nameLocation: "end",
          axisLine: {
            lineStyle: {
              color: "#292B3D",
            },
          },
          axisTick: {
            show: true,
          },
        },

        yAxis: {
          type: "value",
          name: "长度变化百分比（%）",
          nameTextStyle: {
            color: "#FFFFFF",
            fontSize: 14,
            padding: [0, 0, 0, 70],
          },
          axisLabel: {
            interval: 5,
            formatter: "{value} %",
            color: "#B9B9B9",
          },
          splitLine: {
            //分割线配置
            show: true,
            lineStyle: {
              color: "#292B3D",
            },
          },
          max: 50,
        },
        grid: {
          top: "30px",
          left: "45px",
          right: "105px",
          bottom: "20px",
        },
        series: [
          {
            data: this.yData,
            type: "line",
            smooth: true,
            symbol: "none",
            color: "#47AEEE",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(129, 67, 170, 0.4)",
                },
                {
                  offset: 1,
                  color: "rgba(28, 31, 48, 0.4)",
                },
              ]),
            },
            markLine: {
              silent: false,
              data: [
                {
                  type: "average",
                  yAxis: 17,
                },
              ],
              label: {
                show: true,
                color: "#C93A59",
                fontStyle: "normal",
                formatter: "{c}%",
                position: "end",
              },
              lineStyle: {
                color: "#C93A59",
              },
            },
          },
        ],
        tooltip: {
          show: true,
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
          formatter: "损伤位置:{b0}<br />损伤值:{c0}",
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            dataView: {
              show: false,
              readOnly: false,
            },
          },
        },
      };
    },
    // 获取从全局概览界面跳转过来的设备的损伤值
    getEquipDamageOptions() {
      if (getItem("equipData")) {
        let equipmentCode = getItem("equipData").equipmentCode;
        // 请求数据
        this.getDamageValue(equipmentCode);
      }
    },
    // 获取当前设备损伤值
    currentEquipDamageOptions(equipmentCode) {
      this.xData = [];
      this.yData = [];
      // 销毁echarts实例
      this.echartContainer.dispose();
      // 请求数据
      this.getDamageValue(equipmentCode);
    },
    // 获取设备损伤值
    async getDamageValue(equipmentCode) {
      const res = await this.$http.post(this.$urlObj.queryEquipMonitorResult, {
        userCode: getItem("userData").userCode,
        equipmentCode: equipmentCode,
      });
      if (res.status === 200) {
        this.xData = [];
        this.yData = [];
        let data = res.data.data;
        // 有损伤值的位置两侧，进行损伤值衰减
        let arr = new Array(data.monitorMaxlength).fill(0);
        let position = "";
        for (let i = 0; i < data.damageLocationArr.length; i++) {
          position = data.damageLocationArr[i].damageLocation;
          arr[position] = data.damageLocationArr[i].damageValue / 10;
          for (let i = position - 1; i > 0; i++) {
            arr[i] = Math.max(arr[i], arr[i + 1] >> 1);
            if (arr[i] <= 1) break;
          }
          for (let i = position + 1; i < data.monitorMaxlength; i++) {
            arr[i] = Math.max(arr[i], arr[i - 1] >> 1);
            if (arr[i] <= 1) break;
          }
        }
        for (let i = 0; i < arr.length; i++) {
          this.xData.push(i * data.encodeWidth);
          this.yData.push(arr[i]);
        }
        this.echartOptions.xAxis.data = this.xData;
        this.echartOptions.series[0].data = this.yData;
        this.$nextTick(() => {
          let dom = document.getElementsByClassName("jointPercentageWrap")[0];
          if (dom) {
            // 重新初始化echarts实例
            this.echartContainer = echarts.init(dom);
            // this.damageResultOptions && unwarp(this.container).setOption(this.damageResultOptions);
            unwarp(this.echartContainer).setOption(this.echartOptions);
          }
        });
        // this.damageResultOptions && unwarp(this.container).setOption(this.damageResultOptions);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.jointRootWrap {
  width: 100%;
  height: 100%;
  padding-top: 18px;
  background-color: #1c1f30;
  .jointTitle {
    color: #fff;
    font-weight: bold;
    font-size: 18px;
    padding-left: 2.45%;
  }
  .jointPercentageWrap {
    width: 100%;
    height: 80.5%;
    margin-top: 18px;
    box-sizing: border-box;
  }
}
</style>
