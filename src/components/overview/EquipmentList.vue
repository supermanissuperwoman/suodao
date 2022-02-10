<template>
  <el-row>
    <el-col>
      <div class="tableContainer">
        <div class="title">
          <span class="titleName">设备列表</span>
          <div class="listUpdateTime">风险评估时间:{{ assessTime }}</div>
          <!-- 后期需要会放开 -->
          <!-- <span class="download el-icon-download"></span> -->
        </div>
        <div class="table">
          <el-table
            class="customer-table"
            :data="currentProjectEquip"
            :header-cell-style="headerCellStyle"
            :cell-style="cellStyle"
            :row-class-name="tableRowClassName"
            cell-class-name="cell-class-name"
            :max-height="440"
          >
            <el-table-column
              prop="projectName"
              label="项目名称"
              fixed
              min-width="150px"
            >
              <template v-slot="scope">
                <el-tooltip
                  :content="scope.row.projectName"
                  placement="bottom-start"
                  :append-to-body="
                    currentProjectEquip.length > 7 ? false : true
                  "
                >
                  <span
                    style="
                      overflow: hidden;
                      texto-verflow: ellipsis;
                      white-space: nowrap;
                    "
                    >{{ scope.row.projectName }}</span
                  >
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="equipmentName" label="设备名称" fixed>
            </el-table-column>
            <el-table-column
              prop="riskLevel"
              label="风险等级"
              min-width="100px"
              sortable
            >
              <!-- 作用域插槽 访问父组件的数据 -->
              <template v-slot="scope">
                <span v-if="scope.row.riskLevel === 0">健康</span>
                <span v-if="scope.row.riskLevel === 1">轻度</span>
                <span v-if="scope.row.riskLevel === 2">中度</span>
                <span v-if="scope.row.riskLevel === 3">重度</span>
                <span v-if="scope.row.riskLevel === 4">超限</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="workingStatus"
              label="工作状态"
              min-width="100px"
              sortable
            >
              <!-- 作用域插槽 访问父组件的数据 -->
              <template v-slot="scope">
                <span v-if="scope.row.workingStatus === 1">离线</span>
                <span v-if="scope.row.workingStatus === 2">工作</span>
                <span v-if="scope.row.workingStatus === 3">待机</span>
                <span v-if="scope.row.workingStatus === 4">停用</span>
                <span
                  v-if="
                    scope.row.workingStatus === 5 &&
                      scope.row.faultProbeInfo.faultProbeModel !== ''
                  "
                >
                  {{
                    scope.row.faultProbeInfo.faultProbeModel == "ENCODE"
                      ? "编码器故障"
                      : "传感器故障"
                  }}
                </span>
                <span v-if="scope.row.workingStatus === 6">报警</span>
                <span v-if="scope.row.workingStatus === 7">未安装</span>
              </template>
            </el-table-column>
            <el-table-column prop="installLocation" label="安装地址">
              <template v-slot="scope">
                <el-tooltip
                  :content="scope.row.installLocation"
                  placement="bottom-start"
                  :append-to-body="
                    currentProjectEquip.length > 7 ? false : true
                  "
                >
                  <span
                    style="
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                    >{{ scope.row.installLocation }}</span
                  >
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="installDate"
              label="安装时间"
              sortable
              min-width="120px"
            >
            </el-table-column>
            <el-table-column label="传感器">
              <template v-slot="scope">
                {{ scope.row.sensorSerialArr[0] }}
              </template>
            </el-table-column>
            <el-table-column label="编码器">
              <template v-slot="scope">
                {{ scope.row.encodeSerialArr[0] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="validTime"
              label="到期时间"
              sortable
              min-width="85px"
            >
            </el-table-column>
            <el-table-column label="编辑" width="50">
              <template v-slot="scope">
                <span
                  :class="{ iconfont: true, editBtn: true }"
                  @click.stop="editTbaleInfo(scope.row, $event)"
                  >&#xe60c;</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="operation" width="50">
              <template v-slot="scope">
                <span class="toDetail" @click="toDetail(scope.row)">>></span>
              </template>
            </el-table-column>
          </el-table>
          <div @click.stop="" class="dialog" v-if="dialogVisible">
            <span v-show="isWariningShow" class="warningWords"
              >名称重复,请重新输入</span
            >
            <el-form
              :model="ruleForm"
              status-icon
              :rules="rules"
              ref="ruleFormRef"
            >
              <el-form-item prop="editEquipmentName">
                <el-input
                  @click.stop=""
                  @input="handleInput"
                  id="dialogInput"
                  placeholder="修改设备名称"
                  v-model="ruleForm.editEquipmentName"
                  maxlength="8"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click.stop="handleCancelClick">取消</el-button>
                <el-button
                  :disabled="isConfirmDisable"
                  @click="handleConfirmClick('ruleFormRef')"
                  >确定</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-if="dialogVisible" class="mode" @click="handleClickWrap"></div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// 导入事件总线方便兄弟组件之间通信
import { eventBus } from "@ai-zen/event-bus";
import { getItem, setItem } from "../../api/index";
export default {
  name: "EquipmentList",
  data() {
    var checkSpecificKey = (str) => {
      var specialKey =
        "[`~!#$^&*()@%+=《》|{}'→:;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      return true;
    };
    var inputRules = (rule, value, callback) => {
      if (!checkSpecificKey(value)) {
        callback(new Error("请不要输入特殊字符"));
      } else {
        callback();
      }
    };
    return {
      // 当前项目的所有设备
      currentProjectEquip: [],
      // 当前项目的项目编码
      currentProjectCode: "",
      // 要修改的设备编码
      editEquipmentCode: "",
      // 要修改的设备所属项目的项目编码
      editProjectCode: "",
      // 表格头部样式
      headerCellStyle: {
        background: "#2F3349",
        color: "#D8D8D8",
        textAlign: "center",
        border: 0,
        fontSize: "14px",
      },
      // 修改表格信息的弹窗
      dialogVisible: false,
      // 名称重复显示开关
      isWariningShow: false,
      // 确定按钮禁用标志
      isConfirmDisable: false,
      // 评估时间
      assessTime: "",
      ruleForm: {
        // 要修改的设备名称
        editEquipmentName: "",
      },
      // 验证规则
      rules: {
        editEquipmentName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          { max: 8, trigger: "blur" },
          { validator: inputRules, trigger: ["blur", "change"] },
        ],
      },
    };
  },

  async created() {
    // 初始化设备列表数据
    const { data: res } = await this.$http.post(this.$urlObj.queryEquip, {
      userCode: getItem("userData").userCode,
    });
    if (res.resultCode == "0000") {
      this.currentProjectEquip = res.data;
      if (res.data.length > 0) {
        this.assessTime = res.data[0].assessTime;
      }
    }
  },

  mounted() {
    let copyThis = this;
    // 获取兄弟组件Map传递过来的当前项目的所有设备
    eventBus.on("send", (data) => {
      this.currentProjectEquip = data;
    });
    document.addEventListener("click", () => {
      copyThis.dialogVisible = false;
      if (document.getElementsByClassName("isClickStyle")[0]) {
        document
          .getElementsByClassName("isClickStyle")[0]
          .classList.remove("isClickStyle");
      }
    });
  },
  methods: {
    // 控制表格单双行背景色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "even";
      }
      return "odd";
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      let colorObj = {
        textAlign: "center",
        border: 0,
        color: "#D8D8D8",
        fontSize: "14px",
        fontWeight: "800",
      };
      if (row.riskLevel === 0 && columnIndex === 2) {
        colorObj.color = "#35C78C";
        return colorObj;
      } else if (row.riskLevel === 1 && columnIndex === 2) {
        colorObj.color = "#8BD26C";
        return colorObj;
      } else if (row.riskLevel === 2 && columnIndex === 2) {
        colorObj.color = "#f8de42";
        return colorObj;
      } else if (row.riskLevel === 3 && columnIndex === 2) {
        colorObj.color = "#f79f3d";
        return colorObj;
      } else if (row.riskLevel === 4 && columnIndex === 2) {
        colorObj.color = "#f54b36";
        return colorObj;
      } else {
        colorObj.color = "#D8D8D8";
        return colorObj;
      }
    },
    // 获取当前项目的设备
    async getOneProjectEquip(e) {
      // 保存当前项目的项目编码
      this.currentProjectCode = e.projectCode;
      if (e.projectCode) {
        const resEquip = await this.$http.post(this.$urlObj.queryEquip, {
          userCode: getItem("userData").userCode,
          projectCode: e.projectCode,
        });
        if (resEquip.status === 200) {
          let data = [];
          data = resEquip.data.data;
          this.currentProjectEquip = data;
        }
        const resStateCount = await this.$http.post(
          this.$urlObj.querySummaryCount,
          { userCode: getItem("userData").userCode, projectCode: e.projectCode }
        );
        if (resStateCount.status === 200) {
        }
      }
    },

    // 获取所有项目的设备
    async getAllProjectEquip() {
      // 将当前项目编码初始化，代表当前是账户下的所有设备
      this.currentProjectCode = "";
      const resAllEquip = await this.$http.post(this.$urlObj.queryEquip, {
        userCode: getItem("userData").userCode,
      });
      if (resAllEquip.status === 200) {
        let data = [];
        data = resAllEquip.data.data;
        this.currentProjectEquip = data;
      }
    },

    // 获取相应工作状态设备的方法
    async getWorkState(state) {
      let cache = [];
      const res = await this.$http.post(this.$urlObj.queryEquip, {
        userCode: getItem("userData").userCode,
        projectCode: this.currentProjectCode,
      });
      if (res.status === 200) {
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          if (
            (data[i].workingStatus == 1 || data[i].workingStatus == 5) &&
            state == "offline"
          ) {
            cache.push(data[i]);
          } else if (
            (data[i].workingStatus == 2 || data[i].workingStatus == 3) &&
            state == "working"
          ) {
            cache.push(data[i]);
          } else if (data[i].workingStatus == 3 && state == "standby") {
            cache.push(data[i]);
          } else if (data[i].workingStatus == 4 && state == "disabled") {
            cache.push(data[i]);
          } else if (data[i].workingStatus == 5 && state == "fault") {
            cache.push(data[i]);
          } else if (data[i].workingStatus == 6 && state == "alarm") {
            cache.push(data[i]);
          } else if (data[i].workingStatus == 7 && state == "noinstall") {
            data[i].installDate = "";
            cache.push(data[i]);
          } else if (state == "all") {
            cache.push(data[i]);
          }
        }
        this.currentProjectEquip = cache;
      }
    },
    // 跳转到当前设备的实时详情页面
    toDetail(singleEquip) {
      let currentTime = new Date().getTime();
      let validTime = new Date(singleEquip.validTime).getTime();
      if (currentTime < validTime) {
        setItem("equipData", singleEquip);
        this.$router.push({
          name: "detail",
          params: {
            equipCode: singleEquip.equipmentCode,
            projectName: singleEquip.projectName,
            projectCode: singleEquip.projectCode,
            equipmentName: singleEquip.equipmentName,
          },
        });
      } else {
        this.$message({
          type: "warning",
          message: "设备已到期，不允许跳转，请续费",
        });
      }
    },
    // 修改表格信息
    editTbaleInfo(rowInfo, event) {
      // 点击的按钮添加选中样式
      event.target.classList.add("isClickStyle");
      this.ruleForm.editEquipmentName = rowInfo.equipmentName;
      this.editProjectCode = rowInfo.projectCode;
      this.editEquipmentCode = rowInfo.equipmentCode;
      this.dialogVisible = true;
    },
    // 点击弹窗的取消按钮事件
    handleCancelClick() {
      this.dialogVisible = false;
      this.editEquipmentName = "";
      document
        .getElementsByClassName("isClickStyle")[0]
        .classList.remove("isClickStyle");
    },
    // 点击弹窗的确认按钮事件
    handleConfirmClick(ruleFormRef) {
      this.updateEquipmentName(ruleFormRef);
    },
    // 点击弹窗之外的地方关闭弹窗
    handleClickWrap() {
      if (this.dialogVisible) {
        this.dialogVisible = false;
        this.editEquipmentName = "";
        document
          .getElementsByClassName("isClickStyle")[0]
          .classList.remove("isClickStyle");
      }
    },
    // 输入框输入事件
    async handleInput(value) {
      this.isConfirmDisable = false;
      if (value != "") {
        const res = await this.$http.post(this.$urlObj.queryEquip, {
          userCode: getItem("userData").userCode,
          projectCode: this.editProjectCode,
        });
        for (let i = 0; i < res.data.data.length; i++) {
          if (value == res.data.data[i].equipmentName) {
            this.isWariningShow = true;
            this.isConfirmDisable = true;
          }
        }
        setTimeout(() => {
          this.isWariningShow = false;
        }, 2000);
      } else {
        this.isConfirmDisable = true;
      }
    },
    // 点击弹窗的确定按钮提交请求
    updateEquipmentName(ruleFormRef) {
      this.$refs[ruleFormRef].validate(async (valid) => {
        if (valid) {
          for (let i = 0; i < this.currentProjectEquip.length; i++) {
            if (
              this.editEquipmentCode ==
              this.currentProjectEquip[i].equipmentCode
            ) {
              this.currentProjectEquip[
                i
              ].equipmentName = this.ruleForm.editEquipmentName;
            }
          }
          const res = await this.$http.post(this.$urlObj.updateEquipmentName, {
            equipmentCode: this.editEquipmentCode,
            equipmentName: this.ruleForm.editEquipmentName,
            projectCode: this.editProjectCode,
            userCode: getItem("userData").userCode,
          });
          if (res.status === 200 && res.data.resultCode == "0000") {
            this.dialogVisible = false;
            document
              .getElementsByClassName("isClickStyle")[0]
              .classList.remove("isClickStyle");
          } else if (
            res.status === 200 &&
            res.data.errorMessage == "EquipmentName Is Repeat"
          ) {
            this.isWariningShow = true;
            setTimeout(() => {
              this.isWariningShow = false;
            }, 2000);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/index.css";
.el-row {
  width: 100%;
  height: 100%;
  .el-col {
    width: 100%;
    height: 100%;
  }
}
.tableContainer {
  position: relative;
  height: 100%;
  .title {
    position: relative;
    .titleName {
      position: absolute;
      left: 17px;
      top: 18px;
      font-weight: 700;
      font-size: 18px;
      color: #fff;
    }
    .listUpdateTime {
      color: #555c7e;
      position: absolute;
      right: 16px;
      top: 21px;
      font-size: 14px;
    }
    @media screen and (min-width: 500px) {
      .listUpdateTime {
        font-size: 16px;
      }
    }
    .download {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 22px;
      height: 22px;
      background-color: #1c1f30;
      font-size: 22px;
      color: #555c7e;
      cursor: pointer;
    }
  }
  .el-table {
    background-color: #2f3349 !important;
    width: 100%;
    height: 80% !important;
  }
  .table {
    width: 100%;
    position: absolute;
    top: 60px;
    box-sizing: border-box;
    border-bottom: 0;
    .editBtn {
      cursor: pointer;
      font-size: 18px;
    }
    .editBtn:hover {
      color: #0099ff;
    }
    .toDetail {
      width: 100px;
      height: 50px;
      cursor: pointer;
    }
    .dialog {
      width: 30%;
      height: 50%;
      background-color: #2f3349;
      position: absolute;
      left: 50%;
      top: 50%;
      min-height: 220px;
      min-width: 320px;
      transform: translate(-50%, -50%);
      z-index: 99999999;
      .el-form {
        position: absolute;
        width: 80%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .warningWords {
        position: absolute;
        display: block;
        top: 10%;
        left: 50%;
        font-size: 12px;
        color: #d54554;
        transform: translateX(-50%);
      }
      .el-form-item:nth-child(2) {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .mode {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
}
.isClickStyle {
  color: #0099ff !important;
}

.el-button:nth-child(1) {
  background-color: #33394e;
  color: #95a2b8;
  border: 0;
}
.el-button:nth-child(1):hover {
  color: #0099ff;
  border: 1px solid;
  box-sizing: border-box;
  border-color: #0099ff;
}
.el-button:nth-child(2) {
  color: #fff;
  border: 0;
  background-color: #0099ff;
}

:deep(.el-table tbody tr:hover > td) {
  background-color: transparent;
}
:deep(.el-input__inner) {
  background-color: #33394e !important;
  color: #0099ff;
}
:deep(.el-table .cell) {
  padding: 0 0 0 4%;
}
:deep(.el-table__body tr.hover-row > td) {
  background-color: transparent;
}
:deep(.el-table__fixed::before) {
  height: 0;
}
</style>
