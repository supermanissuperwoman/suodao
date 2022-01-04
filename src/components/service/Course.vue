<template>
  <el-row style="width:100%;height:100%;backgroundColor:#000;">
    <el-col class="navColLg hidden-lg-and-down" :xs='24' :sm="24" :md="24" :lg="3">
        <div class="pageTitle">
            <h3>系统教程</h3>
        </div>
        <div class="elMenuWrapLg">
        <el-menu  mode="vertical" menu-trigger="click" :unique-opened="true"
        :default-active="activeIndex"
        active-text-color="#0099ff"
        ref="menu"
        @click.stop=""
        :key="initComponentKey"
        >
        <el-submenu @click="handleClickSubmenu(item1)" :popper-append-to-body="false" :index="item1.menuOrder"
            v-for="item1 in subMenuData" :key="item1.id"
            >
            <template #title>{{item1.menuName}}</template>
            <el-menu-item :index="item1.menuOrder+'-'+item2.menuOrder" 
            v-for="item2 in item1.subMenuArr" :key="item2.id"
            @click="handleClickItem(item1,item2)">
                {{item2.menuName}}
            </el-menu-item>
        </el-submenu>
        <el-menu-item class="elMenuItem" :index="item3.menuOrder" v-for="item3 in menuItemData" :key="item3.id"
        @click="handleClickItem(item3)">
                {{item3.menuName}}
        </el-menu-item>
        </el-menu>  
        </div> 
    </el-col>
    <el-col class="breadCrumbCol" :xs='24' :sm="24" :md="24" :lg="20">
        <div class="breadcrumbWrap">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in breadcrumbData" :key="item"
                @click="handleClickHome(item)"
            >
                {{item}}
        </el-breadcrumb-item>
    </el-breadcrumb>
</div> 
    </el-col>
    <el-col class="navCol hidden-lg-and-up" :xs='24' :sm="24" :md="24">
    <div class="elMenuWrap">
    <el-menu  mode="horizontal" menu-trigger="click" :unique-opened="true"
    :default-active="activeIndex"
    active-text-color="#0099ff"
    ref="menu"
    @click.stop=""
    :key="initComponentKey"
    >
    <el-submenu :popper-append-to-body="false" :index="item1.menuOrder"
        v-for="item1 in subMenuData" :key="item1.id"
        >
        <template #title>{{item1.menuName}}</template>
        <el-menu-item :index="item1.menuOrder+'-'+item2.menuOrder" 
        v-for="item2 in item1.subMenuArr" :key="item2.id"
        @click="handleClickItem(item1,item2)">
            {{item2.menuName}}
        </el-menu-item>
    </el-submenu>
    <el-menu-item :index="item3.menuOrder" v-for="item3 in menuItemData" :key="item3.id"
    @click="handleClickItem(item3)">
            {{item3.menuName}}
    </el-menu-item>
</el-menu>  
    </div>  
    </el-col>
    <el-col class="mainCol" :xs='24' :sm="24" :md="24">
        <div class="mainCourse">
        <introduction ref="introductionRef" v-show="isShowIntroduction"></introduction>
        <child-video ref="childVideoRef" v-show="isShowChildVideo"></child-video>
        </div>  
    </el-col>
  </el-row>
</template>

<script>
import Introduction from './course/Introduction.vue'
import ChildVideo from './course/ChildVideo.vue'
import { eventBus } from '@ai-zen/event-bus'
export default {
    data() {
        return {
            activeIndex:"",
            activeIndexLg:"",
            // 初始化nav组件key值
            initComponentKey: 1,
            elMenuShow: true,
            subMenuData: [],
            menuItemData: [],
            // 面包屑菜单数据
            breadcrumbData: ['客户服务','系统教程'],
            isShowIntroduction: true,
            isShowChildVideo: false,
        }
    },
    created() {
        // if(this.$route.path == '/index')
        // 请求菜单数据
        this.getMenuItem();
    },
    inject: ['reload'],
    mounted() {
        document.addEventListener('click',() => {
            this.handleMenuClose();
        })
        eventBus.on('fromNextToPage',(data) => {
           this.breadcrumbData[this.breadcrumbData.length-1] = data.twoLevelData.menuName;
           this.activeIndex = data.activeIndex;
        })
        eventBus.on('fromPreToPage',(data) => {
            this.breadcrumbData[this.breadcrumbData.length-1] = data.twoLevelData.menuName;
            this.activeIndex = data.activeIndex;
        })
    },
    components: {
        Introduction,ChildVideo
    },
    methods:{
        handleClickSubmenu(data) {
            // for(let i = 0; i < 3; i++) {
            //     document.getElementsByClassName("el-submenu__title")[i].style.color = '#758AAA';
            //     document.getElementsByClassName("el-submenu__title")[i].classList.remove("el-submenu__title::before")
            // }
            // document.getElementsByClassName("el-submenu__title")[data.menuOrder-1].style.color = '#0099ff';            
        },
        handleClickHome(data) {
            if(data == '系统教程') {
                this.breadcrumbData = ['客户服务','系统教程'];
                this.initComponentKey++;
                this.isShowChildVideo = false;
                this.isShowIntroduction = true;
                this.$refs.introductionRef.initKey++;
                this.reload();
            }
        },
        // 点击下拉菜单某一项
        handleClickItem(parent, child) {
            this.activeIndexLg = this.activeIndex;
            this.breadcrumbData = ['客户服务','系统教程'];
            this.$refs.childVideoRef.getInformation(parent,child)
            if(parent) {
              this.breadcrumbData.push(parent.menuName);  
              this.activeIndex = parent.menuOrder;
            }
            if(child) {
                this.breadcrumbData.push(child.menuName);
                this.activeIndex = this.activeIndex+'-'+child.menuOrder;
            }
            this.isShowChildVideo = true;
            this.isShowIntroduction = false;
        },
        handleMenuClose() {
            // this.$refs.menu.close(this.$route.path);
        },
        // 请求菜单数据
        async getMenuItem() {
            const res = await this.$http.post(this.$urlObj.queryMenu,{
                "menuType": "TutorialSystem"
            })
            if(res.status === 200 && res.data.resultCode == '0000') {
                let data = res.data.data;
                for(let i = 0; i < data.length; i++) {
                    if(data[i].subMenuArr && data[i].subMenuArr.length) {
                        this.subMenuData.push(data[i]);
                    }else {
                        this.menuItemData.push(data[i])
                    }
                    
                }
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
    .breadCrumbCol {
        width: 100%;
        height: 30px;
        // margin-top: -20px;
    }
    @media screen and (min-width:1200px) {
        .breadCrumbCol {
            margin-top: 0;
            padding-left: 15px;
        }
    }
    .navCol {
        width: 100%;
        height: 6.09745%;
    }
    .navColLg {
        height: 100%;
        min-width: 175px;
        max-width: 175px;
        background-color: #232735;
        position: relative;
    }
    @media screen and (min-width:1200px) {
        .navColLg {
            display: block !important;
            min-height: 784px;
        }
    }
    .mainCol {
        width: 100%;
        height: 90%;
        min-height: 735px;
        background-color: #232735;
    }
    @media screen and (min-width:1200px) {
        .mainCol {
            width: 86.8%;
            float: left;
            position: absolute;
            left: 190px;
            top: 50px;
            
        }
    }
    @media screen and (min-width:1920px) {
        .mainCol {
            width: 89.8%;
        }
    }
    .breadcrumbWrap {
        height: 30px;
        width: 100%;
        background-color: #000;
        display: flex;
        // margin-top: -20px;
        justify-content: left;
        align-items: center;
    }
    @media screen and (min-width:1200px) {
        .breadcrumbWrap {
            height: 40px;
            align-items: flex-end;
        }
    }
    .elMenuWrap {
        width: 100%;
        height: 34px;
        background-color: #000;
        :deep(.el-menu) {
            width: 100%!important;
            .el-submenu {
                display: flex;
                justify-content: center;
                flex: 1;
                margin-right: 6px;
                .el-submenu__title {
                    width: 100% !important;
                    display: flex;
                    justify-content: center;
                }
                .el-submenu__icon-arrow {
                    margin-left: 0;
                }
                .el-icon-arrow-down:before {
                    content: "\e790";
                    font-size: 14px;
                }
            }
            .el-menu-item {
                flex: 1;
                margin-right: 6px;
                display: flex;
                justify-content: center;
            }
            .el-menu-item:last-child {
                margin-right: 0;
            }
        }
    }
    .pageTitle {
        position: absolute;
        top: 89px;
        color: #758AAA;
        width: 100%;
        text-align: center;
    }
    .elMenuWrapLg {
        width: 80%;
        height: 50%;
        position: absolute;
        top: 155px;
        left: 50%;
        transform: translateX(-50%);
        .el-menu {
            height: auto;
            width: 100%;
            padding-left: 10%;
            :deep(.el-menu-item) {
                font-size: 16px;
                padding-left: 20px !important;
                min-width: 100%;
                
            }
            :deep(.el-menu-item:hover) {
                color: #0099ff;
            }
            
        }
        .elMenuItem {
            font-size: 18px !important;
        }
        :deep(.el-menu) {
            background-color:#2B3040;
        }
        :deep(.el-submenu__title) {
            font-size: 18px;
        }
        :deep(.el-submenu__title:nth-child(-n+3)) {
            padding-left: 20px !important;
        }
        :deep(.el-submenu__title:hover) {
            color: #0099ff;
        }
        :deep(.el-submenu__icon-arrow) {
            width: 13px;
            height: 10px;
            position: absolute;
            left: 5px;
        }
        :deep(.el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow) {
            transform: rotate(90deg);
            color: #0099ff;
        }
        :deep(.el-submenu__title::before) {
           
            // font-family: iconfont;
            // content: '\e69b';
        }
        :deep(.el-icon-arrow-down:before) {
            font-family: iconfont;
            content: '\e69b';
            font-size: 16px;
        }
    }
    .mainCourse{
        width: 100%;
        height: 90.11094%;
        margin-top: 20px;
        min-height: 586px;
    }
    .el-menu {
        background-color: #000;
        border-bottom: 0;
        border-right: 0;
         display: flex;
        justify-content: space-between;
        align-items: center;
        height: 34px;
        li {
            height: 100%;
            display: flex;
            align-items: center;
            background-color: #2B3040;
            justify-content: space-between;
            :deep(.el-submenu__title) {
                height: 100%;
                display: flex;
                align-items: center;
                padding: 0;
                color: #758AAA;
            }
            
        }
        @media screen and (min-width:1200px) {
            li {
                display: block;
            }
        }
        :deep(.el-menu-item) {
            padding: 0;
            color: #758AAA;
            background-color: #2B3040;
            // min-width: 100px;
            a {
                height: 100%;
                display: flex;
                align-items: center;
            }
        }
    }
    @media screen and (min-width:1200px) {
       .el-menu {
           display: block;
           background-color: #2B3040 !important;
       } 
    }
    // 菜单划过样式
    :deep(.el-menu--horizontal>.el-submenu .el-submenu__title:hover) {
        background-color: #2B3040;
        color: #0099ff;
    }
    // submenu菜单样式
    :deep(.el-menu--horizontal>.el-submenu .el-submenu__title) {
        border: 0 !important;
        color: #758AAA;
    }
    // 系统设置和客户服务边框样式
    :deep(.el-menu--horizontal>.el-menu-item) {
        border: 0;
    }
    :deep(.el-menu--horizontal>.el-menu-item>a) {
        display: flex;
        justify-content: center;
    }
    // 系统设置和客户服务选中后背景色样式
    :deep(.el-menu--horizontal > .el-menu-item:not(.is-disabled)) {
        background-color: #2B3040 !important;
    }
    // 系统设置和客户服务hover样式
    :deep(.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover) {
        color: #0099ff;
    }
    // 下拉菜单样式
    :deep(.el-popper.is-pure) {
        border: 1px solid #070A1D;
        border-radius: 2px;
    }
    // 下拉菜单里边样式
    :deep(.el-menu--popup) {
        padding: 0 0 0 16px;
        border-radius: 0;
        background-color: #2B3040;
    }
    :deep(.el-menu--horizontal .el-menu .el-menu-item) {
        display: flex;
        justify-content: left;
    }
    // 下拉菜单 单个项鼠标滑过样式
    :deep(.el-menu--horizontal .el-menu-item:not(.is-disabled):hover) {
        color: #0099ff !important;
    }
    // 下拉菜单 a标签的样式
    .el-menu-item>a {
        width: 100%;
    }
    
    .activeClass {
        color: #0099ff;
    }
    // 面包屑样式开始
    :deep(.el-breadcrumb__item .el-breadcrumb__inner) {
            color: #758AAA !important;
    }
    :deep(.el-breadcrumb__item) {
        cursor: pointer;
    }
    :deep(.el-breadcrumb__item:first-child .el-breadcrumb__inner) {
            color: #0099ff !important;
            font-weight: bold;
    }
    :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: #0099ff !important;
    }
    :deep(.el-breadcrumb__inner .is-link) {
        font-weight: normal;
        color: #758AAA !important;
    }
    // 面包屑样式结束
    :deep(.el-submenu__title:hover) {
        background-color: #2B3040;
    }
    :deep(.el-submenu__title) {
        // line-height: 0 !important;
    }
</style>