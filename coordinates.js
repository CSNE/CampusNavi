//Basic coordinate arithmetic
var CoordinateConversions=(function(){
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

  function CoordinateSystem(long,lat,alt){
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
