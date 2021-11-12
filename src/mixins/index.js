export const mixin = {
    methods:{
        notify(title,type){
            this.$notify({
                title: title,
                type: type
            })
        },
        //根据相对地址获取绝对地址
        getUrl(url){
            return `${this.$store.state.HOST}/${url}`
        },
        //获取性别
        getSex(value){
            if(value==0)
                return '女';
            else if(value==1)
                return '男';
            else if(value==2)
                return '组合';
            else
                return value;
        },
        getBirth(birth){
            return String(birth).substr(0,10);
        },
        //上传图片之前的校验
        beforeAvatorUpload(file){
            const isJPG=(file.type ==='image/jpeg')||(file.type === 'image/png');
            if(!isJPG){
                this.$message.error("上传图片只能是png/jpg/jpeg格式");
                return false;
            }
            const isLt2M=file.size/1024/1024<2;
            if(!isLt2M){
                this.$message.error("图片大小不能超过2M");
                return false;
            }
        },
        //上传图片成功之后
        handleAvatorSuccess(res){
            console.log(res);
            let _this=this;
            if(res.code==1){
                _this.getSingers();
                _this.$notify({
                    title: '上传成功',
                    type:'success'
                })
            }else
            {
                _this.$notify({
                    title: '上传失败',
                    type:'error'
                })
            }
        },
        //弹出删除窗口
        handleDelete(id){
            this.idx=id;
            this.deleteVisible=true;
        },
        //把已经选择的项赋值给multipleSelection
        handleSelectChange(val){
            this.multipleSelection=val;
        },
        //批量删除已经选择的项
        delAll(){
            for(let item of this.multipleSelection){
                this.idx=item.id;
                this.deleteRow();
            }
            this.multipleSelection=[];
        }
    }
}