
  const db=require('../dbconnection');
  const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
{
	_id:
	{
		type: Number,
		required: true
	},
	userTypeId:
	{
		type: Number,
		ref: "UserTypeId",
		required: true
	},
	userEmailId:
	{
		type: String,
		required: true
	},
	fName:
	{
		type: String,
		required: true
	},
	lName:
	{
		type: String,
		required: false
	},
	courseName:
	{
		type: String,
		required: false
	},
	batchYear:
	{
		type: Number,
		required: false
	},
	password:
	{
		type: String,
		required: true
	},
	qr_code:
	{
		type:String,
		required: true
	},
	qr_cnt:
	{
		type:Number,
		required: true
	}

});
userSchema.methods.comparePassword = (password,hash)=>
{
	return bcrypt.compare(password,hash);
}
module.exports=db.model('user_records',userSchema);

