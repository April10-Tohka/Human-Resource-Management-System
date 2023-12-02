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
                        <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
                        <el-button size="mini" @click="closeDialog">取消</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {getDepartment,getManagerList,AddDepartment,getDepartmentDetail} from "@/api/department"
export default {
    name:"AddDept",
    props:{
        showDialog:{
            type:Boolean,
            default:false
        },
        currentNodeId:{
            type:Number,
            default:undefined
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
            //重置表单
            this.$refs.addDept.resetFields();
            //关闭对话框
            this.$emit('update:showDialog', false)
        },
        //获取负责人列表
        getManagerList()
        {
            getManagerList().then(data=>{
                console.log(`获取了负责人列表`,data);
                this.managerList=data;
            })
        },
        //AddDept组件的确定按钮
        btnOK()
        {
            console.log("点击了AddDept组件的确定按钮");
            //判断表单校验是否通过
            this.$refs.addDept.validate(isOK=>{
                if(isOK)//校验通过
                {
                    //调用新增部门接口
                    //TRACK 这里用...拓展运算符，我还不会，等会来看看
                    AddDepartment({...this.formData,pid:this.currentNodeId}).then(()=>{
                        //新增部门完成之后通知父组件重新获取部门列表数据，并更新
                        //触发自定义事件
                        this.$emit("updateDepartment");
                    }).then(()=>{
                        //提示新增部门成功
                        this.$message({
                            type:"success",
                            message:"新增部门成功"
                        })
                        //重置表单,关闭表单对话框
                        this.closeDialog();                        
                    })
                }
            })
            
        },
        //AddDept组件获取点击了编辑的部门的数据
        getDepartmentDetail(id)
        {
            //获取部门数据
            getDepartmentDetail(id).then(data=>{
                console.log("getDepartmentDetail返回的数据",data);
                //数据赋值给表单数据
                this.formData=data;
            })
        }
    },
    data()
    {
        return {
            //表单数据
            formData:{
                code:"",//部门编码
                introduce:"",//部门介绍
                managerId:"",//部门负责人名字
                name:"",//部门名称
                pid:""//部门父级部门id
            },
            //表单校验规则
            rules:{
                code:[
                    {required:true,trigger:"blur",message:"部门编码不能为空"},
                    {min:2,max:10,message:"部门编码的长度为2-10个字符",trigger:"blur"},
                    {
                        trigger:"blur",
                        validator:async(rule,value,callback)=>{
                            let result=await getDepartment();
                            //编辑部门场景下，表单校验要去除本身的数据，因为点击编辑后，数据从服务器得来
                            // 编辑部门场景和新增部门场景的区别在于form.id是否存在
                            //编辑，请求服务器并获取数据，id存在
                            //新增，没有从服务器获取数据,id不存在
                            if(this.formData.id)
                            {
                                //编辑部门场景下
                                result=result.filter(item=>item.id!==this.formData.id);
                            }
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
                            if(this.formData.id)
                            {
                                //编辑部门场景下
                                result=result.filter(item=>item.id!==this.formData.id);
                            }
                            if (result.some(item => item.name === value)) {
                                callback(new Error('部门中已经有该名称了'))
                            } else {
                                callback()
                            }
                        }
                    }
                ]
                
            },
            managerList:[]//部门负责人列表
        }
    }
}
</script>

<style>

</style>