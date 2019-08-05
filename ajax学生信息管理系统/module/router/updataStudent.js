const student = require('../db/student');
const express = require('express');
const router = express.Router();

router.get('/student/getup', (req, res) => {
    student.findOne({_id:req.query.id},(err,data)=>{
        res.json({err:1,data});
    });
});


router.post('/student/up',(req,res)=>{
   student.findOne({_id:req.body.id},(err,data)=>{
       let objL=req.body;
       delete  objL.id;
       data=Object.assign(data,objL);
       data.save((err,data)=>{
           if(err){
               res.json({err:0,msg:'编辑失败'});
           }else{
               res.json({err:1,msg:'编辑成功'});
           }
       })
    })
});





module.exports = router;