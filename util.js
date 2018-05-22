var Util=(function(){
  function humanReadableTime(seconds){
    var min=Math.floor(seconds/60);
    var sec=Math.round(seconds%60);
    return ""+min+"min"+sec+"sec.";
  }
  
  return {
    "humanReadableTime":humanReadableTime
  }
})()