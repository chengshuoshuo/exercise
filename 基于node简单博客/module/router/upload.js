const express=require('express');
const fs=require('fs');
const router=express.Router();
const multer=require('multer');
const user=require('../db/user');

var imguppath='./public/img/';
var headername;

var storage=multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,imguppath);
    },
   filename:function (req,file,cb) {
        let arr=file.originalname.split('.');
      var ext=arr[arr.length-1];
      headername=req.session.user.username+"-"+Date.now()+'.'+ext;
      cb(null,headername);
   }
});
var upload=multer({
   storage:storage,
   limits:{fileSizes:1024*1024*10},
   fileFilter:function (req,file,cb) {

       if(file.mimetype.startsWith('image')){
           cb(null,true);
       }else{
           cb('格式只能是图片',false);
       }
   }
});

router.post('/userimg',upload.single('headerimg'),(req,res)=>{
console.log('--------------------');
    var headerurl='/img/'+headername;

    if(fs.existsSync(imguppath+headername)){
        user.findOne({_id:req.session.user._id},(err,user)=>{
            if(user.headerurl!='/img/timg.jpg'){

                fs.unlinkSync('./public'+user.headerurl);
            }

            user.headerurl=headerurl;
            user.save(()=>{
              req.session.user.headerurl=headerurl;
              res.redirect('/')
            })
        })
    }else{
        res.send('上传失败');
    }
});

module.exports=router;