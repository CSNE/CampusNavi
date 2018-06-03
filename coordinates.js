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
    var cartesianCenterCoords={"lat":37.5602,"lng":126.9368,"alt":0};

    //지구 반지름 등 경도-위도 좌표계를 변환하기 위한 상수들
    var earthRadius=6.3781e6;
    var earthCircumference=2*Math.PI*earthRadius;
    var metersPerDegreeLatitude=earthCircumference/360;
    var earthCircumferenceAtLatitude=2*Math.PI*earthRadius*sind(cartesianCenterCoords.lat);
    var metersPerDegreeLongitude = earthCircumferenceAtLatitude / 360;
    
    var transform = Matrix44Identity(), inverset;
    var center = coordsToCartesian(cartesianCenterCoords);
    //rotate translate
    transform = MatrixMultiply(MatrixTranslate([-center.x, -center.y, -center.z]), transform);
    transform = MatrixMultiply(Matrix44Rotate([0, 0, -1], cartesianCenterCoords.lng * Math.PI / 180 + Math.PI * 0.5), transform);
    transform = MatrixMultiply(Matrix44Rotate([-1, 0, 0], Math.PI * 0.5 - cartesianCenterCoords.lat * Math.PI / 180), transform);

    inverset = MatrixInverse(transform);

    //Log.debug(MatrixToString(inverset));

    //Log.debug(JSON.stringify(coordsToCartesian({ "lat": 37.5602, "lng": 126.9368, "alt": 1000 })));
    //Log.debug(JSON.stringify(cartesianToCoords(coordsToCartesian({ "lat": 37.5602, "lng": 126.9368, "alt": 1000 }))));
    //Log.debug(MatrixToString(MatrixMultiply(transform, inverset)));

    //37.560743,126.936078
    //37.56012270944868,126.93672716617586
    // 위도-경도-고도 좌표를 받아 XYZ 좌표계로 변환.
    // 예시: coordsToCartesian({"lat":37.5,"lng":126.9,"alt":10})
    function coordsToCartesian(coords) {
        
        /*
        var y=(coords.lat-cartesianCenterCoords.lat)*metersPerDegreeLatitude;
        var x=(coords.lng-cartesianCenterCoords.lng)*metersPerDegreeLongitude;
        var z=coords.alt-cartesianCenterCoords.alt;

        return {"x":x,"y":y,"z":z};
        /*/
        //+x: latlng 0, 0
        //+z: N
        var r = earthRadius + coords.alt;
        var rp = r * cosd(coords.lat);
        var v = [rp * cosd(coords.lng), rp * sind(coords.lng), r * sind(coords.lat)];
        v = VectorTransform(transform, v);
        return {
            "x": v[0],
            "y": v[1],
            "z": v[2]
        };
        //*/
    }

    // XYZ 좌표계를 위도-경도-고도 좌표계로 변환.
    // 예시: cartesianToCoords({"x":10,"y":20,"z":30})
    function cartesianToCoords(coords) {
        
        /*
        var lat=coords.y/metersPerDegreeLatitude+cartesianCenterCoords.lat;
        var lng=coords.x/metersPerDegreeLongitude+cartesianCenterCoords.lng;
        var alt=coords.z+cartesianCenterCoords.alt;

        return {"lat":lat,"lng":lng,"alt":alt};
        /*/
        var v = VectorTransform(inverset, [coords.x, coords.y, coords.z]);
        //Log.debug([JSON.stringify(coords), JSON.stringify(v)].toString());
        var r = VectorNorm(v);
        return {
            "lat": Math.asin(v[2] / r) * 180 / Math.PI,
            "lng": Math.atan2(v[1], v[0]) * 180 / Math.PI,
            "alt": r - earthRadius
        };
        //*/
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
    // 이후 lat, lng, alt, x, y, z 변수에서 각 좌표를 얻을 수 있음.
    // getDistance로 두 CoordinateSystem 사이의 거리를 얻을 수 있음.
    function CoordinateSystem(){


        this.lat=0;
        this.lng=0;//for the compatibility with L.LatLng
        this.alt=0;
        this.x=0;
        this.y=0;
        this.z=0;
        this.timestamp=null;

        this.setXyzFromLatLong=function(){
            var conved=CoordinateConversions.coordsToCartesian({"lat":this.lat,"lng":this.lng,"alt":this.alt});
            this.x=conved.x;
            this.y=conved.y;
            this.z=conved.z;
        }
        this.setLatLongFromXyz=function(){
            var conved=CoordinateConversions.cartesianToCoords({"x":this.x,"y":this.y,"z":this.z});
            this.lat=conved.lat;
            this.lng=conved.lng;
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
          return L.latLng(this.lat,this.lng,this.alt);
        }
        
        this.toString=function(){
          return "LAT "+this.lat+"\nLONG "+this.lng+"\nALT "+this.alt+
                    "\nX "+this.x+"\nY "+this.y+"\nZ "+this.z;
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
    function fromLatLongAlt(lat,lng,alt){
        var res=new CoordinateSystem();
        res.lat=lat;
        res.lng=lng;
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


