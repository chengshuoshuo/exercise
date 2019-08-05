const mongoose=require('./connect');

var studentSchema=new mongoose.Schema({
    name:String,
    sex:String,
    age:Number,
    phone:Number,
    email:String,
    content:String,
});
var student=mongoose.model('student',studentSchema);

module.exports=student;