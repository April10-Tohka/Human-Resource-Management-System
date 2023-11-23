import {getToken,setToken,removeToken} from "../../utils/auth"
import { login } from "@/api/user";
const state={
  //token通过读取缓存来获取
  token:getToken()
}

const mutations={
  setToken(state,token)
  {
    //设置state里的token
    state.token=token;
    //缓存token
    setToken(token);
    
  },
  removeToken(state,token)
  {
    //设置state里的token为null
    state.token=null;
    //删除缓存中的token
    removeToken()
  }
}


const actions={
  
  async login(context,value)
  {
    console.log("这里是store里的action，收到的value",value);
    console.log("下面开始调用登录接口!");
    // 调用登录接口
    const token=await login(value); //TRACK 这里视频用了async ，我不会，尤其是这里,不用await的话返回Promise，我忘了怎么从Promise拿到那个data了
    // token.then(data=>{console.log("a去输出data ",data)})
    console.log("token:",token);
    //登录接口返回了一个token， 
    context.commit("setToken",token)
    
  }
}

export default{
  namespaced:true,
  state,
  mutations,
  actions
}