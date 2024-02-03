import request from "@/utils/request"
/**
 * 获取权限点列表
 */
export function getPermissionList()
{
    return request({
        url:"/sys/permission",
        method:"get"
    })
}

/**
 * 删除权限点
 * @param {*} id 要删除权限点的id
 * @returns 
 */
export function delPermission(id)
{
    return request({
        url:`/sys/permission/${id}`,
        method:"delete"
    })
}

/**
 * 新增权限点
 * @param {*} data 新增权限点的数据
 * @returns 
 */
export function addPermission(data)
{
    return request({
        url:"/sys/permission",
        method:"post",
        data:data
    })
}

/**
 * 更改某个权限点详情
 * @param {*} id 要更改权限点详情的id
 * @returns 
 */
export function updatePermission(data)
{
    return request({
        url:`/sys/permission/${data.id}`,
        method:"put",
        data:data
    })
}