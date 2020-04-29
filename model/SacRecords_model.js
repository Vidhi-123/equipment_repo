const db=require('../dbconnection');
const sacSchema=db.Schema({
    equipment_id : {type:db.Schema.ObjectId,ref:"inventorytb"},
        student_id : {type:String},
        issue_date : {type:String},
        return_date : {type:String},
        quantity:{type:Number},
        loan : {type:Number}
       
});
module.exports=db.model('sac_records',sacSchema);