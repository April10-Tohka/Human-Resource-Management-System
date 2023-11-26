import axios from 'axios'
import store from '../store/index'
import {Message} from "element-ui"

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
  //响应成功后，获取响应数据
  const {data,message,success}=res.data;
  if(success)
  {
    //成功就返回数据
    return data;//TRACK 我想知道axios返回的数据是Promise形式还是data本身的形式,这让我只能跟着视频使用async
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
},(err)=>{
  console.log("响应失败了！");
  Message({
    message:err.message,
    type:"error"
  })
  return Promise.reject(err);
})

export default service
