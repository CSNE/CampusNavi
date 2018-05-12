
function Graph(){
  this.edges=[];
  this.vertices=[];

  this.dijkstra=function(src,dest){


  }

  this.addEdge=function(e){
    for(var i=0;i<this.edges.length;i++){
      if (e.name===this.edges[i].name) Log.error("Duplicate edge. name="+e.name);
    }
    this.edges.push(e);

  }

  this.addVertex=function(v){
    for(var i=0;i<this.vertices.length;i++){
      if (v.name===this.vertices[i].name) Log.error("Duplicate vertex. name="+v.name);
    }
    this.vertices.push(v);
  }
}

function Edge(v1,v2){
  this.v1=v1;
  this.v2=v2;

  this.timeRequired={};
  this.timeRequired.walk=0;
  this.timeRequired.run=0;

  this.distance=v1.coordinates.getDistance(v2.coordinates);

  this.outside=true;

  this.name="Unnamed edge";


}

function Vertex(lat,long,alt){

  this.coordinates=new CoordinateConversions.CoordinateSystem(lat,long,alt);

  this.edges=[];

  this.name="Unnamed vertex";
}
