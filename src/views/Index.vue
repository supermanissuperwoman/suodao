<template>
  <div class="rootContainer">
    <!-- 头部开始 -->
    <el-row class="rowHeader">
      <el-col class="menuCol hidden-sm-and-up" :xs="3" :sm="3">
        <i class="iconfont" @click.stop="handleClickMenu">&#xe62c;</i>
      </el-col>
      <el-col class="logoCol" :xs="18" :sm="6" :md="8">
        <img src="../assets/image/lqlogo.svg" alt="" />
      </el-col>
      <el-col class="hidden-sm-and-down isDisplay menu-sm" :sm="16" :md="14">
        <div class="menuItemSm">
          <ul @click="handleClickMenuItemSm($event)">
            <li>
              <router-link to="/index/overview" active-class="activeSm"
                >监控概览</router-link
              >
            </li>
            <li>
              <router-link to="/index/detail" active-class="activeSm"
                >实时详情</router-link
              >
            </li>
            <li>
              <router-link to="/index/report" active-class="activeSm"
                >统计报表</router-link
              >
            </li>
            <li>
              <router-link to="/index/setting" active-class="activeSm"
                >系统设置</router-link
              >
            </li>
            <!-- <li>
              <span :class="{'showActiveService': isShowActiveService}" @click.stop="handleClickService">客户服务
                <i class="el-icon-caret-bottom"></i>
              </span>
              <ul @click.stop="handleClickServiceMenuSm($event)" v-show="isShowServiceMenu" class="serviceMenuSm">
                <li><router-link to="/index/service/feedback" active-class="activeSm">客户反馈</router-link></li>
                <li><router-link to="/index/service/course" active-class="activeSm">系统教程</router-link></li>
              </ul>
            </li> -->
          </ul>
        </div>
      </el-col>
      <el-col class="personCol" :xs="3" :sm="1" :md="1">
        <div
          @mouseenter="personFlag = true"
          @mouseleave="personFlag = false"
          class="personCount"
        >
          <img class="smallLogo" src="../assets/image/person.svg" alt="" />
          <div v-show="personFlag" class="personWrap">
            <img src="../assets/image/head.svg" alt="" />
            <span class="company">{{ userInfo.userName }}</span>
            <span class="userCount">账号：{{ userInfo.userCode }}</span>
            <button @click="logOut()">退出登录</button>
          </div>
        </div>
      </el-col>

      <div class="menuItem" v-if="isShowMenu">
        <ul
          @click.stop="handleClickItem($event)"
          style="width: 100%; height: 100%"
        >
          <li>
            <router-link to="/index/overview" active-class="active"
              >监控概览</router-link
            >
          </li>
          <li>
            <router-link to="/index/detail" active-class="active"
              >实时详情</router-link
            >
          </li>
          <li>
            <router-link to="/index/report" active-class="active"
              >统计报表</router-link
            >
          </li>
          <li>
            <router-link to="/index/setting" active-class="active"
              >系统设置</router-link
            >
          </li>
          <!-- <li>
              <span>客户服务
                <i @click.stop="isShowServiceMenu = !isShowServiceMenu" class="el-icon-caret-bottom"></i>
              </span>
              
              <ul v-show="isShowServiceMenu" class="serviceMenu">
                <li><router-link to="/index/service/feedback" active-class="serviceActive">客户反馈</router-link></li>
                <li><router-link to="/index/service/course" active-class="serviceActive">系统教程</router-link></li>
              </ul>
            </li> -->
        </ul>
      </div>
    </el-row>
    <!-- 头部结束 -->

    <!-- 主体内容开始 -->
    <el-row style="height: 92.51%; padding: 0 1.051%">
      <el-col>
        <router-view></router-view>
      </el-col>
    </el-row>
    <!-- 主体内容结束 -->
  </div>
</template>

<script>
import BigMap from "../components/child/BigMap.vue";
import { getItem, clearSessionStorage } from "../api/index";
import { eventBus } from "@ai-zen/event-bus";
export default {
  data() {
    return {
      personFlag: false,
      userInfo: {},
      // 菜单的显示与隐藏标志
      isShowMenu: false,
      //
      isActive: true,
      // 客户服务的下来菜单是否显示
      isShowServiceMenu: false,
      // 当菜单在上方时，客户服务激活样式标志
      isShowActiveService: false,
    };
  },
  components: {
    BigMap,
  },
  created() {
    this.userInfo = getItem("userData");
    if (this.$route.path.indexOf("service") != -1) {
      this.isShowActiveService = true;
    } else {
      this.isShowActiveService = false;
    }
  },
  mounted() {
    window.addEventListener("click", (event) => {
      this.isShowMenu = false;
      this.isShowServiceMenu = false;
    });
  },
  methods: {
    // 打开个人中心
    openPerson() {},
    // 退出登录
    logOut() {
      // window.sessionStorage.removeItem("token");
      clearSessionStorage();
      this.$router.push("/login");
    },
    // 点击菜单事件
    handleClickMenu() {
      this.isShowMenu = !this.isShowMenu;
      if (this.$route.path.indexOf("service") !== -1) {
        this.isShowServiceMenu = true;
      } else {
        this.isShowServiceMenu = false;
      }
      eventBus.emit("closeDownWrap");
    },
    // 点击单个菜单事件
    handleClickItem(event) {
      if (event.target.innerHTML.indexOf("客户服务") !== -1) {
        this.isShowMenu = true;
        this.isShowServiceMenu = !this.isShowServiceMenu;
      } else {
        this.isShowMenu = false;
        this.isShowServiceMenu = false;
      }
    },
    // 点击客户服务事件
    handleClickService() {
      this.isShowServiceMenu = !this.isShowServiceMenu;
      if (this.$route.path.indexOf("service") != -1) {
        this.isShowActiveService = true;
      } else {
        this.isShowActiveService = false;
      }
    },
    handleClickMenuItemSm(event) {
      if (event.target.innerHTML != "客户服务") {
        this.isShowActiveService = false;
      }
    },
    handleClickServiceMenuSm(event) {
      let targetInnerhtml = event.target.innerHTML;
      if (targetInnerhtml == "客户反馈" || targetInnerhtml == "系统教程") {
        this.isShowActiveService = true;
        this.isShowServiceMenu = false;
      } else {
        this.isShowActiveService = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rootContainer {
  width: 100%;
  height: 100%;
  .rowHeader {
    width: 100%;
    height: 7.4074%;
    min-height: 60px;
    border-bottom: 1px solid #394d65;
    // 菜单样式开始
    .menuCol {
      color: #fff;
      height: 30.75%;
      min-height: 60px;
      position: relative;
      i {
        font-size: 40px;
        text-align: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .menuItem {
      width: 40.8542%;
      max-width: 200px;
      height: 100%;
      min-height: 300px;
      background-color: #1c1f30;
      z-index: 999;
      li {
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #394d65;
        border-top: 1px solid #394d65;
        border-right: 1px solid #394d65;
        box-sizing: border-box;
        a {
          color: #0099ff;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      li:last-child {
        border-bottom: 1px solid #394d65;
        position: relative;
      }
      .serviceMenu {
        position: absolute;
        top: 100%;
        width: 100%;
        height: 200%;
        border: 1px solid #394d65;
        border-top: 0;
        background-color: #1c1f30;
        li {
          border: 0;
          height: 50%;
          font-size: 14px;
        }
      }
      span {
        width: 100%;
        height: 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #0099ff;
      }
      i {
        position: absolute;
        right: 20%;
        color: #0099ff;
      }
      @media screen and (min-width: 500px) {
        i {
          right: 25%;
        }
      }
    }
    // 尺寸大于等于768px的样式
    .menu-sm {
      width: 100%;
      height: 100%;
      .menuItemSm {
        width: 95%;
        height: 100%;
        ul {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-around;
          li {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          @media screen and (min-width: 1200px) {
            li {
              font-size: 20px;
            }
          }
          span {
            color: #fff;
            cursor: pointer;
          }
          .serviceMenuSm {
            position: absolute;
            width: 100%;
            height: 100px;
            top: 100%;
            z-index: 2;
            display: flex;
            flex-direction: column;
            background-color: #1c1f30;
            border: 1px solid #494c59;
            li {
              width: 100%;
              height: 50%;
              font-size: 14px;
              a {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
          }
        }
      }
    }
    @media screen and (min-width: 768px) {
      .menu-sm {
        padding-left: 100px;
      }
    }
    @media screen and (min-width: 1200px) {
      .menu-sm {
        padding-left: 140px;
      }
    }
    // 菜单样式结束

    // logo样式开始
    .logoCol {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        // width: 38.9140625%;
        height: 32.5%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-55%, -50%);
      }
      // 当屏幕尺寸大于768px时的样式
      @media screen and (min-width: 768px) {
        img {
          height: 32.5%;
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      @media screen and (min-width: 1200px) {
        img {
          height: 38.5%;
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    // logo样式结束
    // 个人中心样式开始
    .personCol {
      width: 100%;
      height: 100%;
      position: absolute;
      right: 0;
      .personCount {
        width: 100%;
        height: 100%;
        position: absolute;
        right: 0;
        .smallLogo {
          height: 100%;
          max-height: 80px;
          position: absolute;
          right: 1px;
        }
        .personWrap {
          width: 600%;
          max-width: 260px;
          height: 180px;
          position: absolute;
          right: 0;
          top: 100%;
          box-sizing: border-box;
          background-color: #232735;
          z-index: 999999;
          img {
            width: 20%;
            position: absolute;
            top: 8%;
            left: 50%;
            transform: translateX(-50%);
          }
          span {
            position: absolute;
            width: 100%;
            text-align: center;
            top: 35%;
            left: 50%;
            transform: translateX(-50%);
            color: #758aaa;
          }
          .userCount {
            top: 48%;
          }
          button {
            position: absolute;
            width: 70%;
            height: 15%;
            color: #758aaa;
            background-color: #33394e;
            border: 0;
            top: 70%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
    }
    // 个人中心样式结束
  }
}

.active {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff !important;
  background-color: #0099ff;
  font-weight: bold;
}
.serviceActive {
  background-color: #0099ff;
  font-size: 14px;
  color: #fff !important;
}
.showActiveService {
  color: #0099ff !important;
}
.activeSm {
  color: #0099ff;
  font-weight: bold;
}
@media screen and (min-width: 768px) {
  .isDisplay {
    display: block !important;
  }
}
</style>