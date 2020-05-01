//var window=require('Window');


var tmp_lib=require('./model/lib_tmp');
var lib=require('./model/library');
const date = require('date-and-time');



var time={
     f2() {
                //var window=global;
                 setInterval(function(){ // Set interval for checking
                    var date1 = new Date(); // Create a Date object to find out what time it is
                    console.log(date1.getMinutes());
                    //console.log(global);
                    if(date1.getHours() === 12 && date1.getMinutes() === 18 ){ // Check the time
                        
                       
                        tmp_lib.find(function(err,docs){
                            if(err)
                            {
                                console.log(err);
//                                res.json(err);
                            }
                            else
                            {
                                console.log(docs.length);
                                //res.json(docs);
                                
                            
                                    var i;
                                    var id1;
                                    for(i=0;i<docs.length;i++)
                                    {
                                        id1=docs[i].user_id;
                                    tmp_lib.find({user_id:id1},function(err,docs1){
                                        console.log(docs);
                                        if(err)
                                        {
  //                                          res.json(err);
                                            console.log(err);
                                        }// wait ek min
                                        else
                                        {
                                            //res.json(docs);
                                            console.log(docs1[0]);
                                
                                            const now = new Date();
                                            let curtime=date.format(now,'HH:mm:ss')
                                            docs1[0].out_time=curtime;
                                            //date:new Date(dat_obj.getFullYear(),dat_obj.getMonth(),dat_obj.getDate()+1)
                                            
                                            docs1[0].save(function(err1,res1){
                                                if(err1)
                                                {
                                                    //res.json(err1);
                                                    console.log(err1);
                                                }
                                                else
                                                {
                                                    //res.json(res1);
                                                        const lib1=new lib({
                                                        user_id : docs1[0].user_id,
                                                        in_time :docs1[0].in_time,
                                                        out_time:docs1[0].out_time,
                                                        date:docs1[0].date
                                                        
                                                       
                                                    });
                                                    console.log(lib1);
                                                    lib1.save(function(err,result){
                                                        if(err)
                                                        {
                                                            //res.json(err);
                                                            console.log(err);
                                                        }
                                                        else{
                                                            //res.json(result);
                    
                    
                                                            console.log(lib1.user_id);
                                                            tmp_lib.deleteOne({user_id:lib1.user_id},function(err,result){
                                                                if(err)
                                                                {
                                                                    //res.json(err);
                                                                    console.log(err);
                                                                }
                                                                else
                                                                {
                                                                    //res.json(result);
                                                                    console.log(result);
                                                                }
                                                            })
                                                        
                    
                    
                    
                    
                    
                    
                    
                                                        }
                                                    });
                                                    
                    
                    
                    
                                                }
                                            });
                                
                                        }
                                    });
                    
                    
                    
                                }
                            }
                            //res.redirect('/lib_tmp'); 
                            
                           
                            //setTimeout(()=>{res.redirect('/lib_tmp')}, 1000); 
                            
                    console.log("done lib");//su kravu lakh tu
                        });
                    



                        
                    }
                }, 60000);
            }
    

        };
    module.exports=time;

