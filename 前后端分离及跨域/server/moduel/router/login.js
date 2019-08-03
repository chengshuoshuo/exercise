const express=require('express');
const router=express.Router();
const user=require('../db/user');
const tools=require('../tools');

// 注册
router.post('/user/engine',(req,res)=>{
    if(!tools.trims(req.body.name)){
        res.json({err:1,msg:'用户名不能为空'});
        return;
    };
    if(!tools.trims(req.body.password)){
        res.json({err:1,msg:'密码不能为空'});
        return;
    };
    if(!tools.trims(req.body.age)){
        res.json({err:1,msg:'年龄不能为空'});
        return;
    };
    if(!tools.trims(req.body.sex)){
        res.json({err:1,msg:'性别不能为空'});
        return;
    };

    user.findOne({name:req.body.name},(err,data)=>{
        if(data){
            res.json({err:1,msg:'用户名已经存在'});
        }else{
            var s=new user({
                name:req.body.name,
                password:req.body.password,
                age:req.body.age,
                sex:req.body.sex,
                major:req.body.major,
                hobby:req.body.hobby
            });
            s.save(err=>{
                res.json({err:0,msg:'注册成功'});
            })

        }
    })
});


router.get('/user/login',(req,res)=>{
    if(!tools.trims(req.query.name)){
        res.json({err:1,msg:'用户名不能为空'});
        return;
    };
    if(!tools.trims(req.query.password)){
        res.json({err:1,msg:'密码不能为空'});
        return;
    };
    user.findOne({name:req.query.name},(err,data)=>{
        if(!data){
            res.json({err:1,msg:'用户名不存在'});
        }else{
            if(data.password!=req.query.password){
                res.json({err:1,msg:'密码错误'});
                return;
            }
            req.session.user=data;

            res.json({err:0,msg:'登录成功'});
        }
    })
});
router.get('/user/info',(req,res)=>{
   if(req.session.user){
        user.findOne({_id:req.session.user._id},(err,data)=>{

            res.json({err:0,user:JSON.parse(JSON.stringify(data))});
        })
   }else{
       res.json({err:1,msg:'还未登录'});
   }



});
router.post('/user/edit',(req,res)=>{
    user.updateOne({_id:req.session.user._id},{
        age:Number(req.body.age),
        sex:Number(req.body.sex),
        major:req.body.major,
        hobby:req.body.hobby
    },err=>{
        res.json({err:0,msg:'信息修改成功'});
        })
});






router.get('/user/goout',(req,res)=>{
    req.session.user=null;
    res.json({err:0,msg:'退出成功'});
});

module.exports=router;