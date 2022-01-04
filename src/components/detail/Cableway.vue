<template>
  <el-row>
    <el-col :lg="12" id="overviewCol">
      <cableway-overview></cableway-overview>
    </el-col>
    <el-col :lg="12" id="monitorResultCol">
      <div class="monitorResultColTop">
        <div class="topLeft">
          <monitor-result ref="monitorRef"></monitor-result>
        </div>
        <div class="topRight">
          <damage-list ref="damageListRef"> </damage-list>
        </div>
      </div>
      <div class="monitorResultColDown">
        <div class="topLeft">
          <joint ref="jointRef"></joint>
        </div>
        <div class="topRight">
          <joint-list></joint-list>
        </div>
      </div>
    </el-col>
    <el-col :lg="12" id="damagevalueCol">
      <damage-value ref="damageValueRef"></damage-value>
    </el-col>
    <el-col :lg="12" id="godistanceCol">
      <go-distance ref="goDistanceRef"></go-distance>
    </el-col>
  </el-row>
</template>

<script>
import DamageValue from "./DamageValue.vue";
import GoDistance from "./GoDistance.vue";
import MonitorResult from "./MonitorResult.vue";
import DamageList from "./DamageList.vue";
import CablewayOverview from "../detail/cableway/CablewayOverview.vue";
import Joint from "../common/Joint.vue";
import JointList from "./cableway/JointList.vue";
export default {
  name: "Cableway",
  components: {
    DamageValue,
    GoDistance,
    MonitorResult,
    DamageList,
    CablewayOverview,
    Joint,
    JointList,
  },
  data() {
    return {};
  },
  mounted() {
    window.addEventListener("resize", () => {
      if (this.$refs.monitorRef) {
        this.$refs.monitorRef.myResize();
      }
      if (this.$refs.damageValueRef) {
        this.$refs.damageValueRef.myResize();
      }
      if (this.$refs.goDistanceRef) {
        this.$refs.goDistanceRef.myResize();
      }
      if (this.$refs.jointRef) {
        this.$refs.jointRef.myResize();
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  width: 100%;
  #overviewCol {
    height: 500px;
    margin-bottom: 20px;
  }
  @media screen and (min-width: 1200px) {
    .overviewCol {
      padding-right: 11px;
    }
  }
  #monitorResultCol {
    height: 600px;
    display: flex;
    margin-bottom: 20px;
    flex-direction: column;
    justify-content: space-between;
    .monitorResultColTop {
      flex: 1;
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      .topLeft {
        flex: 5;
      }
      .topRight {
        flex: 3;
      }
    }
    .monitorResultColDown {
      flex: 1;
      background-color: #1c1f30;
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      .topLeft {
        flex: 5;
      }
      .topRight {
        flex: 3;
      }
    }
  }
  @media screen and (min-width: 1200px) {
    #monitorResultCol {
      padding-left: 11px;
      height: 500px;
    }
  }
  #damagevalueCol {
    height: 320px;
    margin-bottom: 20px;
    div {
      width: 100%;
      height: 100%;
      background-color: #fff;
    }
  }
  @media screen and (min-width: 1200px) {
    #damagevalueCol {
      height: 300px;
    }
  }
  #godistanceCol {
    height: 320px;
    div {
      width: 100%;
      height: 100%;
      background-color: #fff;
    }
  }
  @media screen and (min-width: 1200px) {
    #godistanceCol {
      padding-left: 11px;
      height: 300px;
    }
  }
}
</style>
