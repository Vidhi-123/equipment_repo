const express = require('express');
const router = express.Router();
const inventory = require('../model/sportsinventory_model');
const user=require('../model/user_records');
const sac=require('../model/SacRecords_model');
const equipment=require('../model/equipment');


var loggedin = function (req,res,next)
{
    console.log(req.user._id);
    if(req.isAuthenticated())
    {
        user.find({_id : req.user._id},function(err,rows){
            if(err)
            {
                res.redirect('/index');
            }
            else{
                if(rows[0].userTypeId==5)
                {
                    next() // if logged in
                }
                else{
                    res.redirect('/index');
                }
            }
        })
       
    }
        
        
	else
		res.redirect('/index');
}

router.get('/',loggedin,function(req,res,next){
    let stu_id=req.user._id.toString();
    console.log(req.user._id);
    console.log(stu_id);
    sac.aggregate([
        { $match: { student_id: stu_id } },
        {
            $lookup:
            {
                from:"inventory_records",
                localField:"equipment_id",
                foreignField:"_id",
                as:"equipment_borrows"
            }
        }
     ],function(err1,rows1){
         if(err1)
         {
             res.json(err1);
         }
         else
         {
             console.log(rows1);
             //res.json(rows1);
             equipment.aggregate([
                { $match: { student_id: stu_id } },
                {
                    $lookup:
                    {
                        from:"inventory_records",
                        localField:"equipment_id",
                        foreignField:"_id",
                        as:"equipment_borrows"
                    }
                }
             ],function(err2,rows2){
                 if(err2){
                     res.json(err2);
                 }
                 else{


                    console.log(rows2);
                     //res.json(rows2);
                     res.render('student_borrower_history',{
                        sac_records:rows1,
                        pending_records:rows2
                    })
                    
                 }
             })
         }
     })

})


module.exports=router