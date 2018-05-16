//위치 정보 관련
var GPS=(function(){
  function startTracking(){
      /*
       GPS 시작.
       */
      
    }
    function getCurrentLocation(){
        /*
                현재 위치를 object로 반환.
         */
    
    }
    function addLocationListener(){
        /*
                위치가 업데이트 될 때마다 불릴 callback 함수를 추가함.
         */
    }

    return {
        "startTracking":startTracking,
        "getCurrentLocation":getCurrentLocation,
        "addLocationListener":addLocationListener
    }
})();
