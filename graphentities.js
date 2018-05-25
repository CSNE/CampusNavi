// 그래프를 표현하는데 필요한 클래스들.
function Graph() {
    this.edges = [];
    this.vertices = [];

    this.addEdge = function (e) {
        // 그래프에 간선을 더합니다.
        // 이름이 같은 간선이 있다면 에러 로그가 찍힙니다. O(n^2)
        /*
      for(var i=0;i<this.edges.length;i++){
        if (e.name===this.edges[i].name) Log.error("Duplicate edge. name="+e.name);
      }
      //*/
        //같은 이름은 넣지 말자
        e.id = this.edges.length;
        this.edges.push(e);
    }

    this.addVertex = function (v) {
        // 그래프에 꼭짓점을 더합니다.
        // 이름이 같은 꼭짓점이 있다면 에러 로그가 찍힙니다.
        /*
      for(var i=0;i<this.vertices.length;i++){
        if (v.name===this.vertices[i].name) Log.error("Duplicate vertex. name="+v.name);
      }
      //*/
        v.id = this.vertices.length;
        this.vertices.push(v);
    }

    this.findShortestPath = function (from, to, pref) {
        //alert();
        return GraphCalculations.findShortestPath(this, from, to, pref);
    }
    
    this.findVertexWithName=function(name){
      for(var i=0;i<this.vertices.length;i++){
        if (this.vertices[i].name===name) return this.vertices[i];
      }
      return null;
    }

}

function Edge(vStart, vEnd, id) {
    // 간선을 표현하는 클래스

    this.id = id;

    //양쪽 꼭짓점
    this.vStart = vStart;
    vStart.out_edges.push(this);
    this.vEnd = vEnd;

    //이 간선을 통과하는데 걸리는 시간
    this.timeRequired = {};
    this.timeRequired.weight = 0; //걷기
    this.timeRequired.run = 0; //뛰기
    //방향에 따라 가중치가 다른 경우 digraph로 하는 것이 맞을 듯
    //데이터베이스상에는 edge별로 directed인지 포함하고 실제 로드된 데이터에는 undirected는 두 edge로

    //간선의 특성, 실내 등
    this.flags = {};

    //간선의 이름
    this.name = "Unnamed edge";

    //Log.debug(this.vStart.coordinates.getDistance(this.vEnd.coordinates));
}

function Vertex(lat, long, alt, id) {
    // 꼭짓점을 표현하는 클래스

    this.id = id;//실질적인 comparable identifier

    // 위도, 경도, 고도를 받음. path 그리기에 적절하게 표현 (배열)
    this.coordinates = Coordinates.fromLatLongAlt(lat, long, alt);

    //이 꼭짓점에서 나가는 edges
    this.out_edges = [];

    //꼭짓점의 이름
    this.name = "Unnamed vertex";
}
