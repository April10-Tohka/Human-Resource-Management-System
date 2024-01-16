import request from "@/utils/request"

export function getRoleList(params)
{
    return request({
        url:"/sys/role",
        method:"get",
        params:params //查询参数,最终拼接在url中
    })
}