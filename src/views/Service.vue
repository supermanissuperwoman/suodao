
<template>
  <div class="serviceWrap">
    <router-view></router-view>
  </div>
</template>

<script>
import FeedBack from '../components/service/FeedBack.vue'
import Course from '../components/service/Course.vue'
  export default {
    components: {
      FeedBack,Course
    }
  }
</script>

<style lang="scss" scoped>
  .serviceWrap {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #000;
  }
  // @media screen and (min-width:1200px) {
  //   .serviceWrap {
  //     width: 81.14583%;
  //     position: absolute;
  //     left: 50%;
  //     transform: translateX(-50%);
  //   }
  // }
</style>
