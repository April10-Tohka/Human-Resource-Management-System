<template>
    <div class="container">
        <div class="app-container">
            <!-- 角色管理内容 -->
            <div class="role-operate">
                <el-button type="primary" size="mini" @click="showDialog=true">添加角色</el-button>
            </div>
            <!-- 放置table表格 -->

            <!-- 
                NOTE 实现行内编辑效果需求：
                1.点击编辑按钮，表格的该行呈现表单形式，即可以编辑输入框的数据
                2.可以表格多行同时编辑
                3.编辑下，点击确定保存数据
                4.编辑下，点击取消回退原来的数据

                如何实现:

             -->
            <el-table :data="list">
                <el-table-column label="角色" align="center" width="200" prop="name">
                    <!-- 若该行点击了编辑，即该行isEdit为true，则渲染输入框,否则渲染span -->
                    <template v-slot="{row}">
                        <el-input v-if="row.isEdit" size="mini" v-model="row.editRow.name"></el-input>
                        <span v-else>{{ row.name }}</span>
                    </template>
                </el-table-column>

                <!-- 使用el-table-colum的slot来自定义列显示内容 -->
                <el-table-column label="启用" align="center" width="200" prop="state" >
                    <!-- NOTE 使用解构来解构插槽Prop
                        在el文档中，告诉了el-table-column的插槽对象包含 row, column, $index 这三个属性
                        row属性包含该行要显示的数据
                        所以我们使用对象解构来获取插槽对象里的row属性
                    -->
                    <template v-slot:default="{row}">
                        <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1"  :inactive-value="0"></el-switch>
                        <span v-else>{{ row.state==1?"已启用":row.state==0?"未启用":"无" }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="描述" align="center" prop="description">
                    <template v-slot="{row}">
                        <el-input v-if="row.isEdit" type="textarea" v-model="row.editRow.description"></el-input>
                        <span v-else>{{ row.description }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" prop="">
                    <template v-slot="{row}">
                        <!-- 编辑状态下 -->
                        <template v-if="row.isEdit">
                            <el-button type="primary" size="mini" @click="btnEditOK(row)">确定</el-button>
                            <el-button size="mini" @click="row.isEdit=false">取消</el-button>
                        </template>
                        <!-- 非编辑状态下 -->
                        <template v-else>
                            <el-button type="text" size="mini" @click="btnPermission(row)">分配权限</el-button>
                            <el-button type="text" size="mini" @click="btnEdit(row)">编辑</el-button>
                            <!-- 点击编辑，需要将该行的数据传递给函数，因为使用了el-table-column的插槽来自定义内容，v-slot可以获取到该行数据,解构插槽对象里的row并传递给函数 -->
                            <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="btnDel(row.id)">
                                <el-button type="text" size="mini" slot="reference" style="margin-left: 10px;" >删除</el-button>
                            </el-popconfirm>
                            
                        </template>
                        
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

            <!-- 分配权限对话框 -->
            <el-dialog title="分配权限" :visible.sync="showPermissionDialog">
                <el-tree ref="permissionTree" :data="permissionData" :props="{label:'name'}" default-expand-all show-checkbox node-key="id" :default-checked-keys="permIds"></el-tree>
                <template #footer>
                    <el-row type="flex" justify="center">
                        <el-col :span="6">
                            <el-button type="primary" @click="confirmAssignPermission">确定</el-button>
                            <el-button @click="showPermissionDialog=false">取消</el-button>
                        </el-col>
                    </el-row>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {getRoleList,addRole,updateRole,delRole,getRoleDetail,assignPermission} from "@/api/role"
import {getPermissionList} from "@/api/permission"
import { transListToTreeData } from "@/utils"
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
            },
            showPermissionDialog:false,//是否显示分配权限对话框
            permissionData:[],//权限数据
            currentRoleId:null,//选中角色的id
            permIds:[],//角色关联的权限集合，来实现默认选中效果
        }
    },
    methods:{
        //获取角色列表
        getRoleList()
        {
            getRoleList(this.pageParams).then((data)=>{
                console.log("getRoleList返回的数据",data);
                //使用对象解构,解构数据里的rows角色列表,total数据总数
                const {rows,total}=data;
                this.list=rows;
                this.pageParams.total=total;
                //给list表格的每行数据添加响应式数据isEdit来判断是否处于编辑状态
                this.list.forEach((item)=>{
                    //NOTE 使用this.$set(要操作的数据，键名，值) 直接item.isEdit=false;vue无法检测到isEdit的变化
                    this.$set(item,"isEdit",false);
                    //给list表格的每行数据添加响应式数据editRow来缓存数据，在编辑状态下双向绑定该数据，
                    //NOTE v-model双向绑定的数据必须是响应式数据
                    this.$set(item,"editRow",{
                        name:item.name,
                        state:item.state,
                        description:item.description
                    })
                    
                })
                
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
        //新增角色表单确定按钮
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
        //新增角色表单取消按钮
        btnCancel()
        {
            //重置表单
            this.$refs.roleForm.resetFields();
            //关闭对话框
            this.showDialog=false;
        },
        //表格编辑按钮
        btnEdit(row)
        {
            console.log("点击了编辑，查看传递的row",row);
            //将该行的数据里的isEdit设置为true
            row.isEdit=true;//TRACK 这里我以为是个局部变量，以为不能修改表格对应该行的数据，只能说vue已经设计好了
            //编辑状态下，设置表单的编辑数据
            row.editRow={
                name:row.name,
                state:row.state,
                description:row.description
            }
        },
        //编辑状态下表单确定按钮
        btnEditOK(row)
        {
            console.log("btnEditOK的row ",row);
            //检查name和description是否为空
            if(row.editRow.name&& row.editRow.description)
            {
                //调用接口
                updateRole({...row.editRow,id:row.id}).then(()=>{
                    //提示修改角色详情成功
                    this.$message({message:"修改角色详情成功",type:"success"});
                    //更新表格显示数据,并退出编辑状态
                    //NOTE Object.assign(target,source)将source中所有可枚举的属性复制到目标对象，并返回修改后的target对象
                    Object.assign(row,{...row.editRow,isEdit:false});
                })
            }
            else
            {
                //为空，提示不能为空
                this.$message({
                    message:"角色名称和角色描述不能为空",
                    type:"warning"
                })
            }
        },
        //非编辑状态下点击删除按钮
        btnDel(id)
        {
            delRole(id).then(()=>{
                //提示删除角色操作成功
                this.$message({message:"删除角色成功",type:"success"});
                //判断该行是否为该页的最后一行
                /*
                每一页都是调用接口得到返回的数据，list数组的长度就是该页的表格项的个数,
                调用接口只是删除数据库里的数据，前端list还没有调用接口更新数据，所以判断前端list即可
                */
                if(this.list.length===1){this.pageParams.page--};//是的话，当前页码-1
                // 重新获取角色列表
                this.getRoleList();
            })
        },
        //分配权限按钮
        btnPermission(row)
        {
            // 记录选中角色的id
            this.currentRoleId=row.id;
            //获取角色详情和权限列表
            Promise.all([getPermissionList(),getRoleDetail(this.currentRoleId)]).then((data)=>{
                console.log("查看promise.all返回的data,",data);
                this.permissionData=transListToTreeData(data[0],0);
                this.permIds=data[1].permIds;
                this.showPermissionDialog=true;
            })
        },
        //分配权限对话框的确定按钮
        confirmAssignPermission()
        {
            //获取选中节点的数组
            let permIds=this.$refs.permissionTree.getCheckedKeys();
            //调用接口
            assignPermission({id:this.currentRoleId,permIds:permIds}).then(()=>{
                this.$message.success("分配权限成功");
                this.showPermissionDialog=false;
            })
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