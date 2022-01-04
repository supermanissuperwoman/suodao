<template>
  <div class="loginWrap">
    <div class="formWrap">
      <img class="logoImg" src="./assets/image/logoBj.svg" alt="" />
      <img class="titleImg" src="./assets/image/biaoti.svg" alt="" />
      <div class="explain">
        <div class="pWrap">
          <p>全天实时在线|项目运行统计|设备分级预警</p>
          <p>大数据应用分析|AI报告生成|海量场景覆盖</p>
        </div>
      </div>
      <div class="form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          status-icon
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item prop="userName">
            <i class="iconfont">&#xe61c;</i>
            <el-input
              style="backgroundColor:#fff;"
              type="text"
              autocomplete="off"
              v-model="ruleForm.userName"
              placeholder="账号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <i class="iconfont" style="fontSize:20px;">&#xe6cb;</i>
            <el-input
              type="password"
              autocomplete="off"
              v-model="ruleForm.passWord"
              placeholder="密码"
              @keyup.enter="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
          <el-form-item style="border:0;">
            <el-button type="primary" @click="submitForm('ruleForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="zhezhao"></div>
  </div>
</template>

<script>
import { getItem, setItem } from "./api/index";
import * as $ from "./utils/jquery.min.js";
export default {
  data() {
    return {
      ruleForm: {
        userName: "",
        passWord: "",
        accessToken: "",
        userData: {},
      },
      rules: {
        // 用户名校验规则
        userName: [
          { required: true, message: "请输入账户名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        passWord: [
          { required: true, message: "请输入账户密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http({
            method: "post",
            url: this.$urlObj.login,
            data: {
              userCode: this.ruleForm.userName,
              userPassword: this.ruleForm.passWord,
            },
          }).then((res) => {
            if (res.data.errorCode == "login0001") {
              this.$message.error("该用户不存在");
            }
            if (res.data.errorCode == "login0003") {
              this.$message.error("密码错误");
            }
            if (res.data.resultMessage == "Success") {
              this.ruleForm.userData = res.data.data;
              this.ruleForm.accessToken = res.headers.accesstoken;
              setItem("token", this.ruleForm.accessToken);
              setItem("userData", this.ruleForm.userData);
              this.$router.push("/index/overview");
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 370px;
  // border-bottom: 1px solid #000;
}
.loginWrap {
  width: 100%;
  height: 100%;
  background: url("./assets/image/loginBj.png") no-repeat;
  background-size: 100% 100%;
}
.formWrap {
  width: 88%;
  max-width: 480px;
  height: 46.47676%;
  min-height: 380px;
  // min-height: 378px;
  // min-width: 535px;
  z-index: 3;
  background-color: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
  .textLogin {
    width: 21.3%;
    position: absolute;
    left: 50%;
    top: 10.53%;
    transform: translateX(-50%);
  }
  .logoImg {
    position: absolute;
    left: 50%;
    width: 21.81818%;
    height: 13.15789%;
    transform: translateX(-50%);
    top: 5.37%;
  }
  .titleImg {
    width: 91.21212%;
    height: 7.26315%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 21.31578%;
  }
  .explain {
    width: 90.90909%;
    height: 16.12903%;
    border: 1px solid #2c395b;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 31.09%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    .pWrap {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    p {
      color: #32416e;
      font-size: 0.875rem;
      text-align: center;
      font-weight: bold;
    }
    @media screen and (min-width: 500px) {
      p {
        font-size: 1rem;
      }
    }
    @media screen and (min-width: 1200px) {
      p {
        font-size: 1.25rem;
      }
    }
  }

  .form {
    position: absolute;
    height: 52.06451%;
    bottom: 0;
    left: 50%;
    width: 84.81818%;
    transform: translateX(-50%);
    .el-form {
      width: 100%;
      height: 100%;
      .el-button {
        width: 100%;
        background-color: #32416e;
      }
    }
    .el-form-item {
      border-bottom: 1px solid #000;
      width: 100%;
      height: 26.74%;
      max-height: 43px;
      margin-bottom: 15px;
      box-sizing: border-box;
      i {
        position: absolute;
        z-index: 3;
        height: 100%;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        color: #32416e;
      }
    }
    .el-form-item:nth-child(3) {
      margin-bottom: 0 !important;
    }
  }
}
@media screen and (min-width: 1200px) {
  .formWrap {
    transform: skewX(-16deg);
  }
}
.zhezhao {
  width: 100%;
  height: 120%;
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  z-index: 2;
}
@media screen and (min-width: 500px) {
  .zhezhao {
    height: 100%;
  }
}
:deep(.el-input__inner) {
  border: 0 !important;
  padding-left: 10% !important;
  height: 100%;
}
:deep(.el-form-item__content) {
  margin-left: 0 !important;
  height: 100%;
}
:deep(.el-form-item__content .el-input) {
  height: 100%;
}
:deep(.el-form-item__error) {
  padding-top: 2px !important;
}
</style>
