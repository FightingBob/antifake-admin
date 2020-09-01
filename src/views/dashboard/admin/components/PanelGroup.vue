<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-rice">
          <svg-icon icon-class="home-rice" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            本月 - 餐费支出
          </div>
          <count-to :start-val="0" :end-val="totalExpend.monthFoodExpend" :duration="2000" :decimals="2" :suffix="suffix" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-coffee">
          <svg-icon icon-class="home-coffee" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            本月 - 饮料支出
          </div>
          <count-to :start-val="0" :end-val="totalExpend.monthDrinkExpend" :duration="2000" :decimals="2" :suffix="suffix" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-submit1">
          <svg-icon icon-class="home-submit" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            本月 - 报销费用
          </div>
          <count-to :start-val="0" :end-val="totalExpend.monthSubmit" :duration="2000" :decimals="2" :suffix="suffix" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="home-money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            本月 - 餐补金额
          </div>
          <count-to :start-val="0" :end-val="totalExpend.monthFoodSubsidy" :duration="2000" :decimals="2" :suffix="suffix" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-humberger">
          <svg-icon icon-class="home-humberger" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日 - 餐费支出
          </div>
          <count-to :start-val="0" :end-val="totalExpend.todayFoodExpend" :duration="2000" :decimals="2" :suffix="suffix" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-juce">
          <svg-icon icon-class="home-juce" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日 - 饮料支出
          </div>
          <count-to :start-val="0" :end-val="totalExpend.todayDrinkExpend" :duration="2000" :decimals="2" :suffix="suffix" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-submit2">
          <svg-icon icon-class="home-submit2" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日 - 报销费用
          </div>
          <count-to :start-val="0" :end-val="totalExpend.todaySubmit" :duration="2000" :decimals="2" :suffix="suffix" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-over">
          <svg-icon icon-class="home-over" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            累计 - 剩余餐费
          </div>
          <count-to :start-val="0" :end-val="totalExpend.lastSubsidy" :duration="2000" :decimals="2" :suffix="suffix" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getTotalExpend } from '@/api/expend'
const defaultTotalExpenses = {
  monthFoodExpend: 0,
  todayFoodExpend: 0,
  monthDrinkExpend: 0,
  todayDrinkExpend: 0,
  monthFoodSubsidy: 0,
  monthSubmit: 0,
  todaySubmit: 0
}
export default {
  components: {
    CountTo
  },
  data() {
    return {
      totalExpend: Object.assign({}, defaultTotalExpenses),
      suffix: ' 元'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    getList() {
      getTotalExpend().then(response => {
        this.totalExpend = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-humberger {
        background: #ff5722;
      }
      .icon-rice {
       background: #efb336;
      }
      .icon-juce {
        background: #2196f3;
      }

      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #e91e63;
      }
      .icon-submit1 {
        background: #00bcd4;
      }
      .icon-submit2 {
        background: #673ab7;
      }

      .icon-coffee {
        background: #795548;
      }
      .icon-over {
        background: #ff4747;
      }
      .icon-shopping {
        background: #34bfa3;
      }
    }
    .icon-rice {
      color: #efb336;
    }
    .icon-humberger {
      color: #ff5722;
    }
    .icon-juce {
      color: #2196f3;
    }
    .icon-money {
      color: #e91e63;
    }
    .icon-over {
      color: #ff4747;
    }
    .icon-submit1 {
      color: #00bcd4;
    }
    .icon-submit2 {
      color: #673ab7;
    }
    .icon-message {
      color: #36a3f7;
    }

    .icon-coffee {
      color: #795548;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
