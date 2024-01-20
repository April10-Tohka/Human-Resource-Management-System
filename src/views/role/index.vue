<template>
    <div class="container">
        <div class="app-container">
            <!-- 角色管理内容 -->
            <div class="role-operate">
                <el-button type="primary" size="mini" @click="showDialog=true">添加角色</el-button>
            </div>
            <!-- 放置table表格 -->
            <el-table :data="list">
                <el-table-column label="角色" align="center" width="200" prop="name"></el-table-column>
                <!-- 使用el-table-colum的slot来自定义列显示内容 -->
                <el-table-column label="启用" align="center" width="200" prop="state" >
                    <!-- NOTE 使用解构来解构插槽Prop
                        在el文档中，告诉了el-table-column的插槽对象包含 row, column, $index 这三个属性
                        所以我们使用对象解构来获取插槽对象里的row属性
                    -->
                    <template v-slot:default="{row}">
                        <span>{{ row.state==1?"已启用":row.state==0?"未启用":"无" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="描述" align="center" prop="description"></el-table-column>
                <el-table-column label="操作" align="center" prop="">
                    <template>
                        <el-button type="text" size="mini">分配权限</el-button>
                        <el-button type="text" size="mini">编辑</el-button>
                        <el-button type="text" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="end" align="middle" style="height: 60px;">
                <el-pagination layout="prev,pager,next" :page-size="pageParams.pagesize" :total="pageParams.total" :current-page="pageParams.page" @current-change="changeCurrentPage" >

                </el-pagination>
            </el-row>


            <!-- 新增角色对话框 -->
            <el-dialog :visible.sync="showDialog" title="新增角色" width="500" @close="btnCancel">
                <el-form label-width="120px" :rules="rules" :model="roleForm" ref="roleForm">
                    <el-form-item label="角色名称" prop="name" >
                        <el-input style="width: 300px;" size="mini" v-model="roleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="启用" prop="state">
                        <!-- NOTE 调用el-form的resetFields重置表单数据的时候，需要prop -->
                        <el-switch v-model="roleForm.state" active-value="1" inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="description">
                        <el-input style="width: 300px;" size="mini" type="textarea" rows="3" v-model="roleForm.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-row type="flex" justify="center">
                            <el-col :span="20">
                                <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
                                <el-button size="mini" @click="btnCancel">取消</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {getRoleList,addRole} from "@/api/role"
export default {
    name:"Role",
    data(){
        return{
            list:[],//
            pageParams:{
                page:1,//当前页码
                pagesize:5,//每页显示条目个数
                total:0//总页面数
            },
            showDialog:false,//是否显示弹窗
            //表单数据
            roleForm:{
                name:"",//角色名称
                description:"",//角色描述
                state:0 //  0为未启用 1为启用
            },
            //表单校验规则
            rules:{
                name:[{required:true,message:"角色名称不能为空",trigger:"blur"}],
                description:[{required:true,message:"角色描述不能为空",trigger:"blur"}]
            }
        }
    },
    methods:{
        //获取角色列表
        getRoleList()
        {
            getRoleList(this.pageParams).then((data)=>{
                console.log("getRoleList返回的数据",data);
                const {rows,total}=data;//使用对象解构,解构数据里的rows属性
                this.list=rows;
                this.pageParams.total=total;
            })
        },
        //切换分页
        changeCurrentPage(newPage)
        {
            //更改当前页码
            this.pageParams.page=newPage;
            //切换页面后获取当前页的数据
            this.getRoleList();
        },
        //表单确定按钮
        btnOK()
        {
            //校验表单数据
            this.$refs.roleForm.validate((isOK)=>{
                if(isOK)
                {
                    //表单检验成功后，调用接口
                    addRole(this.roleForm).then(()=>{
                        //提示新增角色成功
                        this.$message({
                            message:"新增角色成功",
                            type:"success"
                        })
                        // 重新加载表格数据
                        this.getRoleList();
                        //重置表单关闭对话框
                        this.btnCancel();
                    })
                }
            })

        },
        //表单取消按钮
        btnCancel()
        {
            //重置表单
            this.$refs.roleForm.resetFields();
            //关闭对话框
            this.showDialog=false;
        }
    },
    created()
    {
        this.getRoleList()
    }
}
</script>

<style>
.role-operate
{
    padding: 10px;
}
</style>