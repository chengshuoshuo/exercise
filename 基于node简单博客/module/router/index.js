const express = require('express');
const router = express.Router();


//引入函数模块
const tools = require('../tools');
//引入加密模块用于注册
const md5 = require('md5');
//引入会话模块
const session = require('express-session');
const MongeStore = require('connect-mongo')(session);
router.use(session({
    secret: 'myLogin',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    store: new MongeStore({
        url: "mongodb://127.0.0.1/sessionLogin"
    })
}));
const flash = require('connect-flash');
router.use(flash());
//引入注册数据库模块
const user = require('../db/user');
//引入发帖数据库模块
const issue = require('../db/issue');
//引入回帖数据库模块
const guest = require('../db/guest');

router.get('/', (req, res) => {
    issue.countDocuments((err, count) => {
        //当前页
        var page = (req.query.page || 1) * 1;
        var show_count = 5;
        issue
            .find()
            .sort({'time2':-1})
            .populate('auther')
            .skip((page - 1) * show_count)
            .limit(show_count)
            .exec((err, data) => {
                var error = req.flash('error').toString();
                var issue = data;
                var allpage = Math.ceil(count / show_count);
                res.render('index', {user: req.session.user, error, issue, page, allpage});
            });
    })
});

//注册
router.get('/engin', (req, res) => {
    var error = req.flash('error').toString();
    res.render('engin', {error});
});
router.post('/engin', (req, res) => {
    if(!req.body.username){
        error=req.flash('error','用户名不能为空');
        res.redirect('/engin');
        return;
    }
    if(req.body.username.length>8){
        error=req.flash('error','用户名不能超过八位数');
        res.redirect('/engin');
        return;

    }
    user.findOne({username: req.body.username}, (err, data) => {
        if (err) {
            console.log('错误');
        } else {
            if (data) {
                error = req.flash('error', '用户名已经被注册');
                res.redirect('/engin');
                return;
            }
            if (req.body.password != req.body.password2) {
                error = req.flash('error', '两次密码输入不一样');
                res.redirect('/engin');
                return;
            }
            var s = new user({
                username: req.body.username,
                age:req.body.age,
                sex:req.body.sex,
                password: md5(req.body.password),
                time: tools.dateFor(new Date()),
                time2: (new Date()).getTime(),
                headerurl: '/img/timg.jpg'
            });
            s.save(err => {
                res.redirect('/login');
            });
        }
    });
});

//路由登录
router.get('/login', (req, res) => {
    var error = req.flash('error').toString();
    res.render('login', {error});
});
router.post('/login', (req, res) => {
    user.findOne({username: req.body.username}, (err, data) => {
        if (!data) {
            error = req.flash('error', '用户不存在');
            res.redirect('/login');
        } else {
            if (data.password == md5(req.body.password)) {
                req.session.user = data;
                res.redirect('/');
            } else {
                error = req.flash('error', '密码不正确');
                res.redirect('/login');
            }
        }
    })
});
//发布
router.get('/issue', (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }
    var error = req.flash('error').toString();
    res.render('issue', {error, user: req.session.user})
});
router.post('/issue/go', (req, res) => {
    if (!req.body.issuetitle) {
        error = req.flash('error', '请先输入标题');
        res.redirect('/issue');
        return;
    }
    if (req.body.issuetag.every((ele) => {
        return ele.length < 1;
    })) {
        error = req.flash('error', '请至少输入一个标签');
        res.redirect('/issue');
        return;
    }
    if (!req.body.issuecontent) {
        error = req.flash('error', '请输入内容后提交');
        res.redirect('/issue');
        return;
    }
    req.body.issuetag = req.body.issuetag.filter((ele) => {
        return ele.length > 0
    });
    req.body.time = tools.dateFor(new Date());
    req.body.time2 = new Date().getTime();
    req.body.auther = req.session.user._id;
    let s = new issue(req.body);
    s.save((err, data) => {
        res.redirect('/');
    })
});
//删贴
router.get('/del', (req, res) => {
    issue.deleteOne({_id: req.query.id.slice(1, req.query.id.length - 1)}, (err, data) => {
        if (err) {
        } else {
            console.log('删除成功');
            res.redirect('/')
        }
    });
});
//编辑
router.get('/updata/:id', (req, res) => {
    issue.findOne({_id: req.params.id}, (err, data) => {
        if (data) {
            var error = req.flash('error').toString();
            res.render('updata', {error, data, user: req.session.user});
        }
    });
});
router.post('/updata/go', (req, res) => {
    if (!req.body.issuetitle) {
        error = req.flash('error', '请先输入标题');
        res.redirect('/updata/?id='+req.body.id);
        return;
    }
    if (req.body.issuetag.every((ele) => {
        return ele.length < 1;
    })) {
        error = req.flash('error', '请至少输入一个标签');
        res.redirect('/updata/?id='+req.body.id);
        return;
    }
    if (!req.body.issuecontent) {
        error = req.flash('error', '请输入内容后提交修改');
        res.redirect('/updata/?id='+req.body.id);
        return;
    }
    req.body.issuetag = req.body.issuetag.filter((ele) => {
        return ele.length > 0
    });
    issue.findOne({_id: req.body.id.slice(1, req.body.id.length - 1)}, (err, data) => {
        data.issuetitle = req.body.issuetitle;
        data.issuetag = req.body.issuetag;
        data.issuecontent = req.body.issuecontent;
        data.save(err => {
            res.redirect('/');
        })
    });
});


//登录退出
router.get('/goout', (req, res) => {
    req.session.user = null;
    res.redirect('/');
});


//评论
router.post('/guest', (req, res) => {
    var s = new guest({
        time2: new Date().getTime(),
        time: tools.dateFor(new Date()),
        guestText: req.body.guest,
        user: req.session.user._id
    });
    s.save((err, data) => {
        if (err) {
            console.log(err);
        } else {
            issue.findOne({_id: req.body._id.slice(1, req.body._id.length - 1)}, (err1, centent) => {
                centent.comment.push(s._id);
                centent.save(err3 => {
                    res.redirect('/');
                });

            });

        }
    })
});


module.exports = router;