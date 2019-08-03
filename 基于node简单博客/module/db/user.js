const mongoose=require('./connect');

var userSchema=new mongoose.Schema({
   username:String,
   password:String,
    age:Number,
    sex:String,
    time:String,
    time2:String,
    headerurl:String
});
var user=mongoose.model('user',userSchema);

module.exports=user;