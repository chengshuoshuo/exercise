const express = require('express');
const router = express.Router();

const issue = require('../db/issue');
const guest = require('../db/guest');

//详情页
router.get('/blog/:id', (req, res) => {
    issue
        .findOne({_id: req.params.id})
        .populate('comment')
        .exec((err, data) => {
            if(!data.readNumber){
                data.readNumber=1;
            }else{
                data.readNumber+=1;
            }
            data.save((err)=>{
                guest.find()
                    .sort({'time2':-1})
                    .populate('user')
                    .exec((err1, con) => {
                        if (req.session.user) {
                            res.render('blog.html', {user: req.session.user, content: data, con: con});
                        } else {
                            res.render('blog.html', {user: null, content: data, con: con});
                        }
                    });

            });

        });
});


router.get('/name/:id', (req, res) => {
    issue.find({auther: req.params.id}).countDocuments((err, count) => {
        //当前页
        var page = (req.query.page || 1) * 1;
        var show_count = 5;
        issue
            .find({auther: req.params.id})
            .sort({'time':-1})
            .populate('auther')
            .skip((page - 1) * show_count)
            .limit(show_count)
            .exec((err, data) => {
                var error = req.flash('error').toString();
                var issue = data;
                var allpage = Math.ceil(count / show_count);
                res.render('index', {searchName:"作者："+issue[0].auther.username,searchid:"/name/"+ req.params.id+"/?", user: req.session.user, error, issue, page, allpage});
            });
    })
});
router.get('/tag/:tag', (req, res) => {
    issue.find({issuetag: {$regex: req.params.tag}}).countDocuments((err, count) => {
        var page = (req.query.page || 1) * 1;
        var show_count = 5;
        issue.find({issuetag: {$regex: req.params.tag}})
            .sort({'time2':-1})
            .populate('auther')
            .skip((page - 1) * show_count)
            .limit(show_count)
            .exec((err, data) => {
                var error = req.flash('error').toString();
                var issue = data;
                var allpage = Math.ceil(count / show_count);
                res.render('index', {searchName:"标签："+req.params.tag,searchid: "/tag/"+req.params.tag+"/?", user: req.session.user, error, issue, page, allpage});
            });

    });
});
//文档归档
router.get('/file',(req,res)=>{
    var page=(req.query.page||1)*1;
    var show_count=5;
    issue.find()
        .sort({time2:-1})
        .limit(show_count)
        .skip((page-1)*show_count)
        .exec((err,data)=>{
        var data=JSON.parse(JSON.stringify(data));
        issue.countDocuments((err,count)=>{
           var allpage=Math.ceil(count/show_count);
           res.render('file',{user:req.session.user,data,page,allpage,lastYear:-1});
        });
        // res.render('file',{user:req.session.user,data});
    });
});

//标签墙
router.get('/tag',(req,res)=>{
   issue.find().exec((err,data)=>{

       data=data.filter((ele)=>{
           return ele.issuetag.length>0;
       });
       let tag=[];
       data.forEach((ele)=>{
          tag=tag.concat(ele.issuetag);
       });
       let tag2=[];
       tag.forEach((ele)=>{{
           if(tag2.indexOf(ele)<0){
               tag2.push(ele)
           }
       }});
       res.render('tag',{user:req.session.user,data,tag2});
    })
});

router.get('/search',(req,res)=>{
   if(!req.query.search){
       res.redirect('/');
       return;
   }

   issue.find({
       $or:[{issuetitle:{$regex: req.query.search}},
           {issuecontent:{$regex:req.query.search}},
           {issuetag:{$regex:req.query.search}}]
   }).exec((err,counts)=>{
       var count=counts.length;
       var page=(req.query.page||1)*1;
       var show_count=5;
       issue.find({
           $or:[{issuetitle:{$regex: req.query.search}},
               {issuecontent:{$regex:req.query.search}},
               {issuetag:{$regex:req.query.search}}]
       }).populate('auther')
           .skip((page - 1) * show_count)
           .limit(show_count)
           .exec((err, data) => {
               var error = req.flash('error').toString();
               var issue = data;
               var allpage = Math.ceil(count / show_count);
               res.render('index', {searchName:"关键字："+req.query.search,searchid:"/search?search="+req.query.search+"&", user: req.session.user, error, issue, page, allpage});
           });

      })
});

module.exports = router;




