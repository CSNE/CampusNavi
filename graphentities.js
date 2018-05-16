// 그래프를 표현하는 클래스들.
function Graph(){
  this.edges=[];
  this.vertices=[];

  this.addEdge=function(e){
    // 그래프에 간선을 더합니다.
    // 이름이 같은 간선이 있다면 에러 로그가 찍힙니다.
    for(var i=0;i<this.edges.length;i++){
      if (e.name===this.edges[i].name) Log.error("Duplicate edge. name="+e.name);
    }
    this.edges.push(e);
  }

  this.addVertex=function(v){
    // 그래프에 꼭짓점을 더합니다.
    // 이름이 같은 꼭짓점이 있다면 에러 로그가 찍힙니다.
    for(var i=0;i<this.vertices.length;i++){
      if (v.name===this.vertices[i].name) Log.error("Duplicate vertex. name="+v.name);
    }
    this.vertices.push(v);
  }
}

function Edge(vStart,vEnd){
  // 간선을 표현하는 클래스

  //양쪽 꼭짓점
  this.vStart=vStart;
  this.vEnd=vEnd;

  //이 간선을 통과하는데 걸리는 시간
  this.timeRequired={};
  this.timeRequired["walk"]=0; //걷기
  this.timeRequired["run"]=0; //뛰기
  
  this.timeRequiredReverse={};
  this.timeRequiredReverse["walk"]=0; //걷기 - 반대방향
  this.timeRequiredReverse["run"]=0; //뛰기 - 반대방향

  //간선의 길이 (자동으로 계산됨)
  this.distance=vStart.coordinates.getDistance(vEnd.coordinates);

  //간선이 실내에 있는지
  this.outside=true;

  //간선의 이름
  this.name="Unnamed edge";
}

function Vertex(lat,long,alt){
  // 꼭짓점을 표현하는 클래스
  // 위도, 경도, 고도를 받음.
  this.coordinates=new CoordinateConversions.CoordinateSystem(lat,long,alt);

  //이 꼭짓점과 연결되어 있는 모든 간선
  this.edges=[];

  //꼭짓점의 이름
  this.name="Unnamed vertex";
}
