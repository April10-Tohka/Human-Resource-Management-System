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

/**
 * 添加员工
 * @param {*} data 员工详情表单
 * @returns 
 */
export function AddEmployee(data)
{
    return request({
        url:"/sys/user",
        method:"post",
        data:data
    })
}

/**
 * 获取员工详情信息
 * @returns 
 */
export function getEmployeeDetail(id)
{
    return request({
        url:`/sys/user/${id}`,
        method:"get"
    })
}

/**
 * 更新员工详情信息
 * @param {*} data 修改后的员工详情信息,(需要有员工的id)
 * @returns 
 */
export function updateEmployeeDetail(data)
{
    return request({
        url:`/sys/user/${data.id}`,
        method:"put",
        data:data
    })
}

/**
 * 获取已启用的角色列表
 * @returns 
 */
export function getRoleList()
{
    return request({
        url:"/sys/role/list/enabled",
        method:"get"
    })
}

/**
 * 给员工分配角色
 * @param {*} data {id，roleIds}
 * @returns 
 */
export function assignRoles(data)
{
    return request({
        url:"/sys/user/assignRoles",
        method:"put",
        data:data
    })
}