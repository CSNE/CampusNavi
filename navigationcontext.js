//사용자가 경로를 따라가는 과정을 추적하는 클래스.
//사용자의 속도를 측정해 예상시간도 계산한다.
function NavigationContext(path){
    this.path=path;

    this.totalTime=path.timeRequired;
    this.currentLocationEstimatedTime=0;
    this.timeMultiplier=1;

    function findDistanceBetweenLineAndPoint(startPointCoords,endPointCoords,pointCoords){
        /*
             S----------H----E
                        |
                        |
                        P

        */
        var distance;
        var ratio;
        var perpendicularPoint;

        var vectorS=startPointCoords.to2DVector();
        var vectorE=endPointCoords.to2DVector();
        var vectorP=pointCoords.to2DVector();




        var vectorSE=vectorE.sub(vectorS);
        var vectorSP=vectorP.sub(vectorS);
        var vectorSH=vectorSE.mult((vectorSP.dot(vectorSE))/(vectorSE.dot(vectorSE)));

        var vectorH=vectorSH.add(vectorS);
        var vectorHP=vectorSP.sub(vectorSH);

        perpendicularPoint=Coordinates.fromVector(vectorH);
        ratio=vectorSH.dot(vectorSE.normalize())/vectorSE.length();

        distance=vectorHP.length();

        return {
            "perpendicularPoint":perpendicularPoint,
            "ratio":ratio,
            "distance":distance
        };
    }

    function findClosestEdgeInPath(path,point){
        var result=null;
        var currentMinValue=1000000; //1000km should be enough

        //TOFIX
        //TODO We're NOT checking the direction of the edge!
        //This may end in incorrect results later on!
        var currentResult;
        var currentEdge;

        for(var i=0;i<path.edges.length;i++){
            currentEdge=path.edges[i];
            currentResult=findDistanceBetweenLineAndPoint(
                currentEdge.vStart.coordinates,
                currentEdge.vEnd.coordinates,
                point);

            if (currentResult.ratio<1 && 
                currentResult.ratio>0 &&
                currentResult.distance<currentMinValue){
                currentMinValue=currentResult.distance;
                result={"type":"edge",
                        "edge":currentEdge,
                        "closestLocation":currentResult.perpendicularPoint,
                        "edgeCompletionRatio":currentResult.ratio,
                        "distanceToEdge":currentResult.distance};
            }
        }


        var currentVertex;
        var currentDistance;
        for(var i=0;i<path.vertices.length;i++){
            currentVertex=path.vertices[i];
            currentDistance=currentVertex.coordinates.to2DVector().sub(point.to2DVector()).length();
            if (currentDistance<currentMinValue) {
                currentMinValue=currentDistance;
                result={"type":"vertex",
                    "vertex":currentVertex,
                    "closestLocation":currentVertex.coordinates
                   };
            }            
        }
        return result;
    }


    this.DEBUG_VARIABLE=null;
    this.updateLocation=function(location){
        //We need to do a lot of shit here
        var result=findClosestEdgeInPath(path,location);
        
        var totalTimeInitialEstimate=path.timeRequired;
        var currentTimeInitialEstimate;

        this.DEBUG_VARIABLE=result;
        
        if (result.type==="edge"){
            
            var pathToStartVertex= new Path(
                    GraphDatabase,
                    this.path.from,
                    result.edge.vStart,
                    this.path.pref);
            var timeToStartVertex=pathToStartVertex.timeRequired;
            
            var pathToEndVertex= new Path(
                    GraphDatabase,
                    this.path.from,
                    result.edge.vEnd,
                    this.path.pref);
            var timeToEndVertex=pathToEndVertex.timeRequired;
            currentTimeInitialEstimate=timeToEndVertex*result.edgeCompletionRatio+
                                       timeToStartVertex*(1-result.edgeCompletionRatio);
            
            Log.verbose("Navigation Context Updated.\n"+
                        "Closest graph element: edge\n"+
                        "Edge Start: "+result.edge.vStart.name+"\n"+
                        "Edge End: "+result.edge.vEnd.name+"\n"+
                        "Edge Ratio: "+result.edgeCompletionRatio+"\n"+
                        "Time to start vertex: "+timeToStartVertex+"\n"+
                        "Time to end vertex: "+timeToEndVertex+"\n"+
                        "Time to current position: "+currentTimeInitialEstimate);
        }else if(result.type==="vertex"){
            var pathToVertex= new Path(
                    GraphDatabase,
                    this.path.from,
                    result.vertex,
                    this.path.pref);
            var timeToVertex=pathToVertex.timeRequired;
            
            Log.verbose("Navigation Context Updated.\n"+
                        "Closest graph element: vertex\n"+
                        "Vertex Name: "+result.vertex.name+"\n"+
                        "Time to current position: "+timeToVertex);
        }else{
            Log.error("what?");
        }
        
    }
    this.destroy=function(){

    }
        
    Log.debug("Navigation Context Created.\nTarget path is "+this.path.from.name+" >> "+this.path.to.name);
}