<template>
  <div class="rootWrap">
    <div class="checkboxWrap commonFloat">
      <el-checkbox
        v-model="isDailyReport"
        :disabled="isDailyDisable"
        @change="handleDaily"
        >日报</el-checkbox
      >
      <el-divider class="showDivider" direction="vertical"></el-divider>
      <el-checkbox
        v-model="isWeekReport"
        :disabled="isWeekDisable"
        @change="handleWeek"
        >周报</el-checkbox
      >
    </div>
    <div class="selectWrap commonFloat">
      <el-select
        v-model="projectValue"
        placeholder="项目"
        @change="hanleChangeProject"
        :title="currentProjectName"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="item in projectOptions"
          :key="item.value"
          :label="item.projectName"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="equipValue"
        placeholder="设备"
        @change="hanleChangeEquip"
        v-show="equipSelectFlag"
        :disabled="isEquipDisable"
      >
        <el-option
          v-for="item in equipOptions"
          :key="item.value"
          :label="item.equipmentName"
          :value="item"
        >
        </el-option>
      </el-select>
      <span :class="{ text: true, showTime: isShowTime }">监测时间</span>
      <el-date-picker
        class="dataPicker"
        v-model="dateValue"
        v-if="isWeekDatePickerShow"
        :disabled-date="disabledDateWeek"
        placeholder="日期"
        type="date"
        :clearable="false"
        @change="handleChangeDate"
        :disabled="isDateDisable"
      >
      </el-date-picker>
      <el-date-picker
        class="dataPicker"
        v-model="dateValue"
        v-if="isDailyDatePickerShow"
        :disabled-date="disabledDateDaily"
        placeholder="日期"
        type="date"
        :clearable="false"
        @change="handleChangeDate"
        :disabled="isDateDisable"
      >
      </el-date-picker>
    </div>
    <div class="btnAndDownload commonFloat">
      <button
        class="searchBtn"
        @click="searchReport"
        :disabled="isSearchDisable"
      >
        查询
      </button>
      <div
        v-show="false"
        class="downloadWrap isShowDownloadIcon"
        @click="handlerDownload"
      >
        <span
          :class="{ downloadBtn: true, showDownloadText: isShowDownloadText }"
          >下载报表</span
        >
        <i class="iconfont icon-xiazai"></i>
      </div>
    </div>
  </div>
  <div class="btnWrapPh">
    <button
      @click="handlerDownload"
      :disabled="isDisableBtn"
      :class="{ activeBtnBgc: isShowBtnBgc }"
    >
      <i class="iconfont icon-xiazai"></i>下载报表
    </button>
  </div>
</template>

<script>
import { eventBus } from "@ai-zen/event-bus";
import { getItem } from "../../api";
export default {
  name: "SelectReport",
  emits: ["equipChange", "changeComponent", "getCode"],
  data() {
    return {
      // 项目下拉框数据
      projectOptions: [],
      projectValue: "",
      // 设备下拉框数据
      equipOptions: [],
      equipValue: "",
      // 当前项目的项目编码
      currentProjectCode: "",
      // 当前项目的项目名称
      currentProjectName: "",
      currentEquipCode: "",
      isDailyReport: false,
      isWeekReport: true,
      dateValue: "",
      // 设备选择框显示标志
      equipSelectFlag: false,
      // 日期禁用标志
      isDateDisable: true,
      // 周报日期选择框是否显示
      isWeekDatePickerShow: true,
      // 日报日期选择框是否显示
      isDailyDatePickerShow: false,
      // 日报禁用标志
      isDailyDisable: false,
      // 周报禁用标志
      isWeekDisable: false,
      // 设备禁用标志
      isEquipDisable: true,
      // 查询按钮禁用标志
      isSearchDisable: true,
      // 周报日期禁用配置
      disabledDateWeek: null,
      // 日报日期禁用配置
      disabledDateDaily: null,
      // 日期选中的标准日期格式
      standardDate: "",
      // 手机版下载按钮激活背景色
      isShowBtnBgc: false,
      // 手机版按钮禁用标准
      isDisableBtn: true,
      // 监测时间显示标志
      isShowTime: true,
      // 下载报表文本显示标志
      isShowDownloadText: true,
    };
  },
  created() {
    // 获取项目下拉框数据
    this.getProjectData();
    this.disabledDateWeek = function(time) {
      let date = new Date();
      let num = 0;
      if (date.getDay() == 0) {
        num = 7;
      } else {
        num = date.getDay();
      }
      return time.getTime() > Date.now() - 24 * 60 * 60 * 1000 * num;
    };
    this.disabledDateDaily = function(time) {
      return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
    };
  },
  methods: {
    // 获取项目下拉框数据
    async getProjectData() {
      let cache = {};
      const res = await this.$http.post(this.$urlObj.queryProject, {
        userCode: getItem("userData").userCode,
      });
      if (res.data.resultCode === "0000") {
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          cache = {};
          cache.projectName = data[i].projectName;
          cache.value = data[i].projectCode;
          this.projectOptions.push(cache);
        }
      }
    },

    // 获取设备下拉框数据
    async getEquipData() {
      let equipType = "";
      let cache = {};
      this.equipOptions = [];
      this.equipValue = "";
      const res = await this.$http.post(this.$urlObj.queryEquip, {
        userCode: getItem("userData").userCode,
        projectCode: this.currentProjectCode,
      });
      if (res.data.resultCode === "0000") {
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          cache = {};
          cache.equipmentName = data[i].equipmentName;
          cache.value = data[i].equipmentCode;
          cache.equipmentModel = data[i].equipmentModel;
          this.equipOptions.push(cache);
        }
        let flag = data[0].equipmentModel == "IOT01B";

        if (flag) {
          equipType = "nosuodao";
        } else {
          equipType = "suodao";
        }
        if (this.isWeekReport) {
          this.$emit("changeComponent", equipType);
        }
      }
    },
    // 选择项目后，保存项目编码
    hanleChangeProject(data) {
      this.isShowBtnBgc = false;
      this.isDisableBtn = true;
      // data为选择项目后，当前项目的项目名称和项目编码
      this.currentProjectCode = data.value;
      this.currentProjectName = data.projectName;
      // 获取设备下拉框数据
      this.getEquipData();
      // 取消设备下拉框禁用
      this.isEquipDisable = false;
      if (!this.equipSelectFlag) {
        this.isDateDisable = false;
      } else {
        this.isDateDisable = true;
      }
    },

    // 选择设备后，保存设备编码
    hanleChangeEquip(data) {
      this.isShowBtnBgc = false;
      this.isDisableBtn = true;
      // data为选择设备后，当前设备的设备名称和设备编码
      this.currentEquipCode = data.value;
      // 取消日期选择框禁用
      this.isDateDisable = false;
      this.$emit("equipChange", { data: data, date: this.dateValue });
      // if(data.value == "6143f67cf80a12edc1314d92") {

      // }
    },

    // 选择日期事件
    handleChangeDate(data) {
      this.isShowBtnBgc = false;
      this.isDisableBtn = true;
      if (data) {
        let year = data.getFullYear();
        let month = data.getMonth();
        let day = data.getDate();
        this.standardDate = data;
        // 取消日报选择框禁用
        this.isDailyDisable = false;
        this.isWeekDisable = false;
        this.isSearchDisable = false;
        this.dateValue =
          year +
          "-" +
          (month.toString().length == 1 && month < 9
            ? "0" + (month - 0 + 1)
            : month - 0 + 1) +
          "-" +
          (day.toString().length == 1 ? "0" + day : day);
      }
    },
    // 选择日报事件
    handleDaily() {
      this.projectValue = "";
      this.equipValue = "";
      this.dateValue = "";
      this.isDateDisable = true;
      this.isEquipDisable = true;
      this.isShowBtnBgc = false;
      this.isDisableBtn = true;
      // 日报被选中
      if (this.isDailyReport) {
        this.equipSelectFlag = true;
        this.isWeekReport = false;
        // 周报日期选择框隐藏，日报日期选择框显示
        this.isWeekDatePickerShow = false;
        this.isDailyDatePickerShow = true;
      } else {
        this.equipSelectFlag = false;
        this.isWeekReport = true;
        // 周报日期选择框显示，日报日期选择框隐藏
        this.isWeekDatePickerShow = true;
        this.isDailyDatePickerShow = false;
      }

      if (!this.isWeekDisable && !this.isDailyDisable) {
        this.isSearchDisable = true;
      } else {
        this.isSearchDisable = false;
      }
      // 向父组件发送关闭周报
      eventBus.emit("closeWeek", {
        isWeekDisable: this.isWeekReport,
        isDailyDisable: this.isDailyReport,
      });
    },
    // 选择周报事件
    handleWeek() {
      this.projectValue = "";
      this.equipValue = "";
      this.dateValue = "";
      this.isDateDisable = true;
      this.isShowBtnBgc = false;
      this.isDisableBtn = true;
      // 周报被选中
      if (this.isWeekReport) {
        this.isDailyReport = false;
        this.equipSelectFlag = false;
        // 周报日期选择框显示，日报选择框隐藏
        this.isWeekDatePickerShow = true;
        this.isDailyDatePickerShow = false;
      } else {
        this.isDailyReport = true;
        this.equipSelectFlag = true;
        // 周报日期选择框隐藏，日报选择框显示
        this.isWeekDatePickerShow = false;
        this.isDailyDatePickerShow = true;
      }
      // 向父组件传递选择日报或周报
      eventBus.emit("closeDaily", {
        isDailyDisable: this.isDailyReport,
        isWeekDisable: this.isWeekReport,
      });
    },
    // 查询事件
    searchReport() {
      this.isShowBtnBgc = true;
      this.isDisableBtn = false;
      // eventBus.emit("getCode", {
      //   currentEquipCode: this.currentEquipCode,
      //   currentProjectCode: this.currentProjectCode,
      //   reportDate: this.dateValue,
      //   isWeekDisable: this.isWeekReport,
      //   standardDate: this.standardDate,
      // });
      this.$emit("getCode", {
        currentEquipCode: this.currentEquipCode,
        currentProjectCode: this.currentProjectCode,
        reportDate: this.dateValue,
        isWeekDisable: this.isWeekReport,
        standardDate: this.standardDate,
      });
    },

    // 下载报表处理事件
    handlerDownload() {
      let paramsDaily = {
        equipmentCode: this.currentEquipCode,
        reportDate: this.dateValue,
        reportType: "dailyImage",
      };
      let paramsWeek = {
        projectCode: this.currentProjectCode,
        reportDate: this.dateValue,
        reportType: "weeklyImage",
      };
      if (this.currentEquipCode && this.dateValue && this.isDailyReport) {
        this.$http({
          method: "post",
          url: this.$urlObj.queryDownloadImagePath,
          data: paramsDaily,
        }).then((res) => {
          window.open(res.data.data, "download");
        });
      }
      if (this.currentProjectCode && this.dateValue && this.isWeekReport) {
        this.$http({
          method: "post",
          url: this.$urlObj.queryDownloadImagePath,
          data: paramsWeek,
        }).then((res) => {
          window.open(res.data.data, "download");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rootWrap {
  width: 100%;
  height: 60px;
  margin-top: 20px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #1c1f30;
  .checkboxWrap {
    width: 27%;
    display: flex;
    align-items: center;
    justify-content: left;
    height: 100%;
    max-width: 160px;
    box-sizing: border-box;
    .el-checkbox {
      // float: left;
      margin-right: 4px;
    }
    @media screen and (min-width: 768px) {
      .el-checkbox:nth-child(1) {
        margin-right: 30px;
      }
    }
  }
  @media screen and (min-width: 500px) {
    .checkboxWrap {
      padding-left: 10px;
      max-width: 180px;
    }
    .vertical {
      display: block !important;
    }
    :deep(.el-checkbox__inner) {
      width: 20px !important;
      height: 20px !important;
    }
    @media screen and (min-width: 768px) {
      :deep(.el-checkbox__inner) {
        width: 24px !important;
        height: 24px !important;
      }
    }
    :deep(.el-checkbox__inner::after) {
      width: 10px !important;
      height: 10px !important;
    }
    @media screen and (min-width: 768px) {
      :deep(.el-checkbox__inner::after) {
        width: 7px !important;
        height: 7px !important;
        position: absolute;
        left: 30%;
        top: 20%;
        // transform: translate(-50%,-50%);
      }
    }
  }
  .selectWrap {
    width: 56%;
    display: flex;
    justify-content: left;
    align-items: center;
    height: 100%;
    max-height: 40px;
    position: relative;
    max-width: 600px;
    .el-select {
      float: left;
      width: 65%;
      margin-right: 4px;
      height: 75%;
      max-width: 165px;
    }
    @media screen and (min-width: 500px) {
      .el-select {
        height: 40px;
      }
    }
    .el-date-picker {
      float: left;
      width: 10%;
      height: 75%;
    }
  }
  .btnAndDownload {
    display: flex;
    height: 100%;
    width: 17%;
    padding-left: 4px;
    box-sizing: border-box;
    justify-content: left;
    align-items: center;
    position: absolute;
    right: 0;
    .searchBtn {
      background-color: #0099ff;
      color: #fff;
      border: 0;
      width: 40px;
      height: 30px;
      font-size: 0.6em;
      margin-right: 10px;
      margin-left: 20px;
      cursor: pointer;
    }
    i {
      color: #0099ff;
      font-size: 1.22em;
      padding-right: 2px;
      cursor: pointer;
    }
    .downloadBtn {
      color: #fff;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
    @media screen and (min-width: 900px) {
      .searchBtn {
        width: 100px;
        height: 40px;
        position: absolute;
        right: 40%;
      }
      i {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    @media screen and (min-width: 992px) {
      .searchBtn {
        right: 60%;
      }
      i {
        right: 75px;
      }
    }
    @media screen and (min-width: 1600px) {
      .searchBtn {
        left: 0;
      }
    }
  }
  @media screen and (min-width: 900px) {
    .btnAndDownload {
      width: 17%;
    }
  }
  @media screen and (min-width: 1200px) {
    .btnAndDownload {
      width: 30%;
    }
  }
  @media screen and (min-width: 1400px) {
    .btnAndDownload {
      width: 42%;
    }
  }
  @media screen and (min-width: 1600px) {
    .btnAndDownload {
      width: 50%;
    }
  }
  .text {
    color: #afbed6;
    width: 80px;
    margin-left: 10px;
    padding-right: 10px;
    text-align: right;
  }
  @media screen and (min-width: 992px) {
    .text {
      width: 134px;
    }
  }
}
@media screen and (min-width: 500px) {
  .rootWrap {
    height: 80px;
  }
}
.btnWrapPh {
  width: 100%;
  height: 42px;
  display: flex;
  justify-content: center;
  margin-top: 12px;
  button {
    width: 100%;
    background-color: #33394e;
    color: #fff;
    border: 0;
    border-radius: 2px;
    cursor: pointer;
    i {
      margin-right: 4px;
    }
  }
}
@media screen and (min-width: 768px) {
  .btnWrapPh {
    display: none !important;
  }
}
@media screen and (min-width: 768px) {
  .isShowDownloadIcon {
    display: block !important;
  }
}
.commonFloat {
  float: left;
}
.activeBtnBgc {
  background-color: #0099ff !important;
}
// 复选按钮之间的分割线
.showDivider {
  display: none;
}
@media screen and (min-width: 768px) {
  .showDivider {
    display: block !important;
    position: absolute;
    left: 70px;
    height: 30px;
    background-color: #afbed6;
  }
}
:deep(.el-checkbox__label) {
  padding: 2px !important;
  color: #afbed6;
}
:deep(.el-checkbox__inner) {
  background-color: #1c1f30;
}
:deep(.select-trigger) {
  height: 100%;
}
:deep(.el-select .el-input) {
  height: 100%;
}
:deep(.el-select .el-input .el-input__inner) {
  height: 100%;
  display: flex;
  align-items: center;
}
:deep(.el-select .select-trigger .el-input .el-input__inner) {
  height: 100% !important;
  padding-left: 2px;
  padding-right: 22px;
}
@media screen and (min-width: 768px) {
  :deep(.el-select .select-trigger .el-input .el-input__inner) {
    padding-left: 12px;
  }
}
:deep(.el-input__suffix) {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
}

:deep(.el-date-editor) {
  // width: 35.33%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media screen and (min-width: 500px) {
  :deep(.el-date-editor) {
    height: 40px;
  }
}
:deep(.el-date-editor .el-input__inner) {
  width: 100%;
  height: 100%;
  padding-left: 15px;
  padding-right: 0;
  color: #0099ff;
  border-color: #758aaa;
  background-color: #1c1f30;
  display: flex;
  align-items: center;
}
@media screen and (min-width: 768px) {
  :deep(.el-date-editor .el-input__inner) {
    padding-left: 26px;
  }
}
:deep(.el-date-editor .el-input__inner .el-input__icon) {
  position: absolute !important;
}
:deep(.el-date-editor .el-input__prefix) {
  display: flex;
  align-items: center;
  position: absolute;
  left: 1px;
  width: 0;
}
@media screen and (min-width: 768px) {
  :deep(.el-date-editor .el-input__prefix) {
    left: 10px;
  }
}
:deep(.el-select__popper) {
  width: 95vw !important;
  max-width: 357px !important;
}
.showTime {
  display: none;
}
.showDownloadText {
  display: none;
}
@media screen and (min-width: 992px) {
  .showTime {
    display: block;
  }
  .showDownloadText {
    display: block;
  }
}
</style>
