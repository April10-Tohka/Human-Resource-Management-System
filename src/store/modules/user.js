import {getToken,setToken,removeToken} from "../../utils/auth"
import { login ,getUserInfo} from "@/api/user";
import { constantRoutes,resetRouter } from "@/router";
const state={
  //token通过读取缓存来获取
  token:getToken(),
  UserInfo:{},//用户资料
  routes:constantRoutes//用户所能访问的路由
}

const mutations={
  setToken(state,token)
  {
    //设置state里的token
    state.token=token;
    //缓存token
    setToken(token);
    
  },
  removeToken(state)
  {
    //设置state里的token为null
    state.token=null;
    //删除缓存中的token
    removeToken()
  },
  setUserInfo(state,UserInfo)
  {
    state.UserInfo=UserInfo;
  },
  //设置用户所能访问的路由
  setRoutes(state,newRoutes)
  {
    state.routes=[...state.routes,...newRoutes];
  }
}


const actions={
  //登录
  async login(context,value)
  {
    console.log("这里是store里的action，收到的value",value);
    console.log("下面开始调用登录接口!");
    // 调用登录接口
    const token=await login(value); 
    console.log("token:",token);
    //登录接口返回了一个token， 
    context.commit("setToken",token)
  },

  //获取用户资料
  async getUserInfo(context)
  {
    //调用用户资料接口
    const result= await getUserInfo();
    //将返回的结果设置vuex
    context.commit("setUserInfo",result);
  },

  //退出登录
  logOut(context)
  {
    //删除token
    context.commit("removeToken");
    //将用户资料设置为空
    context.commit("setUserInfo",{});
    resetRouter();//重置路由
  }
}

export default{
  namespaced:true,
  state,
  mutations,
  actions
}