
// 시간표를 나타내는 엘리먼트(TimeTableElement:TTE)및 시간표 클래스
// 전역으로 TimeTable 객체 하나 만들어서 사용하면 됨(대신 UserData 사용해도 됨)
// TimeTable 객체 생성할 때 쿠키에 저장된 시간표 불러와줌
// TimeTable 클래스에 TTE추가, 삭제 메소드 call 할 때마다 자동으로 쿠키에 반영됨

function TimeTableElement(startTime, endTime, weekDay, location, className){
    /*
		startTime, endTime은 시 + 분/60의 형태로 받음
		weekDay는 일~토 순으로 0~6 숫자로 받음
		location은 강의실 위치 문자열로 받음
		className도 문자열로 받음
        시간표에서 하나의 수업을 표현하는 클래스.
    */
    this.startTime=startTime; //수업 시작시간
    this.endTime=endTime; //수업 끝시간
    this.weekDay=weekDay; //요일 : 일~토 -> 0~6
    this.location=location; // 수업 위치
	this.className=className; // 수업 이름
	
	// getter & setter methods
	this.getStartTime = function() {
		return this.startTime;
	}
	this.getEndTime = function() {
		return this.endTime;
	}
	this.getWeekDay = function() {
		return this.weekDay;
	}
	this.getLocation = function() {
		return this.location;
	}
	this.getClassName = function() {
		return this.className;
	}
	this.setStartTime = function(startTime) {
		this.startTime = startTime;
	}
	this.setEndTime = function(endTime) {
		this.endTime = endTime;
	}
	this.setWeekDay = function(weekDay) {
		this.weekDay = weekDay;
	}
	this.setLocation = function(location) {
		this.location = location;
	}
	this.setClassName = function(className) {
		this.className = className;
	}
}
function stringToTime(s) {
	/*
		00:00 형태의 문자열을 (앞자리*100 + 뒷자리)의 수로 만들어줌
	*/
	var splitArr = s.split(":");
	return (parseInt(splitArr[0])*100 + parseInt(splitArr[1]));
}

function timeToString(time) {
	/*
		(앞자리*100 + 뒷자리)의 수를 00:00 형태의 문자열로 만들어줌
	*/
	
	var string="";
	
	if(Math.floor(time/100)<10) string+="0";
	string+= Math.floor(time/100);
	
	string+=":";
	
	if(time%100<10) string+="0";
	string+= time%100;
	
	return string;
}

function TimeTable(){
    /*
        시간표를 표현하는 클래스.
    */
    this.elements=[[],[],[],[],[],[],[]]; // 요일별 시간표 저장 array

    this.addTimeTableElement=function(tte){
    /*
        시간표에 수업을 더하고 현재 시간표를 쿠키로 저장함
		argument : TimeTableElement 객체
		수업 시작 시간이 끝나는 시간 이후면 추가할 수 없음(TimeTableElement가 유효하지 않은 경우)
		현재 시간표와 겹치는 시간대의 수업은 추가할 수 없음
    */
		if(tte.getStartTime()>=tte.getEndTime()) return; // TimeTableElement 시간 유효성 검사
		
		var element;
		var todayClasses = this.getWeekDayClasses(tte.getWeekDay());
		for(var i=0; i<todayClasses.length; i++) { // 현재 시간표와 겹치는 수업인지 검사
			element = todayClasses[i];
			if(!(tte.getEndTime()<=element.getStartTime() ||
					tte.getStartTime()>=element.getEndTime())) return;
		}
		
		for(var i=0; i<todayClasses.length; i++) { // 해당 요일에 해당하는 수업들의 쿠키들을 삭제
			localStorage.removeItem(tte.getWeekDay()+ "," + i);
		}
		
		this.elements[tte.getWeekDay()].push(tte); // 해당 요일에 수업 객체를 추가
		this.sortClasses(); // 수업들을 시간순으로 정렬
		
		todayClasses = this.elements[tte.getWeekDay()];
		for(var i=0; i<todayClasses.length; i++) { // 해당 요일의 정렬된 시간표를 쿠키에 저장
			localStorage.setItem(tte.getWeekDay() + "," + i, JSON.stringify(todayClasses[i]));
		}
    }
	
	this.deleteTimeTableElement=function(className) {
	/*
		시간표에서 수업을 제거하고 현재 시간표를 쿠키로 저장함
		argument : 수업 이름
	*/
		var dayClasses;
		for(var i=0; i<7; i++) {
			dayClasses = this.getWeekDayClasses(i);
			for(var j=0; j<dayClasses.length; j++) {
				if(dayClasses[j].getClassName()==className) {
					
					for(var k=0; k<dayClasses.length; k++) { // 해당 요일에 해당하는 수업들의 쿠키들을 삭제
						localStorage.removeItem(i + "," + k);
					}
					
					this.elements[i].splice(j,1); // 수업을 시간표에서 삭제
					
					for(var k=0; k<dayClasses.length; k++) { // 해당 요일의 정렬된 시간표를 쿠키에 저장
						localStorage.setItem(i + "," + k, JSON.stringify(dayClasses[k]));
					}
				}
			}
		}
	}
	
	this.getWeekDayClasses = function(weekDay) {
	/*
		해당 요일의 수업을 반환함
		argument : 요일에 해당하는 수
	*/
		if(weekDay<0 || weekDay>6) return null;
		return this.elements[weekDay];
	}
	
	this.setWeekDayClasses = function(weekDay, classes) {
	/*
		해당 요일의 수업을 저장함
		argument : 요일에 해당하는 수, TimeTableElement array
	*/
		this.elements[weekDay] = classes;
	}
	
    this.nextLecture=function(){
    /*
        곧 시작하는 수업을 반환함; 현재 시각 기준 시작하지 않은 수업 중 가장 일찍 시작하는 수업 반환(tte)
		만약 모든 수업이 끝났거나 오늘 수업이 없는 경우 null 반환
    */
		var date = new Date(); // 날짜 및 시간
		
		var todayClass = this.elements[date.getDay()];
		if(todayClass == null) return null; // 오늘 수업 없으면 null 반환
		
		var soonClass = null; // 현재 시작하지 않은 수업 중 가장 일찍 시작하는 수업
		var timeNow = date.getHours()*100 + date.getMinutes(); // 현재시각
		for (var i=0; i<todayClass.length; i++) {
			if(todayClass[i].getStartTime() >= timeNow) {
				if(soonClass==null) soonClass = todayClass[i];
				else if(todayClass[i].getStartTime() < soonClass.getStartTime()) soonClass = todayClass[i];
			}
		}
		
		return soonClass;
    }
    this.lastLecture=function(){
    /*
        방금 끝난 수업을 반환함.
    */
		var date = new Date(); // 날짜 및 시간
		
		var todayClass = this.elements[date.getDay()];
		if(todayClass == null) return null; // 오늘 수업 없으면 null 반환
		
		var justClass = null; // 현재 끝난 수업 중 가장 최근에 끝난 수업
		var timeNow = date.getHours()*100 + date.getMinutes(); // 현재시각
		for (var i=0; i<todayClass.length; i++) {
			if(todayClass[i].getEndTime() <= timeNow) {
				if(justClass==null) justClass = todayClass[i];
				else if(todayClass[i].getStartTime() > justClass.getStartTime()) justClass = todayClass[i];
			}
		}
		
		return justClass;

    }
	
	this.saveTimeTable=function() {
	/*
		이 시간표 객체를 각 TimeTableElement 별로 localStorage 쿠키에 저장함
	*/
		this.sortClasses(); // 수업 빠른순으로 정렬해줌
				
		var classes;
		for(var i=0; i<7; i++) {
			classes = timeTable.getWeekDayClasses(i);
			for(var j=0; j<classes.length; j++) {
				localStorage.setItem(i+","+j, JSON.stringify(classes[j]));
			}
		}
		localStorage.setItem("visited","true"); // 이 웹 페이지에 방문한 적이 있었음을 나타내는 flag
	}
	
	this.clearCookie=function() {
	/*
		현재 페이지 localStorage에 저장되어 있는 쿠키 삭제
	*/
		localStorage.clear();
	}
	
	this.loadTimeTable=function() {
	/*
		이전에 현재 페이지 localStorage에 쿠키로 저장한 시간표를 불러옴
	*/
		if(localStorage.getItem("visited")) { // 전에 현재 페이지에 방문해서 쿠키를 저장한 경우에만
			var keys = [];
			for(var i=0; i<localStorage.length; i++) {
				if(localStorage.key(i)=="visited") continue;
				keys.push(localStorage.key(i));
			}
			var element;
			var tte;
			for(var i=0; i<keys.length; i++) {
				element = JSON.parse(localStorage.getItem(keys[i]));
				tte = new TimeTableElement();
				tte.setStartTime(element["startTime"]);
				tte.setEndTime(element["endTime"]);
				tte.setWeekDay(element["weekDay"]);
				tte.setLocation(element["location"]);
				tte.setClassName(element["className"]);
				this.addTimeTableElement(tte);
			}
		}
	}
	
	this.sortClasses=function() {
	/*
		각 요일별 수업들을 시작, 끝 시간이 빠른 순서대로 정렬함
	*/
		for(var i=0; i<7; i++) {
			if(this.elements[i].length>1){
				this.elements[i].sort(function(a,b){
					if(a["startTime"]<=b["startTime"] && a["endTime"]<=b["endTime"]) return -1;
					else return 1;});
			}
		}
	}
	
	this.loadTimeTable(); // 객체 생성할 때 쿠키에 저장된 시간표 불러옴
}

