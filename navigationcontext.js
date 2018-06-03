//사용자가 경로를 따라가는 과정을 추적하는 클래스.
//사용자의 속도를 측정해 예상시간도 계산한다.
function NavigationContext(path){
    this.path=path;

    this.history=[];
    this.historyThreshold=60*1000//milliseconds;

    this.currentStatus;
  
    //Given two endpoints of a line startPointCoords and endPointCoords
    //and another point pointCoords
    //Finds the distance beween the line and the point
    //Along with the perpendicular point
    //And the "location ratio" of the perpendicular point within a line.
    //    The location ratio is 0 when the point is directly over the startPoint,
    //                          0.5 when the point is halfway over the line,
    //                          and 1 when the point is directly over the endPoint
    //All coordinates are given as a CoordinateSystem object.
    //Z coords are ignored.
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
    
    //Given a Path object,
    //And a point (a CoordinateSystem object)
    //Finds the closest graph entity to the point.
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

    //Remove this variable later on.
    this.DEBUG_VARIABLE=null;
    
    //Update the location.
    //location is given as a CoordinateSystem object.
    //this method will also update the history, speed, predicted time of arrival,
    //and basically everything.
    //The calculated, useful values are stored in .currentStatus
    //and is also available with a callback function (see .addContextUpdateListener())
    this.updateLocation=function(location){
        if (!this.active) return;
        //We need to do a lot of shit here
        var result=findClosestEdgeInPath(path,location);
        var totalTimeInitialEstimate=path.timeRequired;
        var estimatedTimeAtCurrentLocation;
        var routeCompletionRatio;
        var completionPerMillisecond;

        this.DEBUG_VARIABLE=result;

        if (result.type==="edge"){

            var pathToStartVertex= new Path(
                Geodata.graph,
                this.path.from,
                result.edge.vStart,
                this.path.pref);
            var timeToStartVertex=pathToStartVertex.timeRequired;

            var pathToEndVertex= new Path(
                Geodata.graph,
                this.path.from,
                result.edge.vEnd,
                this.path.pref);
            var timeToEndVertex=pathToEndVertex.timeRequired;


            estimatedTimeAtCurrentLocation=timeToEndVertex*result.edgeCompletionRatio+
                timeToStartVertex*(1-result.edgeCompletionRatio);

            Log.verbose("Projecting current position to graph...\n"+
                        "Closest graph element: edge\n"+
                        "Edge Start: "+result.edge.vStart.name+"\n"+
                        "Edge End: "+result.edge.vEnd.name+"\n"+
                        "Edge Ratio: "+result.edgeCompletionRatio+"\n"+
                        "Time to start vertex: "+timeToStartVertex+"\n"+
                        "Time to end vertex: "+timeToEndVertex+"\n"+
                        "Time to current position: "+estimatedTimeAtCurrentLocation);
        }else if(result.type==="vertex"){
            var pathToVertex= new Path(
                Geodata.graph,
                this.path.from,
                result.vertex,
                this.path.pref);
            var timeToVertex=pathToVertex.timeRequired;


            estimatedTimeAtCurrentLocation=timeToVertex;

            Log.verbose("Projecting current position to graph...\n"+
                        "Closest graph element: vertex\n"+
                        "Vertex Name: "+result.vertex.name+"\n"+
                        "Time to current position: "+timeToVertex);            
        }else{
            Log.error("what?");
        }

        routeCompletionRatio=estimatedTimeAtCurrentLocation/totalTimeInitialEstimate;
        var currentTime=Date.now();
        this.history.push({"timestamp":currentTime,
                           "result":result,
                           "estimatedTimeAtCurrentLocation":estimatedTimeAtCurrentLocation,
                           "routeCompletionRatio":routeCompletionRatio
                          });

        while(this.history[0].timestamp<(currentTime-this.historyThreshold)){
            this.history.shift();
        }
        
        Log.debug("History size "+this.history.length);


        //TODO replace this with a more sophiscated algorithm.
        if (this.history.length>=2){
            var firstElem=this.history[0];
            var lastElem=this.history[this.history.length-1];

            completionPerMillisecond=(lastElem.routeCompletionRatio-firstElem.routeCompletionRatio)/(lastElem.timestamp-firstElem.timestamp);
        }else{
            completionPerMillisecond=NaN;
        }
        
        var ratioLeft=1-routeCompletionRatio;
        var timeLeft=ratioLeft/completionPerMillisecond; //in milliseconds
        var arrivalTime=currentTime+timeLeft;

        
        this.currentStatus={"routeCompletionRatio":routeCompletionRatio,
                            "completionPerMillisecond":completionPerMillisecond,
                            "timeLeft":timeLeft,
                            "arrivalTime":arrivalTime,
                            "updated":currentTime};
        
        Log.verbose("Navigation Context updated.\n"+
                    "Completion Ratio: "+routeCompletionRatio+"\n"+
                    "Time left: "+(timeLeft/1000).toFixed()+" seconds.\n"+
                    "Ratio per minute: "+(completionPerMillisecond/1000*100).toPrecision(5)+"(percent per minute)"
                   );
        
        this.callCallbacks(this.currentStatus);
    }
    
    this.callbacks=[]
    
    //Add a callback.
    //the callback will be called
    //whenever the .currentStatus is modified
    //which is whenever .updateLocation() is called.
    this.addContextUpdateListener=function(callback){
        this.callbacks.push(callback);
    }
    this.callCallbacks=function(data){
        for(var i=0;i<this.callbacks.length;i++){
            this.callbacks[i](data);
        }
    }
    
    //TODO deactivating this way does not remove the actual object
    //and thus is a memory leak!
    this.active=true;
    this.deactivate=function(){
      this.active=false;
    }
    
    Log.debug("Navigation Context Created.\nTarget path is "+this.path.from.name+" >> "+this.path.to.name);
}