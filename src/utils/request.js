import axios from 'axios'
import store from '../store/index'
import {Message} from "element-ui"
import router from '@/router'
//创建一个axios实例
const service=axios.create({
  // baseURL:process.env.VUE_APP_BASE_API,//获取到的是 /dev-api
  baseURL:"/api",//TODO 暂时先写死基地址
  timeout:10000
})

//添加请求拦截器(在发送请求前进行一些操作)
/**
 * param1:Function 在发送请求之前做些什么
 * param2:Function  对请求失败做些什么  
 */
service.interceptors.request.use((config)=>{
  
  //如何获取vuex里的state里的token？
  console.log("请求拦截器成功时！");
  //注入token
  if(store.getters.token)
  {
    config.headers.Authorization=`Bearer ${store.getters.token}`
  }
  return config;
},(error)=>{
  console.log("请求拦截器失败时！");
  console.log("err:",error);
  return Promise.reject(error)
})

//添加响应拦截器
service.interceptors.response.use((res)=>{
  console.log("响应成功！");
  //如果响应数据形式为blob二进制流,直接返回blob二进制流文件
  if(res.data instanceof Blob)
  {
    return res.data;
  }
  //响应成功后，获取响应数据
  const {data,message,success}=res.data;
  if(success)
  {
    //成功就返回数据
    return data;
  }
  else
  {
    //失败
    Message({
      message:message,
      type:"error"
    })
    return Promise.reject(message);
  }
},
  //响应失败
  (err)=>{
  console.log("响应失败了！");
  if(err.response.status===401)
  {
    console.log("token验证不通过就会输出此句");
    Message({
      type:"warning",
      message:"token超时了"
    })
    //调用退出登录action
    store.dispatch("user/logOut")
    .then(()=>{
      //store.dispatch返回的是Promise
      // 使用then()等待dispatch执行完 再接着跳转到登录界面
      router.push("/login");
      return Promise.reject(err);
    })
    
  }
  Message({
    message:err.message,
    type:"error"
  })
  return Promise.reject(err);
})

export default service
