function validateForm(ev){
	var quant = document.getElementById('qty1').value;
if(quant<0 || quant==='0'){ //=== was matching value string with 0 numeric so was false
document.getElementById('error-qty').innerHTML="*Please enter a valid number";
document.getElementById('qty1').focus();
}
else{
    document.getElementById('error-qty').innerHTML=" ";
    document.getElementById('availableQty').value=quant;
}
}

function validateForm1(ev){
	var quant = document.getElementById('qty2').value;
if(quant<0 || quant==='0'){ //=== was matching value string with 0 numeric so was false
document.getElementById('error-qty1').innerHTML="*Please enter a valid number";
document.getElementById('qty2').focus();
ev.preventDefault();
}
else{
    document.getElementById('error-qty1').innerHTML=" ";
}
}
window.addEventListener('load',(event)=>{
    console.log("load event fire");
    document.getElementById('addnewrecord').hidden=true;
    document.getElementById('UpdateNewStock').hidden=true;
  });

  function AddNewRecord(){
      console.log("add new records");
    document.getElementById('addnewrecord').hidden=false;
    document.getElementById('UpdateNewStock').hidden=true;
  }
  function UpdateNewStock(){
    console.log("update records records");
    document.getElementById('addnewrecord').hidden=true;
    document.getElementById('UpdateNewStock').hidden=false;
  }



function isNumberKey(evt)
      {
         var charCode = (evt.which) ? evt.which : event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

         return true;
      }

