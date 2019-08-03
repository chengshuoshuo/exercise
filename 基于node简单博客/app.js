const express=require('express');
const path=require('path');
const app=express();

app.use(express.urlencoded({extended:false}));
// 设置默认根路径
app.use(express.static('public'));

//页面模板引入并使用
const artTemplateEngine=require('./module/art-template');
artTemplateEngine(app);

//首页路由使用
const index=require('./module/router/index');
app.use(index);

//查询路由的使用
const search=require('./module/router/search');
app.use(search);

//用户路由的使用
const userAdmin=require('./module/router/userAdmin');
app.use(userAdmin);

const upload=require('./module/router/upload');
app.use(upload);
app.listen(3000,()=>{

   console.log('服务器开启，端口号3000');
});