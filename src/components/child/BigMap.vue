<template>
  <div v-show="bigMapShow" id="mapBigger" class="mapBigger">
    <div id="bigMapContainer"></div>
    <el-select
      v-model="projectValue"
      filterable
      placeholder="请选择"
      :popper-append-to-body="false"
      ref="selectRef"
      @change="handleSelectChange"
    >
      <el-option
        v-for="item in projectGroup"
        :key="item.value"
        :label="item.projectName"
        :value="item"
      >
      </el-option>
    </el-select>
    <div @click="closeMap" class="closeMap">x</div>
  </div>
  <div class="shadowWrap"></div>
</template>

<script>
import { getItem, setItem } from "../../api/index";
export default {
  name: "BigMap",
  data() {
    return {
      // 实例化地图
      map: "",
      // 地图开关
      bigMapShow: true,
      // 项目数据
      projectGroup: [],
      // 当前项目的项目编码
      currentProjectCode: "",
      // 实例化点标记
      markerGroup: null,
      // 信息窗体
      infoWindow: null,
      // 下拉框选中的值
      projectValue: "",
    };
  },
  mounted() {
    window.toDetail = this.toDetail;
    document.addEventListener("click", (e) => {
      if (this.markerGroup) {
        // this.projectValue = "";
        this.$refs.selectRef.blur();
        // for(let i = 0; i <this.markerGroup.length; i++) {
        //   this.markerGroup[i].marker.setIcon(new AMap.Icon({
        //     size: new AMap.Size(40,40),
        //     image:require('../../assets/image/dian1.svg'),
        //     imageSize: new AMap.Size(40, 40),
        //     anchor: 'center'
        //   }))
        // }
      }
      // if(this.infoWindow) {
      //   this.infoWindow.close();
      // }
    });
  },
  watch: {
    projectGroup() {
      this.$nextTick(() => {
        this.init();
      });
    },
  },
  methods: {
    // 初始化地图
    init() {
      this.map = new AMap.Map("bigMapContainer", {
        //缩放级别
        zoom: 8,
        //默认中心点
        //center:[116.364495,39.930694],
        center: [113.663221, 34.7568711],
        //关闭拖拽平移
        // dragEnable: false,
        //关闭缩放
        // zoomEnable: false,
        //设置地图背景图
        mapStyle: "amap://styles/dcfcd281e36b08e2745aa060daab1b1b",
      });

      this.initMarker(this.map);
    },
    // 初始化地图标点
    initMarker(map) {
      // 拷贝this,便于回调函数访问
      var copyThis = this;
      let markerGroup = [];
      // 实例化所有的点标记
      for (let i = 0; i < this.projectGroup.length; i++) {
        let cache = {};
        if (
          typeof this.projectGroup[i].longitude !== "undefined" &&
          typeof this.projectGroup[i].latitude !== "undefined"
        ) {
          cache.marker = new AMap.Marker({
            // map: that.map,
            icon: new AMap.Icon({
              size: new AMap.Size(40, 40),
              image: require("../../assets/image/dian1.svg"),
              imageSize: new AMap.Size(40, 40),
              anchor: "center",
            }),
            position: [
              this.projectGroup[i].longitude,
              this.projectGroup[i].latitude,
            ],
            offset: new AMap.Pixel(-13, -30),
          });
          cache.projectCode = this.projectGroup[i].projectCode;
          cache.projectName = this.projectGroup[i].projectName;
          cache.longitude = this.projectGroup[i].longitude;
          cache.latitude = this.projectGroup[i].latitude;
          markerGroup.push(cache);
          this.markerGroup = markerGroup;
        }
      }
      // 将所有点标记到地图上
      this.markerClick(markerGroup, copyThis);
    },
    // 地图标点 点击事件
    markerClick(markerGroup, copyThis) {
      markerGroup.forEach((item) => {
        copyThis.map.add(item.marker);
        AMap.event.addListener(item.marker, "click", async function() {
          var str = "";
          copyThis.currentProjectCode = item.projectCode;
          copyThis.projectValue = item.projectName;
          for (let i = 0; i < markerGroup.length; i++) {
            markerGroup[i].marker.setIcon(
              new AMap.Icon({
                size: new AMap.Size(40, 40),
                image: require("../../assets/image/dian1.svg"),
                imageSize: new AMap.Size(40, 40),
                anchor: "center",
              })
            );
          }
          item.marker.setIcon(
            new AMap.Icon({
              size: new AMap.Size(40, 40),
              image: require("../../assets/image/dian2.svg"),
              imageSize: new AMap.Size(40, 40),
              anchor: "center",
            })
          );
          //在指定位置打开信息窗体
          copyThis.infoWindow = new AMap.InfoWindow({
            isCustom: true, //使用自定义窗体
            autoMove: true,
            offset: new AMap.Pixel(0, -58),
          });

          const res = await copyThis.$http.post(copyThis.$urlObj.queryEquip, {
            userCode: getItem("userData").userCode,
            projectCode: copyThis.currentProjectCode,
          });
          if (res.status === 200 && res.data.resultCode == "0000") {
            let data = res.data.data;
            let projectCode = "";
            let projectName = "";
            let equipmentCode = "";
            let equipmentName = "";
            for (let i = 0; i < data.length; i++) {
              projectCode = data[i].projectCode;
              projectName = data[i].projectName;
              equipmentCode = data[i].equipmentCode;
              equipmentName = data[i].equipmentName;
              validTime = data[i].validTime;
              str += `
              <li style='padding:10px 0 10px 15px;cursor:pointer;position:relative;box-sizing:border-box;'
              onMouseOver="this.style.color='#0099ff'"
              onMouseOut="this.style.color='#fff'"
              onclick="toDetail('${projectCode}','${projectName}','${equipmentCode}','${equipmentName}','${validTime}')">${data[i].equipmentName}
              <span style='position:absolute;right:20px;cursor:pointer;'>></span></li>
              `;
            }
            str = copyThis.createInfoWindow(str, item.projectName);
            copyThis.infoWindow.setContent(str);
          }
          copyThis.infoWindow.open(copyThis.map, item.marker.getPosition());
        });
      });
    },
    // 搜索框选中项目发生变化后事件
    async handleSelectChange(e) {
      this.projectValue = e.projectName;
      let currentMarker = null;
      let str = "";
      let equipGroup = [];
      for (let i = 0; i < this.markerGroup.length; i++) {
        this.markerGroup[i].marker.setIcon(
          new AMap.Icon({
            size: new AMap.Size(40, 40),
            image: require("../../assets/image/dian1.svg"),
            imageSize: new AMap.Size(40, 40),
            anchor: "center",
          })
        );
        if (e.projectCode == this.markerGroup[i].projectCode) {
          let longitude = "";
          let latitude = "";

          currentMarker = this.markerGroup[i].marker;
          longitude = this.markerGroup[i].longitude;
          latitude = this.markerGroup[i].latitude;

          currentMarker.setIcon(
            new AMap.Icon({
              size: new AMap.Size(40, 40),
              image: require("../../assets/image/dian2.svg"),
              imageSize: new AMap.Size(40, 40),
              anchor: "center",
            })
          );
          currentMarker.setTop(true);
          this.map.setCenter([longitude, latitude]);
          this.infoWindow = new AMap.InfoWindow({
            isCustom: true, //使用自定义窗体
            autoMove: true,
            offset: new AMap.Pixel(0, -58),
          });
          const res = await this.$http.post(this.$urlObj.queryEquip, {
            userCode: getItem("userData").userCode,
            projectCode: e.projectCode,
          });
          if (res.status === 200 && res.data.resultCode == "0000") {
            equipGroup = res.data.data;
            for (let i = 0; i < equipGroup.length; i++) {
              str += `
          <li style='padding:10px 0 10px 15px;cursor:pointer;position:relative;box-sizing:border-box;'
          onMouseOver="this.style.color='#0099ff'"
          onMouseOut="this.style.color='#fff'"
          onclick="toDetail('${equipGroup[i].projectCode}','${equipGroup[i].projectName}','${equipGroup[i].equipmentCode}','${equipGroup[i].equipmentName}','${equipGroup[i].validTime}')">${equipGroup[i].equipmentName}
          <span style='position:absolute;right:20px;cursor:pointer;'>></span></li>
          `;
            }
          }

          str = this.createInfoWindow(str, e.projectName);
          this.infoWindow.setContent(str);
          this.infoWindow.open(this.map, currentMarker.getPosition());
        }
      }
    },
    // 关闭地图事件
    closeMap() {
      let divChild = document.getElementsByClassName("divChild");
      let divEquip = document.getElementsByClassName("divEquip");
      this.bigMapShow = !this.bigMapShow;
      divChild.forEach((item) => {
        item.style.display = "none";
      });
      divEquip.forEach((item) => {
        item.style.display = "none";
      });
      document.getElementsByClassName("shadowWrap")[0].style.display = "none";
    },

    // 请求项目信息
    async getProjectInfo() {
      // 发送请求获取项目信息
      const { data: res } = await this.$http.post(this.$urlObj.queryProject, {
        userCode: getItem("userData").userCode,
      });
      if (res.resultMessage === "Success") {
        this.initSearch(res.data);
      }
    },
    // 初始化搜索框数据
    initSearch(data) {
      this.projectGroup = [];
      data.forEach((item) => {
        this.projectGroup.push(item);
      });
    },
    // 跳转到详情页面
    toDetail(
      projectCode,
      projectName,
      equipmentCode,
      equipmentName,
      validTime
    ) {
      let currentTime = new Date().getTime();
      let validStamp = new Date(validTime).getTime();
      let equipInfo = {
        projectCode: projectCode,
        projectName: projectName,
        equipmentCode: equipmentCode,
        equipmentName: equipmentName,
        validTime: validTime,
      };
      if (currentTime < validStamp) {
        setItem("equipData", equipInfo);
        this.$router.push({
          name: "detail",
          params: {
            equipCode: equipmentCode,
            projectCode: projectCode,
          },
        });
      } else {
        this.$message({
          type: "warning",
          message: "设备已到期，不允许跳转，请续费",
        });
      }
    },
    // 创建信息窗体内容
    createInfoWindow(str, projectName) {
      str =
        `<div style='border-bottom:1px solid #fff;height:36px;line-height:36px;padding-left:15px;'>设备名称</div>
            <ul style='width:100%;max-height:229px;overflow:auto;'>` +
        str +
        `</ul>`;

      str =
        `<div style='width:200px;background-color:0099FF;position:relative;'>
            <div title='${projectName}' style='width:200px;min-height:36px;line-height:36px;text-align:center;
            position:absolute;left:0;top:0;background-color:#0099FF;color:#fff;
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
            padding-left:10px;box-sizing:border-box;'>${projectName}</div>` +
        `<div style='position:absolute;width:180px;left:200px;top:0;max-height:264px;background:rgba(0,0,0,0.8);color:#fff;'>` +
        str +
        `</div></div>`;
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/bigMap.css";
.mapBigger {
  width: 100%;
  height: 79vh;
  position: absolute;
  left: 0;
  top: 0%;
  background-color: #000;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  padding-top: 4px;
  box-sizing: border-box;
}
@media screen and (min-width: 992px) {
  .mapBigger {
    width: 219%;
  }
}
@media screen and (min-width: 1200px) {
  .mapBigger {
    width: 301%;
  }
}
#bigMapContainer {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.selectWrap {
  position: absolute;
  left: 0;
  top: -152px;
  .input {
    width: 306px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 50px;
    top: 200px;
    border: 0;
    border-radius: 2px;
    padding-left: 12px;
    box-sizing: border-box;
    outline: none;
    color: #0099ff;
  }
  .itemWrap {
    width: 306px;
    height: 420px;
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    left: 50px;
    top: 240px;
    border-radius: 2px;
    color: #fff;
    li {
      height: 40px;
      width: 100px;
    }
  }
  .img {
    width: 19px;
    height: 19px;
    position: absolute;
    left: 327px;
    top: 211px;
  }
}
.closeMap {
  width: 30px;
  height: 30px;
  border: 2px solid #fff;
  box-sizing: border-box;
  border-radius: 2px;
  position: absolute;
  right: 0;
  top: -5%;
  color: #fff;
  font-size: 17px;
  text-align: center;
}
.shadowWrap {
  width: 100%;
  height: 108%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 60px;
  left: -1px;
  z-index: 99999;
  display: none;
}
@media screen and (min-width: 992px) {
  .shadowWrap {
    width: 219%;
  }
}
@media screen and (min-width: 1200px) {
  .shadowWrap {
    width: 301%;
  }
}
.el-select {
  position: absolute;
  left: 5%;
  top: 8%;
  width: 50%;
  max-width: 300px;
}
:deep(.el-select-dropdown) {
  width: 100% !important;
  background: rgba(0, 0, 0, 0.8) !important;
}
:deep(.el-select__popper.el-popper[role="tooltip"]) {
  width: 100%;
}
:deep(.el-scrollbar) {
  background: rgba(0, 0, 0, 0.8);
}
:deep(.el-select-dropdown__empty) {
  background-color: #1c1f30;
  color: #fff;
}
:deep(.el-select__popper.el-popper[role="tooltip"][data-popper-placement^="bottom"]
    .el-popper__arrow::before) {
  background-color: #1c1f30;
  border: 0;
}
</style>
