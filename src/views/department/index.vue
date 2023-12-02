<template>
    <div class="container">
        <div class="app-container">
            <el-tree :data="depts" :props="defaultProps" default-expand-all :expand-on-click-node="false">
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
                                <!-- TRACK 可能需要了解一下事件处理的回调函数，我记得默认会给回调函数传event事件 -->
                                <el-dropdown  @command="operateDept($event,data.id)">
                                    <span class="el-dropdown-link">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="add">添加</el-dropdown-item>
                                        <el-dropdown-item command="edit">编辑</el-dropdown-item>
                                        <el-dropdown-item command="delete">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                        </el-col>
                    </el-row> 
                </template> 
            </el-tree>
        </div>
        <!-- NOTE
            .sync的目的是实现双向绑定
            （这里的双向绑定指的是子组件共享父组件的数据，父组件的数据改变子组件的数据会跟着一起改变，子组件也能改变父组件的数据
            :showDialog.sync等同于@update:showDialog=(value)=>{showDialog=value}
            然后子组件$emit('update:showDialog', false),触发update:showDialog，并传了false过去,使得showDialog=false
            参考文档：https://www.jb51.net/javascript/299819zbb.htm
        -->
        <add-dept ref="AddDept" :showDialog.sync="showDialog" :currentNodeId="currentNodeId" @updateDepartment="getDepartment"></add-dept>
    </div>
</template>

<script>
import {getDepartment} from "@/api/department"
import {transListToTreeData} from "@/utils/index"
import AddDept from './components/AddDept.vue'
export default {
    name:"Department",
    components:{
        AddDept
    },
    data()
    {
        return{
            currentNodeId:undefined,//当前树形节点的id
            depts:[],
            defaultProps:
            {
                label:"name",
                children:"children"
            },
            showDialog:false
        }
    },
    created()
    {
        this.getDepartment();
    },
    methods:{
        //获取部门列表
        getDepartment()
        {
            getDepartment().then(data=>{
                console.log("查看getDepartment接口返回的data：",data);
                this.depts=transListToTreeData(data,0);
            })
            
        },
        //部门操作
        operateDept(type,id)
        {
            this.currentNodeId=id;
            // 点击了添加
            if(type==="add")
            {
                // 给AddDept组件传入showDialog=true，使其显示
                this.showDialog=true;
            }
            //点击了编辑
            else if (type==="edit")
            {
                console.log("点击了编辑");
                console.log("id:",id);
                //显示弹出层
                this.showDialog=true;
                //调用AddDept组件的getDepartmentDetail方法，获取部门数据
                this.$refs.AddDept.getDepartmentDetail(id);
            }
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