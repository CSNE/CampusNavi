
// 시간표를 나타내는 엘리먼트(TimeTableElement:TTE)및 시간표 클래스
// 전역으로 TimeTable 객체 하나 만들어서 사용하면 됨(대신 UserData 사용해도 됨)
// TimeTable 객체 생성할 때 쿠키에 저장된 시간표 불러와줌
// TimeTable 클래스에 TTE추가, 삭제 메소드 call 할 때마다 자동으로 쿠키에 반영됨
//var localStorage = new window.localStorage();

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
}

	/* TimeTable 클래스에 사용되는 함수들 */
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

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + escape(cvalue) + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = unescape(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
	setCookie(cname, "", -1);
}

	/* TimeTable 클래스 */
function TimeTable(){
    /*
        시간표를 표현하는 클래스.
    */
    this.elements=[[],[],[],[],[],[],[]]; // 요일별 시간표 저장 array
	
	this.lsUsable = (typeof(localStorage)=="undefined")? false : true;
	
	this.buildings = ['공학원', '제1공학관', '제2공학관', '제3공학관', '제4공학관', '대강당', 
						'경영관', '음악관', '체육관', '체육교육관', '백양관', '과학관', '과학원', '대우관', '대우관 별관',
						'외솔관', '교육과학관', '위당관', '삼성관', '신학관', '빌링슬리관', '연희관',
						'성암관', '상남경영관', '광복관' ,'스포츠과학관', '아펜젤러관'];
	this.classPrefix = ['외', '신', '백S', '교', '위', '위B', '상본', '상본B', '경영', '경영B',
						'과', '과S', '과B', '공A', '공B', '공C', '공D', '신', '빌', '연', '성',
						'음(A)', '음(B)', '삼', '삼B', '스포츠', '체', '광', '아'];
	this.buildingExceptions = {"제2공학관":"공B", "제3공학관":"공c"};
	this.buildingPrefix = {'외':"외솔관", '신':"신학관", '백S':"백양관", '교':"교육과학관", '위':"위당관", '위B':"위당관",
						'과':"과학관",  '과B':"과학관", '공A':"제1공학관", '공D':"제4공학관", '신':"신학관", '빌':"빌링슬리관",
						'연':"연희관", '성':"성암관", '음A':"음악관A", '음B':"음악관B", '경영':"경영관", '경영B':"경영관",
						'음(A)':"음악관A", '음(B)':"음악관B", '광':"광복관", '아':"아펜젤러관",
						'삼':"정문", '삼B':"정문", '상본':"대우관", '상본B':"대우관 별관", '상별':"대우관 별관",  //
						'공B':"제2공학관", //
						'공C':"제3공학관", //
						'과S':"과학원", '스포츠':"스포츠과학관", '체':"체육교육관"};				
	
	this.isBuilding = function(name) {
	/*
		전달받은 이름이 미리 정의된 건물 이름이면 true, 아니면 false 반환
	*/
		for(var i=0; i<this.buildings.length; i++) {
			if(name==this.buildings[i]) return true;
		}
		return false;
	}
	
	this.isException = function(name) {
		for(var i=0; this.buildingExceptions.length; i++) {
			if(this.buildingExcpetions.hasOwnProperty(name)) return true;
		}
		return false;
	}
	
	this.locationCheck = function(location) {
	/*
		입력받은 강의실 정보가 유효하면 0반환, 아니면 0이 아닌 값 반환
	*/
		var loc = location;
		
		if(this.isBuilding(loc)) return 0;

		var i;
		/*for(i=0; i<this.buildings.length; i++) {
			if(loc == this.buildings[i]) return 0;
		}*/
		for(i=0; i<loc.length; i++) {
			if(loc.charAt(i)>='0' && loc.charAt(i)<='9') break;
		}
		if(i<=0) return 1; // 아무 prefix가 없으면 1반환
		
		var prefix = loc.substring(0,i);

		if(i<loc.length) {
			var suffix = loc.substring(i,loc.length);
			if(suffix.length != 3) return 2;
			for(var j=0; j<suffix.length; j++) {
				if(suffix.charAt(j)<'0' || suffix.charAt(j)>'9') return 3;
			}
		}
		/*for(var i=0; i<this.classPrefix.length; i++) {
			if(prefix == this.classPrefix[i]) break;
		}
		if(i>=this.classPrefix.length) return 2;*/
		//if(!this.buildingPrefix.hasOwnProperty(prefix)) return 2;
		var k;
		for(k=0; k<this.classPrefix.length; k++) {
			if(prefix == this.classPrefix[k]) break;
		}
		if(k>=this.classPrefix.length) return 4;

		return 0;
	}
	
	this.timeCheck = function(weekDay, startTime, endTime) {
	/*
		입력받은 시간이 유효하면 0반환, 아니면 0이 아닌 값 반환
	*/
		if(startTime >= endTime) return 1; // TimeTableElement 시간 유효성 검사
		
		var element;
		var todayClasses = this.getWeekDayClasses(weekDay);
		for(var i=0; i<todayClasses.length; i++) { // 현재 시간표와 겹치는 수업인지 검사
			element = todayClasses[i];
			if(!(endTime <= element.startTime ||
					startTime >= element.endTime)) return 2;
		}
		
		return 0;
	}

    this.addTimeTableElement=function(tte){
    /*
        시간표에 수업을 더하고 현재 시간표를 쿠키로 저장함
		argument : TimeTableElement 객체
		수업 시작 시간이 끝나는 시간 이후면 추가할 수 없음(TimeTableElement가 유효하지 않은 경우)
		현재 시간표와 겹치는 시간대의 수업은 추가할 수 없음
    */
		/*if(tte.startTime>=tte.endTime) return; // TimeTableElement 시간 유효성 검사
		
		var element;
		var todayClasses = this.getWeekDayClasses(tte.weekDay);
		for(var i=0; i<todayClasses.length; i++) { // 현재 시간표와 겹치는 수업인지 검사
			element = todayClasses[i];
			if(!(tte.endTime <= element.startTime ||
					tte.startTime >= element.endTime)) return;
		}*/
		if(this.timeCheck(tte.weekDay, tte.startTime, tte.endTime) != 0) return;
		
		var todayClasses = this.getWeekDayClasses(tte.weekDay);
		if(this.lsUsable) {	// 해당 요일에 해당하는 수업들의 쿠키들을 삭제
			for(var i=0; i<todayClasses.length; i++) { // localStorage 사용 가능한 경우
				localStorage.removeItem(tte.weekDay + "," + i);
			}
		}
		else {
			for(var i=0; i<todayClasses.length; i++) { // localStorage 사용 불가능한 경우
				deleteCookie(tte.weekDay + "," + i);
			}
		}
		
		this.elements[tte.weekDay].push(tte); // 해당 요일에 수업 객체를 추가
		this.sortClasses(); // 수업들을 시간순으로 정렬
		
		todayClasses = this.elements[tte.weekDay];
		if(this.lsUsable) {		// 해당 요일의 수업들을 쿠키로 저장
			for(var i=0; i<todayClasses.length; i++) { // localStorage 사용 가능한 경우
				localStorage.setItem(tte.weekDay + "," + i, JSON.stringify(todayClasses[i]));
			}
			localStorage.setItem("visited","true");
		}
		else {
			for(var i=0; i<todayClasses.length; i++) { // localStorage 사용 불가능한 경우
				setCookie(tte.weekDay + "," + i, JSON.stringify(todayClasses[i]), 180);
			}
			setCookie("visited","true",180);
		}
    }
	
	this.deleteTimeTableElement=function(className) {
	/*
		시간표에서 수업을 제거하고 현재 시간표를 쿠키로 저장함
		>> 이름 같은 수업 전부 제거함
		argument : 수업 이름
	*/
		var dayClasses;
		for(var i=0; i<7; i++) {
			dayClasses = this.getWeekDayClasses(i);
			for(var j=0; j<dayClasses.length; j++) {
				if(dayClasses[j].className == className) {
					
					if(this.lsUsable) {		// 해당 요일에 해당하는 수업들의 쿠키들을 삭제
						for(var k=0; k<dayClasses.length; k++) { 	// localStorage 사용 가능한 경우
							localStorage.removeItem(i + "," + k);
						}
					}
					else {
						for(var k=0; k<dayClasses.length; k++) { 	// localStorage 사용 불가능한 경우
							deleteCookie(i + "," + k);
						}
					}
					
					dayClasses.splice(j,1); // 수업을 시간표에서 삭제
					
					if(this.lsUsable) {		// 해당 요일의 정렬된 시간표를 쿠키에 저장
						for(var k=0; k<dayClasses.length; k++) { 	// localStorage 사용 가능한 경우
							localStorage.setItem(i + "," + k, JSON.stringify(dayClasses[k]));
						}
					}
					else {
						for(var k=0; k<dayClasses.length; k++) { 	// localStorage 사용 불가능한 경우
							setCookie(i + "," + k, JSON.stringify(dayClasses[k]), 180);
						}
					}
				}
			}
		}
	}
	
	this.deleteTimeTableElementExactly = function(i, j) {
	/*
		시간표에서 정확히 수업 한개만(TimeTableElement) 삭제함
	*/
		if(this.elements[i].length < (j+1)) return false;
		
		var dayClasses = this.elements[i];
		if(this.lsUsable) {		// 해당 요일에 해당하는 수업들의 쿠키들을 삭제
			for(var k=0; k<dayClasses.length; k++) { 	// localStorage 사용 가능한 경우
				localStorage.removeItem(i + "," + k);
			}
		}
		else {
			for(var k=0; k<dayClasses.length; k++) { 	// localStorage 사용 불가능한 경우
				deleteCookie(i + "," + k);
			}
		}
		
		dayClasses.splice(j,1); // 수업을 시간표에서 삭제
		
		if(this.lsUsable) {		// 해당 요일의 정렬된 시간표를 쿠키에 저장
			for(var k=0; k<dayClasses.length; k++) { 	// localStorage 사용 가능한 경우
				localStorage.setItem(i + "," + k, JSON.stringify(dayClasses[k]));
			}
		}
		else {
			for(var k=0; k<dayClasses.length; k++) { 	// localStorage 사용 불가능한 경우
				setCookie(i + "," + k, JSON.stringify(dayClasses[k]), 180);
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
	this.debug_override_time=null;
    this.nextLecture=function(){
    /*
        곧 시작하는 수업을 반환함; 현재 시각 기준 시작하지 않은 수업 중 가장 일찍 시작하는 수업 반환(tte)
		만약 모든 수업이 끝났거나 오늘 수업이 없는 경우 null 반환
    */
		var date = new Date(); // 날짜 및 시간
        if (this.debug_override_time) date=this.debug_override_time; //for debug & demo
		
		var todayClass = this.elements[date.getDay()];
		if(todayClass == null) return null; // 오늘 수업 없으면 null 반환
		
		var soonClass = null; // 현재 시작하지 않은 수업 중 가장 일찍 시작하는 수업
		var timeNow = date.getHours()*100 + date.getMinutes(); // 현재시각
		for (var i=0; i<todayClass.length; i++) {
			if(todayClass[i].startTime >= timeNow) {
				if(soonClass==null) soonClass = todayClass[i];
				else if(todayClass[i].startTime < soonClass.startTime) soonClass = todayClass[i];
			}
		}
		
		return soonClass;
    }
    this.lastLecture=function(){
    /*
        방금 끝난 수업을 반환함.현재 시각 기준 끝난 수업 가운데 가장 최근에 끝난 수업 반환(tte)
		아직 끝난 수업이 없거나 오늘 수업이 없는 경우 null 반환
    */
		var date = new Date(); // 날짜 및 시간
        if (this.debug_override_time) date=this.debug_override_time; //for debug & demo
		
		var todayClass = this.elements[date.getDay()];
		if(todayClass == null) return null; // 오늘 수업 없으면 null 반환
		
		var justClass = null; // 현재 끝난 수업 중 가장 최근에 끝난 수업
		var timeNow = date.getHours()*100 + date.getMinutes(); // 현재시각
		for (var i=0; i<todayClass.length; i++) {
			if(todayClass[i].endTime <= timeNow) {
				if(justClass==null) justClass = todayClass[i];
				else if(todayClass[i].startTime > justClass.startTime) justClass = todayClass[i];
			}
		}
		
		return justClass;

    }
	
	//this.nextLocation = function() {
	/*
        곧 시작하는 수업의 강의 건물 문자열 반환함(ex "제1공학관")
		곧 시작하는 수업이 없으면 "정문"문자열 반환함
    */
		/*var soonClass = this.nextLecture();
		if(soonClass==null) return "정문";
		
		var loc = soonClass.location;
		var i;
		for(i=0; i<this.buildings.length; i++) { // 강의실이 건물 이름으로 등록된 경우
			if(loc == this.buildings[i]) return loc;
		}

		for(i=0; i<loc.length; i++) {	// 강의실이 정식 약어로 등록된 경우
			if(loc.charAt(i)>='0' && loc.charAt(i)<='9') break;
		}
		return this.buildingPrefix[loc.substring(0,i)];
		
	}*/
	
	//this.lastLocation = function() {
	/*
        가장 최근에 끝난 수업의 강의 건물 문자열 반환함(ex "제1공학관")
		가장 최근에 끝난 수업이 없으면 "정문"문자열 반환함
    */
		/*var justClass = this.lastLecture();
		if(justClass==null) return "정문";
		
		var loc = justClass.location;
		var i;
		for(i=0; i<this.buildings.length; i++) { // 강의실이 건물 이름으로 등록된 경우
			if(loc == this.buildings[i]) return loc;
		}

		for(i=0; i<loc.length; i++) {	// 강의실이 정식 약어로 등록된 경우
			if(loc.charAt(i)>='0' && loc.charAt(i)<='9') break;
		}
		return this.buildingPrefix[loc.substring(0,i)];
	}*/
	
	//this.saveTimeTable=function() {
	/*
		이 시간표 객체를 각 TimeTableElement 별로 localStorage 쿠키에 저장함
	*/
		/*this.sortClasses(); // 수업 빠른순으로 정렬해줌
				
		var classes;
		
		if(this.lsUsable) {		// localStorage 사용 가능한 경우
			for(var i=0; i<7; i++) {
				classes = this.elements[i];
				for(var j=0; j<classes.length; j++) {
					localStorage.setItem(i+","+j, JSON.stringify(classes[j]));
				}
			}
			localStorage.setItem("visited","true"); // 이 웹 페이지에 방문한 적이 있었음을 나타내는 flag
		}
		else {			// localStorage 사용이 불가능한 경우
			for(var i=0; i<7; i++) {
				classes = this.elements[i];
				for(var j=0; j<classes.length; j++) {
					setCookie(i+","+j, JSON.stringify(classes[j]), 180);
				}
			}
			setCookie("visited","true", 180); // 이 웹 페이지에 방문한 적이 있었음을 나타내는 flag
		}
	}*/
	
	this.clearCookie=function() {
	/*
		현재 페이지 localStorage에 저장되어 있는 쿠키 삭제
	*/
		if(this.lsUsable) {	// localStorage 객체를 사용 가능한 경우
			for(var i=0; i<7; i++) {
				for(var j=0; j<this.elements[i].length; j++) {
					localStorage.removeItem(i + "," + j);
				}
			}
		}
		else {		// localStorage 객체를 사용할 수 없는 경우
			for(var i=0; i<7; i++) {
				for(var j=0; j<this.elements[i].length; j++) {
					deleteCookie(i + "," + j);
				}
			}
			//deleteCookie("visited");
		}
	}
	
	this.loadTimeTable=function() {
	/*
		이전에 현재 페이지 localStorage에 쿠키로 저장한 시간표를 불러옴
	*/
		if(this.lsUsable) { // localStorage 객체를 사용 가능한 경우
			if(localStorage.getItem("visited")) { // 전에 현재 페이지에 방문해서 쿠키를 저장한 경우에만
				var keys = [];
				for(var i=0; i<localStorage.length; i++) {
					if(localStorage.key(i)=="visited") continue;
					if(localStorage.key(i).indexOf(',')==-1) continue;
					keys.push(localStorage.key(i));
				}
				var element;
				var tte;
				for(var i=0; i<keys.length; i++) {
					this.addTimeTableElement(JSON.parse(localStorage.getItem(keys[i])));
				}
			}
		}
		else {	 // localStorage 객체를 사용 불가능한 경우
			if(getCookie("visited")) { // 전에 현재 페이지에 방문해서 쿠키를 저장한 경우에만
				var pairs = unescape(document.cookie).split(";");
				var element;
				var tte;
				for(var i=0; i<pairs.length; i++) {
					var c = pairs[i];
					while (c.charAt(0) == ' ') c = c.substring(1);
					if (c.indexOf("visited=") == 0) continue;
					if(c.split('=')[0].indexOf(',') == -1) continue;
					
					//window.alert(c.substring(c.indexOf('=')+1, c.length));
					this.addTimeTableElement(JSON.parse((c.substring(c.indexOf('=')+1, c.length)).replace(/\\'/g, "'"))); // 주의! name 값에 '='있으면 오류 발생
				}
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
