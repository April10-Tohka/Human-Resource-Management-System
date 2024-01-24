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

/**
 * 获取导入Excel模板
 * @returns 
 */
export function getExcelTemplate()
{
    return request({
        url:"/sys/user/import/template",
        method:"get",
        timeout:20000,
        responseType:"blob"
    })
}

/**
 * 上传Excel
 * @param {*} fileData Form-data类型
 * @returns 
 */
export function uploadExcel(fileData)
{
    return request({
        url:"/sys/user/import",
        method:"post",
        data:fileData
    })
}

/**
 * 删除员工
 * @param {*} id 要删除的员工id
 * @returns 
 */
export function DelEmployee(id)
{
    return request({
        url:`/sys/user/${id}`,
        method:"delete"
    })
}