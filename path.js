function Path(graph, from, to, pref)
{
    //Log.verbose("Finding path from " + from.name + " to " + to.name+" ["+pref.time_name+"]");

    this.graph = graph;
    this.from=from;
    this.to=to;

    this.name="Unnamed Path";
    if (!pref)
        pref = { "time_name": "walk" };
    this.pref=pref;

    this.p = this.graph.findShortestPath(from, to, pref);
    this.parray = [];
    var pr = [];
    for (var i = this.p; i; i = i.p)
    {
        pr.push(i);
    }
    for (var i = pr.length; --i >= 0;)
    {
        this.parray.push(pr[i]);
    }
    this.layers = [];
    this.edges=[];
    this.vertices=[]
    if (this.p) {

        var w = 0;
        for (var i = 0; i < this.parray.length; i++) {
            var n = this.parray[i];
            var e=n.e;

            if (e) {
                w += e.timeRequired[pref.time_name];
                this.edges.push(e);
                this.layers.push(L.polyline([e.vStart.coordinates, e.vEnd.coordinates], { "pane": e.flags.inside ? "underground" : "edges", "color": e.flags.inside ? "darkgrey" : "red" }));
            }

            this.vertices.push(n.v);
            this.layers.push(L.circleMarker(n.v.coordinates, { "pane": "vertices", "radius": 4, "stroke": false, "fill": true, "fillColor": "blue", "fillOpacity": 1 }));
        }

        this.timeRequired = w;
        //Log.debug("Found path from " + from.name + " to " + to.name + "(" +pref.time_name+", "+ this.p.w.toFixed() + "초)");
    }
    else
    {
        this.timeRequired = Infinity;
        this.layers.push(L.circleMarker(from.coordinates, { "pane": "vertices", "radius": 4, "stroke": false, "fill": true, "fillColor": "blue", "fillOpacity": 1 }));
        this.layers.push(L.circleMarker(to.coordinates, { "pane": "vertices", "radius": 4, "stroke": false, "fill": true, "fillColor": "blue", "fillOpacity": 1 }));
    }


    this.displayOnMap = function (map) {
        for (var i = 0; i < this.layers.length; i++)
        {
            this.layers[i].addTo(map);
        }
    }

    this.removeFromMap = function(map) {
        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].removeFrom(map);
        }
    }
    
    this.timeRequiredInMillisec=function(){
      return this.timeRequired*1000;
    }

}
