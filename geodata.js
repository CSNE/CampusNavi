var GraphDatabase=(function(){
  var masterGraph=new Graph();

  var shinchonStation=new Vertex(37.55537,126.93687,0);
  shinchonStation.name="신촌역";
  masterGraph.addVertex(shinchonStation);

  var yonseiMainGate=new Vertex(37.56018,126.93689,0);
  yonseiMainGate.name="연세대 정문";
  masterGraph.addVertex(yonseiMainGate);


  var shinchonStation_yonseiMainGate=new Edge(shinchonStation,yonseiMainGate);
  shinchonStation_yonseiMainGate.timeRequired.walk=6;
  masterGraph.addEdge(shinchonStation_yonseiMainGate);



  Log.info("Geodata database created.");
  return masterGraph;
})();
