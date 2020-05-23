var nodemailer=require('nodemailer');
var inventory=require('./sportsinventory_model');
var demo={


    /*this function sends mail when student has borrowed equipment from sac*/
    sendMail:function(demo,callback){
        var x=Date.now();
        var dat_obj=new Date(x);

        inventory.findById(demo.equipment_id,function(err,rows){
            var transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'vidhipshah10@gmail.com',
                    pass:"Vidhi@12345678"
                }
            });
            let email_id=demo.student_id+"@daiict.ac.in";
            var mailOptions={
                from:'vidhipshah10@gmail.com',
                to:email_id,
                subject:"equipment borrowed",
                text:"You have borrowed  "+ demo.quantity + " "+rows.name+ " and make sure you return before this "+new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+7)+ " otherwise pentaly is charged"
            };
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error)
                }
                else{
                    console.log('email sent'+info.response);
                }
            });
        })
        
        
    }
}
module.exports=demo;