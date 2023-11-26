const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId:state=> state.user.UserInfo.userId //用户的id，用来判断是否获取过用户的资料的依据
}
export default getters
