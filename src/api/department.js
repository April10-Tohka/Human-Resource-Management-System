import request from "@/utils/request"

/**
 * 获取部门列表
 */
export function getDepartment()
{
    return request({
        url:"/company/department",
        method:"get"
    })
}

/**
 * 获取部门负责人列表
 */
export function getManagerList()
{
    return request({
        url:"/sys/user/simple",
        method:"get"
    })
}

/**
 * 新增部门
 */
export function AddDepartment(data)
{
    return request({
        url:"/company/department",
        method:"post",
        data:data
    })
}

/**
 * 获取当前部门的数据
 */
export function getDepartmentDetail(id)
{
    return request({
        url:`/company/department/${id}`,
        method:"get"
    })
}

/**
 * 修改部门详情
 */
export function modifyDepartment(data)
{
    return request({
        url:`/company/department/${data.id}`,
        method:"put",
        data:data
    })
}