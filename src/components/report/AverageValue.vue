<template>
  <div id="rootContainerValue">
    <div class="titleTextValue">平均损伤值</div>
    <div class="chartContainer"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { eventBus } from "@ai-zen/event-bus";
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  name: "AverageValue",

  data() {
    return {
      // 图表容器
      chartContainer: null,
      // 图表数据
      chartOptions: {},
      // 横坐标数据
      xData: [],
      // 纵坐标数据
      yData: [],
      // 项目编号
      projectCode: "",
      // 选择日期
      reportDate: "",
      // 请求的数据
      resData: [],
    };
  },

  mounted() {
    let dom = document.getElementsByClassName("chartContainer")[0];
    this.chartContainer = echarts.init(dom);
  },

  methods: {
    myResize() {
      this.chartContainer.resize();
    },
    // 初始化图表数据
    initOptions(xData, yData, nullFlag) {
      return {
        xAxis: {
          name: "日期",
          type: "category",
          nameLocation: "end",
          nameTextStyle: {
            color: "#fff",
          },
          data: xData,
          axisLabel: { color: "#d7d7d7" },
          nameLocation: "end",
          boundaryGap: false,
        },
        yAxis: {
          name: "平均损伤值(%)",
          nameTextStyle: { color: "#fff" },
          type: "value",
          max: 50,
          axisLabel: {
            interval: 5,
            formatter: "{value}%",
            color: "#fff",
            fontSize: 14,
          },
          splitLine: {
            //分割线配置
            show: true,
            lineStyle: {
              color: "#292B3D",
            },
          },
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
        grid: {
          top: "18%",
          left: "45px",
          bottom: "10%",
          right: "12%",
        },
        series: [
          {
            data: yData,
            type: "line",
            smooth: true,
            symbol: "none",
            color: "#3158FF",
            lineStyle: {
              width: nullFlag ? 0 : 2,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(0,207,255,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(28,31,48,0.3)",
                },
              ]),
            },
          },
        ],
        tooltip: {
          show: nullFlag ? false : true,
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
        },
      };
    },
    // 请求数据
    async getImageData(projectCode, reportDate, standardDate) {
      const res = await this.$http.post(this.$urlObj.queryImageContent, {
        projectCode: projectCode,
        reportDate: reportDate,
      });
      if (res.status === 200 && res.data.resultCode == "0000") {
        let x = [];
        let y = [];
        let resData = [];
        let option = {};
        if (res.data.hasOwnProperty("data") && res.data.data) {
          resData = res.data.data;
          x = resData.dateStringArr;
          for (let i = 0; i < resData.avgDamageArr.length; i++) {
            y.push(resData.avgDamageArr[i] / 10);
          }
          option = this.initOptions(x, y);
        } else {
          const nullFlag = true;
          const today = new Date(new Date().toLocaleDateString());
          const start = new Date(
            today.setDate(today.getDate() - (today.getDay() || 7) + 1)
          );
          const week = [
            new Date(start),
            ...Array(6)
              .fill()
              .map((_) => new Date(start.setDate(start.getDate() + 1))),
          ];
          for (let i = 0; i < week.length; i++) {
            let month = week[i].getMonth() + 1;
            let day =
              String(week[i].getDate()).length == 1
                ? "0" + week[i].getDate()
                : week[i].getDate();
            let date = month + "-" + day;
            x.push(date);
            y.push(0);
          }
          option = this.initOptions(x, y, nullFlag);
        }
        this.$nextTick(() => {
          let dom = document.getElementsByClassName("chartContainer")[0];
          // 销毁echarts实例
          this.chartContainer.dispose();
          // 重新初始化echarts实例
          if (dom) {
            this.chartContainer = echarts.init(dom);
          }

          unwarp(this.chartContainer).setOption(option);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#rootContainerValue {
  width: 100%;
  height: 100%;
  background-color: #1c1f30;
  padding-top: 10px;
  box-sizing: border-box;
  .titleTextValue {
    margin-left: 1.5%;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }
  .chartContainer {
    width: 100%;
    height: 87%;
  }
}
</style>
