<template>
  <div id="rootContainerSate">
    <div class="titleText">本周运行概况</div>
    <div class="rootChartContainer">
      <div class="health"></div>
      <div class="light"></div>
      <div class="middle"></div>
      <div class="heavy"></div>
      <div class="out"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { eventBus } from "@ai-zen/event-bus";
export default {
  name: "State",
  data() {
    return {
      projectCode: "",
      reportDate: "",
      healthContainer: null,
      lightContainer: null,
      middleContainer: null,
      heavyContainer: null,
      outContainer: null,
      healthOptions: {},
      lightOptions: {},
      middleOptions: {},
      heavyOptions: {},
      outOptions: {},
      riskLevel: [],
    };
  },
  created() {
    eventBus.on("getCode", (data) => {
      this.projectCode = data.currentProjectCode;
      this.reportDate = data.reportDate;
      if (data.isWeekDisable) {
        this.healthContainer.dispose();
        this.lightContainer.dispose();
        this.middleContainer.dispose();
        this.heavyContainer.dispose();
        this.outContainer.dispose();
        this.getImageData(this.projectCode, this.reportDate);
      }
    });
  },
  mounted() {
    let healthDom = document.getElementsByClassName("health")[0];
    let lightDom = document.getElementsByClassName("light")[0];
    let middleDom = document.getElementsByClassName("middle")[0];
    let heavyDom = document.getElementsByClassName("heavy")[0];
    let outDom = document.getElementsByClassName("out")[0];
    this.healthContainer = echarts.init(healthDom);
    this.lightContainer = echarts.init(lightDom);
    this.middleContainer = echarts.init(middleDom);
    this.heavyContainer = echarts.init(heavyDom);
    this.outContainer = echarts.init(outDom);
  },
  methods: {
    myResize() {
      this.healthContainer.resize();
      this.lightContainer.resize();
      this.middleContainer.resize();
      this.heavyContainer.resize();
      this.outContainer.resize();
    },
    // 请求数据
    async getImageData(projectCode, reportDate) {
      const res = await this.$http.post(this.$urlObj.queryImageContent, {
        projectCode: projectCode,
        reportDate: reportDate,
      });
      if (res.status === 200 && res.data.resultCode == "0000") {
        this.riskLevel = [];
        if (res.data.hasOwnProperty("data") && res.data.data) {
          this.riskLevel = res.data.data.riskLevelProportion;
        }
        this.healthOptions = this.initHealthOptions(this.riskLevel);
        this.lightOptions = this.initLightOptions(this.riskLevel);
        this.middleOptions = this.initMiddleOptions(this.riskLevel);
        this.heavyOptions = this.initHeavyOptions(this.riskLevel);
        this.outOptions = this.initOutOptions(this.riskLevel);
        this.$nextTick(() => {
          let healthDom = document.getElementsByClassName("health")[0];
          let lightDom = document.getElementsByClassName("light")[0];
          let middleDom = document.getElementsByClassName("middle")[0];
          let heavyDom = document.getElementsByClassName("heavy")[0];
          let outDom = document.getElementsByClassName("out")[0];
          //  重新初始化echarts实例
          if (healthDom) {
            this.healthContainer = echarts.init(healthDom);
          }
          if (lightDom) {
            this.lightContainer = echarts.init(lightDom);
          }
          if (middleDom) {
            this.middleContainer = echarts.init(middleDom);
          }
          if (heavyDom) {
            this.heavyContainer = echarts.init(heavyDom);
          }
          if (outDom) {
            this.outContainer = echarts.init(outDom);
          }
          this.healthOptions &&
            this.healthContainer.setOption(this.healthOptions);
          this.lightOptions && this.lightContainer.setOption(this.lightOptions);
          this.middleOptions &&
            this.middleContainer.setOption(this.middleOptions);
          this.heavyOptions && this.heavyContainer.setOption(this.heavyOptions);
          this.outOptions && this.outContainer.setOption(this.outOptions);
        });
      }
    },
    // 初始化健康圆环图数据
    initHealthOptions(riskLevel) {
      let sum = 0;
      if (riskLevel.length != 0) {
        sum =
          riskLevel[0] +
          riskLevel[1] +
          riskLevel[2] +
          riskLevel[3] +
          riskLevel[4];
      }
      return {
        tooltip: {
          trigger: "item",
        },
        title: {
          text: "健康",
          textStyle: {
            color: "#fff",
            fontSize: 12,
            fontWeight: "normal",
          },
          left: "center",
          top: "80%",
        },
        media: [
          {
            query: { minWidth: 172 },
            option: {
              title: {
                top: "90%",
              },
            },
          },
          {
            option: {
              title: {
                text: "健康",
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: "normal",
                },
                left: "center",
                top: "80%",
              },
            },
          },
        ],
        series: [
          {
            name: "健康",
            type: "pie",
            radius: ["60%", "70%"],
            label: {
              show: true,
              position: "center",
              formatter: function(a) {
                return a.percent.toFixed(0) + "%";
              },
              color: "#fff",
              fontSize: "14px",
            },
            // 取消环形图事件
            silent: true,
            labelLine: {
              show: false,
            },
            data:
              riskLevel.length == 0
                ? [
                    {
                      value: 0,
                      itemStyle: { color: "#DAE1E9" },
                      label: { show: true },
                    },
                  ]
                : [
                    {
                      value: riskLevel[0],
                      itemStyle: { color: "#35C78C" },
                      label: { show: true },
                    },
                    {
                      value: sum - riskLevel[0],
                      itemStyle: { color: "#DAE1E9" },
                      label: { show: false },
                    },
                  ],
          },
        ],
      };
    },
    // 初始化轻度圆环图数据
    initLightOptions(riskLevel) {
      let sum = 0;
      if (riskLevel.length != 0) {
        sum =
          riskLevel[0] +
          riskLevel[1] +
          riskLevel[2] +
          riskLevel[3] +
          riskLevel[4];
      }
      return {
        tooltip: {
          trigger: "item",
        },
        title: {
          text: "轻度",
          textStyle: {
            color: "#fff",
            fontSize: 12,
            fontWeight: "normal",
          },
          left: "center",
          top: "80%",
        },
        media: [
          {
            query: { minWidth: 172 },
            option: {
              title: {
                top: "90%",
              },
            },
          },
          {
            option: {
              title: {
                text: "轻度",
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: "normal",
                },
                left: "center",
                top: "80%",
              },
            },
          },
        ],
        series: [
          {
            name: "轻度",
            type: "pie",
            radius: ["60%", "70%"],
            label: {
              show: true,
              position: "center",
              formatter: function(a) {
                return a.percent.toFixed(0) + "%";
              },
              color: "#fff",
              fontSize: "14px",
            },
            silent: true,
            labelLine: {
              show: false,
            },
            data:
              riskLevel.length == 0
                ? [
                    {
                      value: 0,
                      itemStyle: { color: "#DAE1E9" },
                      label: { show: true },
                    },
                  ]
                : [
                    {
                      value: riskLevel[1],
                      itemStyle: { color: "#8BD26C" },
                      label: { show: true },
                      label: { show: true },
                    },
                    {
                      value: sum - riskLevel[1],
                      itemStyle: { color: "#DAE1E9" },
                      label: { show: false },
                    },
                  ],
          },
        ],
      };
    },
    // 初始化中度圆环图数据
    initMiddleOptions(riskLevel) {
      let sum = 0;
      if (riskLevel.length != 0) {
        sum =
          riskLevel[0] +
          riskLevel[1] +
          riskLevel[2] +
          riskLevel[3] +
          riskLevel[4];
      }
      return {
        tooltip: {
          trigger: "item",
        },
        title: {
          text: "中度",
          textStyle: {
            color: "#fff",
            fontSize: 12,
            fontWeight: "normal",
          },
          left: "center",
          top: "80%",
        },
        media: [
          {
            query: { minWidth: 172 },
            option: {
              title: {
                top: "90%",
              },
            },
          },
          {
            option: {
              title: {
                text: "中度",
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: "normal",
                },
                left: "center",
                top: "80%",
              },
            },
          },
        ],
        series: [
          {
            name: "中度",
            type: "pie",
            radius: ["60%", "70%"],
            label: {
              show: true,
              position: "center",
              formatter: function(a) {
                return a.percent.toFixed(0) + "%";
              },
              color: "#fff",
              fontSize: "14px",
            },
            silent: true,
            labelLine: {
              show: false,
            },
            data:
              riskLevel.length == 0
                ? [
                    {
                      value: 0,
                      itemStyle: { color: "#DAE1E9" },
                      label: { show: true },
                    },
                  ]
                : [
                    {
                      value: riskLevel[2],
                      itemStyle: { color: "#f79f3d" },
                      label: { show: true },
                      label: { show: true },
                    },
                    {
                      value: sum - riskLevel[2],
                      itemStyle: { color: "#DAE1E9" },
                      label: { show: false },
                    },
                  ],
          },
        ],
      };
    },
    // 初始化重度圆环图数据
    initHeavyOptions(riskLevel) {
      let sum = 0;
      if (riskLevel.length != 0) {
        sum =
          riskLevel[0] +
          riskLevel[1] +
          riskLevel[2] +
          riskLevel[3] +
          riskLevel[4];
      }
      return {
        tooltip: {
          trigger: "item",
        },
        title: {
          text: "重度",
          textStyle: {
            color: "#fff",
            fontSize: 12,
            fontWeight: "normal",
          },
          left: "center",
          top: "80%",
        },
        media: [
          {
            query: { minWidth: 172 },
            option: {
              title: {
                top: "90%",
              },
            },
          },
          {
            option: {
              title: {
                text: "重度",
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: "normal",
                },
                left: "center",
                top: "80%",
              },
            },
          },
        ],
        series: [
          {
            name: "重度",
            type: "pie",
            radius: ["60%", "70%"],
            label: {
              show: true,
              position: "center",
              formatter: function(a) {
                return a.percent.toFixed(0) + "%";
              },
              color: "#fff",
              fontSize: "14px",
            },
            silent: true,
            labelLine: {
              show: false,
            },
            data:
              riskLevel.length == 0
                ? [
                    {
                      value: 0,
                      itemStyle: { color: "#DAE1E9" },
                      label: { show: true },
                    },
                  ]
                : [
                    {
                      value: riskLevel[3],
                      itemStyle: { color: "#f8de42" },
                      label: { show: true },
                      label: { show: true },
                    },
                    {
                      value: sum - riskLevel[3],
                      itemStyle: { color: "#DAE1E9" },
                      label: { show: false },
                    },
                  ],
          },
        ],
      };
    },
    // 初始化超限圆环图数据
    initOutOptions(riskLevel) {
      let sum = 0;
      if (riskLevel.length != 0) {
        sum =
          riskLevel[0] +
          riskLevel[1] +
          riskLevel[2] +
          riskLevel[3] +
          riskLevel[4];
      }
      return {
        tooltip: {
          trigger: "item",
        },
        title: {
          text: "超限",
          textStyle: {
            color: "#fff",
            fontSize: 12,
            fontWeight: "normal",
          },
          left: "center",
          top: "80%",
        },
        media: [
          {
            query: { minWidth: 172 },
            option: {
              title: {
                top: "90%",
              },
            },
          },
          {
            option: {
              title: {
                text: "超限",
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: "normal",
                },
                left: "center",
                top: "80%",
              },
            },
          },
        ],
        series: [
          {
            name: "超限",
            type: "pie",
            radius: ["60%", "70%"],
            label: {
              show: true,
              position: "center",
              formatter: function(a) {
                return a.percent.toFixed(0) + "%";
              },
              color: "#fff",
              fontSize: "14px",
            },
            silent: true,
            color: ["#35C78C", "#DAE1E9"],
            labelLine: {
              show: false,
            },
            data:
              riskLevel.length == 0
                ? [
                    {
                      value: 0,
                      itemStyle: { color: "#DAE1E9" },
                      label: { show: true },
                    },
                  ]
                : [
                    {
                      value: riskLevel[4],
                      itemStyle: { color: "#f54b36" },
                      label: { show: true },
                      label: { show: true },
                    },
                    {
                      value: sum - riskLevel[4],
                      itemStyle: { color: "#DAE1E9" },
                      label: { show: false },
                    },
                  ],
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
#rootContainerSate {
  width: 100%;
  height: 100%;
  padding-top: 10px;
  box-sizing: border-box;
  background-color: #1c1f30;
  position: relative;
  .titleText {
    margin-left: 2%;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }
  .rootChartContainer {
    width: 100%;
    height: 100%;
    position: absolute;
    div {
      width: 20%;
      height: 80%;
      box-sizing: border-box;
      float: left;
    }
  }
}
</style>
