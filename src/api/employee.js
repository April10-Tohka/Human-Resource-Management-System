import  request  from "@/utils/request"

/**
 * 获取员工列表
 * @param {*} params 查询参数
 * @returns 
 */
export function getEmployeeList(params)
{
    return request({
        url:"/sys/user",
        params:params
    })
}