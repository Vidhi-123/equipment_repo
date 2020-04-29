const mongoose=require('mongoose');
const url="mongodb://localhost:27017/studentsdb";
//const url1="mongodb+srv://vidhishah:vidhishah@cluster0-05uax.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(url,{useNewUrlParser:true},function(err){
    if(err)
    {
        console.log("error in connecting database");
    }
    else{
        console.log("connected");
    }
});
module.exports=mongoose;