<template>
    <div>
        <el-dialog title="添加部门" :visible="showDialog" @close="closeDialog">
            <!-- 添加部门的表单内容 -->
            <el-form label-width="120px"  ref="addDept" :model="formData" :rules="rules">
                <el-form-item label="部门名称" prop="name">
                    <el-input style="width: 80%;" placeholder="2-10个字符" size="mini"  v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="部门编码" prop="code">
                    <el-input style="width: 80%;" placeholder="2-10个字符" size="mini" v-model="formData.code"></el-input>
                </el-form-item>
                <el-form-item label="部门负责人" prop="managerId">
                    <!-- v-model获取的是el-option的value值，所以要获取id，则el-option的value绑定id -->
                    <el-select style="width: 80%;" placeholder="请选择负责人" size="mini" v-model="formData.managerId">
                        <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门介绍" prop="introduce">
                    <el-input style="width: 80%;" placeholder="1-100个字符" type="textarea"  :rows="4" size="mini" v-model="formData.introduce"></el-input>
                </el-form-item>
                <el-row type="flex" justify="center">
                    <el-col :span="12" :offset="6">
                        <el-button type="primary" size="mini">确定</el-button>
                        <el-button size="mini">取消</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {getDepartment,getManagerList} from "@/api/department"
export default {
    name:"AddDept",
    props:{
        showDialog:{
            type:Boolean,
            default:false
        }
    },
    created()
    {
        this.getManagerList();
    },
    methods:{
        //关闭表单对话框
        closeDialog()
        {
            this.$emit('update:showDialog', false)
        },
        //获取负责人列表
        getManagerList()
        {
            getManagerList().then(data=>{
                console.log(`获取了负责人列表`,data);
                this.managerList=data;
            })
        }
    },
    data()
    {
        return {
            formData:{
                code:"",//部门编码
                introduce:"",//部门介绍
                managerId:"",//部门负责人名字
                name:"",//部门名称
                pid:""//部门父级部门id
            },
            rules:{
                code:[
                    {required:true,trigger:"blur",message:"部门编码不能为空"},
                    {min:2,max:10,message:"部门编码的长度为2-10个字符",trigger:"blur"},
                    {
                        trigger:"blur",
                        validator:async(rule,value,callback)=>{
                            let result=await getDepartment();
                            if (result.some(item => item.code === value)) {
                                callback(new Error('部门中已经有该编码了'))
                            } else {
                                callback()
                            }
                        }
                    }
                ],
                introduce:[
                    {required:true,trigger:"blur",message:"部门介绍不能为空"},
                    {min:1,max:100,message:"部门介绍的长度为1-100个字符",trigger:"blur"}
                ],
                managerId:[
                    {required:true,trigger:"blur",message:"部门负责人不能为空"},
                ],
                name:[
                    {required:true,trigger:"blur",message:"部门名称不能为空"},
                    {min:2,max:10,message:"部门名称的长度为2-10个字符",trigger:"blur"},
                    {
                        trigger:"blur",
                        validator:async(rule,value,callback)=>{
                            let result = await getDepartment()
                            // result数组中是否存在 value值
                            if (result.some(item => item.name === value)) {
                                callback(new Error('部门中已经有该名称了'))
                            } else {
                                callback()
                            }
                        }
                    }
                ]
                
            },
            managerList:[]
        }
    }
}
</script>

<style>

</style>