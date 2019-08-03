const express=require('express');
const router=require('./index');

router.get('/user',(req,res)=>{
   res.render('user',{user:req.session.user});
});




module.exports=router;

    