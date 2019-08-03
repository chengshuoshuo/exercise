const mongoose=require('./connect');

const userSchema=new mongoose.Schema({
    username:String,
    password:String,
    age:Number,
    sex:String,
    major:String,
    hobby:Array,
    img:String
})

const user=mongoose.model('user',userSchema);

module.exports=user;