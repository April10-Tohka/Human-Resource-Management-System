//导航守卫
import router from "./router";
import nprogress from "nprogress"
import "nprogress/nprogress.css"
import store from "./store";
import {asyncRoutes} from "@/router" //引入动态路由
//白名单
const WhiteList=["/login","/404"];

//路由前置守卫
router.beforeEach(async(to,from,next)=>{
  nprogress.start();//开启进度条
  if(store.getters.token)
  {
    //有token
    if(to.path==="/login")//如果是跳转到登录页
    {
      //是，就跳到主页
      next({path:"/"})//路由后置守卫是当路由发生跳转后才会执行,通过next跳转路由是不会执行afterEach()
      nprogress.done();//手动关闭进度条
      
    }
    else
    {
      //不是跳转到登录页就放行
      //判断是否获取过用户资料,通过判断是否有用户的id
      if(!store.getters.userId)
      {
        //不存在用户的id，则获取用户资料,通过调用action里的getUserInfo
        console.log("开始获取用户资料，会调用getUserInfo的action，会请求一次");
        await store.dispatch("user/getUserInfo")
        const {roles}= store.getters.userInfo;//从vuex获取用户资料
        //过滤出用户能访问的路由
        const filterRoutes= asyncRoutes.filter(item=>{
          return roles.menus.includes(item.name);
        })
        //将404放置在所有的路由的最后
        filterRoutes.push({ path: '*', redirect: '/404', hidden: true });
        console.log("filterRoutes:",filterRoutes);
        //添加到用户所能访问的路由
        store.commit("user/setRoutes",filterRoutes);
        router.addRoutes(filterRoutes);//添加路由
        next(to.path);
      }
      else
      {
        next();
      }
      
    }
  }
  else
  {
    //没有token
    //判断要跳转的页面是否在白名单内
    if(WhiteList.indexOf(to.path)>-1)
    {
      //在白名单内就放行
      next()
    }
    else
    {
      //不在白名单内，跳转到登录页
      next({path:"/login"});
    }
    
  }
  
})

//路由后置守卫
router.afterEach((to,from)=>{
  nprogress.done();
  
})