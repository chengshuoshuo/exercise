const student = require('../db/student');
const express = require('express');
const router = express.Router();

router.get('/student/del', (req, res) => {

    student.deleteOne({_id:req.query.id},(err,data)=>{
    }).then(err=>{
        res.json({err:1});

    })
});
module.exports = router;