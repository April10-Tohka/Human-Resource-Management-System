import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  //模块
  modules: {
    app,//左侧导航栏的伸缩
    settings,
    user
  },
  //vuex的计算属性
  getters
})

export default store
