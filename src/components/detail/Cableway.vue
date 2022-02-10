<template>
  <el-row>
    <el-col :lg="12" id="overviewCol">
      <cableway-overview ref="cabelOverviewRef"></cableway-overview>
    </el-col>
    <el-col :lg="12" id="monitorResultCol">
      <el-row class="monitorResultColTop">
        <el-col :xs="24" :lg="14" class="topLeft">
          <monitor-result ref="monitorRef"></monitor-result>
        </el-col>
        <el-col :xs="24" :lg="10" class="topRight">
          <damage-list ref="damageListRef"> </damage-list>
        </el-col>
      </el-row>
      <el-row class="monitorResultColDown">
        <el-col :xs="24" :lg="14" class="topLeft">
          <joint ref="jointRef"></joint>
        </el-col>
        <el-col :xs="24" :lg="10" class="topRight">
          <joint-list ref="jointListRef"></joint-list>
        </el-col>
      </el-row>
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
    height: 700px;
    margin-bottom: 20px;
  }
  @media screen and (min-width: 900px) {
    #overviewCol {
      height: 600px;
    }
  }
  @media screen and (min-width: 1200px) {
    #overviewCol {
      height: 500px;
    }
  }
  #monitorResultCol {
    .monitorResultColTop {
      height: 800px;
      margin-bottom: 20px;
      .topLeft {
        height: 30%;
      }
      .topRight {
        height: 70%;
      }
    }
    @media screen and (min-width: 1200px) {
      .monitorResultColTop {
        height: 250px;
        margin-bottom: 10px;
        .topLeft {
          height: 100%;
        }
        .topRight {
          height: 100%;
        }
      }
    }
    .monitorResultColDown {
      height: 500px;
      background-color: #1c1f30;
      margin-bottom: 20px;
      .topLeft {
        height: 50%;
      }
      .topRight {
        height: 50%;
      }
    }
    @media screen and (min-width: 1200px) {
      .monitorResultColDown {
        margin-bottom: 0;
        height: 240px;
        .topLeft,
        .topRight {
          height: 100%;
        }
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
    }
  }
}
</style>
