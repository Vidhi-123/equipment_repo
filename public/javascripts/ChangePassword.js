function validate(){
    var password1 = document.getElementById('Pass1').value; 
    var password2 = document.getElementById('Pass2').value; 
    if(password1!=password2){
        document.getElementById('error-Password').innerHTML="*Password are not same";
        document.getElementById('Pass2').focus();
    }
    else{
        document.getElementById('error-Password').innerHTML="";
    }
  }