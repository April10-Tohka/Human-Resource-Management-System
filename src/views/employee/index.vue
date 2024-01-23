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
            <el-button size="mini" type="primary">添加员工</el-button>
            <el-button size="mini">excel导入</el-button>
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
                        <span>{{ row.formOfEmployment===1?"正式":row.formOfEmployment===0?"非正式":"无"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="部门" prop="departmentName"></el-table-column>
                <el-table-column label="入职时间" :sortable="true" prop="timeOfEntry"></el-table-column>
                <el-table-column label="操作" width="280px">
                    <template>
                         <el-row>
                            <el-button size="mini" type="text">查看</el-button>
                            <el-button size="mini" type="text">角色</el-button>
                            <el-button size="mini" type="text">删除</el-button>
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
    </div>
</template>

<script>
import {getDepartment} from "@/api/department"
import {transListToTreeData,debounce} from "@/utils"
import {getEmployeeList,exportEmployee} from "@/api/employee"
import { saveAs } from 'file-saver';//从file-saver包导入保存文件方法
export default {
    name: 'Employee',
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
            total:null
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