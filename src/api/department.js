import request from "@/utils/request"

export function getDepartment()
{
    return request({
        url:"/company/department",
        method:"get"
    })
}