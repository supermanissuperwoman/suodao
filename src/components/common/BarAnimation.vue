<template>
  <div class="root">
    <svg class="svg" width="100%" :height="topHeight">
      <defs>
        <linearGradient id="line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="20%" style="stop-color:#38C88B; " />
          <stop offset="90%" style="stop-color:#EDDF46; " />
          <stop offset="100%" style="stop-color:#F55737; " />
        </linearGradient>
      </defs>
      <rect
        class="rect"
        fill="url(#line)"
        x="0"
        y="0"
        width="100%"
        :height="topHeight"
        style="top: 50%;"
      />
    </svg>
    <div
      class="top"
      :style="{ width: topWidth + '%', height: topHeight + 'px' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "BarAnimation",
  props: {
    topHeight: {
      type: String,
      default: "6",
    },
    percentData: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      topWidth: 100,
      // 定时监测父组件传递过来的损伤值
      timer: null,
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.percentData > 0.5) {
        this.topWidth = this.percentData;
      } else {
        this.topWidth = 50 + this.percentData * 100;
        if (this.topWidth > 100) this.topWidth == 0;
      }
    }, 200);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="scss" scoped>
.root {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.svg {
  position: absolute;
}
.rect {
  position: absolute;
}
.top {
  width: 100%;
  background-color: #393c51;
  border: 0;
  border-radius: 0;
  position: absolute;
  top: 50%;
  right: -1px;
  transform: translateY(-50%);
  min-width: 50%;
  max-width: 100%;
  transition: width 1s ease;
}
</style>
