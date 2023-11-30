<template>
    <div class="container">
        <div class="app-container">
            <el-tree :data="depts" :props="defaultProps" default-expand-all>
                <!-- NOTE 
                    使用作用域插槽来自定义节点内容 ,使用v-slot会传入两个参数node,data
                    node：当前节点的node对象
                    data:当前节点的数据  对应树形结构的数据
                    然后就可以自定义节点内容，比如有下拉菜单
                -->
                <template v-slot="{data}">
                    <el-row type="flex" justify="space-between" align="middle" style="width: 100%;height: 40px;" >
                        <el-col :span="16">{{ data.name }}</el-col>
                        <el-col :span="8">
                            <span class="tree-manager">{{ data.managerName }}</span>
                                <el-dropdown>
                                    <span class="el-dropdown-link">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item>添加</el-dropdown-item>
                                        <el-dropdown-item>编辑</el-dropdown-item>
                                        <el-dropdown-item>删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                        </el-col>
                    </el-row> 
                </template>
                

                
            </el-tree>
        </div>
    </div>
</template>

<script>
import {getDepartment} from "@/api/department"
import {transListToTreeData} from "@/utils/index"
export default {
    name:"Department",
    data()
    {
        return{
            depts:[],
            defaultProps:
            {
                label:"name",
                children:"children"
            }
            
        }
    },
    created()
    {
        this.getDepartment();
    },
    methods:{
        getDepartment()
        {
            getDepartment().then(data=>{
                console.log("查看data：",data);
                this.depts=transListToTreeData(data,0);
                console.log("this.dept:",this.depts);
            })
            
        }
    }
}
</script>

<style scoped>
.app-container
{
    padding: 30px 140px;
}
.tree-manager
{
    display: inline-block;
    
    margin: 10px;
}
</style>