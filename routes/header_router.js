const express = require('express');
const router = express.Router();

var user=require('../model/user_records');

router.get('/',function(req,res,next){

    user.find({_id:req.user._id},function(err,rows){
        if(err)
        {
            res.json(err);
        }
        else
        {
            console.log(rows);
            console.log(rows[0].qr_cnt);
            res.send(rows[0].qr_cnt+"");
        }
    })

})



module.exports=router;