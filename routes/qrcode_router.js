var express=require('express');
var router=express.Router();
var qr=require('../model/qrcode');
const qrimg=require('qr-image');

const fs=require('fs');

router.post("/",function(req,res,next){

   
    qr.generateQR(req.body.uname,function(err){
        if(err)
        {
            res.json(err);
        }
        
    });
    //res.json({"status":"successful"});
    res.redirect('/equipment');
});

module.exports=router;