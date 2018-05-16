function TimeTableElement(){
  /*
    시간표에서 하나의 수업을 표현하는 클래스.
  */
  this.startTime=12; //12:00PM
  this.endTime=13+50/60; //1:50PM
  this.weekday="Mon"; //월요일.
  this.location="???";
}

function TimeTable(){
    /*
     시간표를 표현하는 클래스.
     */
  this.elements=[];
  
  this.addTimeTableElement=function(tte){
    /*
     시간표에 수업을 더함.
     */
    
  }
  this.nextLecture=function(){
    /*
        곧 시작하는 수업을 반환함.
     */
    
  }
  this.lastLecture=function(){
    /*
        방금 끝난 수업을 반환함.
     */
    
  }
}

