const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const user = require('../db/user');


let uploadpath = path.join(__dirname, '../../../client/img/');
let userimg;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadpath);
    },
    filename: function (req, file, cb) {
        let imgext = path.extname(file.originalname);
        userimg = req.session.user.name + '-' + Date.now() + imgext;
        cb(null, userimg);
    }
});

let upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
});


router.post('/user/upload',upload.single('myimg') ,(req, res) => {

    let imgurl='/img/'+ userimg;
    console.log(uploadpath);
    if(fs.existsSync(uploadpath+userimg)){
        user.findOne({_id:req.session.user._id},(err,data)=>{
            if(data.headerurl!='/img/timg.jpg'){
               let imgpath= path.parse(data.headerurl);
                fs.unlinkSync(uploadpath+imgpath.base);
                data.headerurl=imgurl;
                data.save(err=>{
                    req.session.user.headerurl=imgurl;
                })
            }

        })
    }else{
        res.json({err:1,msg:'上传失败'});
    }

});


module.exports = router;