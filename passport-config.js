const localStrat =require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./model/user_records');

module.exports = function (passport){
passport.serializeUser(function(user,done){ //add into session
            done(null,user)


    })
    passport.deserializeUser(function(user,done){ //remove from session
            done(null,user);

    })

    passport.use(new localStrat({
        usernameField:'userID',
        passwordField:''
    },function(username,password,done){
        
        User.findById({_id:username},function(err,doc){
            if(err){
                done(err)
                console.log(err);
            }
            else{
                if(doc){
                    let valid = doc.comparePassword(password,doc.password)
                    if(valid)
                    {
                        done(null,doc);
                        console.log(doc);
                    }
                    else{
                        done(null,false);
                        console.log(err);
                    }
                }
                else{
                    done(null,false);
                }
            }

        })

    }))
    //return passport;
}