import request from "@/utils/request"

//登录接口
export function login(data)
{
  return request({
    url:"/sys/login",
    method:"post",
    data:data
  })
}

//获取用户资料接口
export function getUserInfo()
{
  return request({
    url:"/sys/profile",
    method:"get"
  })
}