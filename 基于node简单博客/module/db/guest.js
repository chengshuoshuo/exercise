const mongoose=require('./connect');


var guestSchema=new mongoose.Schema({
    guestText:String,
    time:String,
    time2:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
   }
});

var guest=mongoose.model('guest',guestSchema);
module.exports=guest;