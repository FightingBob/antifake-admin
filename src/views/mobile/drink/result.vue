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
      <mu-row gutter>
        <mu-col span="6" offset="3"><h1 style="margin-top:100px;">下单成功！！！</h1></mu-col>
      </mu-row>
      <mu-row gutter>
        <mu-col span="6" offset="3"><mu-button full-width color="primary" @click="goback">返回零售区，继续购买</mu-button></mu-col>
      </mu-row>

    </mu-container>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StoreResult',
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  methods: {
    goback() {
      this.$router.push('/mobile/drink')
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
