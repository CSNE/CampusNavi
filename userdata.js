//사용자 데이터 저장 관련
// 굳이 load 호출하지 않아도 객체 만들때 자동으로 쿠키에서 시간표 정보 가져옴
// TimeTable 클래스에 TimeTableElement추가, 삭제 메소드 call 할 때마다 자동으로 쿠키에 반영됨
function UserData(){
    this.timetable=new TimeTable(); 


    this.save =function(){
    /*
        cookie에 데이터를 저장합니다.
    */
		timetable.saveTimeTable();
    }
    this.load=function(){
    /*
        cookie에서 데이터를 불러옵니다.
    */
		timetable.loadTimeTable();
    }
}