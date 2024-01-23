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

/**
 * 员工导出Excel
 * @returns 
 */
export function exportEmployee()
{
    return request({
        url:"/sys/user/export",
        method:"get",
        responseType:"blob",
        timeout:20000
    })
}