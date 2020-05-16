const express = require("express");
const bcrpyt=require('bcrypt');
// import validators
//const { check, validationResult } = require('express-validator/check');
//const { matchedData, sanitize } = require('express-validator/filter');


// bring user model
const User = require("../model/user_records");

const userRouter = express.Router();




userRouter.get("/logout",function (req,res) {
	req.logOut();
	res.send("/"); //sending to website home page
})

// check if logged in 
var loggedin = function (req,res,next)
{
	if(req.isAuthenticated())
		next() // if logged in
	else
		res.redirect('/');
}



userRouter.get("/loadHomePage",loggedin, (req,res)=>{
	//res.send req.session
	//console.log(req.user);

	let user = req.user; //user object will contain user data as from passport file
    let userType= user.userTypeId;
    

	//User type ids
	//1 admin
	//2 Gate
	//3 SAC
	//4 Lib
    // 5 student 
    
	if(userType==1){
       // localStorage.setItem('user_id',req.user._id);
	res.render('index1',{
		title: req.user.fName + req.user.lName
	});
	}
	else if(userType==3)
	{
       // localStorage.setItem('user_id',req.user._id);
		res.redirect('/equipment');
	}
	else if(userType==4)
	{
		res.redirect('/lib_tmp');
	}
	else if(userType==5)
	{
		res.redirect('/student_homepage1');
	}
	//TODO Edit your respective homepages
})
module.exports=userRouter;