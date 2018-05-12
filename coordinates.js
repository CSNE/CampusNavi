// 기본적인 좌표 계산을 해주는 라이브러리.
var CoordinateConversions=(function(){
  // 도 -> 라디안
  function degreesToRadians(d){
    return (d/360)*(2*Math.PI);
  }

  // 사인함수, 360도 기준
  function sind(d){
    return Math.sin(degreesToRadians(d));
  }
  // 코사인함수, 360도 기준
  function cosd(d){
    return Math.cos(degreesToRadians(d));
  }

  // 좌표 계산의 중점
  // 연세대 정문 좌표임.
  // 경도-위도-고도 좌표계를 XYZ 좌표계로 변환시 원점 기준이 됨.
  // 따라서 연세대 정문은 (0,0,0) 으로 됨.
  var cartesianCenterCoords={"lat":37.5602,"long":126.9368,"alt":50};

  //지구 반지름 등 경도-위도 좌표계를 변환하기 위한 상수들
  var earthRadius=6400*1000;
  var earthCircumference=2*Math.PI*earthRadius;
  var metersPerDegreeLatitude=earthCircumference/360;
  var earthCircumferenceAtLatitude=2*Math.PI*earthCircumference*sind(cartesianCenterCoords.lat);
  var metersPerDegreeLongitude=earthCircumferenceAtLatitude/360;

  // 위도-경도-고도 좌표를 받아 XYZ 좌표계로 변환.
  // 예시: coordsToCartesian({"lat":37.5,"long":126.9,"alt":10})
  function coordsToCartesian(coords){
    var y=(coords.lat-cartesianCenterCoords.lat)*metersPerDegreeLatitude;
    var x=(coords.long-cartesianCenterCoords.long)*metersPerDegreeLongitude;
    var z=coords.alt-cartesianCenterCoords.alt;

    return {"x":x,"y":y,"z":z};
  }

  // XYZ 좌표계를 위도-경도-고도 좌표계로 변환.
  // 예시: cartesianToCoords({"x":10,"y":20,"z":30})
  function cartesianToCoords(coords){
    var lat=coords.y/metersPerDegreeLatitude+cartesianCenterCoords.lat;
    var long=coords.x/metersPerDegreeLongitude+cartesianCenterCoords.long;
    var alt=coords.z+cartesianCenterCoords.alt;

    return {"lat":lat,"long":long,"alt":alt};
  }

  // 위도-경도 좌표계와 XYZ 좌표계를 동시에 표현하는 클래스.
  // 생성자에서는 위도, 경도, 고도를 받으며,
  // 이후 lat, long, alt, x, y, z 변수에서 각 좌표를 얻을 수 있음.
  // getDistance로 두 CoordinateSystem 사이의 거리를 얻을 수 있음.
  function CoordinateSystem(lat,long,alt){
    var dat={"lat":lat,"long":long,"alt":alt};
    var cartesian=coordsToCartesian(dat);

    this.lat=dat.lat;
    this.long=dat.long;
    this.alt=dat.long;
    this.x=cartesian.x;
    this.y=cartesian.y;
    this.z=cartesian.z;

    this.getCartesianDelta=function(othercoord){
      var res={};
      res.x=othercoord.x-this.x;
      res.y=othercoord.y-this.y;
      res.z=othercoord.z-this.z;
      return res;
    }
    this.getDistance=function(othercoord){
      var delta=this.getCartesianDelta(othercoord);
      return Math.sqrt(delta.x*delta.x+delta.y*delta.y+delta.z*delta.z);
    }


  }

  return{
    "coordsToCartesian":coordsToCartesian,
    "cartesianToCoords":cartesianToCoords,
    "CoordinateSystem":CoordinateSystem,
    "centerCoords":cartesianCenterCoords
  };
})()
