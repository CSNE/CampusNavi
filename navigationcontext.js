//사용자가 경로를 따라가는 과정을 추적하는 클래스.
//사용자의 속도를 측정해 예상시간도 계산한다.
function NavigationContext(path){
    this.path=path;
    
    this.totalTime=path.timeRequired;
    this.currentLocationEstimatedTime=0;
    this.timeMultiplier=1;

    this.updateLocation=function(){
      //We need to do a lot of shit here
    }
    this.destroy=function(){

    }




}