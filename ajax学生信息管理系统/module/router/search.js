const student = require('../db/student');
const express = require('express');
const router = express.Router();

router.get('/student/search',(req,res)=>{
        //每一页几条
    var show_count=req.query.show_count*1;
    var page=req.query.page*1;
    let condition={};
    if(req.query.name){
        condition.name=new RegExp(req.query.name,'gi');
    }
    if(req.query.age){
        condition.age=req.query.age;
    }
    if(req.query.sex){
        condition.sex=req.query.sex;
    }
    if(req.query.phone){
        condition.phone=req.query.phone;
    }




   student
       .find(condition)
       .countDocuments()
       .then(count=>{
            student.find(condition).sort({_id:-1}).skip((page-1)*show_count).limit(show_count).exec((err,data)=>{
               res.json({err:1,allpage:Math.ceil(count/show_count),data:data})
            })

   }).catch(err=>{
       res.json({err:0,msg:err})
   });

    // student.find(condition,(err,data)=>{
    //    res.json({err:1,data:data,req:req.query})
    // });

});

module.exports = router;