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
    var earthRadius=6.3781e6;
    var earthCircumference=2*Math.PI*earthRadius;
    var metersPerDegreeLatitude=earthCircumference/360;
    var earthCircumferenceAtLatitude=2*Math.PI*earthRadius*sind(cartesianCenterCoords.lat);
    var metersPerDegreeLongitude=earthCircumferenceAtLatitude/360;
    Log.debug("metersPerDegreeLatitude "+metersPerDegreeLatitude);
    Log.debug("metersPerDegreeLongitude "+metersPerDegreeLongitude);
    Log.debug("sind(cartesianCenterCoords.lat) "+sind(cartesianCenterCoords.lat));

    // 위도-경도-고도 좌표를 받아 XYZ 좌표계로 변환.
    // 예시: coordsToCartesian({"lat":37.5,"long":126.9,"alt":10})
    function coordsToCartesian(coords) {
        
        var y=(coords.lat-cartesianCenterCoords.lat)*metersPerDegreeLatitude;
        var x=(coords.long-cartesianCenterCoords.long)*metersPerDegreeLongitude;
        var z=coords.alt-cartesianCenterCoords.alt;

        return {"x":x,"y":y,"z":z};
        /*
        var r = earthRadius + coords.alt;
        var rp = r * cosd(coords.lat);
        return {
            "x": rp * cosd(coords.long),
            "y": rp * sind(coords.long),
            "z": r * sind(coords.lat)
        };
        */
    }

    // XYZ 좌표계를 위도-경도-고도 좌표계로 변환.
    // 예시: cartesianToCoords({"x":10,"y":20,"z":30})
    function cartesianToCoords(coords) {
        
        var lat=coords.y/metersPerDegreeLatitude+cartesianCenterCoords.lat;
        var long=coords.x/metersPerDegreeLongitude+cartesianCenterCoords.long;
        var alt=coords.z+cartesianCenterCoords.alt;

        return {"lat":lat,"long":long,"alt":alt};
        /*
        var r = coords.x * coords.x + coords.y * coords.y + coords.z * coords.z;
        var alt = r - earthRadius;
        */
    }



    return{
        "coordsToCartesian":coordsToCartesian,
        "cartesianToCoords":cartesianToCoords,
        "centerCoords":cartesianCenterCoords
    };
})();

var Coordinates=(function(){
    // 위도-경도 좌표계와 XYZ 좌표계를 동시에 표현하는 클래스.
    // 생성자에서는 위도, 경도, 고도를 받으며,
    // 이후 lat, long, alt, x, y, z 변수에서 각 좌표를 얻을 수 있음.
    // getDistance로 두 CoordinateSystem 사이의 거리를 얻을 수 있음.
    function CoordinateSystem(){


        this.lat=0;
        this.long=0;
        this.alt=0;
        this.x=0;
        this.y=0;
        this.z=0;
        this.timestamp=null;

        this.setXyzFromLatLong=function(){
            var conved=CoordinateConversions.coordsToCartesian({"lat":this.lat,"long":this.long,"alt":this.alt});
            this.x=conved.x;
            this.y=conved.y;
            this.z=conved.z;
        }
        this.setLatLongFromXyz=function(){
            var conved=CoordinateConversions.cartesianToCoords({"x":this.x,"y":this.y,"z":this.z});
            this.lat=conved.lat;
            this.long=conved.long;
            this.alt=conved.alt;
        }

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
        
        this.toVector=function(){
          return new Vector(this.x,this.y,this.z);
        }
        
        this.to2DVector=function(){
            return new Vector(this.x,this.y,0);
        }
        
        this.toLatLng=function(){
          return L.latLng(this.lat,this.long,this.alt);
        }

        //Log.debug([this.x, this.y, this.z]);
    }
    function fromXYZ(x,y,z){
        var res=new CoordinateSystem();
        res.x=x;
        res.y=y;
        res.z=z;
        res.setLatLongFromXyz();
        return res;
    }
    function fromVector(vec){
        var res=new CoordinateSystem();
        res.x=vec.x;
        res.y=vec.y;
        res.z=vec.z;
        res.setLatLongFromXyz();
        return res;
    }
    function fromLatLongAlt(lat,long,alt){
        var res=new CoordinateSystem();
        res.lat=lat;
        res.long=long;
        res.alt=alt;
        res.setXyzFromLatLong();
        return res;
    }
    function fromLatLng(latlng){
        return fromLatLongAlt(latlng.lat,latlng.lng,latlng.alt);
    }
    function fromGeoloationCoords(coords){
        return fromLatLongAlt(coords.latitude,coords.longitude,coords.altitude);
    }

    return {
        "fromXYZ":fromXYZ,
        "fromVector":fromVector,
        "fromLatLongAlt":fromLatLongAlt,
        "fromLatLng":fromLatLng,
        "fromGeoloationCoords":fromGeoloationCoords
    }

})();


