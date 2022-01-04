<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="refPsdForm" label-width="100px">
    <el-form-item label="原密码" prop="prePsd">
        <el-input v-model.number="ruleForm.prePsd"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="oldPsd">
        <el-input type="password" v-model="ruleForm.oldPsd" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认新密码" prop="newPsd">
        <el-input type="password" v-model="ruleForm.newPsd" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm('refPsdForm')">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {getItem, clearSessionStorage} from '../../api/index'
export default {
    data() {
      // 原密码的验证规则
      var validatePrePsd = (rule,value,callback)=>{
      let reg= /[0-9]{6,18}$/
      if(!reg.test(value)){callback(new Error('密码必须是6-18位的数字'))
      }else{
          callback()
      }
    };
      // 新密码的验证规则
      var validateOldPsd = (rule, value, callback) => {
        let reg = /[0-9]{6,18}$/
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if(!reg.test(value)) {
            callback(new Error('密码必须是6-18位的数字'))
          }else {
            if (this.ruleForm.newPsd !== '') {
            this.$refs.refPsdForm.validateField('newPsd');
          }
          callback();
          }
          
        }
      };
      // 确认新密码的验证规则
      var validateNewPsd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.oldPsd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
        return {
            ruleForm: {
            oldPsd: '',
            newPsd: '',
            prePsd: ''
            },
            rules: {
              // 新密码的验证规则
            oldPsd: [
                { validator: validateOldPsd, trigger: 'blur' }
            ],
            // 确认新密码的验证规则
            newPsd: [
                { validator: validateNewPsd, trigger: 'blur' }
            ],
            // 原密码的验证规则
            prePsd: [{validator: validatePrePsd, trigger: 'blur'}
                  ],
            }
        }
    },
    created() {
        
    },
    mounted() {
        this.resetForm('refPsdForm')
    },
    
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            const res = await this.$http.post(this.$urlObj.login, {"userCode": getItem("userData").userCode, "userPassword": this.ruleForm.prePsd})
            if(res.data.errorCode && res.data.errorCode== "login0003") {
              this.$message.error('原密码错误');
            }
            if(res.data.resultCode && res.data.resultCode == "0000") {
              const res = await this.$http.post(this.$urlObj.updatePassword, {
                "userCode": getItem("userData").userCode,
                "oldPassword": this.ruleForm.prePsd,
                "newPassword": this.ruleForm.newPsd
              })
              if(res.data.resultCode && res.data.resultCode == "0000") {
                clearSessionStorage();
                this.$message.success('密码修改成功，请重新登录');
                this.$router.push('/login')
              }
            }
          } else {
            return false;
          }
        });
      },
    //   重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style lang="scss" scoped>
.el-form {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  .el-form-item {
    width: 100%;
    max-width: 500px;
  }
}
.el-input {
    width: 100%;
}
.el-button {
    border: 0;
    width: 30%;
    // height: 20%;
    margin-left: 99px;
    min-width: 100px;
}
:deep(.el-form-item__content) {
  width: 50%;
}
</style>