//Basic coordinate arithmetic

function degreesToRadians(d){
  return (d/360)*(2*Math.PI);
}

function sind(d){
  return Math.sin(degreesToRadians(d));
}
function cosd(d){
  return Math.cos(degreesToRadians(d));
}


var cartesianCenterCoords={"lat":37.5602,"long":126.9368,"alt":50};

var earthRadius=6400*1000;
var earthCircumference=2*Math.PI*earthRadius;
var metersPerDegreeLatitude=earthCircumference/360;

var earthCircumferenceAtLatitude=2*Math.PI*earthCircumference*sind(cartesianCenterCoords.lat);
var metersPerDegreeLongitude=earthCircumferenceAtLatitude/360;


function coordsToCartesian(coords){
  var y=(coords.lat-cartesianCenterCoords.lat)*metersPerDegreeLatitude;
  var x=(coords.long-cartesianCenterCoords.long)*metersPerDegreeLongitude;
  var z=coords.alt-cartesianCenterCoords.alt;

  return {"x":x,"y":y,"z":z};
}

function cartesianToCoords(coords){
  var lat=coords.y/metersPerDegreeLatitude+cartesianCenterCoords.lat;
  var long=coords.x/metersPerDegreeLongitude+cartesianCenterCoords.long;
  var alt=coords.z+cartesianCenterCoords.alt;

  return {"lat":lat,"long":long,"alt":alt};
}