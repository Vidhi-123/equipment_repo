var express=require('express');
var router=express.Router();
var lib=require('../model/library');


router.post('/',function(req,res,next){
    //var x=Date.now();
    //x=Date.now();
    //console.log(x);
    //var dat_obj=new Date(x);
    const lib1=new lib({
        user_id : req.body.user_id,
        in_time :req.body.in_time,
        out_time:req.body.out_time,
        date:req.body.date
        
        
    });
    console.log(lib1);
    lib1.save(function(err,result){
        if(err)
        {
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
})
module.exports=router;