const db=require('../dbconnection');
const QRcode=require('qrcode');
const qrimg=require('qr-image');
const fs=require('fs');
const crypto = require('crypto');
var nodemailer=require('nodemailer');
var qr={
    
    generateQR(id,callback)
    {
        let mykey = crypto.createCipher('aes-128-cbc', 'dascanner');
        let encryptedID = mykey.update(id, 'utf8', 'hex')
        encryptedID += mykey.final('hex');

        let qr_png=qrimg.imageSync(encryptedID,{ type: 'png'});
        let qr_code_file_name = id + '.png';
        fs.writeFileSync('C:/Users/VIDHI/Desktop/project/' + qr_code_file_name, qr_png,function(err)
        {
            if(err)
            {
                console.log(err);
            }
        });

        let email_id=id+"@daiict.ac.in";
        let img_src="C:/Users/VIDHI/Desktop/project/"+qr_code_file_name;

        
            var transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'vidhipshah10@gmail.com',
                    pass:"Vidhi@12345678"
                }
            });
            var mailOptions={
                from:'vidhipshah10@gmail.com',
                to:email_id,
                subject:"Registration successful",
                text:"qr code",
                //html: "Embedded image: <img src='cid:unique@kreata.ee' />",
                attachments: [{
                    filename: qr_code_file_name,
                    path: 'C:/Users/VIDHI/Desktop/project/'+qr_code_file_name,
                    //cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
                
            };
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error)
                }
                else{
                    console.log('email sent'+info.response);
                }
            });

        

    }
}


module.exports=qr;