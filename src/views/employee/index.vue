<template>
    <div class="container">
        <div class="app-container">
            <div class="left">
                <el-input style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索" v-model="queryParams.keyword" @input="debounceSearchEmployee" />
                <!-- 树形组件 -->
                <el-tree :data="depts" :props="defaultProps" :default-expand-all="true" :highlight-current="true"
                node-key="id" ref="deptsTree" @current-change="selectNode"></el-tree>
            </div>
            <div class="right">
                <el-row class="opeate-tools" type="flex" justify="end">
                <el-button size="mini" type="primary" @click="$router.push('/employee/detail')"  v-permission="'add-employee'">添加员工</el-button>
                <el-button size="mini" @click="showExcelDialog=true">excel导入</el-button>
                <el-button size="mini" @click="exportEmployee">excel导出</el-button>
                </el-row>
                <!-- 表格组件 -->
                <el-table :data="employeeList">
                    <el-table-column label="头像" align="center" prop="staffPhoto1">
                        <template v-slot="{row}">
                            <el-avatar v-if="row.staffPhoto" :size="30" :src="row.staffPhoto" ></el-avatar>
                            <span v-else class="username">{{ row.username.charAt(0)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="姓名" prop="username"></el-table-column>
                    <el-table-column label="手机号" :sortable="true" prop="mobile"></el-table-column>
                    <el-table-column label="工号" :sortable="true" prop="workNumber"></el-table-column>
                    <el-table-column label="聘用形式" prop="formOfEmployment" align="center">
                        <template v-slot="{row}">
                            <span>{{ row.formOfEmployment===1?"正式":row.formOfEmployment===2?"非正式":"无"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="部门" prop="departmentName"></el-table-column>
                    <el-table-column label="入职时间" :sortable="true" prop="timeOfEntry"></el-table-column>
                    <el-table-column label="操作" width="280px">
                        <template v-slot="{row}">
                            <el-row>
                                <el-button size="mini" type="text" @click="$router.push({path:'/employee/detail',query:{id:row.id}})">查看</el-button>
                                <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
                                <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="btnDel(row.id)">
                                    <el-button type="text" size="mini" slot="reference" style="margin-left: 10px;" >删除</el-button>
                                </el-popconfirm>
                            </el-row>
                        </template>
                    
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-row type="flex" justify="end" style="height: 60px;" align="middle">
                    <el-pagination layout="total,prev,pager,next" :total="total" @current-change="changePage" :current-page="queryParams.page" :page-sizes="[queryParams.pagesize]"></el-pagination>
                </el-row>
            </div>
        </div>
        <!-- 放置导入Excel组件 -->
        <importExcel :showExcelDialog.sync="showExcelDialog" @uploadExcelSuccess="getEmployeeList"></importExcel>
        <!-- 放置员工分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="showAssignRoleDialog">
            <el-checkbox-group v-model="roleIds">
                <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
            <template #footer>
                <el-row type="flex" justify="center" >
                    <el-col :span="6">
                        <el-button type="primary" @click="confirmAssignRoles">确定</el-button>
                        <el-button @click="showAssignRoleDialog=false">取消</el-button>
                    </el-col>
                </el-row>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {getDepartment} from "@/api/department"
import {transListToTreeData,debounce} from "@/utils"
import {getEmployeeList,exportEmployee,DelEmployee,getRoleList,getEmployeeDetail,assignRoles} from "@/api/employee"
import { saveAs } from 'file-saver';//从file-saver包导入保存文件方法
import importExcel from './component/importExcel.vue';
import store from "@/store";
export default {
    name: 'Employee',
    components:{
        importExcel
    },
    data() {
        return {
            depts: [], //部门列表数据
            defaultProps: {
                children: "children",
                label: "name"
            },
            //获取员工列表查询参数
            queryParams: {
                departmentId: null, //部门id
                pagesize:10,//当前页面需要的数据条数
                page:1,//当前页面
                keyword:""//要搜索的名字
            },
            //员工列表数据
            employeeList: [],
            //员工列表数据的总数
            total:null,
            //是否显示导入Excel页面
            showExcelDialog:false,
            //是否弹出员工分配角色对话框
            showAssignRoleDialog:false,
            //已启用的角色列表
            roleList:[],
            //选中的角色列表
            roleIds:[],
            //选中某个员工的id
            currentId:null
        };
    },
    created() {
        this.getDepartment();
        //返回经过防抖函数处理的 searchEmployee 方法
        this.debounceSearchEmployee=debounce(this.searchEmployee,1000);
    },
    methods: {
        //获取部门列表数据
        getDepartment() {
            getDepartment().then((data) => {
                //将获取到的部门列表数据转换为树形结构
                this.depts = transListToTreeData(data, 0);
                this.queryParams.departmentId = this.depts[0].id;
            }).then(() => {
                // TRACK Vue 在更新 DOM 时是异步执行的，不了解
                //设置默认选中节点
                this.$refs.deptsTree.setCurrentKey(this.queryParams.departmentId);
            }).then(() => {
                //获取该部门下的员工列表数据
                this.getEmployeeList();
            });
        },
        //选中某个部门
        selectNode(data) {
            //记录该节点的id
            this.queryParams.departmentId = data.id;
            //设置查询当前页码为第一页
            this.queryParams.page=1;
            // 获取该部门下的员工列表数据
            this.getEmployeeList();
        },
        //获取该部门下的员工列表数据
        getEmployeeList() {
            // 调用接口，获取该部门下的员工列表数据
            getEmployeeList(this.queryParams).then((data) => {
                console.log("获取到该部门下的员工列表数据", data);
                //解构员工列表数据和数据总数并赋值给表格显示数据employeeList和分页组件的总数
                let { rows,total } = data;
                this.employeeList = rows;
                this.total=total;
            });
        },
        //切换分页
        changePage(newPage)
        {
            this.queryParams.page=newPage;
            //调用接口获取当前分页下的员工列表数据
            this.getEmployeeList();
        },
        //根据输入的名字搜索员工
        searchEmployee()
        {
            console.log("调用searchEmployee方法");
            //设置查询当前页为第一页
            this.queryParams.page=1;
            this.getEmployeeList();
        },
        //导出员工execl
        exportEmployee()
        {
            exportEmployee().then((data)=>{
                console.log("查看exportEmployee返回的数据",data);
                saveAs(data,"员工信息表.xlsx");
            })
        },
        //删除员工
        btnDel(id)
        {
            console.log("传来的id为",id);
            //调用删除接口，删除后端数据
            DelEmployee(id).then(()=>{
                //提示删除操作成功
                this.$message({message:"删除成功",type:"success"});
                //判断该行是否为该页的最后一行,同时该页不为第一页
                if(this.employeeList.length===1&& this.queryParams.page>1){this.queryParams.page--};
                //重新加载数据
                this.getEmployeeList();
            })
        },
        //给员工分配角色
        btnRole(id)
        {
            // NOTE promise.all来 获取已启用的角色列表数据和获取员工的基本信息中所拥有的角色
            Promise.all([getRoleList(),getEmployeeDetail(id)]).then((data)=>{
                console.log("查看Promise.all返回的结果",data);
                this.roleList=data[0];
                this.roleIds=data[1].roleIds;
                this.currentId=id;//记录选中某个员工的id
                //弹出分配角色对话框
                this.showAssignRoleDialog=true;
            })
        },
        //分配角色对话框确定按钮
        confirmAssignRoles()
        {
            assignRoles({id:this.currentId,roleIds:this.roleIds}).then(()=>{
                this.$message.success("分配角色成功");
                this.showAssignRoleDialog=false;
            })
        }
    },
    directives:{
        permission:{
            //inserted钩子函数，被绑定元素插入父结点时调用
            inserted(el,binding)
            {
                console.log("el:",el);
                console.log("binding:",binding);
                console.log("store",store);
                console.log(store.state.user.UserInfo.roles);
                // NOTE ?.可选链操作符 见文档https://blog.csdn.net/Ght19970126/article/details/122084892
                const {points} =store.state.user?.UserInfo?.roles || [];
                console.log("points:",points);
                //如果用户信息不包含add-employee权限，就删除指令绑定的元素
                if(!points.includes(binding.value)) {el.remove()};
                
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.app-container {
background: #fff;
display: flex;
.left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
}
.right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
    margin:10px ;
    }
    .username {
    height: 30px;
    width: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    background: #04C9BE;
    font-size: 12px;
    display:inline-block;
    }
}
.username
{
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 50%;
    background: #04c9be;
    color: #fff;
    margin-right: 4px;
}
}

</style>