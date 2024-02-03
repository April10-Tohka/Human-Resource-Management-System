import request from "@/utils/request"

//获取角色列表数据
export function getRoleList(params)
{
    return request({
        url:"/sys/role",
        method:"get",
        params:params //查询参数,最终拼接在url中
    })
}

//新增角色
export function addRole(data)
{
    return request({
        url:"/sys/role",
        method:"post",
        data:data
    })
}

//修改角色详情
export function updateRole(data)
{
    return request({
        url:`/sys/role/${data.id}`,
        method:"put",
        data:data
    })
}

//删除角色
export function delRole(id)
{
    return request({
        url:`/sys/role/${id}`,
        method:"delete"
    })
}

/**
 * 获取角色的详情
 * @param {*} id 角色的id
 * @returns 
 */
export function getRoleDetail(id)
{
    return request({
        url:`/sys/role/${id}`,
        method:"get"
    })
}


/**
 * 给角色分配权限
 * @param {*} data {id:角色id,permIds:所选择的权限点数组}
 * @returns 
 */
export function assignPermission(data)
{
    return request({
        url:"/sys/role/assignPrem",
        method:"put",
        data:data
    })
}