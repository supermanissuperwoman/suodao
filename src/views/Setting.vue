<template>
  <el-row>
    <el-col :xs="24" :sm="24" :md="24" :lg="5" class="asideCol">
      <!-- 侧边栏 开始 -->
      <div class="sidebar">
        <div class="personInfo">
          <img src="../assets/image/head.svg" alt="" />
          <div class="companyName">{{ userName }}</div>
          <div class="account">账号: {{ accountName }}</div>
          <hr />
        </div>
        <div class="btnWrap">
          <div class="addPersonBtn">
            <el-button @click="addperson" :class="{ active: isPersonOpen }"
              >添加联系人</el-button
            >
          </div>
          <div class="changePsdBtn">
            <el-button @click="changePassword" :class="{ active: isPsdOpen }"
              >修改密码</el-button
            >
          </div>
        </div>
      </div>
      <!-- 侧边栏 结束 -->
    </el-col>
    <el-col
      :xs="24"
      :sm="24"
      :md="24"
      :lg="19"
      :class="{ mainCol: true, checkpassword: isCheckpassword }"
    >
      <!-- 主题区域 开始 -->
      <div class="main">
        <!-- 添加联系人 -->
        <div class="addPersonContainer" v-if="isPersonOpen">
          <div class="addPerson">
            <div class="title">设置项目管理人员</div>
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              class="demo-ruleForm"
            >
              <el-form-item class="select" label="选择" prop="project">
                <el-select
                  v-model="ruleForm.project"
                  placeholder="请选择项目"
                  value-key="value"
                  :title="ruleForm.project.label"
                >
                  <el-option
                    v-for="item in ruleForm.projectData"
                    :key="item.value"
                    :label="item.label"
                    :value="item"
                  >
                  </el-option>
                </el-select>
                <el-checkbox-group
                  v-model="ruleForm.selectedValue"
                  style="display: none"
                >
                  <el-checkbox label="日报" name="type"></el-checkbox>
                  <el-checkbox label="周报" name="type" disabled></el-checkbox>
                  <!-- <el-checkbox label="报警" name="type" disabled></el-checkbox> -->
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="姓名" prop="lastName" class="lastName">
                <el-input
                  @blur="handleLastNameBlur"
                  v-model="ruleForm.lastName"
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="phoneNum" class="phoneNum">
                <el-input
                  @blur="handlePhoneBlur"
                  v-model="ruleForm.phoneNum"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  :class="{ addBtnActive: isAddBtnActive }"
                  @click="personDataToList('ruleForm')"
                  >添加</el-button
                >
                <span class="remind">最多只能添加3人</span>
              </el-form-item>
            </el-form>
          </div>

          <!-- 列表开始 -->
          <div class="personList">
            <div class="listContainer">
              <div class="listTilte">已添加人员</div>
              <el-input
                v-model="search"
                class="searchInput"
                placeholder="项目名称 | 姓名 | 手机号"
              />
              <el-table
                :data="
                  tableData
                    .filter(
                      (data) =>
                        !search ||
                        data.projectName
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        data.fullName
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        data.phoneNum
                          .toLowerCase()
                          .includes(search.toLowerCase())
                    )
                    .slice((currentPage - 1) * 10, currentPage * 10)
                "
                style="width: 100%"
                :max-height="410"
                :header-cell-style="headerStyle"
                :cell-style="cellStyle"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  label="项目名称"
                  prop="projectName"
                  show-overflow-tooltip
                  min-width="100"
                  sortable
                >
                </el-table-column>
                <el-table-column label="姓名" prop="fullName">
                </el-table-column>
                <el-table-column label="手机号" prop="phoneNum" min-width="120">
                </el-table-column>
                <!-- <el-table-column
              label="选择"
              min-width="240"
              > -->
                <!-- 作用域插槽 获取该行的数据 -->
                <!-- <template v-slot="scope"> -->
                <!-- <el-checkbox label="日报" name="type" v-model="scope.row.dailyState" disabled></el-checkbox>
                <el-checkbox label="周报" name="type" v-model="scope.row.weeklyState" disabled></el-checkbox>
                <el-checkbox label="报警" name="type" v-model="scope.row.alarmState" disabled></el-checkbox> -->
                <!-- </template> -->
                <!-- </el-table-column> -->
                <el-table-column align="right">
                  <!-- <template #header>
                <el-input
                  v-model="search"
                  size="mini"
                  class="searchInput"
                  placeholder="输入关键字搜索"/>
              </template> -->
                  <!-- <template #default="scope">

                <el-button
                  size="mini"
                  type="danger"
                  class="editBtn"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  class="deleteBtn"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template> -->
                </el-table-column>
              </el-table>
              <!-- 分页开始 -->
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="1"
                :pager-count="5"
                background
                layout="total, prev, pager, next, jumper"
                :total="
                  tableData.filter(
                    (data) =>
                      !search ||
                      data.projectName
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      data.fullName
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      data.phoneNum.toLowerCase().includes(search.toLowerCase())
                  ).length
                "
              >
              </el-pagination>
              <!-- 分页结束 -->
            </div>
          </div>
          <!-- 列表结束 -->
        </div>
        <!-- 修改密码 -->
        <div class="changePsdContainer" v-if="isPsdOpen">
          <change-password></change-password>
        </div>
        <!-- 修改密码结束 -->

        <!-- 编辑对话框开始 -->
        <el-dialog title="编辑" v-model="dialogVisible" width="30%">
          <el-checkbox label="日报" name="type"></el-checkbox>
          <el-checkbox label="周报" name="type" disabled></el-checkbox>
          <el-checkbox label="报警" name="type" disabled></el-checkbox>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </span>
          </template>
        </el-dialog>
        <!-- 编辑对话框结束 -->
      </div>
      <!-- 主题区域 结束 -->
    </el-col>
  </el-row>
</template>

<script>
import { getItem } from "../api/index";
import ChangePassword from "../components/setting/ChangePassword.vue";
export default {
  data() {
    // 验证手机号
    var checkMobile = (rule, value, callback) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入手机号"));
        } else {
          if (regMobile.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    return {
      // 公司名称
      userName: "",
      // 账户名称
      accountName: "",
      // 修改密码框显示开关
      isPsdOpen: false,
      // 添加联系人显示开关
      isPersonOpen: true,
      // 添加时的表单数据，用户选择项目，日报，周报，报警，姓名，手机号的一系列信息
      ruleForm: {
        lastName: "",
        phoneNum: "",
        projectData: [],
        project: "",
        selectedValue: [],
      },
      isAddBtnActive: false,
      // value: [],
      rules: {
        // 校验输入姓名的规则
        lastName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 4, message: "长度在 2 到 4 个字符", trigger: "blur" },
        ],
        // 校验输入手机号的规则
        phoneNum: [{ required: true, validator: checkMobile, trigger: "blur" }],
        // 校验选择项目的u规则
        project: [{ required: true, message: "请选择项目", trigger: "change" }],
      },

      tableData: [],
      // 当前页
      currentPage: 1,
      search: "",
      // 编辑联系人对话框开关
      dialogVisible: false,
      // 当前编辑行的数据
      currentRowData: {},
      // 表格头部的样式
      headerStyle: {
        color: "#D8D8D8",
        textAlign: "center",
        border: 0,
        width: "1004px",
        height: "44px",
        background: "#33394E",
        padding: 0,
      },
      // 表格body单元格样式
      cellStyle: {
        height: "34px",
        padding: 0,
        border: 0,
        textAlign: "center",
        color: "#758AAA",
      },
      // 修改密码的样式开关
      isCheckpassword: false,
    };
  },
  components: {
    ChangePassword,
  },
  created() {
    this.userName = getItem("userData").userName;
    this.accountName = getItem("userData").userCode;
    this.getProject();
    // 获取当前账户的所有联系人
    this.getPerson();
  },
  methods: {
    // 控制单双行的背景色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "evenSet";
      }
      return "oddSet";
    },
    // 切换到修改密码
    changePassword() {
      if (document.body.clientWidth > 375) {
        this.isCheckpassword = false;
      } else {
        this.isCheckpassword = true;
      }
      this.isPsdOpen = true;
      this.isPersonOpen = false;

      // 离开添加联系人界面，初始化表单数据
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
      // 离开添加联系人界面，初始化多选框
      (this.ruleForm.selectedValue = []),
        // 离开添加联系人界面，初始化搜索框
        (this.search = "");
    },

    // 切换到添加联系人
    addperson() {
      this.isPsdOpen = false;
      this.isPersonOpen = true;
      this.isCheckpassword = false;
    },

    // 获取当前账户下的所有项目
    async getProject() {
      const res = await this.$http.post(this.$urlObj.queryProject, {
        userCode: getItem("userData").userCode,
      });
      if (res.status === 200) {
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          let cache = {};
          cache.label = data[i].projectName;
          cache.value = data[i].projectCode;
          this.ruleForm.projectData.push(cache);
        }
      }
    },

    // 获取当前账户下的所有联系人
    async getPerson() {
      const res = await this.$http.post(
        this.$urlObj.queryProjectContactPerson,
        { userCode: getItem("userData").userCode }
      );
      if (res.status === 200) {
        let data = res.data.data;
        this.tableData = [];
        for (let i = 0; i < data.length; i++) {
          let cache = {};
          cache.projectName = data[i].projectName;
          cache.fullName = data[i].name;
          cache.phoneNum = data[i].phoneNumber;
          cache.dailyState = Boolean(data[i].isSendDailyReport);
          cache.weeklyState = Boolean(data[i].isSendWeeklyReport);
          cache.alarmState = Boolean(data[i].isSendAlarmInfo);
          cache.contactPersonCode = data[i].contactPersonCode;
          this.tableData.push(cache);
        }
      }
    },
    // 将添加的联系人更新到列表中
    personDataToList(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let isSendDailyReport = 0;
          let isSendWeeklyReport = 0;
          let isSendAlarmInfo = 0;
          if (this.ruleForm.selectedValue.length !== 0) {
            for (let i = 0; i < this.ruleForm.selectedValue.length; i++) {
              if (this.ruleForm.selectedValue[i] == "日报") {
                isSendDailyReport = 1;
              } else if (this.ruleForm.selectedValue[i] == "周报") {
                isSendWeeklyReport = 1;
              } else {
                isSendAlarmInfo = 1;
              }
            }
          }
          const res = await this.$http.post(
            this.$urlObj.addProjectContactPerson,
            {
              projectCode: this.ruleForm.project.value,
              isSendDailyReport: isSendDailyReport,
              isSendWeeklyReport: isSendWeeklyReport,
              isSendAlarmInfo: isSendAlarmInfo,
              name: this.ruleForm.lastName,
              phoneNumber: this.ruleForm.phoneNum,
            }
          );
          if (res.status === 200) {
            this.$message.success("联系人添加成功");
            // 更新表格数据
            this.getPerson();
            // 重置表单
            if (this.$refs.ruleForm) {
              this.$refs.ruleForm.resetFields();
            }
            // 重置多选框
            this.ruleForm.selectedValue = [];
          } else {
            this.$message.error("联系人添加失败");
          }
        } else {
          return false;
        }
      });
    },

    // 将列表数据更新为当前页指定的数据
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    // 删除行
    handleDelete(index, row) {
      this.$confirm("该联系人将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            method: "post",
            url: this.$urlObj.deleteProjectContactPerson,
            data: { contactPersonCode: row.contactPersonCode },
          }).then(() => {
            // 更新表格数据
            this.getPerson();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑行
    handleEdit(index, row) {
      // row.dailyState = true;
      // 打开编辑对话框
      this.dialogVisible = true;
      // 获取当前要编辑的联系人的数据
      this.currentRowData = row;
    },

    // 确定编辑并保存
    confirmEdit(rowData) {
      this.dialogVisible = false;
    },

    // handleClose(done) {
    //     this.$confirm('确认关闭？')
    //       .then(_ => {
    //         done();
    //       })
    //       .catch(_ => {});
    //   }
    //手机输入框失去焦点事件
    handlePhoneBlur() {
      if (
        this.ruleForm.selectedValue &&
        this.ruleForm.lastName &&
        this.ruleForm.phoneNum
      ) {
        this.isAddBtnActive = true;
      } else {
        this.isAddBtnActive = false;
      }
    },
    handleLastNameBlur() {
      if (
        this.ruleForm.selectedValue &&
        this.ruleForm.lastName &&
        this.ruleForm.phoneNum
      ) {
        this.isAddBtnActive = true;
      } else {
        this.isAddBtnActive = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.asideCol {
  width: 100%;
  height: 315px;
  margin-bottom: 20px;
  .sidebar {
    width: 100%;
    height: 100%;
    background-color: #232735;
    margin-top: 20px;
    .personInfo {
      width: 100%;
      height: 60.63492%;
      color: #758aaa;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-around;
      padding-top: 34px;
      box-sizing: border-box;
      img {
        width: 46px;
      }
    }
    @media screen and (min-width: 1200px) {
      .personInfo {
        height: 20%;
      }
    }
    hr {
      width: 60%;
      height: 1px;
      border: 0;
      background-color: #414964;
    }
    .btnWrap {
      width: 100%;
      height: 39.36508%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      div {
        width: 160px;
        .el-button {
          width: 100%;
          background-color: #2b3040;
          border: 0;
        }
      }
    }
    @media screen and (min-width: 768px) {
      .btnWrap {
        width: 50%;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        justify-content: space-evenly;
        align-items: center;
      }
    }
    @media screen and (min-width: 1200px) {
      .btnWrap {
        height: 29.36508%;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    }
  }
}
@media screen and (min-width: 1200px) {
  .el-row {
    height: 100%;
    .asideCol {
      height: 100%;
      padding-bottom: 60px;
      max-width: 235px;
      .sidebar {
        margin-top: 0;
        padding-top: 92px;
        box-sizing: border-box;
        height: 986px;
      }
    }
  }
}
.mainCol {
  width: 100%;
  height: 990px;
  margin-top: 20px;
  .main {
    width: 100%;
    height: 98%;
    background-color: #1c202e;
    .addPersonContainer {
      width: 100%;
      height: 100%;
      .addPerson {
        width: 100%;
        height: 36.63636%;
        background-color: #232735;
        padding-top: 28px;
        box-sizing: border-box;
        .title {
          color: #0099ff;
          font-size: 18px;
          font-weight: bold;
          margin-left: 13px;
        }
        .el-form {
          margin-top: 30px;
          margin-left: 14px;
          .el-select {
            width: 70%;
            margin-left: 14px;
          }
          .el-checkbox-group {
            position: absolute;
            top: 0;
            right: -90px;
            .el-checkbox {
              margin-right: 17px;
              width: 30%;
              color: #758aaa;
            }
          }
          .el-button {
            width: 150px;
            margin-left: 65px;
            margin-right: 16px;
            margin-top: 14px;
            background-color: #33394e;
            border: 0;
            color: #fff;
          }
          .remind {
            color: #fff;
          }
        }
      }
      @media screen and (min-width: 1200px) {
        .addPerson {
          height: 360px;
          padding-left: 117px;
        }
      }
      .personList {
        width: 100%;
        height: 610px;
        background-color: #1c202e;
        padding-top: 21px;
        box-sizing: border-box;
        .listContainer {
          width: 100%;
          height: 100%;
          position: relative;
          .listTilte {
            margin-bottom: 31px;
            color: #0099ff;
            padding-top: 6px;
            padding-left: 14px;
            display: block;
            box-sizing: border-box;
            font-size: 18px;
            font-weight: bold;
          }
          .el-input {
            position: absolute;
            width: 48.91304%;
            max-width: 300px;
            height: 30px;
            top: 0;
            right: 9px;
            border-radius: 0;
          }
          .el-pagination {
            margin-top: 20px;
            width: 93%;
            display: flex;
            justify-content: flex-end;
          }
          @media screen and (min-width: 1200px) {
            .el-pagination {
              margin-top: 2px;
            }
          }
        }
      }
      @media screen and (min-width: 1200px) {
        .personList {
          height: 57.86364%;
          padding-left: 117px;
          padding-right: 121px;
        }
      }
    }
  }
  @media screen and (min-width: 1366px) {
    .main {
      width: 102%;
    }
  }
  @media screen and (min-width: 1440px) {
    .main {
      width: 104%;
    }
  }
  @media screen and (min-width: 1600px) {
    .main {
      width: 106%;
    }
  }
  @media screen and (min-width: 1700px) {
    .main {
      width: 109%;
    }
  }
}
@media screen and (min-width: 1200px) {
  .mainCol {
    height: 100%;
    padding-left: 28px;
    margin-top: 0;
    padding-top: 20px;
    padding-bottom: 60px;
    box-sizing: border-box;
  }
}
.checkpassword {
  height: 300px !important;
}
:deep(.el-form-item__label) {
  color: #758aaa;
}
:deep(.lastName .el-form-item__label) {
  margin-right: 14px;
}
:deep(.lastName .el-form-item__content) {
  width: 73.09782%;
  max-width: 288px;
}
:deep(.phoneNum .el-form-item__content) {
  width: 73.09782%;
  max-width: 288px;
}
:deep(.el-pagination .number) {
  background-color: #1c202e !important;
  margin: 0 !important;
  padding: 0 !important;
}
:deep(.el-pagination .active) {
  color: #0099ff !important;
}
:deep(.el-pagination button) {
  background-color: #1c202e !important;
  color: #fff !important;
  margin: 0 !important;
}
:deep(.el-pagination .more) {
  background-color: #1c202e !important;
  margin: 0 !important;
  padding: 0 !important;
}
:deep(.el-pagination .el-pagination__total) {
  margin: 0 11px 0 0 !important;
  color: #758aaa;
}

:deep(.el-pagination .el-pagination__jump) {
  margin-left: 0 !important;
}
:deep(.el-pagination__editor) {
  width: 20px !important;
}
:deep(.el-pagination__editor .el-input__inner) {
  width: 20px !important;
}

:deep(.el-form-item__content) {
  margin-left: 0 !important;
  margin-bottom: 0.5%;
  float: left;
}

.active {
  color: #0099ff;
}
.addBtnActive {
  background-color: #0099ff !important;
}

:deep(.el-input__inner) {
  background: #33394e !important;
  border: 0px !important;
  color: #0099ff;
}
:deep .el-table tbody tr:hover > td {
  background-color: #414964 !important;
}
:deep .el-table__body-wrapper {
  background-color: #1c202e;
}
:deep .el-checkbox .is-checked .el-checkbox__inner {
  background-color: #409eff !important;
  border: 1px solid #409eff !important;
}
:deep .el-checkbox .is-checked .el-checkbox__inner::after {
  border-color: #ffffff !important;
}
:deep .el-checkbox .is-checked .el-checkbox__inner span {
  color: #40adfb !important;
}
:deep .el-checkbox .is-checked .is_disabled .el-checkbox__label {
  color: #40adfb !important;
}
:deep(.el-table::before) {
  z-index: inherit;
}
</style>