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
    var xhr = new XMLHttpRequest();
    // 날짜 문자열 만들기
    var d = new Date();
    var date = d.getFullYear().toString() + ((d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString()) + (d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString());
    
    // 시간 문자열 만들기
    var time = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
    
    // 신촌동은 x=59, y=126, 네이버 지도로 신촌동을 검색했을 때 연세대학교에서 제일 가까워서 선택함.
    // 공공데이터포털에 회원가입, 사용신청해서 서비스키를 받음.
    xhr.open("GET", "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib?ServiceKey=U5SabF7XIWIy1zJi7iY8Ueuw7bZh%2BZA6HifF6cvaBfuq7byiMS8liA9FYO%2FIUgFpO5zSi7SEosO6h1T%2BH%2F7drA%3D%3D&base_date=" + date + "&base_time=" + time + "&nx=59&ny=126&pageNo=1&numOfRows=1&_type=json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // json으로 변환
            var temp = JSON.parse(xhr.responseText);
            alert(temp);
            xhr.responseText["response"]["body"]["items"]["item"]["category"]
        }
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();
    */


    // 다른 사람이 작성한 코드
    var today = new Date();
    var week = new Array('일','월','화','수','목','금','토');
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
 
    // $('.weather-date').html(month +"월 " + day + "일 " + week[today.getDay()]+"요일");
 
    /*
     * 기상청 30분마다 발표
     * 30분보다 작으면, 한시간 전 hours 값
     */
    if(minutes < 30){
        hours = hours - 1;
        if(hours < 0){
            // 자정 이전은 전날로 계산
            today.setDate(today.getDate() - 1);
            day = today.getDate();
            month = today.getMonth()+1;
            year = today.getFullYear();
            hours = 23;
        }
    }
    
    /* example
     * 9시 -> 09시 변경 필요
     */
    
    if(hours < 10) {
        hours = '0'+hours;
    }
    if(month < 10) {
        month = '0' + month;
    }    
    if(day < 10) {
        day = '0' + day;
    } 
 
    today = year+""+month+""+day;
    
    /* 좌표 */
    var _nx = 59, 
    _ny = 126,
    apikey = "x84IrpZ%2FYvOf0dir6QMBWdj3FaOW%2FTpp2rMHIQw6gc6W4tQxdpe0nZDBnwF93dCT2XohL5FgnFk9l6VF9Sjd5w%3D%3D",    
    ForecastGribURL = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib";
    ForecastGribURL += "?ServiceKey=" + apikey;
    ForecastGribURL += "&base_date=" + today;
    ForecastGribURL += "&base_time=" + hours +"00";
    ForecastGribURL += "&nx=" + _nx + "&ny=" + _ny;
    ForecastGribURL += "&pageNo=1&numOfRows=7";
    ForecastGribURL += "&_type=json";
 
    $.ajax({
        url: ForecastGribURL
        ,type: 'get'
        ,success: function(msg) {
    
        var text = msg.responseText,
        text = text.replace(/(<([^>]+)>)/ig,""); //HTML 태그 모두 공백으로 대체
        text = '[' + text + ']';
        var json = $.parseJSON(text);
        
        var rain_state = json[0].response.body.items.item[1].obsrValue;
        var rain = json[0].response.body.items.item[3].obsrValue;
        var sky = json[0].response.body.items.item[4].obsrValue;
        var temperature = json[0].response.body.items.item[5].obsrValue;
        
        // $('.weather-temp').html(temperature.toFixed(1) + " ℃");
        // $('#RN1').html("시간당강수량 : "+ rain +"mm");
        
            if(rain_state != 0) {
                switch(rain_state) {
                case 1:
                    return {"weather":"rain"};
                    // $('.weather-state-text').html("비");
                    break;
                case 2:
                    // 비/눈이지만 완전히 눈이 아니므로 비로 표시함.
                    return {"weather":"rain"};
                    // $('.weather-state-text').html("비/눈");
                    break;
                case 3:
                    return {"weather":"snow"};
                    // $('.weather-state-text').html("눈");
                    break;
                }
            } else {
                switch(sky) {
                case 1:
                    return {"weather":"sunny"};
                    // $('.weather-state-text').html("맑음");
                    break;
                case 2:
                    return {"weather":"sunny"};
                    // $('.weather-state-text').html("구름조금");
                    break;
                case 3:
                    return {"weather":"cloudy"};
                    // $('.weather-state-text').html("구름많음");
                    break;
                case 4:
                return {"weather":"cloudy"};
                    // $('.weather-state-text').html("흐림");    
                    break;
                    }    
                } //if 종료
            } //success func 종료
        })
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
