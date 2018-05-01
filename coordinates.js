function degreesToRadians(d){
  return (d/360)*(2*Math.PI);
}

function sind(d){
  return Math.sin(degreesToRadians(d));
}
function cosd(d){
  return Math.cos(degreesToRadians(d));
}

function Coordinates(){
  this.lat=0;
  this.long=0;
  this.alt=0;
}

var center={"lat":37.5602,"long":126.9368,"alt":50};
var latitude=center.lat;

var earthRadius=6400*1000;
var earthCircumference=2*Math.PI*earthRadius;
var metersPerDegreeLatitude=earthCircumference/360;

var earthCircumferenceAtLatitude=2*Math.PI*earthCircumference*sind(latitude);
var metersPerDegreeLongitude=earthCircumferenceAtLatitude/360;


function coordsToCartesian(coords){
  var y=(coords.lat-center.lat)*metersPerDegreeLatitude;
  var x=(coords.long-center.long)*metersPerDegreeLongitude;
  var z=coords.alt-center.alt;
  
  return {"x":x,"y":y,"z":z};
}

function cartesianToCoords(coords){
  var lat=coords.y/metersPerDegreeLatitude+center.lat;
  var long=coords.x/metersPerDegreeLongitude+center.long;
  var alt=coords.z+center.alt;
  
  return {"lat":lat,"long":long,"alt":alt};
}