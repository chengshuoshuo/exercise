const express = require('express');
const app = express();
const session = require('express-session');
// const cors=require('cors');
const MongStore = require("connect-mongo")(session);


app.use(express.urlencoded({extended: false}));
// app.use(cors());

// 跨域携带cookie
app.use((req, res, next) => {
    //需要跨域携带cookie就必须跨域的源设置指定的域 不能用通配符 *
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8000');
    //允许跨域携带cookie
    res.header('Access-Control-Allow-Credentials',true);
    next();
});


app.use(session({
    secret: 'mylogin',
    resave: true,
    rolling:true,
    saveUninitialized: true,
    store: new MongStore({url:'mongodb://127.0.0.1:27017/mylogin'}),
    cookie: {maxAge:1000 * 60 * 60}

}));


const login = require('./moduel/router/login');
app.use(login);

const upload = require('./moduel/router/upload');
app.use(upload);


app.listen(3000, () => {
    console.log('runing 3000')
});