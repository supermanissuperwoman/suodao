<template>
  <el-row>
    <el-col :span="24">
      <span class="textWorkState">当日运行状况</span>
      <table cellpadding="0" cellspacing="0" class="table">
        <thead>
          <tr>
            <th colspan="2">{{ equipStateInfo.projectName }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>设备：{{ equipStateInfo.equipmentName }}</td>
            <td>报警：{{ equipStateInfo.isAlarm == 1 ? "是" : "否" }}</td>
          </tr>
          <tr>
            <td>风险程度: {{ equipStateInfo.riskLevel }}</td>
            <td>
              风险损伤位置：{{
                typeof equipStateInfo.damageLocation == "undefined"
                  ? ""
                  : equipStateInfo.damageLocation
              }}
            </td>
          </tr>
          <tr>
            <td>平均损伤值：{{ equipStateInfo.avgDamage }}</td>
            <td>
              损伤个数：{{
                typeof equipStateInfo.damageCount == "undefined"
                  ? ""
                  : equipStateInfo.damageCount
              }}
            </td>
          </tr>
          <tr>
            <td>
              当日运行时长：{{
                typeof equipStateInfo.runningTime == "undefined"
                  ? ""
                  : equipStateInfo.runningTime
              }}
            </td>
            <td>
              当日运行里程：{{
                typeof equipStateInfo.runningDistance == "undefined"
                  ? ""
                  : equipStateInfo.runningDistance
              }}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="color:#0099FF;">
              责任人：{{ equipStateInfo.contactPerson }}
            </td>
          </tr>
        </tbody>
      </table>
    </el-col>
  </el-row>
</template>

<script>
import { eventBus } from "@ai-zen/event-bus";
import { getItem } from "../../api";
export default {
  data() {
    return {
      // 当前设备的运行状况
      equipStateInfo: {},
    };
  },

  methods: {
    async getEquipInfo(equipmentCode, reportDate) {
      this.equipStateInfo = {};
      const res = await this.$http.post(this.$urlObj.queryImage, {
        equipmentCode: equipmentCode,
        reportDate: reportDate,
      });
      if (res.data.resultCode === "0000") {
        this.equipStateInfo = res.data.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.textWorkState {
  display: block;
  margin-left: 18px;
  // margin-top: 18px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  position: absolute;
  top: 18px;
}
.el-row {
  width: 100%;
  height: 100%;
}
.el-col {
  width: 100%;
}
.table {
  width: 65.21%;
  max-width: 900px;
  height: 70%;
  // margin-top: 20px;
  position: absolute;
  left: 50%;
  top: 60px;
  font-size: 14px;
  transform: translateX(-50%);
  background-color: #1c1f30;
  border-left: 1px solid #292b3d;
  color: #fefefe;
  thead {
    width: 100%;
    text-align: center;
    tr {
      width: 100%;
      th {
        width: 50%;
        height: 47px;
        background-color: #292b3d;
      }
    }
  }
  tbody {
    tr {
      border-left: 1px solid #292b3d;
      td {
        box-sizing: border-box;
        padding-left: 6px;
        border-right: 1px solid #292b3d;
        border-bottom: 1px solid #292b3d;
      }
    }
  }
}
@media screen and (min-width: 1200px) {
  .table {
    font-size: 16px;
  }
}
@media screen and (max-width: 1366px) {
  .table {
    width: 90%;
  }
}
</style>
