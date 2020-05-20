var express = require('express');
var router = express.Router();
var user_records=require('../model/user_records');

router.post('/',function(req,res,next){
   
    if(req.body.status==1)
    {
        user_records.find({qr_code:req.body.id},function(err,rows){
            if(err)
            {
               
                res.send("ERROR");
            }
            else{
                if(rows.length==1)
                {
                    res.send(rows);
                }
                else{
                    res.send("INVALID");
                }
            }
        })
    }
    else
    {
        user_records.find({_id:req.body.id},function(err,rows){
            if(err)
            {
                
                res.send("ERROR");
            }
            else{
                if(rows.length==1)
                {
                    res.send(rows);
                }
                else{
                    res.send("INVALID");
                }
            }
        })
    }
    
})
module.exports=router;