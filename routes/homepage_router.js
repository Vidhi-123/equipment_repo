const express=require('express');
const User = require('../model/user_records');

const homeRouter = express.Router();


module.exports = function (passport){

    homeRouter.post("/authUser",passport.authenticate('local',{
        failureRedirect:'/',
        successRedirect:'/users/loadHomePage'
    }),(req,res)=>{
        
    });

    return homeRouter;

}





