<template>
  <div class="contentWrap">
      <div class="textWrap">
        <div class="itemName">{{name}}</div>
        <div class="itemTitle">
            <p>{{synopsis}}</p>
        </div>
      </div>
      <div class="videoWrap">
          <div class="iframeWrap">
            <iframe class="iframe" src="//player.bilibili.com/player.html?aid=207891872&bvid=BV1Sh411H7n3&cid=407437110&page=1" frameborder="0"></iframe>
          </div>
          <div class="pageSwitchWrap">
          <div class="prePageWrap" v-show="isShowPrePage">
              <button
              @click="toPrePage"
               class="prePageBtn">上一页: {{prePageName}}</button>
          </div>
          <div class="nextPageWrap">
              <button
              @click="toNextPage"
               class="nextPageBtn" v-show="isShowNextPage">下一页: {{nextPageName}}</button>
          </div>
      </div>
      </div>
      
  </div>
</template>

<script>
import { eventBus } from '@ai-zen/event-bus';
export default {
    data() {
        return {
            // 项目名字
            name: "",
            // 
            synopsis: "",
            // 项目一级标题
            oneLevelTitle: "",
            // 项目二级标题
            twoLevelTitle: "",
            // 视频地址
            srcVideo: "https://en-zo.dev/vue3-player-video.mp4",
            // 组件初始化key值
            initKey: 1,
            // 第一级菜单数据
            oneLevelData: [],
            // 第二级菜单数据
            twoLevelData: [],
            // 上一页的名字
            prePageName: "",
            // 下一页的名字
            nextPageName: "",
            // 上一页的index
            prePageIndex: "",
            // 下一页的index
            nextPageIndex: "",
            // 上一页是否显示
            isShowPrePage: true,
            // 下一页是否显示
            isShowNextPage: true,
            // 当前页码
            currentPage: ""
        }
    },
    methods: {
        getInformation(parent, child) {
            this.initKey++;
            if(parent && child) {
                this.oneLevelData = parent;
                this.twoLevelData = child;
                this.oneLevelTitle = parent.menuName;
                this.twoLevelTitle = child.menuName;
                this.name = child.menuName;
                this.isShowPrePage = true;
                this.isShowNextPage = true;
                // 如何下拉菜单中的选择项大于2，页面切换有上一页和下一页
                if(parent.subMenuArr.length > 2) {
                    this.currentPage = parseInt(this.twoLevelData.menuOrder);
                    if(child.menuOrder != '1' && parseInt(child.menuOrder) != parent.subMenuArr.length) {
                        this.prePageName =parent.menuName +'-'+ parent.subMenuArr[parseInt(child.menuOrder)-2].menuName;
                        this.nextPageName = parent.menuName +'-'+ parent.subMenuArr[parseInt(child.menuOrder)].menuName;
                    }
                    if(child.menuOrder == '1') {
                        this.prePageName = parent.menuName +'-'+ parent.subMenuArr[parent.subMenuArr.length-1].menuName;
                        this.nextPageName = parent.menuName +'-'+ parent.subMenuArr[parseInt(child.menuOrder)].menuName;
                    }
                    if(parseInt(child.menuOrder) == parent.subMenuArr.length) {
                        this.prePageName = parent.menuName +'-'+ parent.subMenuArr[parent.subMenuArr.length-2].menuName;
                        this.nextPageName = parent.menuName +'-'+ parent.subMenuArr[0].menuName;
                    } 
                }
                if(parent.subMenuArr.length == 2) {
                    this.isShowPrePage = false;
                    this.currentPage = parseInt(this.twoLevelData.menuOrder);
                    if(child.menuOrder == '2') {
                        this.nextPageName = parent.menuName +'-'+ parent.subMenuArr[0].menuName;
                    }else {
                        this.nextPageName = parent.menuName +'-'+ parent.subMenuArr[1].menuName;
                    }
                }
            }else{
                this.oneLevelData = parent;
                this.twoLevelTitle = parent.menuName;
                this.oneLevelTitle = '';
                this.name = parent.menuName;
                this.isShowPrePage = false;
                this.isShowNextPage = false; 
            }
        },

        // 点击上一页按钮
        toPrePage() {
           if(this.currentPage == 1) {
               this.prePageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[this.oneLevelData.subMenuArr.length-2].menuName;
               this.nextPageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[0].menuName;
               this.name = this.oneLevelData.subMenuArr[this.oneLevelData.subMenuArr.length-1].menuName;
               this.oneLevelTitle = this.oneLevelData.menuName;
               this.twoLevelTitle = this.oneLevelData.subMenuArr[this.oneLevelData.subMenuArr.length-1].menuName;
               this.currentPage = this.oneLevelData.subMenuArr.length;
           }else if(this.currentPage == 2) {
               this.prePageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[this.oneLevelData.subMenuArr.length-1].menuName;
               this.nextPageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[this.currentPage-1].menuName;
               this.name = this.oneLevelData.subMenuArr[this.currentPage-2].menuName;
               this.oneLevelTitle = this.oneLevelData.menuName;
               this.twoLevelTitle = this.oneLevelData.subMenuArr[this.currentPage-2].menuName;
               this.currentPage = 1;
           }else if(this.currentPage > 2 && this.currentPage < this.oneLevelData.subMenuArr.length) {
               this.prePageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[this.currentPage-3].menuName;
               this.nextPageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[this.currentPage-1].menuName;
               this.name = this.oneLevelData.subMenuArr[this.currentPage-2].menuName;
               this.oneLevelTitle = this.oneLevelData.menuName;
               this.twoLevelTitle = this.oneLevelData.subMenuArr[this.currentPage-2].menuName;
               this.currentPage--;
           }else {
               this.prePageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[this.currentPage-3].menuName;
               this.nextPageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[this.currentPage-1].menuName;
               this.name = this.oneLevelData.subMenuArr[this.currentPage-2].menuName;
               this.oneLevelTitle = this.oneLevelData.menuName;
               this.twoLevelTitle = this.oneLevelData.subMenuArr[this.currentPage-2].menuName;
               this.currentPage = this.oneLevelData.subMenuArr.length-1;
           }
           eventBus.emit('fromPreToPage',{
                'currentPage':this.currentPage,
                'twoLevelData':this.oneLevelData.subMenuArr[this.currentPage-1],
                'activeIndex':this.oneLevelData.menuOrder+'-'+this.currentPage
           })
        },
        // 点击下一页按钮
        toNextPage() {
            if(this.currentPage < this.oneLevelData.subMenuArr.length-1) {
                this.prePageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[this.currentPage-1].menuName;
                this.nextPageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[this.currentPage+1].menuName;
                this.name = this.oneLevelData.subMenuArr[this.currentPage].menuName;
                this.oneLevelTitle = this.oneLevelData.menuName;
                this.twoLevelTitle = this.oneLevelData.subMenuArr[this.currentPage].menuName;
                this.queryContent(this.oneLevelData.subMenuArr[this.currentPage].id);
                this.currentPage++;
                
            }else {
                this.prePageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[this.currentPage-1].menuName;
                this.nextPageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[0].menuName;
                if(this.currentPage == this.oneLevelData.subMenuArr.length-1) {
                    this.name = this.oneLevelData.subMenuArr[this.currentPage].menuName;
                    this.oneLevelTitle = this.oneLevelData.menuName;
                    this.twoLevelTitle = this.oneLevelData.subMenuArr[this.currentPage].menuName;
                    this.queryContent(this.oneLevelData.subMenuArr[this.currentPage].id);
                    this.currentPage++;
                }else {
                    this.nextPageName = this.oneLevelData.menuName+'-'+this.oneLevelData.subMenuArr[1].menuName;
                    this.name = this.oneLevelData.subMenuArr[0].menuName;
                    this.oneLevelTitle = this.oneLevelData.menuName;
                    this.twoLevelTitle = this.oneLevelData.subMenuArr[0].menuName;
                    this.queryContent(this.oneLevelData.subMenuArr[0].id);
                    this.currentPage = 1;
                }
            }
            eventBus.emit('fromNextToPage',{
                'currentPage':this.currentPage,
                'twoLevelData':this.oneLevelData.subMenuArr[this.currentPage-1],
                'activeIndex':this.oneLevelData.menuOrder+'-'+this.currentPage
            })
        },

        // 查询内容
        async queryContent(itemId) {

            const res = await this.$http.post(this.$urlObj.queryMenuContent,{
                menuId: itemId
            });
            if(res.status === 200 && res.data.resultCode == '0000') {
                this.name = res.data.data.title;
                this.synopsis = res.data.data.synopsis;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .contentWrap {
    width: 100%;
    height: 100%;
    position: relative;
    .itemName {
      color: #0099ff;
      position: absolute;
      left: 13px;
      top: 26px;
      font-size: 18px;
      font-weight: bold;
    }
    .itemTitle {
      position: absolute;
      left: 13px;
      top: 67px;
      color: #758AAA;
    }
    .textWrap {
        width: 92.30769%;
        max-width: 768px;
        height: 15%;
        position: absolute;
        left: 50%;
        transform: translateX(-52%);
    }
    .videoWrap {
      width: 92.30769%;
      max-width: 768px;
      position: absolute;
      left: 50%;
      top: 123px;
      transform: translateX(-50%);
    //   background-color: #2B3040;
      .vue3-player-video {
        height: 100%;
        :deep(.shadow-xl) {
          height: 100% !important;
          border-radius: 0;
          box-shadow: none;
          .relative {
            height: 100%;
            .w-full {
            }
          }
        }
      }
      .iframeWrap {
          width: 100%;
          height: 0;
          padding-bottom: 56.25%;
          position: relative;
      }
      .iframe {
          width: 100%;
          height: 100%;
          position: absolute;
      }
    }
    @media screen and (min-width:768px) {
        .videoWrap {
            min-height: 400px;
        }
    }
    .pageSwitchWrap {
        width: 100%;
        max-width: 690px;
        height: 100px;
        margin-top: 10px;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        align-items: center;
        .prePageWrap {
            width: 91%;
            height: 34px;            
            button {
                width: 100%;
                height: 100%;
                background-color: #33394E;
                color: #758AAA;
                cursor: pointer;
            }
            button:hover {
                color: #0099ff;
            }
        }
        @media screen and (min-width:768px) {
            .prePageWrap {
                width: 45%;
                float: left;
            }
        }
        .nextPageWrap {
            width: 91%;
            height: 34px;
            button {
                width: 100%;
                height: 100%;
                background-color: #33394E;
                color: #758AAA;
                cursor: pointer;
            }
            button:hover {
                color: #0099ff;
            }
        }
        @media screen and (min-width:768px) {
            .nextPageWrap {
               width: 45%;
               float: right;
            }
        }
    }
    @media screen and (min-width:768px) {
        .pageSwitchWrap {
            display: block;
            max-width: 768px;
            top: 92%;
        }
    }
  }
</style>