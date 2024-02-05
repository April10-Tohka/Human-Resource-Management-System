const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.UserInfo.staffPhoto,//用户头像
  name: state => state.user.UserInfo.username,//用户名
  userId:state=> state.user.UserInfo.userId, //用户的id，用来判断是否获取过用户的资料的依据
  userInfo:state=>state.user.UserInfo,//用户资料
  routes:state=>state.user.routes//用户能访问的路由
}
export default getters
