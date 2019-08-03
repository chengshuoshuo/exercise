const user = require('../db/user');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

router.post('/user', (req, res) => {
    if (req.session.user) {
        res.json({err: 1, user: req.session.user})
    } else {
        res.json({err: 0, user: null})
    }
});


router.post('/engine', (req, res) => {

    if (!req.body.username) {
        res.json({err: 0, msg: '用户名不能为空'});
        return;
    }
    if (!req.body.password) {
        res.json({err: 0, msg: '密码不能为空'});
        return;
    }
    if (req.body.password != req.body.password2) {
        res.json({err: 0, msg: '两次密码不相同'});
        return;
    }
    if (!req.body.age) {
        res.json({err: 0, msg: '请正确的填写年龄'});
        return;
    }
    delete req.body.password2;

    user.findOne(req.body, (err, data) => {
        if (data) {
            res.json({err: 0, msg: '用户名已经存在'});
            return;
        } else {
            req.body.img = "/img/timg.jpg";
            var s = new user(req.body);
            s.save(err => {
                res.json({err: 1, msg: '注册成功'});
            })
        }


    })
});


router.post('/login', (req, res) => {
    if (!req.body.username) {
        res.json({err: 0, msg: '用户名不能为空'});
        return;
    }
    if (!req.body.password) {
        res.json({err: 0, msg: '密码不能为空'});
        return;
    }
    user.findOne({username: req.body.username}, (err, data) => {
        if (!data) {
            res.json({err: 0, msg: '用户名不存在'});
            return;
        }
        if (data.password != req.body.password) {
            res.json({err: 0, msg: '密码不正确'});
            return;
        }
        req.session.user = data;
        res.json({err: 1, msg: '登录成功'});
    })
});


//修改
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({
    storage: storage
});

router.post('/upload', upload.single('myimg'), (req, res) => {
    if (!req.file) {
        res.json({err: 0, msg: '没有选择文件'});
        return;
    }
    if (!req.file) {
        res.json({err: 0, msg: '上传失败', r: req.file});
    } else {

        if (req.session.user.img != "/img/timg.jpg") {
            fs.unlinkSync('./public' + req.session.user.img);
        }
        var str = '/uploads/';
        req.session.user.img = str + req.file.filename;
        user.updateOne({username: req.session.user.username},{img:req.session.user.img}, (err, data) => {
                res.json({err: 1,msg:'图片提交成功', user: req.session.user});

        });

    }

});


router.post('/updata', (req, res) => {
    user.findOne({username: req.session.user.username}, (err, data) => {
        data.age=req.body.age;
        data.sex=req.body.sex;
        data.major=req.body.major;
        data.hobby=req.body.hobby;
        data.save((err1, data2) => {
            if (err1) {
                console.log('出错');
            } else {
                req.session.user = data2;
                res.json({err: 1, msg: '修改成功', user: req.session.user});
            }
        })
    })
});


//退出登录
router.post('/goout', (req, res) => {
    req.session.user = null;
    res.json({err: 0, msg: '退出成功'});
});

module.exports = router;