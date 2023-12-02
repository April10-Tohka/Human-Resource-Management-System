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