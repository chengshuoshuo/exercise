const mongoose=require('./connect');

var UserSchema=new mongoose.Schema({
    name:String,
    password:String,
    age:Number,
    sex:Number,
    major:String,
    hobby:Array,
    headerurl:{
        type:String,
        default:'/img/timg.jpg'
    }
});

var user=mongoose.model('user',UserSchema);

module.exports=user;