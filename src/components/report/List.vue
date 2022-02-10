<template>
  <el-row>
    <el-col :span="24">
      <div class="listTitle">损伤列表<small>（前十大损伤值列表）</small></div>
      <table class="table" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th>序号</th>
            <th>损伤值</th>
            <th>损伤位置</th>
            <th>序号</th>
            <th>损伤值</th>
            <th>损伤位置</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              {{
                topTenDamageValue[0] == undefined
                  ? ""
                  : topTenDamageValue[0].damage
              }}
            </td>
            <td>
              {{
                topTenDamageValue[0] == undefined
                  ? ""
                  : topTenDamageValue[0].damageLocation
              }}
            </td>
            <td>6</td>
            <td>
              {{
                topTenDamageValue[5] == undefined
                  ? ""
                  : topTenDamageValue[5].damage
              }}
            </td>
            <td>
              {{
                topTenDamageValue[5] == undefined
                  ? ""
                  : topTenDamageValue[5].damageLocation
              }}
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>
              {{
                topTenDamageValue[1] == undefined
                  ? ""
                  : topTenDamageValue[1].damage
              }}
            </td>
            <td>
              {{
                topTenDamageValue[1] == undefined
                  ? ""
                  : topTenDamageValue[1].damageLocation
              }}
            </td>
            <td>7</td>
            <td>
              {{
                topTenDamageValue[6] == undefined
                  ? ""
                  : topTenDamageValue[6].damage
              }}
            </td>
            <td>
              {{
                topTenDamageValue[6] == undefined
                  ? ""
                  : topTenDamageValue[6].damageLocation
              }}
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>
              {{
                topTenDamageValue[2] == undefined
                  ? ""
                  : topTenDamageValue[2].damage
              }}
            </td>
            <td>
              {{
                topTenDamageValue[2] == undefined
                  ? ""
                  : topTenDamageValue[2].damageLocation
              }}
            </td>
            <td>8</td>
            <td>
              {{
                topTenDamageValue[7] == undefined
                  ? ""
                  : topTenDamageValue[7].damage
              }}
            </td>
            <td>
              {{
                topTenDamageValue[7] == undefined
                  ? ""
                  : topTenDamageValue[7].damageLocation
              }}
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>
              {{
                topTenDamageValue[3] == undefined
                  ? ""
                  : topTenDamageValue[3].damage
              }}
            </td>
            <td>
              {{
                topTenDamageValue[3] == undefined
                  ? ""
                  : topTenDamageValue[3].damageLocation
              }}
            </td>
            <td>9</td>
            <td>
              {{
                topTenDamageValue[8] == undefined
                  ? ""
                  : topTenDamageValue[8].damage
              }}
            </td>
            <td>
              {{
                topTenDamageValue[8] == undefined
                  ? ""
                  : topTenDamageValue[8].damageLocation
              }}
            </td>
          </tr>
          <tr>
            <td>5</td>
            <td>
              {{
                topTenDamageValue[4] == undefined
                  ? ""
                  : topTenDamageValue[4].damage
              }}
            </td>
            <td>
              {{
                topTenDamageValue[4] == undefined
                  ? ""
                  : topTenDamageValue[4].damageLocation
              }}
            </td>
            <td>10</td>
            <td>
              {{
                topTenDamageValue[9] == undefined
                  ? ""
                  : topTenDamageValue[9].damage
              }}
            </td>
            <td>
              {{
                topTenDamageValue[9] == undefined
                  ? ""
                  : topTenDamageValue[9].damageLocation
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </el-col>
  </el-row>
</template>

<script>
import { eventBus } from "@ai-zen/event-bus";
export default {
  data() {
    return {
      // 前十大损伤值列表数据
      topTenDamageValue: [],
    };
  },

  methods: {
    // 获取前十大损伤值列表
    async getTopTenDamageValue(equipmentCode, reportDate) {
      this.topTenDamageValue = [];
      const res = await this.$http.post(this.$urlObj.queryImage, {
        equipmentCode: equipmentCode,
        reportDate: reportDate,
      });
      if (res.data.resultCode == "0000") {
        this.topTenDamageValue = res.data.data.damageTopTenArr;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  background-color: #1c1f30;
  width: 100%;
  height: 100%;
}
.listTitle {
  color: #ffffff;
  margin-left: 18px;
  margin-top: 18px;
  font-weight: bold;
  font-size: 18px;
  small {
    color: #b9b9b9;
    font-weight: 400;
    font-size: 14px;
  }
}
.table {
  width: 98%;
  height: 78.25%;
  background-color: #1c1f30;
  position: absolute;
  left: 50%;
  font-size: 14px;
  transform: translateX(-50%);
  top: 60px;
  thead {
    tr {
      th {
        width: 16.66%;
        height: 44px;
        background: linear-gradient(0deg, #252838, #1e2234, #242839);
        color: #ffffff;
      }
    }
  }
  tbody {
    tr {
      td {
        color: #fff;
        text-align: center;
        border-bottom: 1px solid #292b3d;
        border-right: 1px solid #292b3d;
      }
      td:nth-child(1) {
        border-left: 1px solid #292b3d;
      }
    }
  }
}
@media screen and (min-width: 1200px) {
  .table {
    font-size: 16px;
  }
}
</style>
