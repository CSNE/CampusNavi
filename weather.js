var Weather=(function(){
    // 아래의 ajaxForShinchonWeather 함수의 반환 값을 저장하는 변수
    var shinchonWeatherData=null;
    var shinchonAqiData=null;

    function getCurrentWeatherInShinchon(){
        /*
        현재 신촌의 날씨를 가져옵니다.
        object 하나를 리턴합니다.
        object는 weather라는 키에 현재 날씨를 저장합니다.
        weather의 값은 다음 string 중 하나입니다: 'sunny' 'rain' 'snow' 'cloudy' 
        예시: return {"weather":"rain"};
    */

        /*
        반환 값을 수정하였음.
        "weather": 현재 날씨 정보 문자열 (ex. Rain, Snow, Clear)
        "weatherid": https://openweathermap.org/weather-conditions
        "temperature": 현재 온도(섭씨 온도), 정수로 만들어서 오차가 있을 수 있음.
        "humidity": 습도
        "weatherIcon": 현재 날씨에 해당하는 아이콘
        "wind": 바람의 속도
        "cloud": 구름의 양 (ex. 1%)
    */
        return shinchonWeatherData;
    }

    function getCurrentWeatherNameKorean(){

        if (getCurrentWeatherInShinchon()===null) return null;

        var wi=getCurrentWeatherInShinchon().weatherid;
        
        //https://openweathermap.org/weather-conditions
        if (200<=wi && wi<300) return "폭풍";
        if (300<=wi && wi<400) return "약한비";
        if (500<=wi && wi<600) return "비";
        if (600<=wi && wi<700) return "눈";
        if (700<=wi && wi<800) return "안개";
        if (800===wi) return "맑음";
        if (800<wi && wi<900) return "흐림";

        Log.error("Unexpected Weather! "+w);
    }

    function getCurrentWeatherGrade(){
        //Returns: "Good","Okay","bad"
        if (getCurrentWeatherInShinchon()===null) return null;

        var wi=getCurrentWeatherInShinchon().weatherid;

        if ((800<=wi && wi<900) || (700<=wi && wi<800)) return "good"; //800, 80x
        if ((300<=wi && wi<400)) return "okay"; //3xx, 7xx
        if ((200<=wi && wi<300) || (500<=wi && wi<600) || (600<=wi && wi<700)) return "bad"; //2xx, 5xx, 6xx

        Log.error("Unexpected Weather! "+w);
    }function getCurrentTemperatureGrade(){
        //Returns: "Good","Okay","bad"
        if (getCurrentWeatherInShinchon()===null) return null;

        var t=getCurrentWeatherInShinchon().temperature;
        if (t<25 && t>5) return "good";
        if (t>30 || t<-5) return "bad";
        return "okay";
    }function getCurrentDustGrade(){
        //Returns: "Good","Okay","bad"
        if (getCurrentDustLevelsInShinchon()===null) return null;

        var d=getCurrentDustLevelsInShinchon();
        if (d<125) return "good";
        if (d<200) return "okay";
        if (d>=200) return "bad";

        Log.error("Inavlid Dust Levels! "+d);
    }
    function getCompositeGrade(){
        var d=getCurrentDustGrade();
        var t=getCurrentTemperatureGrade();
        var w=getCurrentWeatherGrade();
        
        if (d===null || t===null || w===null) return null;
        if (d==="bad" || t==="bad" || w==="bad") return "bad";
        if (d==="okay" || t==="okay" || w==="okay") return "okay";
        return "good";
        
    }

    function getCurrentDustLevelsInShinchon(){
        /*
        현재 신촌의 미세먼지 정보를 가져옵니다.
        object 하나를 리턴합니다.
        object는 aqi라는 키에 현재 AQI(공기품질지수)를 float로 저장합니다.
        예시: return {"aqi": 30};
        */

        return shinchonAqiData;
    }

    function debug_override_weather(weatherid,temps,aqi){
        shinchonWeatherData={"weatherid":weatherid,"temperature":temps};
        shinchonAqiData=aqi;
        
        callCallbacks();
    }

    var callbacks=[];

    function addCallback(callback){
        callbacks.push(callback);
    }
    function callCallbacks(){
        for(var i=0;i<callbacks.length;i++){
            callbacks[i]();
        }
    }

    function fetch() {
        Log.debug("Fetching weather...");
        /*
        신촌 날씨 정보와 미세먼지 정보를 요청하는 함수.
        getCurrentWeatherInShinchon 함수를 호출할 때 요청하면 값을 제대로 반환할 수가 없어서 웹페이지 로드되지마자 일단 요청.
        */
        var weatherReturned=false;
        var aqiReturned=false;
        
        // 날씨 요청
        var apiURI = "https://api.openweathermap.org/data/2.5/weather?lat="+"37.5602" + "&lon=" + "126.9368"+"&appid="+"f4e5095b023d96581b869c74b663f6b2";
        $.ajax({
            url: apiURI,
            dataType: "json",
            type: "GET",
            async: "true",
            timeout:3000,
            success: function(resp) {
                Log.debug("Got response from openweathermap.org");
                try{
                    shinchonWeatherData = {
                        "weather": resp.weather[0].main,
                        "weatherid": resp.weather[0].id,
                        "temperature": Math.round(resp.main.temp- 273.15),
                        "humidity": resp.main.humidity,
                        "weatherIcon": "http://openweathermap.org/img/w/" + resp.weather[0].icon + ".png",
                        "wind": resp.wind.speed,
                        "cloud": (resp.clouds.all) +"%"
                    };
                    Log.verbose("weather:     "+shinchonWeatherData.weather+"\n"+
                                "weatherid:   "+shinchonWeatherData.weatherid+"\n"+
                                "temperature: "+shinchonWeatherData.temperature+"\n"+
                                "humidity:    "+shinchonWeatherData.humidity+"\n"+
                                "wind:        "+shinchonWeatherData.wind+"\n"+
                                "cloud:       "+shinchonWeatherData.cloud);

                    if (shinchonWeatherData.weather===undefined 
                        || shinchonWeatherData.weather===null
                        || shinchonWeatherData.weather===NaN) throw ("Weather Fetch Failed. "+shinchonWeatherData.weather);
                    
                    weatherReturned=true;
                    if (weatherReturned && aqiReturned){
                        Log.info("Weather data fetch successful.");
                        callCallbacks();
                    } 
                }catch(err){
                    Log.warning("Error while parsing response.\n"+err)
                }

                // console.log(ret1);
                // document.getElementById("hi").innerHTML = ret["weather"];
            },
            error:function(jqXHR,textStatus,errorThrown){
                Log.warning("Error from openweathermap.org:\n"+textStatus+"\n"+errorThrown);
            }
        });


        // 미세먼지 요청
        var apiKey = "https://api.waqi.info/feed/geo:37;127/?token=9a60be515f42c846e4e0d0e6006b9ae5b4101f77";

        $.ajax({
            url: apiKey,
            dataType: "json",
            type: "GET",
            async: "true",
            timeout:3000,
            success: function(resp) {
                Log.debug("Got response from waqi.info");
                // console.log(resp);
                // console.log(resp["data"]["aqi"]);
                try{
                    shinchonAqiData = resp["data"]["aqi"];

                    if (shinchonAqiData===undefined 
                        || shinchonAqiData===null
                        || shinchonAqiData===NaN) throw ("AQI Fetch Failed. "+shinchonAqiData);
                    Log.verbose("AQI: "+shinchonAqiData);
                    aqiReturned=true;
                    if (weatherReturned && aqiReturned){
                        Log.info("Weather data fetch successful.");
                        callCallbacks();
                    } 

                }catch(err){
                    Log.warning("Error while parsing response.\n"+err)
                }

            },
            error:function(jqXHR,textStatus,errorThrown){
                Log.warning("Error from waqi.info:\n"+textStatus+"\n"+errorThrown);
            }
        });

    }

    return{
        "getCurrentWeatherInShinchon":getCurrentWeatherInShinchon,
        "getCurrentDustLevelsInShinchon":getCurrentDustLevelsInShinchon,
        "fetch":fetch,
        "getCurrentWeatherGrade":getCurrentWeatherGrade,
        "getCurrentDustGrade":getCurrentDustGrade,
        "getCurrentTemperatureGrade":getCurrentTemperatureGrade,
        "getCurrentWeatherNameKorean":getCurrentWeatherNameKorean,
        "debug_override_weather":debug_override_weather,
        "addCallback":addCallback,
        "getCompositeGrade":getCompositeGrade
    }

})();

