//Very simple logging framework.

var debugMsgBox=document.getElementById("debugMsgBox");

function timestamp(){
  var d=new Date();
  return ""+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds();
}
function print(level,message){
  
  debugMsgBox.innerHTML="<span class=\"level"+level+"\">"+timestamp()+" | "+message+"</span><br>"+debugMsgBox.innerHTML;
}
function print_verbose(message){
  print(1,message);
}function print_debug(message){
  print(2,message);
}function print_info(message){
  print(3,message);
}function print_warning(message){
  print(4,message);
}function print_error(message){
  print(5,message);
}