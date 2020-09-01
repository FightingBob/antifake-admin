<template>
  <div>
    <mu-container class="mu-container">
      <mu-appbar style="width: 100%;" color="primary">
        <mu-button slot="left" icon>
          <mu-icon value="menu" />
        </mu-button>
        点餐
        <mu-avatar slot="right">
          <img :src="avatar+'?imageView2/1/w/80/h/80'">
        </mu-avatar>
      </mu-appbar>
      <mu-list textline="two-line">
        <mu-sub-header v-if="menu.status === 1 && menu.ended === 0" hidden>你选择的是：{{ radio.name }}</mu-sub-header>
        <mu-sub-header v-else>点餐活动已截止</mu-sub-header>
        <mu-list-item v-for="(tile, index) in list" :key="'radio ' + index" avatar :ripple="false" button>
          <mu-list-item-content :style="(tile.id != radio.id) ? '':'color: #f44336;'">
            <mu-list-item-title>
              <span v-if="tile.storeName != null">{{ tile.storeName }} - </span>
              <span>{{ tile.name }}</span>
            </mu-list-item-title>
            <mu-list-item-sub-title :style="(tile.id != radio.id) ? 'color: rgba(0, 0, 0, .87)':'color: #f44336;'">{{ tile.price }} 元</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-radio v-model="radio" :value="tile" checked-icon="check_circle" :disabled="hasAddOrder" :style="(tile.id != radio.id) ? '':'color: #f44336;'" />
            <mu-list-item-after-text v-if="orderData != null"> X {{ tile.quantity }}</mu-list-item-after-text>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
      <mu-button v-if="listOrder == null && listOrder == undefined" color="primary" class="add-order" :disabled="hasAddOrder" @click="addOrder">下单</mu-button>
      <mu-dialog title="下单" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
        确认选择：
        <span v-if="radio.storeName != null">{{ radio.storeName }} - </span>
        <span>{{ radio.name }}</span>
        <span> - {{ radio.price }} 元 </span>?
        <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">取消</mu-button>
        <mu-button slot="actions" flat color="primary" @click="confirm">确认</mu-button>
      </mu-dialog>
    </mu-container>

  </div>
</template>
<script>
import { todayMenu, createOrder, orderData } from '@/api/canteenMenu'
import { mapGetters } from 'vuex'
const defaultFood = {
  id: null,
  name: null,
  price: null,
  storeName: null,
  menuId: null,
  status: null
}
const defaultMenu = {
  id: undefined,
  endTime: null,
  status: undefined,
  ended: undefined,
  finished: undefined
}
export default {
  data() {
    return {
      openScroll: false,
      ringtone: 'None',
      radio: Object.assign({}, defaultFood),
      cols: 2,
      rows: 2,
      list: null,
      labelPosition: 'top',
      openAlert: false,
      listOrder: null,
      hasAddOrder: true,
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
      },
      user: null,
      orderData: null,
      menu: Object.assign({}, defaultMenu)
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
      todayMenu().then(response => {
        this.list = response.data.list
        this.menu = response.data.menu
        if (this.menu.status === 1 && this.menu.ended === 1) {
          this.hasAddOrder = true
        }
        this.todayOrder()
      })
    },
    addOrder() {
      if (this.radio.id === null) {
        const message = '请选择午餐再下单'
        const type = 'error'
        this.tips(message, type)
        this.openAlert = false
        return false
      }
      this.openAlert = true
      this.hasAddOrder = true
    },
    todayOrder() {
      orderData(this.menu.id).then(response => {
        if (response.data == null) {
          return false
        }
        this.user = response.data.user
        this.orderData = response.data.list
        this.setTableRadio()
        this.setSelectedNum()
      })
    },
    setTableRadio() {
      if (this.user != null) {
        this.hasAddOrder = true
        this.list.forEach((item) => {
          if (item.id === this.user.foodId) {
            this.radio = item
          }
        })
      } else {
        this.hasAddOrder = false
      }
    },
    setSelectedNum() {
      this.list = this.list.map(food1 => {
        this.orderData.map(food2 => {
          if (food1.id === food2.foodId) {
            food1.quantity = food2.quantity
          }
        })
        if (food1.quantity == null) {
          food1.quantity = 0
        }
        return food1
      })
    },
    closeAlertDialog() {
      this.openAlert = false
      this.hasAddOrder = false
    },
    confirm() {
      createOrder(this.radio).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.openAlert = false
        this.$router.go(0)
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
.food-image {
  height: 200px;
}
.select-color {
  color: #2196F3;
}
</style>
<style>
.el-message ,
.el-message--success{
    top: 200px !important
}
</style>
效果
