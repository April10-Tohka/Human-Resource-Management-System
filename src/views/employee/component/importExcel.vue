<template>
    <el-dialog
        width="500px"
        title="员工导入"
        :visible="showExcelDialog"
        @close="$emit('update:showExcelDialog', false)"
    >
        <el-row type="flex" justify="center">
        <div class="upload-excel">
            <input
            ref="excel-upload-input"
            class="excel-upload-input"
            type="file"
            accept=".xlsx, .xls"
            @change="uploadExcel"
            >
            <div class="drop">
            <i class="el-icon-upload" />
            <el-button type="text" @click="getExcelTemplate">下载导入模板</el-button>
            <span>将文件拖到此处或
                <el-button type="text" @click="handleUpload">点击上传</el-button>
            </span>
            </div>
        </div>
        </el-row>
        <el-row type="flex" justify="end">
        <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
        <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
import { getExcelTemplate,uploadExcel } from '@/api/employee';
import { saveAs } from 'file-saver';//从file-saver包导入保存文件方法
export default {
props: {
    showExcelDialog: {
    type: Boolean,
    default: false
    }
},
methods: {
    //下载Excel模板
    getExcelTemplate()
    {
        console.log("获取员工导入Excel模板");
        getExcelTemplate().then((blob)=>{
            console.log("blob:",blob);
            saveAs(blob,"员工导入模板.xlsx");
        })
    },
    //处理上传事件
    handleUpload()
    {
        //NOTE web浏览器想要打开系统的文件选择框，唯一的办法就是通过input type=file类型来打开
        //弹出文件选择框(点击input)
        this.$refs["excel-upload-input"].click();
    },
    //上传Excel文件
    uploadExcel(event)
    {
        //当type=file的input有值时，代表已经选择好了文件
        let file=event.target.files;
        if(file.length>0)
        {
            //有文件
            let fileData= new FormData();
            fileData.append("file",file[0]);
            //尝试调用上传接口
            try
            {
                uploadExcel(fileData).then(()=>{
                    //关闭导入Excel页面
                    this.$emit('update:showExcelDialog', false);
                    //通知父组件上传成功，重新加载数据
                    this.$emit("uploadExcelSuccess");
                })
            }
            // 调用上传接口失败处理
            catch(error)
            {

            }
            finally
            {
                //清空input的值
                this.$refs["excel-upload-input"].value="";
            }
            
        }
    }
}
}
</script>
  
<style scoped lang="scss">
    .upload-excel {
    display: flex;
    justify-content: center;
    margin: 20px;
    width: 360px;
    height: 180px;
    align-items: center;
    color: #697086;
    .excel-upload-input {
        display: none;
        z-index: -9999;
    }
    .btn-upload,
    .drop {
        border: 1px dashed #dcdfe6;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 160px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .drop {
        line-height: 40px;
        color: #bbb;
        i {
        font-size: 60px;
        display: block;
        color: #c0c4cc;
        }
    }
    }
</style>