const express=require('express');
const app=express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));



const session=require('./module/router/session');
app.use(session);

const user=require('./module/router/engine');
app.use(user);




app.listen(3000,()=>{
    console.log('runing 3000');
});