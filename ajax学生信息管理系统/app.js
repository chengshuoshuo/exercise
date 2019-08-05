const express=require('express');
const app=express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

const search=require('./module/router/search');
app.use(search);

/*存入数据*/
const appendStudent=require('./module/router/appendStudent');
app.use(appendStudent);

/*删除数据*/
const delStudent=require('./module/router/delectStudent');
app.use(delStudent);
//编辑显示页面
const upStudent=require('./module/router/updataStudent');
app.use(upStudent);
app.listen(3000,()=>{
   console.log('端口3000 服务器开启')
});