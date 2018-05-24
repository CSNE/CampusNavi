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

        /*
        Log.debug("ratio calculation BEGIN");
        Log.debug(vectorSE.length());
        Log.debug(vectorSE.normalize().toString());
        Log.debug(vectorSH.dot(vectorSE.normalize()).toString());

        Log.debug("ratio calculation END");

        Log.debug("vectorS "+vectorS.toString());
        Log.debug("vectorE "+vectorE.toString());
        Log.debug("vectorP "+vectorP.toString());

        Log.debug("vectorSE "+vectorSE.toString());
        Log.debug("vectorSP "+vectorSP.toString());
        Log.debug("vectorSH "+vectorSH.toString());

        Log.debug("vectorSE Normalized "+vectorSE.normalize().toString());
        Log.debug("vectorSH Top "+(vectorSP.dot(vectorSE)).toString());
        Log.debug("vectorSH Low"+(vectorSE.dot(vectorSE).toString()));


        Log.debug("vectorH "+vectorH.toString());
        Log.debug("vectorSH "+vectorSH.toString());

        Log.debug("perpendicularPoint "+perpendicularPoint.toVector().toString());
        Log.debug("distance "+distance);
        Log.debug("ratio "+ratio);
        */
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

        //Log.debug("numedges "+path.edges.length);
        for(var i=0;i<path.edges.length;i++){
            currentEdge=path.edges[i];
            currentResult=findDistanceBetweenLineAndPoint(
                currentEdge.vStart.coordinates,
                currentEdge.vEnd.coordinates,
                point);
            /*
            Log.debug("Edge "+i);
            Log.debug(currentEdge.vStart.name);
            Log.debug(currentEdge.vStart.coordinates.toVector().toString());
            Log.debug(currentEdge.vEnd.name);
            Log.debug(currentEdge.vEnd.coordinates.toVector().toString());
            Log.debug(point.toVector().toString());
            Log.debug(currentResult.distance.toFixed());
            Log.debug(currentResult.ratio);
            */
            if (currentResult.ratio<1 && 
                currentResult.ratio>0 &&
                currentResult.distance<currentMinValue){
                currentMinValue=currentResult.distance;
                //Log.debug("SELECTEED!");
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
            //Log.debug("Path "+i);
            currentVertex=path.vertices[i];
            currentDistance=currentVertex.coordinates.to2DVector().sub(point.to2DVector()).length();
            if (currentDistance<currentMinValue) {
                currentMinValue=currentDistance;
                result={"type":"vertex",
                    "vertex":currentVertex,
                    "closestLocation":currentVertex.coordinates
                   };
            }
            //Log.debug("currentDistance "+currentDistance);
            
        }

        return result;
    }


    this.DEBUG_VARIABLE=null;
    this.updateLocation=function(location){
        //We need to do a lot of shit here
        var result=findClosestEdgeInPath(path,location);

        this.DEBUG_VARIABLE=result;
        
        if (result.type==="edge"){
            Log.verbose("Navigation Context Updated.\n"+
                        "Closest graph element: edge\n"+
                        "Edge Start: "+result.edge.vStart.name+"\n"+
                        "Edge End: "+result.edge.vEnd.name+"\n"+
                        "Edge Ratio: "+result.edgeCompletionRatio);
        }else if(result.type==="vertex"){
            Log.verbose("Navigation Context Updated.\n"+
                        "Closest graph element: vertex\n"+
                        "Vertex Name: "+result.vertex.name);
        }else{
            Log.error("what?");
        }
        
    }
    this.destroy=function(){

    }
}