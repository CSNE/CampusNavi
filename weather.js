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

        var w=getCurrentWeatherInShinchon().weather;

        if (w==="Thunderstorm") return "폭풍";
        if (w==="Drizzle") return "약한비";
        if (w==="Rain") return "비";
        if (w==="Snow") return "눈";
        if (w==="Atmosphere") return "안개";
        if (w==="Clear") return "맑음";
        if (w==="Clouds") return "흐림";

        Log.error("Unexpected Weather! "+w);
    }

    function getCurrentWeatherGrade(){
        //Returns: "Good","Okay","bad"
        if (getCurrentWeatherInShinchon()===null) return null;

        var w=getCurrentWeatherInShinchon().weather;

        if (w==="Clear" || w==="Clouds") return "good";
        if (w==="Drizzle" || w==="Atmosphere") return "okay";
        if (w==="Thunderstorm" || w==="Rain" || w==="Snow") return "bad";

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

    function getCurrentDustLevelsInShinchon(){
        /*
        현재 신촌의 미세먼지 정보를 가져옵니다.
        object 하나를 리턴합니다.
        object는 aqi라는 키에 현재 AQI(공기품질지수)를 float로 저장합니다.
        예시: return {"aqi": 30};
        */

        return shinchonAqiData;
    }

    function debug_override_weather(weather,temps,aqi){
        shinchonWeatherData={"weather":weather,"temperature":temps};
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
        // 날씨 요청
        var apiURI = "http://api.openweathermap.org/data/2.5/weather?lat="+"37" + "&lon=" + "127"+"&appid="+"f4e5095b023d96581b869c74b663f6b2";
        $.ajax({
            url: apiURI,
            dataType: "json",
            type: "GET",
            async: "true",
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

                    if (shinchonWeatherData.weather===undefined 
                        || shinchonWeatherData.weather===null
                        || shinchonWeatherData.weather===NaN) Log.error("Weather Fetch Failed. "+shinchonWeatherData.weather);

                    if (shinchonWeatherData!==null && shinchonAqiData!==null){
                        callCallbacks();
                    } 
                }catch(err){
                    Log.error("Error while parsing response.\n"+err)
                }

                // console.log(ret1);
                // document.getElementById("hi").innerHTML = ret["weather"];
            },
            error:function(jqXHR,textStatus,errorThrown){
                Log.error("Error from openweathermap.org:\n"+textStatus+"\n"+errorThrown);
            }
        });


        // 미세먼지 요청
        var apiKey = "https://api.waqi.info/feed/geo:37;127/?token=9a60be515f42c846e4e0d0e6006b9ae5b4101f77";

        $.ajax({
            url: apiKey,
            dataType: "json",
            type: "GET",
            async: "false",
            success: function(resp) {
                Log.debug("Got response from waqi.info");
                // console.log(resp);
                // console.log(resp["data"]["aqi"]);
                try{
                    shinchonAqiData = resp["data"]["aqi"];

                    if (shinchonAqiData===undefined 
                        || shinchonAqiData===null
                        || shinchonAqiData===NaN) Log.error("AQI Fetch Failed. "+shinchonAqiData);

                    if (shinchonWeatherData!==null && shinchonAqiData!==null){
                        callCallbacks();
                    } 

                }catch(err){
                    Log.error("Error while parsing response.\n"+err)
                }

            },
            error:function(jqXHR,textStatus,errorThrown){
                Log.error("Error from waqi.info:\n"+textStatus+"\n"+errorThrown);
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
        "addCallback":addCallback
    }

})();

