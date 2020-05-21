var express = require('express');
var router = express.Router();
var equipment = require('../model/equipment');
var inventory = require('../model/sportsinventory_model');
var sacrecords = require('../model/SacRecords_model');
var mail_equ=require('../model/mail_equipment');
var user=require('../model/user_records');
const date = require('date-and-time');

//This function checks 
//whether authenticated student
// is logged in or not 
var loggedin1 = function (req,res,next)
{
 
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

//This function checks 
//whether authenticated sac user
// is logged in or not 

var loggedin = function (req,res,next)
{
    // console.log(req.user);
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


//This router will fetch the records and send to inventory 
//details page for updating qty of equipment 
router.get("/inventory",loggedin,function(req,res,next){
    inventory.find(function(err,inventoryrecord){
        if(err){
            return res.send(err);
        }
       
        res.render('inventory_detail',{data:{stock:inventoryrecord}});
    });
});


router.post("/inventory",loggedin,function(req,res,next){
   
    //add new stock
    const data=new inventory({
        name:req.body.itemName,
        NumberOfItems:req.body.totalQuantity,
        NumberOfAvailable:req.body.availableQuantity
    });
   data.save(function(err,result)
   {
        if(err)
            return res.send(err);
        else{
            //redirect to the page with updated data.
            res.redirect('/equipment/inventory');
    }
    });
});
//

//updates qty and redirects to inventory page
router.post("/inventory/updatestock",loggedin,function(req,res,next){
    //console.log(req);
    //update stock

    inventory.updateOne({_id:req.body.equipmentID},{$inc:{NumberOfAvailable:req.body.quantity,NumberOfItems:req.body.quantity}},function(err,result){
        if(err)
            return res.send(err);
        else{
            res.redirect('/equipment/inventory');
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


//
// router.put('/inventory/:id',loggedin,function(req,res,next){
//     inventory.updateOne({_id:req.params.id},req.body,function(err,record){
//         if(err)
//             return res.send(err);
//         return res.json(record);
//     });
// });

router.delete('/inventory/:id',loggedin ,function(req,res,next){
    inventory.deleteOne({_id:req.params.id},function(err,record){
        if(err)
            return res.send(err);
        return res.json(record);
    });
});





router.get('/borrow_history',loggedin1,function(req,res,next){
    let stu_id=req.user._id.toString();
    console.log(req.user._id);
    console.log(stu_id);
    sacrecords.aggregate([
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



router.get("/:equipmentID?/:studentID?/:quantity?",loggedin,function (req, res, next) {
    console.log("heyyyyyy");
    if(req.params.equipmentID && req.params.studentID && req.params.quantity)
    {
        //console.log(req.params.equipmentID);
        //console.log(req.params.studentID);
        //console.log(req.params.quantity);
        equipment.find({ student_id: req.params.studentID, equipment_id: req.params.equipmentID }, function (err, rows) {
            if (err) {
                res.json(err);
            }
            else {
                if (rows.length == 0) {
                    var x =new Date();
                   
                    const equi = new equipment({
                        equipment_id: req.params.equipmentID,
                        student_id: req.params.studentID,
                        issue_date: date.format(x, 'DD-MM-YYYY'),
                        quantity: req.params.quantity
    
    
                    });
                    //console.log(equi);
                    equi.save(function (err, result) {
                        if (err) {
                            res.json(err);
                        }
                        else {
                            //res.json(result);
                            /*var data={
                                "id":req.body.studentID,
                                "equipment":req.body.equipmentID,
                                "Quantity":req.body.quantity,
                                "return_date":new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+7)
                            };*/
                           mail_equ.sendMail(equi);
                           
                                inventory.updateOne({_id:result.equipment_id},{$inc:{NumberOfAvailable:-result.quantity}},function(err,result){
                                    if(err)
                                        res.json(err);
                                        res.redirect('/equipment');
                                });
                        }
                    });
                }
                else {
                    //console.log("record is already there");
                    //console.log(rows);
                    let tot_qty=rows[0].quantity;
                    var x = Date.now();
                    var dat_obj=new Date(x);
                    var now=new Date();

                    //quantity aema hase j so eno use karine loan nu karje
                    //console.log(dat_obj-rows[0].issue_date);
    
                    var dat_obj1 = new Date(rows[0].issue_date);
                    const diffTime = Math.abs(dat_obj - dat_obj1);
                    var loan1 = 0;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays > 7) {
                        loan1 = (diffDays - 7) * 5 *req.params.quantity;
                    }
                    const sac1 = new sacrecords({
                        equipment_id: rows[0].equipment_id,
                        student_id: rows[0].student_id,
                        issue_date: rows[0].issue_date,
                        quantity:req.params.quantity,
                        return_date: date.format(now, 'DD-MM-YYYY'),
                        loan: loan1
    
    
    
                    });
                   // console.log(sac1);
                    sac1.save(function (err, result) {
                        if (err) {
                            res.json(err);
                        }
                        else {
                            //res.json(result);
                            //console.log(result);
                            inventory.updateOne({_id:result.equipment_id},{$inc:{NumberOfAvailable:req.params.quantity}},function(err,result){
                                if(err)
                                    res.json(err);
                                    else{
                                        if(tot_qty-req.params.quantity<=0)
                                        {
                                equipment.deleteOne({ student_id: req.params.studentID, equipment_id: req.params.equipmentID }, function (err, result) {
                                        if (err) {
                                            res.json(err);
                                        }
                                        else {
                                            res.redirect('/equipment');
                                            
                                        }
                                    });
                                }
                                else{
                                    equipment.updateOne({ student_id: req.params.studentID, equipment_id: req.params.equipmentID },{$inc:{quantity:-req.params.quantity}},function(err,rows){
                                        if(err)
                                        {
                                            res.json(err);
                                        }
                                        else
                                        {
                                            res.redirect('/equipment');
                                        }
                                    })
                                }
                                }
                            });
                        
                           
                            
                        }
                    });
                }
            }
        })
    }
    else
    {
        inventory.find(function (err, inventoryrecord) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('equipment_borrow', { data: { stock: inventoryrecord }});
            //res.json(inventoryrecord);
        }
    });
}
});


// router.get('/',function(req,res,next){
//     inventory.find(function(err,inventoryrecord){
//         if(err){
//             res.send(err);
//         }
//         else{
//             console.log(inventoryrecord);
//             res.render('equipment_details',{data:{result:inventoryrecord}});
//         }
//     });
// });








router.post('/',loggedin, function (req, res, next) {
    console.log("heyyyy");
    equipment.find({ student_id: req.body.studentID, equipment_id: req.body.equipmentID }, function (err, rows) {
        if (err) {
            res.json(err);
        }
        else {
            if (rows.length == 0) {
                var x = new Date();
                
                const equi = new equipment({
                    equipment_id: req.body.equipmentID,
                    student_id: req.body.studentID,
                    issue_date: date.format(x, 'DD-MM-YYYY'),
                    quantity: req.body.quantity


                });
               
                equi.save(function (err, result) {
                    if (err) 
                    {
                        res.json(err);
                    }
                    else {
                        //res.json(result);
                        /*var data={
                            "id":req.body.studentID,
                            "equipment":req.body.equipmentID,
                            "Quantity":req.body.quantity,
                            "return_date":new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+7)
                        };*/
                       mail_equ.sendMail(equi);
                       
                            inventory.updateOne({_id:result.equipment_id},{$inc:{NumberOfAvailable:-result.quantity}},function(err,result){
                                if(err)
                                    res.json(err);
                                    res.redirect('/equipment');
                            });
                    }
                });
            }
            else {
           
                let tot_qty=rows[0].quantity;
                var x = Date.now();
                var dat_obj = new Date(x);
                var now=new Date();
                //quantity aema hase j so eno use karine loan nu karje
                //console.log(dat_obj-rows[0].issue_date);

                var dat_obj1 = new Date(rows[0].issue_date);
                const diffTime = Math.abs(dat_obj - dat_obj1);
                var loan1 = 0;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 7) {
                    loan1 = (diffDays - 7) * 5 *req.body.quantity;
                }
                const sac1 = new sacrecords({
                    equipment_id: rows[0].equipment_id,
                    student_id: rows[0].student_id,
                    issue_date: rows[0].issue_date,
                    quantity:req.body.quantity,
                    return_date: date.format(now, 'DD-MM-YYYY'),
                    loan: loan1



                });
               // console.log(sac1);
                sac1.save(function (err, result) {
                    if (err) {
                        res.json(err);
                    }
                    else {
                        //res.json(result);
                     
                        inventory.updateOne({_id:result.equipment_id},{$inc:{NumberOfAvailable:req.body.quantity}},function(err,result){
                            if(err)
                                res.json(err);
                                else{
                                    if(tot_qty-req.body.quantity<=0)
                                    {
                            equipment.deleteOne({ student_id: req.body.studentID, equipment_id: req.body.equipmentID }, function (err, result) {
                                    if (err) {
                                        res.json(err);
                                    }
                                    else {
                                        res.redirect('/equipment');
                                        
                                    }
                                });
                            }
                            else{
                                equipment.updateOne({ student_id: req.body.studentID, equipment_id: req.body.equipmentID },{$inc:{quantity:-req.body.quantity}},function(err,rows){
                                    if(err)
                                    {
                                        res.json(err);
                                    }
                                    else
                                    {
                                        res.redirect('/equipment');
                                    }
                                })
                            }
                            }
                        });
                    
                       
                        
                    }
                });
            }
        }
    })
})

router.put('/:id', function (req, res, next) {
    equipment.findById(req.params.id, function (err, docs) {
        console.log(docs);
        if (err) {
            res.json(err);
        }
        else {
            //res.json(docs);
            docs.equipment_id = req.body.equipment_id;
            docs.student_id = req.body.student_id;
            docs.issue_date = req.body.issue_date;
            docs.return_date = req.body.return_date;
            docs.loan = req.body.loan;

            docs.save(function (err1, res1) {
                if (err1) {
                    res.json(err1);
                }
                else {
                    res.json(res1);
                }
            });

        }
    });
});



router.delete('/:id', function (req, res, next) {
    equipment.deleteOne({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    })
});

module.exports = router;
