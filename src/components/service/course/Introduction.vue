<template>
  <div class="systermWrap">
      <div class="mainContentWrap">
        <div class="textWrap">
          <div class="platformIntroduce">平台介绍</div>
            <div class="paragraphTitle">
              <p>冷丘钢丝绳测到位系统平台介绍视频</p>
            </div>
          </div>
        <div class="videoWrap">
          <div class="iframeWrap">
            <iframe class="iframe" src="//player.bilibili.com/player.html?aid=208178264&bvid=BV1ih411n7BR&cid=412465761&page=1"
            scrolling="no" webkitallowfullscreen="true" mozallowfullscreen="true" oallowfullscreen="true" msallowfullscreen="true" allowfullscreen="true">
            </iframe>
          </div>
          <div class="pohoeLoginModeDes">
          <h3>手机端快捷登录方式</h3>
          <p class="iosPara">ios：打开Safari浏览器-找到菜单-分享按钮-添加到主屏幕，在手机桌面上找到点击进入。</p>
          <p>安卓：打开浏览器网页-找到菜单-收藏网址/添加书签/添加-添加到手机桌面/添加到主屏幕，在手机桌面找到点击进入。</p>
        </div>        
        </div>
        
      </div>
      
  </div>
</template>

<script>
export default {
  data() {
    return {
      initKey:1,
      // 内容
      content: null
    }
  },
  created() {

  },
  methods: {
    async queryContent(id) {
      const res = await this.$http.post(this.$urlObj.queryMenuContent,{
        menuId: id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .systermWrap {
    width: 100%;
    height: 100%;
    position: relative;
    .mainContentWrap {
      height: 100%;
      width: 100%;
      position: relative;
      .textWrap {
        width: 92.30769%;
        max-width: 768px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      .platformIntroduce {
      color: #0099ff;
      position: absolute;
      // left: 13px;
      top: 26px;
      font-size: 18px;
      font-weight: bold;
    }
    .paragraphTitle {
      position: absolute;
      // left: 13px;
      top: 67px;
      color: #758AAA;
    }
    .videoWrap {
      width: 92.30769%;
      max-width: 768px;
      // height: 35.66037%;
      position: absolute;
      // left: 13px;
      top: 123px;
      left: 50%;
      transform: translateX(-50%);
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
    .pohoeLoginModeDes {
      margin-top: 20px;
      h3 {
        font-size: 16px;
        color: #0099ff;
        font-weight: normal;
      }
      p {
        color: #758AAA;
        margin-bottom: 5px;
      }
      .iosPara {
        margin-top: 10px;
      }
    }
    
    }
    
    @media screen and (min-width:500px) {
      .videoWrap {
        height: 50%;
      }
    }
    }
    @media screen and (min-width:1200px) {
      .mainContentWrap {
        // padding-left: 20%;
      }
    }
  }
</style>