var Weather=(function(){
    function getCurrentWeatherInShinchon(){
    /*
        현재 신촌의 날씨를 가져옵니다.
        object 하나를 리턴합니다.
        object는 weather라는 키에 현재 날씨를 저장합니다.
        weather의 값은 다음 string 중 하나입니다: 'sunny' 'rain' 'snow' 'cloudy' 
        예시: return {"weather":"rain"};
    */




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
