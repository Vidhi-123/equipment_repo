var express=require('express');
var router=express.Router();
var equipment=require('../model/equipment');
var inventory=require('../model/sportsinventory_model');




router.put("/:id",function(req,res,next){
    if(req.params.id){
        equipment.findOne({_id:req.params.id},function(err,result1){
            equipment.updateOne({_id:req.params.id},req.body,function(err,result){
                if(err)
                    res.json(err);
               if(result.nModified){
                inventory.updateOne({_id:result1.equipment_id},{$inc:{NumberOfAvailable:1}},function(err,result){
                    if(err)
                        res.json(err);
                    res.json(result);
                });
               }
               else{
                res.json({"Message":"Already Returned"});
               }
                   
                
               
            });
        });
        
    }
});



module.exports=router;