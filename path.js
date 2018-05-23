
function Path(graph, from, to, pref)
{
    Log.debug("Finding path from " + from.name + " to " + to.name);

    this.graph = graph;
    this.from=from;
    this.to=to;


    if (!pref)
        pref = { "time_name": "walk" };
    this.pref=pref;

    this.p = this.graph.findShortestPath(from, to, pref);
    this.layers = [];
    if (this.p) {

        this.latlngs = [];
        for (var i = this.p; i; i = i.p) {
            var c = i.v.coordinates;

            this.latlngs.push([c.lat, c.long]);
        }

        if (this.latlngs.length)
            this.layers.push(L.polyline(this.latlngs, { "color": "red" }));

        this.timeRequired = this.p.w;
        Log.info("Found path from " + from.name + " to " + to.name + "(" + this.p.w.toFixed() + "초)");
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
