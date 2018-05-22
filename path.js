
function Path(graph, from, to, pref)
{
    Log.debug("Finding path from " + from.name + " to " + to.name);

    this.graph = graph;


    if (!pref)
        pref = { "time_name": "walk" };
    this.pref=pref;

    this.p = this.graph.findShortestPath(from, to, pref);

    this.latlngs = [];
    for (var i = this.p; i; i = i.p) {
        var c = i.v.coordinates;

        this.latlngs.push([c.lat, c.long]);
    }

    this.timeRequired=this.p.w;
    Log.info("Found path from " + from.name + " to " + to.name + "(" + this.p.w.toFixed() + "초)");



    this.displayOnMap=function(map){
        this.path_data = [];
        if (this.latlngs.length)
            this.path_data.push(L.polyline(this.latlngs, { "color": "red" }).addTo(map));
        for (var i = 0; i < this.latlngs.length; i++) {
            this.path_data.push(L.circleMarker(this.latlngs[i], { "radius": 4, "stroke": false, "fill": true, "fillColor": "blue", "fillOpacity": 1 }).addTo(map));
        }
    }

    this.removeFromMap = function(map) {
        if (this.path_data) {
            for (var i = 0; i < this.path_data.length; i++) {
                map.removeLayer(this.path_data[i]);
            }
        }
    }

}
