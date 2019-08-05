const student = require('../db/student');
const express = require('express');
const router = express.Router();

router.post('/student/append', (req, res) => {
    if (!req.body.name.match(/\S/)) {
        res.json({err: 0, errtext: '用户名不能为空'});
        return;
    }
    if (!req.body.age.match(/\S/)) {
        res.json({err: 0, errtext: '年龄不能为空'});
        return;
    }
    if (!req.body.phone.match(/\S/)) {
        res.json({err: 0, errtext: '联系方式不能为空'});
        return;
    }
    if(!req.body.email.match(/\S/)){
        res.json({err:0,errtext:'请填写邮箱'});
        return;
    }

    var stud=new student(req.body);
    stud.save((err,data)=>{
        res.json({err:1})
    });
});


module.exports = router;