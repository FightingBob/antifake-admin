<template>
  <div>
    <mu-container class="mu-container">

      <mu-appbar style="width: 100%;" color="primary">
        <mu-button slot="left" icon>
          <mu-icon value="menu" />
        </mu-button>
        零售区
        <mu-avatar slot="right">
          <img :src="avatar+'?imageView2/1/w/80/h/80'">
        </mu-avatar>
      </mu-appbar>

      <mu-list textline="two-line">
        <mu-sub-header v-if="radio.id != null">你选择的是：{{ radio.name }} <span> X {{ num }}</span></mu-sub-header>
        <mu-list-item v-for="(tile, index) in list" :key="'radio ' + index" avatar :ripple="false" button>
          <mu-list-item-content>
            <mu-list-item-title>
              <span>{{ tile.name }}</span>
            </mu-list-item-title>
            <mu-list-item-sub-title style="color: rgba(0, 0, 0, .87)">{{ tile.price }} 元</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-list-item-after-text> 库存：{{ tile.margin }}</mu-list-item-after-text>
            <mu-radio v-model="radio" :value="tile" uncheck-icon="check_circle_outline" checked-icon="check_circle" :disabled="hasAddOrder" />
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
      <!-- <mu-row>

            <span>请选择数量</span><el-input-number v-model="num" :min="1" :max="10" label="至少为1" @change="handleChange" />
          </mu-row> -->
      <el-form style="margin: 10px 0px 10px 10px;" :inline="true">
        <el-form-item label="数量：" prop="pass">
          <el-input-number v-model="num" controls-position="right" :min="1" :max="radio.margin" />
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button v-if="todayOrderList !== undefined && todayOrderList.length <= 0" type="primary" @click="addOrder">下单</el-button>
        </el-form-item>
      </el-form>
      <!-- <mu-button v-if="todayOrderList !== undefined && todayOrderList.length <= 0" color="primary" class="add-order" @click="addOrder">下单</mu-button> -->
      <mu-dialog title="下单" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
        确认选择：{{ radio.name }}  x {{ num }}?
        <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">取消</mu-button>
        <mu-button slot="actions" flat color="primary" @click="confirm">确认</mu-button>
      </mu-dialog>
    </mu-container>

  </div>
</template>
<script>
import { listDrink } from '@/api/drink'

// import { todayMenu } from '@/api/canteenMenu'
import { createOrder } from '@/api/drinkOrder'
import { mapGetters } from 'vuex'
const defaultDrink = {
  id: null,
  image: null,
  margin: null,
  name: null,
  price: null
}
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
  isMobile: 1
}
export default {
  data() {
    return {
      value11: '',
      openScroll: false,
      ringtone: 'None',
      radio: Object.assign({}, defaultDrink),
      listQuery: Object.assign({}, defaultListQuery),
      cols: 2,
      rows: 2,
      list: null,
      hasAddOrder: false,
      labelPosition: 'top',
      num: 1,
      openAlert: false,
      listOrder: null,
      todayOrderList: [],
      form: {
        input: '',
        select: '',
        date: '',
        radio: '',
        checkbox: [],
        switch: false,
        slider: 30,
        textarea: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listDrink(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
      })
    },
    setQuantity() {
      this.num = 1
    },
    addOrder() {
      console.log(this.radio.id)
      if (this.radio.id === null) {
        const message = '请选择商品再下单'
        const type = 'error'
        this.tips(message, type)
        this.openAlert = false
        return false
      }
      this.openAlert = true
    },
    setTableRadio() {
      if (this.listOrder != null) {
        this.list.map(food => {
          if (food.foodId === this.listOrder.foodId) {
            this.radio = food
          }
        })
      }
    },
    setSelectedNum() {
      if (this.todayOrderList != null) {
        this.list = this.list.map(food1 => {
          this.todayOrderList.map(food2 => {
            if (food1.foodId === food2.foodId) {
              food1.selectNum = food2.selectNum
            }
          })
          if (food1.selectNum == null) {
            food1.selectNum = 0
          }
          return food1
        })
      }
    },
    closeAlertDialog() {
      this.openAlert = false
    },
    confirm() {
      const defaultOrder = {
        drinkId: this.radio.id,
        quantity: this.num,
        price: this.radio.price,
        total: this.radio.price * this.num,
        image: this.radio.image,
        name: this.radio.name
      }
      createOrder(defaultOrder).then(response => {
        const message = '下单成功'
        const type = 'success'
        this.tips(message, type)
        this.openAlert = false
        // this.$router.go(0)
        this.$router.push('/mobile/drink/result')
      })
    },
    tips(message, type) {
      this.$message({
        message,
        type,
        duration: 1000
      })
    }
  }
}
</script>
<style lang="less">
@import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic';
@import 'http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css';
.mu-container {
  padding: 0 0;
}
.mu-demo-form {
  width: 100%;
  max-width: 460px;
}
.add-order {
  float: right;
  margin: 10px 10px 10px 0;
}
.alert-demo-wrapper {
  width: 90%;
  margin: 0 auto;
  > .mu-alert {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.drink-image {
  height: 200px;
}
</style>
