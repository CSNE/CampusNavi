
function Path(graph, from, to, pref)
{
    Log.verbose("Finding path from " + from.name + " to " + to.name+" ["+pref.time_name+"]");

    this.graph = graph;
    this.from=from;
    this.to=to;


    if (!pref)
        pref = { "time_name": "walk" };
    this.pref=pref;

    this.p = this.graph.findShortestPath(from, to, pref);
    this.layers = [];
    this.edges=[];
    this.vertices=[]
    if (this.p) {

        this.latlngs = [];
        for (var i = this.p; i; i = i.p) {
            var coords = i.v.coordinates;
            var edge=i.e;

            this.latlngs.push([coords.lat, coords.long]);
            if (edge) this.edges.unshift(edge);
            
            this.vertices.unshift(i.v);
        }

        if (this.latlngs.length)
            this.layers.push(L.polyline(this.latlngs, { "color": "red" }));
        
        this.timeRequired = this.p.w;
        Log.debug("Found path from " + from.name + " to " + to.name + "(" +pref.time_name+", "+ this.p.w.toFixed() + "초)");
    }
    else
    {
        this.timeRequired = Infinity;
        this.latlngs = [[from.coordinates.lat, from.coordinates.long], [to.coordinates.lat, to.coordinates.long]];

    }

    for (var i = 0; i < this.latlngs.length; i++) {
        this.layers.push(L.circleMarker(this.latlngs[i], { "radius": 4, "stroke": false, "fill": true, "fillColor": "blue", "fillOpacity": 1 }));
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

}
