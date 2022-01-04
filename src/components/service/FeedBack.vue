<template>
  <div class="feedBackWrap">
      <div class="navWrap">
          客户服务：<span>客户反馈</span>
      </div>
      <div class="friendlyTips">
          <p>功能操作不方便？没有想要的信息？有更好的建议和想法？欢迎您随时提出来！</p>
          <br>
          <p>我们会不断优化和改善，为您带来更好的用户体验！</p>
        </div>
      <div class="allItemWrap">
        <div class="selectEquipWrap">
            <div class="firstItemTitle"><span><i>*</i>1.反馈问题</span></div>
            <div class="selectWrap">
                <el-select v-model="projectValue" placeholder="选择项目"
                :popper-append-to-body="false"
                @change="handleSelectProjectItem">
                    <el-option
                    v-for="item in projectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="equipValue" placeholder="选择设备"
                :disabled="selectEquipDisabled"
                @change="handleChangeEquip">
                    <el-option
                    v-for="item in equipOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div v-show="selectEquipTextTipShow" class="textTip">请选择设备</div>
        </div>
        <div class="descripeProblemInfoWrap">
            <div class="problemTitle">
                <div><i>*</i>2.反馈内容</div>
                <div v-show="feedContentTipShow">反馈内容不能为空!</div>
            </div>
            <div class="textareaWrap">
                <textarea name="" id="" cols="30" rows="10"
                placeholder="请将您的建议或您遇到的问题写下来 |"
                @focus="handleTextareaFocus"
                @blur="handleTextareaBlur"
                v-model="textareaContent"></textarea>
            </div>
        </div>
        <div class="uploadImageWrap">
            <div class="uploadTitle">3.如需图片来说明问题，请上传（不可大于1M）</div>
            <div class="imageWrap">
                <div class="imageLeft imageCommon" @mouseover="handleMouseoverLeft()"
                @mouseleave="handleMouseLeave">
                    <el-upload
                     class="avatar-uploader"
                    :action="handleUpload()"
                    ref="uploadLeftRef"
                    name="file"
                    :auto-upload="true"
                    :headers="myHeaders"
                    list-type="picture-card"
                    :on-success="handleLeftPictureSuccess"
                    >
                    <i class="el-icon-plus"></i>
                    </el-upload>
                    <span @click="handleDeleteImage('left')" v-show="deleteLeftImageShow" class="deleteImage">
                        <i class="el-icon-delete"></i>
                    </span>
                    <span>添加图片</span>
                </div>
                <div class="imageMiddle imageCommon" @mouseover="handleMouseoverMiddle()"
                @mouseleave="handleMouseLeave">
                    <el-upload
                    class="avatar-uploader"
                    :action="handleUpload()"
                    ref="uploadMiddleRef"
                    name="file"
                    :before-upload="beforeAvatarUpload"
                    :auto-upload="true"
                    :headers="myHeaders"
                    list-type="picture-card"
                    :on-success="handleMiddlePictureSuccess">
                    <i class="el-icon-plus"></i>
                    </el-upload>
                    <span @click="handleDeleteImage('middle')" v-show="deleteMiddleImageShow" class="deleteImage">
                        <i class="el-icon-delete"></i>
                    </span>
                    <span>添加图片</span>
                </div>
                <div class="imageRight imageCommon" @mouseover="handleMouseoverRight()"
                @mouseleave="handleMouseLeave">
                    <el-upload
                    class="avatar-uploader"
                    :action="handleUpload()"
                    ref="uploadRightRef"
                    name="file"
                    :auto-upload="true"
                    :headers="myHeaders"
                    list-type="picture-card"
                    :on-success="handleRightPictureSuccess">
                    <i class="el-icon-plus"></i>
                    </el-upload>
                    <span @click="handleDeleteImage('right')" v-show="deleteRightImageShow" class="deleteImage">
                        <i class="el-icon-delete"></i>
                    </span>
                    <span>添加图片</span>
                </div>
            </div>
        </div>
        <div class="submitFeedInfoWrap">
            <div class="submitTitle"><i>*</i><span>4.请留下您的信息，以便我们回访或及时反馈</span></div>
            <div class="inputPhoneWrap">
                <div class="phoneWrap">
                    <span>手机号</span>
                    <input @blur="checkPhoneNumber"
                    @focus="handleInputFocus"
                    v-model="inputValue" type="text" placeholder="常用手机">
                    <div v-show="inputAlarmShow" class="inputErrorAlarm">{{inputAlarmContent}}</div>
                </div>
                <button :class="{'submitBtn':true, 'activeSubmitBtn':isActiveSubmitBtnShow}"
                :disabled="submitBtnDisabled" @click="handleSubmitClick">提交</button>
            </div>
        </div> 
      </div>
      <div v-show="isShowDialogTip" class="dialogTipWrap">
          <div class="contentWrap">
            <div class="textWrap">
                <p>感谢您的反馈，我们已以短信的方式发送给您，收到您的反馈会及时处理，请耐心等待！</p>
            </div>
            <div class="btnWrap">
                <button @click="isShowDialogTip = false" class="goBackBtn">返回</button>
            </div>
            
          </div>
      </div>
  </div>
</template>

<script>
import { getItem } from '../../api';
export default {
    data() {
        return {
            // 项目下拉框的数据
            projectOptions: [],
            // 设备下拉框的数据
            equipOptions: [],
            // 项目下来框双向绑定的值
            projectValue: "",
            // 设备下拉框双向绑定的值
            equipValue: "",
            // 设备下来框是否禁用
            selectEquipDisabled: true,
            // 没有选择设备时的提示文本是否显示
            selectEquipTextTipShow: false,
            // 反馈内容为输入的文字提示
            feedContentTipShow: false,
            // 手机号
            inputValue: "",
            // 手机号输入错误时，提示文本是否显示
            inputAlarmShow: false,
            // 手机号输入错误时，提示文本的内容
            inputAlarmContent: "",
            // 文本域中的内容
            textareaContent: "",
            // 手机号验证通过布尔值
            phoneNumberPass: false,
            // 必填项完成后，提交按钮激活
            isActiveSubmitBtnShow: false,
            // 提交按钮禁用标志
            submitBtnDisabled: true,
            // token值
            token: {},
            myHeaders:{},
            leftImageUrl: '',
            middleImageUrl: '',
            rightImageUrl: '',
            dialogVisible: false,
            deleteLeftImageShow: false,
            deleteMiddleImageShow: false,
            deleteRightImageShow: false,
            // 友情提示弹出框是否显示
            isShowDialogTip: false,
            // 添加图片的地址
        }
    },
    created() {
        // 获取Token
        this.token ={"Authorization":getItem("token")} 
        this.myHeaders.accessToken = getItem("token");
        // 获取项目下拉框的数据
        this.getProjectData();
    },
    methods: {
        async getProjectData() {
            let cache = {};
            const res = await this.$http.post(this.$urlObj.queryProject,{
                userCode: getItem("userData").userCode
            })
            if(res.status === 200 && res.data.resultCode == "0000") {
                this.projectOptions = [];
                for(let i = 0; i < res.data.data.length; i++) {
                    cache = {};
                    cache.label = res.data.data[i].projectName;
                    cache.value = res.data.data[i].projectCode;
                    this.projectOptions.push(cache)
                }
                
            }
        },
        // 选择项目后的处理函数
        async handleSelectProjectItem(value) {
            let cache = {};
            this.equipOptions = [];
            this.equipValue = "";
            const res = await this.$http.post(this.$urlObj.queryEquip,{
                userCode: getItem("userData").userCode,
                projectCode: value
            })
            if(res.status === 200 && res.data.resultCode == "0000") {
                for(let i = 0; i < res.data.data.length; i++) {
                    cache = {};
                    cache.label = res.data.data[i].equipmentName;
                    cache.value = res.data.data[i].equipmentCode;
                    this.equipOptions.push(cache);
                }
                
            }
            this.selectEquipDisabled = false;
        },
        // 选择设备后，"请选择设备"提示隐藏
        handleChangeEquip() {
            if(this.equipValue) {
                this.selectEquipTextTipShow = false;
            };
            if(this.textareaContent && this.phoneNumberPass) {
                this.submitBtnDisabled = false;
                this.isActiveSubmitBtnShow = true;
            }
        },
        // 文本域获取焦点事件
        handleTextareaFocus() {
            this.feedContentTipShow = false;
            if(this.equipValue == "") {
                this.selectEquipTextTipShow = true;
            }
        },
        // 文本域失去焦点事件
        handleTextareaBlur() {
            if(this.textareaContent == "") {
                this.feedContentTipShow = true;
                this.submitBtnDisabled = true;
                this.isActiveSubmitBtnShow = false;
            }else if(this.equipValue && this.phoneNumberPass) {
                this.submitBtnDisabled = false;
                this.isActiveSubmitBtnShow = true;
            }
            
        },
        // 图片上传前，判断图片大小，大于1M禁止上传
        beforeAvatarUpload(file) {
            const isLt1M = file.size / 1024 / 1024 <= 1
            if (!isLt1M) {
                return this.$message.error('上传的图片大小不能超过 1MB!');
            }
            return isLt1M;
        },
      handleLeftPictureSuccess(response,file,fileList) {
          this.leftImageUrl = URL.createObjectURL(file.raw)
      },
      handleMiddlePictureSuccess(response,file,fileList) {
          this.middleImageUrl = URL.createObjectURL(file.raw)
      },
      handleRightPictureSuccess(response,file,fileList) {
          this.rightImageUrl = URL.createObjectURL(file.raw)
      },
      handleMouseoverLeft(data) {
          if(this.leftImageUrl) {
            this.deleteLeftImageShow = true;
          }
      },
      handleMouseoverMiddle() {
          if(this.middleImageUrl) {
              this.deleteMiddleImageShow = true;
          }
      },
      handleMouseoverRight() {
          if(this.rightImageUrl) {
              this.deleteRightImageShow = true;
          }
      },
      handleMouseLeave() {
        this.deleteLeftImageShow = false;
        this.deleteMiddleImageShow = false;
        this.deleteRightImageShow = false;
      },
      handleDeleteImage(str) {
          if(str == 'left') {
            this.leftImageUrl = "";
            this.$refs.uploadLeftRef.clearFiles();
          }
          if(str == 'middle') {
            this.middleImageUrl = "";
            this.$refs.uploadMiddleRef.clearFiles();
          }
          if(str == 'right') {
            this.rightImageUrl = "";
            this.$refs.uploadRightRef.clearFiles();
          }
          
          this.deleteLeftImageShow = false;
          this.deleteMiddleImageShow = false;
          this.deleteRightImageShow = false;
      },
      handleUpload() {
        let token = getItem("token");
        this.myHeaders.accessToken=token;
        let url = 'http://192.168.111.7:8506/portal/common/uploadFile';
        return url;
      },
    //   手机号正则验证返回结果
      phoneNumberRegularResult(number) {
          return  /^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(number)
      },
    //   核对手机号输入结果，做相应处理
      checkPhoneNumber() {
          if(this.inputValue.length < 11) {
              if(this.inputValue.length == 0) {
                this.inputAlarmContent = "手机号不能为空!";
                this.submitBtnDisabled = true;
                this.isActiveSubmitBtnShow = false;
              }else {
                this.inputAlarmContent = "手机号长度不够11位!";
                this.submitBtnDisabled = true;
                this.isActiveSubmitBtnShow = false;
              }
              this.inputAlarmShow = true;
          }else {
              if(!this.phoneNumberRegularResult(this.inputValue)) {
                this.inputAlarmContent = "手机号输入格式不正确!";
                this.inputAlarmShow = true;
                this.submitBtnDisabled = true;
                this.isActiveSubmitBtnShow = false;
              }else{
                  this.phoneNumberPass = true;
                  if(this.equipValue && this.textareaContent) {
                    this.submitBtnDisabled = false;
                    this.isActiveSubmitBtnShow = true;
                  }else {
                      this.submitBtnDisabled = true;
                      this.isActiveSubmitBtnShow = false;
                  }
              }
          }
          if(this.equipValue == "") {
            this.selectEquipTextTipShow = true;
          }
          if(this.textareaContent == "") {
            this.feedContentTipShow = true;
          }
      },
    //   手机号获取焦点事件
    handleInputFocus() {
        this.inputAlarmShow = false;
        if(this.equipValue == "") {
            this.selectEquipTextTipShow = true;
        }
    },
    // 点击提交按钮事件
    handleSubmitClick() {
        this.isShowDialogTip = true;
    }
    }

}
</script>

<style lang="scss" scoped>
    .feedBackWrap {
        background-color: #232735;
        width: 100%;
        height: 1060px;
        position: relative;
        .allItemWrap {
            width: 100%;
            height: 83.8958534%;
            box-sizing: border-box;
            background-color: #232735;
        }
        @media screen and (min-width:768px) {
            .allItemWrap {
                padding-left: 14%;
            }
        }
        .dialogTipWrap {
            width: 100%;
            height: 100%;
            background: rgba(0,0,0, 0.2);
            position: absolute;
            top: 0;
            z-index: 10;
            .contentWrap {
                width: 70%;
                max-width: 510px;
                height: 302px;
                background-color: #fff;
                position: fixed;
                top: 35%;
                left: 50%;
                transform: translateX(-50%);
                font-size: 18px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-around;
                align-items: center;
                flex-direction: column;
                .textWrap {
                    width: 80%;
                }
                .btnWrap {
                    width: 80%;
                    max-width: 300px;
                    display: flex;
                    justify-content: center;
                    .goBackBtn {
                        width: 80%;
                        height: 36px;
                        background-color: #0099ff;
                        color: #fff;
                        cursor: pointer;
                    }
                }
                
            }
        }
        .navWrap {
            color: #0099FF;
            font-weight: bold;
            height: 43px;
            background-color: #070A1D;
            display: flex;
            align-items: center;
            width: 100%;
            left: 0;
            top: 0;
            padding-left: 10px;
            box-sizing: border-box;
            span {
                color: #758AAA;
                font-weight: normal;
            }
        }
        .friendlyTips {
            padding-top: 30px;
            padding-left: 14px;
            padding-right: 33px;
            color: #758AAA;
            max-width: 700px;
            height: 13.302%;
            margin-bottom: 26px
        }
        @media screen and (min-width:768px) {
            .friendlyTips {
                margin-left: 10%;
            }
        }
        .selectEquipWrap {
            height: 5%;
            width: 100%;
            max-width: 700px;
            div {
                float: left;
                height: 100%;
            }
            .firstItemTitle {
                display: flex;
                justify-content: left;
                align-items: center;
                width: 26%;
                max-width: 120px;
                padding-left: 6px;
                box-sizing: border-box;
                i {
                    font-size: 20px;
                    font-style: normal;
                    width: 12px;
                    height: 12px;
                    color: #0099ff;
                }
                span {
                    display: flex;
                    align-items: center;
                    color: #758AAA;
                }
            }
            .selectWrap {
                width: 50%;
                padding-left: 8px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                .el-select {
                    width: 45.6%;
                    height: 34px;
                }
                .el-select:nth-child(2) {
                    margin-left: 8px;
                }
            }
            .textTip {
                color: #0099FF;
                font-size: 14px;
                display: flex;
                align-items: center;
            }
        }
        .descripeProblemInfoWrap {
            width: 100%;
            max-width: 700px;
            height: 40.145245%;
            margin-top: 23px;
            box-sizing: border-box;
            padding-left: 6px;
            position: relative;
            .problemTitle {
                display: flex;
                align-items: center;
                height: 20px;
                width: 100%;
                max-width: 100%;
                color: #758AAA;
                div {
                    height: 100%;
                    display: flex;
                    align-items: center;
                }
                i {
                font-style: normal;
                width: 12px;
                height: 12px;
                font-size: 20px;
                color: #0099ff;
                margin-right: 2px;
                }
                div:nth-child(2) {
                    margin-left: 10px;
                    color: #0099ff;
                    font-size: 14px;
                }
            }
            .textareaWrap {
                height: 89.635855%;
                width: 90.93333%;
                max-width: 555px;
                position: absolute;
                left: 14px;
                background-color: #33394E;
                margin-top: 5.45%;
                textarea {
                    width: 100%;
                    height: 100%;
                    background-color: #33394E;
                    box-shadow: 0;
                    color: #758AAA;
                    resize:none;
                    padding-top: 17px;
                    box-sizing: border-box;
                    padding-left: 12px;
                    outline: none;
                    font-size: 16px;
                }
                textarea::-webkit-input-placeholder {
                    color: #758AAA;
                    font-size: 16px;
                    margin-left: 12px;
                }
            }
            @media screen and (min-width:1200px) {
                .textareaWrap {
                    height: 80%;
                    margin-top: 22px;
                }
            }
            
        }

        .uploadImageWrap {
            width: 100%;
            max-width: 700px;
            height: 15.744%;
            min-height: 144px;
            margin-top: 32px;
            .uploadTitle {
                width: 100%;
                padding-left: 13px;
                box-sizing: border-box;
                color: #758AAA;
            }
            .imageWrap {
                width: 100%;
                height: 72.3%;
                min-height: 100px;
                margin-top: 19px;
                display: flex;
                justify-content: left;
                align-items: center;
                padding-left: 6px;
                padding-right: 6px;
                box-sizing: border-box;
                div {
                    height: 100%;
                    width: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #33394E;
                    position: relative;
                    span {
                        position: absolute;
                        bottom: 9px;
                        color: #546682;
                        font-size: 12px;
                    }
                    .deleteImage {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 100%;
                        height: 100%;
                        opacity: 0.5;
                        background-color: #000;
                        cursor: pointer;
                        z-index: 4;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        i {
                            font-size: 24px;
                        }
                    }
                }
                .imageCommon {
                    margin-left: 14px;
                }
                :deep(.el-icon-plus:before) {
                    font-size: 22px;
                    color: #546682;
                }
                :deep(.el-upload-list) {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    background-color: #33394E;
                }
                :deep(.el-upload--picture-card) {
                    height: 100%;
                    width: 100%;
                }
                :deep(.el-upload--picture-card i) {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                    z-index: 2;
                }
                :deep(.el-upload-list--picture-card .el-upload-list__item) {
                    width: 100%;
                    height: 100px;
                    margin-top: 0;
                    border-radius: 0;
                    border: 0;
                    z-index: 4;
                }
                :deep(.el-upload-list--picture-card .el-upload-list__item-actions:hover) {
                    display: none;
                }
            }
        }
        @media screen and (min-width:1200px) {
            .uploadImageWrap {
                margin-top: 28px;
            }
        }
        .submitFeedInfoWrap {
            width: 100%;
            max-width: 700px;
            height: 20%;
            margin-top: 32px;
            padding-left: 7px;
            color: #758AAA;
            position: relative;
            box-sizing: border-box;
            .submitTitle {
                display: flex;
                align-items: center;
                height: 20px;
              i {
                color: #0099ff;
                font-size: 18px;
                font-style: normal;
                display: flex;
                width: 12px;
                height: 12px;
                align-items: bottom;
                }  
            }
            .inputPhoneWrap {
                margin-top: 22px;
                margin-left: 12px;
                .phoneWrap {
                    height: 80px;
                }
                input {
                    width: 260px;
                    height: 33px;
                    margin-left: 7px;
                    border: 0;
                    outline: none;
                    background-color: #33394E;
                    padding-left: 14px;
                    box-sizing: border-box;
                    color: #0099ff;
                }
                input::-webkit-input-placeholder {
                    color: #758AAA;
                    font-size: 16px;
                    margin-left: 12px;
                }
                .inputErrorAlarm {
                    margin-top: 12px;
                    margin-left: 54px;
                    width: 200px;
                    color: #0099ff;
                    font-size: 14px;
                }
                .submitBtn {
                    width: 317px;
                    height: 40px;
                    background-color: #33394E;
                    border: 0;
                    color: #fff;
                    cursor: pointer;
                }
                @media screen and (min-width:1200px) {
                    .submitBtn {
                        position: absolute;
                        top: 36px;
                        right: 0;
                    }
                }
            }
            
        }
        
    }
   
    @media screen and (min-width:1200px) {
        .feedBackWrap {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            width: 81.145833%;
            height: 98%;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            .allItemWrap {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding-left: 21%;
            }
        }
    }
    .activeSubmitBtn {
        background-color: #0099ff !important;
    }
    :deep(.select-trigger) {
        height: 100%;
    }
    :deep(.el-input) {
        height: 100%;
    }
    :deep(.el-input__inner) {
        height: 100%;
        font-size: 14px;
        padding-left: 2px;
        padding-right: 19px;
        color: #AFBED6;
    }
    :deep(.el-input__suffix) {
        right: -2px;
        top: -2px;
    }
    :deep(.el-select__popper) {
        width: 96vw;
        max-width: 362px;
    }
</style>