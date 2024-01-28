<template>
    <el-cascader :options="treeData" :props="props" placeholder="请选择部门" size="mini" separator="-" @change="changeValue"></el-cascader>
</template>

<script>
import {getDepartment} from "@/api/department"
import {transListToTreeData} from "@/utils/index"
export default {
    name:"selectTree",
    props:{
        value:{
            type:Number,
            default:null
        }
    },
    data(){
        return{
            //级联选择器
            treeData:[],
            //级联选择器的props
            props:{
                label:"name",
                value:"id"
            }

        }
    },
    methods:{
        //获取所有的部门列表数据
        getDepartment()
        {
            getDepartment().then((data)=>{
                console.log("部门列表数据",data);
                this.treeData=transListToTreeData(data,0);//数据转换为树形结构
            })
        },
        //级联选择器选中的节点发生变化事件的回调函数
        changeValue(value)
        {
            //回调参数value在此为数组，数组的最后一位的值为选中部门的id
            //触发input事件，并且传一个参数，<selectTree v-model="value"></selectTree>  value的属性值=该传递的参数
            this.$emit("input",value[value.length-1]);  
        }
    },
    created()
    {
        this.getDepartment();
    }
}
</script>

<style>

</style>