<template>
    <el-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>


<script>
export default {
    name:"imageUpload",
    model:{
      prop:"imageUrl"
    },
    props:{
      imageUrl:""
    },
    data() {
        return {
        };
    },
    methods: {
        //上传头像之前的钩子
        beforeAvatarUpload(file) {
            console.log("file:",file);
            //上传头像的格式支持JPEG GIF png bmp
            //NOTE includes判断数组是否包含一个指定的值，包含返回true 否则返回false
            const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
            const isLt5M = file.size / 1024 / 1024 < 5;//将图片大小单位bit转换为M
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!');
            }
            if (!isLt5M) {
                this.$message.error('上传头像图片大小不能超过 5MB!');
            }
            return isJPG && isLt5M;
        }
    }
}
</script>


<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>