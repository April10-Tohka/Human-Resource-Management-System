<template>
    <!-- BUG
        1.行内编辑时，有的表格是树形结构，导致在行内编辑时，输入框不对齐
        TODO
        1. 后续看看如何点击添加后，表格新增一行，来实现行内添加信息
    -->
    <div class="container">
      <div class="app-container">
        <el-button class="btn-add" size="mini" type="primary" @click="addPermission(pid=0,type=1)">添加权限</el-button>
        <el-table :data="permissionList" row-key="id">
          <el-table-column label="名称" prop="name" >
            <template v-slot="{row}">
                <template v-if="row.isEdit">
                    <el-input size="mini" v-model="row.name"></el-input>
                </template>
                <template v-else>
                    <span>{{ row.name }}</span>
                </template>
            </template>
          </el-table-column>

          <el-table-column label="标识" prop="code" align="center">
            <template v-slot="{row}">
                <template v-if="row.isEdit">
                    <el-input size="mini" v-model="row.code"></el-input>
                </template>
                <template v-else>
                    <span>{{ row.code }}</span>
                </template>
            </template>
          </el-table-column>

          <el-table-column label="描述" prop="description" align="center">
            <template v-slot="{row}">
                <template v-if="row.isEdit">
                    <el-input type="textarea" size="mini" v-model="row.description"></el-input>
                </template>
                <template v-else>
                    <span>{{ row.description }}</span>
                </template>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template v-slot="{row}">
                <template v-if="row.isEdit">
                    <el-button size="mini" type="text" @click="confirmEdit(row)">确认</el-button>
                    <el-button size="mini" type="text" @click="cancelEdit(row)">取消</el-button>
                </template>
                <template v-else>
                    <el-button size="mini" type="text" v-if="row.type===1" @click="addPermission(pid=row.id,type=2)">添加</el-button>
                    <el-button size="mini" type="text" @click="editPermission(row)">编辑</el-button>
                    <el-button size="mini" type="text" @click="delPermission(row.id)">删除</el-button>
                </template>
            </template>
          </el-table-column>
        </el-table>

        <!-- 新增权限对话框 -->
        <el-dialog title="新增权限" :visible.sync="showDialog" width="500px">
            <el-form label-width="100px" :model="permissonInfo" :rules="rules" ref="addPermission">
                <el-form-item label="权限名称" prop="name">
                    <el-input size="mini" style="width: 300px;" v-model="permissonInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="权限标识" prop="code">
                    <el-input size="mini" style="width: 300px;" v-model="permissonInfo.code"></el-input>
                </el-form-item>
                <el-form-item label="权限描述">
                    <el-input type="textarea" size="mini" style="width: 300px;" :rows="3" v-model="permissonInfo.description"></el-input>
                </el-form-item>
                <el-form-item label="开启">
                    <el-switch v-model="permissonInfo.enVisble" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-row type="flex"  style="margin-left: 60px;">
                        <el-button type="primary" @click="confirmAdd">确定</el-button>
                        <el-button @click="cancelAdd">取消</el-button>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-dialog>
      </div>
    </div>
</template>
<script>
import {getPermissionList,delPermission,updatePermission,addPermission} from "@/api/permission"
import {transListToTreeData} from "@/utils/index"
export default {
    name: 'Permission',
    data()
    {
        return {
            permissionList:[],//权限点列表
            showDialog:false,//显示对话框
            //权限点详情
            permissonInfo:{
                name:"",//权限点名字
                code:"",//权限点标识
                description:"",//权限点描述
                type:null,//权限点类型, 1为页面路由权限点, 2为按钮权限点
                pid:null,//权限点父级id
                enVisble:"",//权限点开启状态  0关闭 1打开
            },
            //表单校验规则
            rules:{
                name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
                code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
            }
        }
    },
    methods:{
        //获取权限点列表
        getPermissionList()
        {
            //调用获取权限点列表的接口
            getPermissionList().then((data)=>{
                console.log("获取权限点列表的数据",data);
                //给列表的每一项添加响应式数据isEdit，来判断表格该行是否处于编辑状态
                data.forEach(item => {
                    this.$set(item,"isEdit",false);
                });
                //将返回的数据转换为树形结构
                this.permissionList=transListToTreeData(data,0);
            })
        },
        //删除权限点
        delPermission(id)
        {
            this.$confirm("此操作将永久删除该权限点, 是否继续?","提示",
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                // delPermission(id).then(()=>{
                //     //提示删除成功
                //     this.$message({type:"success",message:"删除权限点成功"});
                // })
                return Promise.all([delPermission(id),this.$message({type:"success",message:"删除权限点成功"})]);
            }).then((all)=>{
                console.log("查看使用了promise。all返回的结果",all);
                //删除后重新获取权限点列表数据
                this.getPermissionList();
            }).catch(()=>{
                this.$message({type:"info",message:"已取消删除"});
            })
            
        },
        //编辑权限点
        editPermission(row)
        {
            console.log("点击了编辑，收到的row为",row);
            row.isEdit=true;
            row.cacheRow={...row};
        },
        //编辑状态下取消按钮
        cancelEdit(row)
        {
            console.log("取消编辑");
            //取消编辑，回退数据
            Object.assign(row,{...row.cacheRow,isEdit:false});
            delete row.cacheRow;
        },
        //编辑状态下确认按钮
        confirmEdit(row)
        {
            if(row.name&&row.code)
            {
                //调用修改权限点详情接口
                updatePermission(row).then(()=>{
                    //提示修改成功
                    this.$message({type:"success",message:"修改权限点成功"});
                    //关闭编辑状态
                    row.isEdit=false;
                    delete row.cacheRow;
                })
            }
            else
            {
                this.$message({message:"名称和标识不能为空",type:"warning"});
            }
        },
        //添加权限点
        addPermission(pid,type)
        {
            this.showDialog=true;
            this.permissonInfo.pid=pid;
            this.permissonInfo.type=type;
        },
        //添加状态下确定按钮
        confirmAdd()
        {
            console.log("点击了确定");
            //校验表单
            this.$refs.addPermission.validate((isOK)=>{
                if(isOK)
                {
                    //调用接口
                    addPermission(this.permissonInfo).then(()=>{
                        //提示添加权限成功
                        this.$message({type:"success",message:"添加权限点成功"});
                        //关闭对话框并清空表单数据
                        this.cancelAdd();
                        //重新获取权限点列表数据
                        this.getPermissionList();
                    })
                }
            })
        },
        //添加状态下取消按钮
        cancelAdd()
        {
            console.log("点击了取消");
            //关闭对话框
            this.showDialog=false;
            //清空表单数据
            this.permissonInfo={
                name:"",//权限点名字
                code:"",//权限点标识
                description:"",//权限点描述
                type:null,//权限点类型,
                pid:null,//权限点父级id
                enVisble:"",//权限点开启状态  0关闭 1打开
            }

        }
    },
    created()
    { 
        this.getPermissionList();
    }
  }
</script>
<style>
.btn-add {
    margin: 10px;
}
</style>