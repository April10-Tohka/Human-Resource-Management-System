<template>
    <div class="dashboard-container">
      <div class="app-container">
        <div class="edit-form">
          <el-form ref="userForm" label-width="220px" :rules="rules" :model="userInfo">
            <!-- 姓名 部门 -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名" prop="username">
                  <el-input size="mini" class="inputW"  v-model="userInfo.username"/>
                </el-form-item>
              </el-col>
  
            </el-row>
            <!-- 工号 入职时间 -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="工号" prop="workNumber">
                    <!-- 工号是系统自动生成，所以禁止填写 -->
                  <el-input size="mini" class="inputW" v-model="userInfo.workNumber" :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <!--手机 聘用形式  -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="手机" prop="mobile">
                  <el-input
                    size="mini"
                    class="inputW"
                    v-model="userInfo.mobile"
                    :disabled="$route.query.id?true:false" 
                  />
                  <!-- NOTE 字符串转bool $route.query.id为字符串, !!$route.query.id可以转为bool -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="部门" prop="departmentId">
                  <!-- 放置及联部门组件 -->
                  <!-- 
                    NOTE 给自定义组件使用v-model来实现父子组件通信
                    看看官方文档https://v2.cn.vuejs.org/v2/guide/components-custom-events.html#自定义组件的-v-model (最好)
                    跟
                    https://blog.csdn.net/m0_53022813/article/details/124409581 博客了解
                   -->
                   <!-- 一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件 -->
                  <selectTree class="inputW" v-model="userInfo.departmentId" ></selectTree>
                  <!-- BUG 点击查看后，员工详情页面的部门栏没有显示所处的部门 -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="聘用形式" prop="formOfEmployment">
                  <el-select size="mini" class="inputW" v-model="userInfo.formOfEmployment" placeholder="请选择" >
                    <el-option label="正式" :value="1"></el-option>
                    <el-option label="非正式" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="入职时间" prop="timeOfEntry">
                  <el-date-picker
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    class="inputW"
                    v-model="userInfo.timeOfEntry"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="转正时间" prop="correctionTime">
                  <el-date-picker
                    size="mini"
                    type="date"
                    class="inputW"
                    v-model="userInfo.correctionTime"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 员工照片 -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="员工头像">
                  <!-- 放置上传图片 -->
                  <!-- 对自定义组件使用v-model来实现父子组件通信,将服务器返回的头像数据传递给子组件-->
                  <imageUpload v-model="userInfo.staffPhoto"></imageUpload>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 保存个人信息 -->
            <el-row type="flex">
              <el-col :span="12" style="margin-left:220px">
                <el-button size="mini" type="primary" @click="saveData">保存更新</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
  
      </div>
    </div>
</template>
  
<script>
import selectTree from './component/selectTree.vue';
import imageUpload from './component/imageUpload.vue';
import {AddEmployee,getEmployeeDetail,updateEmployeeDetail} from "@/api/employee"
export default {
  name:"detail",
  components:{
    selectTree,
    imageUpload
  },
  data(){
      return{
          //表单信息
          userInfo:{
              username:"",//用户名
              mobile:"",//手机号
              workNumber:"",//工号
              formOfEmployment:null,//聘用形式
              departmentId:null,//部门id
              timeOfEntry:"",//入职时间
              correctionTime:"",//转正时间
              staffPhoto:""//头像
          },
          //表单校验规则
          rules:{
              username:[
                  {required:true,message:"请输入名字",trigger:"blur"},
                  {min:1,max:6,message:"姓名为1-6位"}
              ],
              mobile:[
                  {required:true,message:"请输入手机号",trigger:"blur"},
                  {pattern:/^1[3-9]\d{9}$/,message:"手机号码格式不正确",trigger:"blur"}
              ],
              formOfEmployment:[{required:true,message:"请选择聘用形式",trigger:"blur"}],
              departmentId:[{required:true,message:"请选择部门",trigger:"blur"}],
              timeOfEntry:[{required:true,message:"请选择入职时间",trigger:"blur"}],
              correctionTime:[
                  {required:true,message:"请选择转正时间",trigger:"blur"},
                  {
                      validator:(rule,value,callback)=>
                      {
                          if(this.userInfo.timeOfEntry)
                          {
                              if(new Date(this.userInfo.timeOfEntry)>new Date(value))
                              {
                                  callback(new Error("转正时间不能小于入职时间"));
                                  return;
                              }
                          }
                          callback();
                      }
                  }
                  
              ]
          },
          
      }
  },
  methods:{
    //保存更新按钮
    saveData()
    {
      //校验表单是否通过
      this.$refs.userForm.validate((isOK)=>{
        if(isOK)
        {
          //编辑状态下($route.query.id有值)
          if(this.$route.query.id)
          {
            updateEmployeeDetail(this.userInfo).then(()=>{
              //提示更新员工信息成功
              this.$message({
                type:"success",
                message:"更新员工信息成功"
              })
            })
          }
          else
          {
            // 新增状态下
            //调用接口
            AddEmployee().then(()=>{
              //提示添加员工成功
              this.$message({
                type:"success",
                message:"添加员工成功"
              });
            })
          }
          //跳回员工列表页
          this.$router.push("/employee");
        }
      });
    },
    //获取员工详情信息
    getEmployeeDetail()
    {
      getEmployeeDetail(this.$route.query.id).then((data)=>{
        console.log("获取员工详情信息返回的数据",data);
        this.userInfo=data;
      })
    }
  },
  created()
  {
    console.log("查看路由传来的参数",this.$route.query.id);
    //如果点击查看员工(有路由传递的参数)，根据路由传来的参数来查询员工详情
    this.$route.query.id && this.getEmployeeDetail();//NOTE 等同于if(){}
  }
}
</script>
  
<style scoped lang="scss">
    .edit-form {
    background: #fff;
    padding: 20px;
    .inputW {
        width: 380px
    }
    }

</style>