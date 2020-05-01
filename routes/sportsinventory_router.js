const express=require('express');
const router=express.Router();
const inventorytb=require('../model/sportsinventory_model');
var user=require('../model/user_records');

var loggedin = function (req,res,next)
{
    if(req.isAuthenticated())
    {
        user.find({_id : req.user._id},function(err,rows){
            if(err)
            {
                res.redirect('/');
            }
            else{
                if(rows[0].userTypeId==3)
                {
                    next() // if logged in
                }
                else{
                    res.redirect('/');
                }
            }
        })
       
    }
        
        
	else
		res.redirect('/');
}


router.get("/",loggedin,function(req,res,next){
    inventorytb.find(function(err,inventoryrecord){
        if(err){
            return res.send(err);
        }
        console.log(inventoryrecord);
        res.render('inventory_detail',{data:{stock:inventoryrecord}});
    });
});


router.post("/",function(req,res,next){
    console.log(req.body);
    //add new stock
    const data=new inventorytb({
        name:req.body.itemName,
        NumberOfItems:req.body.totalQuantity,
        NumberOfAvailable:req.body.availableQuantity
    });
   data.save(function(err,result){
        if(err)
            return res.send(err);
        else{
            //redirect to the page with updated data.
            res.redirect('/inventory');
    }
    });
});
router.post("/updatestock",function(req,res,next){
    //console.log(req);
    //update stock

    inventorytb.updateOne({_id:req.body.equipmentID},{$inc:{NumberOfAvailable:req.body.quantity,NumberOfItems:req.body.quantity}},function(err,result){
        if(err)
            return res.send(err);
        else{
            res.redirect('/inventory');
            //redirect to the page with updated data.
        // inventorytb.find(function(err,inventoryrecord){
        //     if(err){
        //         return res.send(err);
        //     }
        //     console.log(inventoryrecord);
        //     res.render('inventory_detail',{data:{stock:inventoryrecord}});
        // });
    }
    });
});

router.put('/:id',function(req,res,next){
    inventorytb.updateOne({_id:req.params.id},req.body,function(err,record){
        if(err)
            return res.send(err);
        return res.json(record);
    });
});

router.delete('/:id',function(req,res,next){
    inventorytb.deleteOne({_id:req.params.id},function(err,record){
        if(err)
            return res.send(err);
        return res.json(record);
    });
});
module.exports=router;