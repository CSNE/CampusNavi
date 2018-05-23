//위치 정보 관련
var GPS=(function(){
    var callbackFunctions=[];

    var locationHistory=[]; //history of the past locations.
    var locationHistorySize=100;

    var accuracyRejectionThreshold=100;

    function locationCallback(position){
        var lat=position.coords.latitude;
        var long=position.coords.longitude;
        var alt=position.coords.altitude;
        if (alt===null) alt=0;
        var acc=position.coords.accuracy;

        if (acc>accuracyRejectionThreshold){
            Log.verbose("GPS data rejected due to low accuracy. (accuracy="+acc+"m)");
            return;
        }

        Log.verbose("LAT "+lat+" | LONG "+long+" | ALT "+alt+" | ACC "+acc);

        var newLocation=new CoordinateSystem(position.coords.latitude,position.coords.longitude,position.coords.altitude);

        updateLocation(newLocation);

    }
    function updateLocation(newLocation){ //location is a Coordinatesystem
        newLocation.timestamp=Date.now();

        locationHistory.unshift(newLocation);
        while (locationHistory.length>locationHistorySize){
            locationHistory.pop();
        }

        for(var i=0;i<callbackFunctions.length;i++){
            callbackFunctions[i](newLocation);
        }
    }
    function locationErrorCallback(positionError){
        Log.warning("Error Callback: "+positionError.code+" | "+positionError.message);
    }

    var watchID=null;
    function startTracking(){
        if (watchID!==null){
            Log.warning("GPS is already being tracked! startTracking() request ignored.");
            return;
        }
        /*
        GPS 시작.
        */
        // 위치 탐색
        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation

        // 위치정보 요청
        if ("geolocation" in navigator) {
            Log.info("Geolocation available.");

            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            watchID = navigator.geolocation.watchPosition(locationCallback,locationErrorCallback,options);
            Log.debug("watchPosition done");
        } else {
            Log.error("Geolocation NOT available.");
        }
    }
    function stopTracking(){
        if (watchID===null){
            Log.warning("stopTracking() called but GPS is not being tracked! ignoring.");
            return;
        }
        navigator.geolocation.clearWatch(watchID);
    }
    function forceCurrentLocation(coordinateSystem){
        //FOR DEBUG & TESTING PURPOSES ONLY!
        updateLocation(coordinateSystem);
    }
    function getCurrentLocation(){
        /*
        현재 위치를 object로 반환.
     */
        return locationHistory[0];

    }
    function addLocationListener(callback){
        /*
        위치가 업데이트 될 때마다 불릴 callback 함수를 추가함.
     */
        callbackFunctions.push(callback);
    }

    return {
        "startTracking":startTracking,
        "getCurrentLocation":getCurrentLocation,
        "addLocationListener":addLocationListener,
        "stopTracking":stopTracking,
        "forceCurrentLocation":forceCurrentLocation
    }
})();
