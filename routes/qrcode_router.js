var express=require('express');
var router=express.Router();
var qr=require('../model/qrcode');
var user=require('../model/user_records');
const qrimg=require('qr-image');

const fs=require('fs');

router.post("/",function(req,res,next){

   let id1=req.body.uname+Date.now();
    user.find({_id:req.body.uname},function(err,rows){
        if(err)
       {
            res.json(err);
        }
        else
        {
            console.log(rows);
            if(rows.length==1)
            {
                 rows[0].qr_code=id1;
                 rows[0].save(function(err1,res1){
                     if(err1)
                     {
                         res.json(err1);
                     }
                     else
                     {
                        qr.generateQR(req.body.uname,id1,function(err){
                            if(err)
                            {
                                res.json(err);
                            }
                            else
                            {
                                console.log("IN");
                                
                             
                            }
                        });        
                        
                     }
                 })
            }
        }
    })


        

    

    

    //res.json({"status":"successful"});
    setTimeout(()=>{
        res.redirect('/generateqr');
    },1000)
    
    
});

module.exports=router;