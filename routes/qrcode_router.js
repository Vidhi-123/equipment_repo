var express=require('express');
var router=express.Router();
var qr=require('../model/qrcode');
var user=require('../model/user_records');
const qrimg=require('qr-image');

const fs=require('fs');

router.get("/",function(req,res,next){

    console.log(req.user._id);
    let id1=req.user._id;
    id1=id1.toString();
   id1=id1+Date.now();
   
   console.log(id1);
    user.find({_id:req.user._id},function(err,rows){
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
                 rows[0].qr_cnt--;
                 rows[0].save(function(err1,res1){
                     if(err1)
                     {
                         res.json(err1);
                     }
                     else
                     {
                        qr.generateQR(req.user._id,id1,function(err){
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
        res.redirect('/student_homepage1');
    },1000)
    
    
});

module.exports=router;