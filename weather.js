var Weather=(function(){
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
        "temperature": 현재 온도(섭씨 온도), 정수로 만들어서 오차가 있을 수 있음.
        "humidity": 습도
        "weatherIcon": 현재 날씨에 해당하는 아이콘
        "cloud": 구름의 양 (ex. 1%)
    */
        var apiURI = "http://api.openweathermap.org/data/2.5/weather?lat=37&lon=127&appid=f4e5095b023d96581b869c74b663f6b2";
        var ret;
        $.ajax({
            url: apiURI,
            dataType: "json",
            type: "GET",
            async: "true",
            success: function(resp) {
                ret = {
                "weather": resp.weather[0].main,
                "temperature": Math.round(resp.main.temp- 273.15),
                "humidity": resp.main.humidity,
                "weatherIcon": "http://openweathermap.org/img/w/" + resp.weather[0].icon + ".png",
                "wind": resp.wind.speed,
                "cloud": (resp.clouds.all) +"%"
                };
            }
        });
    }

    function getCurrentDustLevelsInShinchon(){
    /*
        현재 신촌의 미세먼지 정보를 가져옵니다.
        object 하나를 리턴합니다.
        object는 aqi라는 키에 현재 AQI(공기품질지수)를 float로 저장합니다.
        예시: return {"aqi": 30};
    */

    


    }

    return{
        "getCurrentWeatherInShinchon":getCurrentWeatherInShinchon,
        "getCurrentDustLevelsInShinchon":getCurrentDustLevelsInShinchon
    }
})();
