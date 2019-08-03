const express=require('express');
const router=express.Router();

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

router.use(session({
    secret:'mylogin',
    resave:true,
    saveUninitialized:true,
    rolling:true,
    cookie:{
        maxAge:1000*60*60
    },
    store: new MongoStore({
        url:'mongodb://127.0.0.1/session-login'
    })
}));

module.exports=router;