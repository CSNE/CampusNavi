
function Path(map, graph, from, to, pref)
{
    Log.debug("path from " + from.name + " to " + to.name);
    //this.path_data = undefined;
    this.map = map;
    this.graph = graph;

    {
        //alert(from.id + "\n" + to.id + "\n" + JSON.stringify(pref));
        if (!pref)
            pref = { "time_name": "walk" };
        var p = this.graph.findShortestPath(from, to, pref);
        //alert(8);
        var latlngs = [];
        for (var i = p; i; i = i.p) {
            var c = i.v.coordinates;
            //alert(JSON.stringify(c));
            //alert([c.lat, c.long]);
            latlngs.push([c.lat, c.long]);
        }
        //alert(latlngs);
        //Log.debug("path_length: " + (latlngs.length - 1));
        Log.debug("time: " + p.w);
        this.path_data = [];
        if (latlngs.length)
            this.path_data.push(L.polyline(latlngs, { "color": "red" }).addTo(this.map));
        for (var i = 0; i < latlngs.length; i++) {
            this.path_data.push(L.circleMarker(latlngs[i], { "radius": 4, "stroke": false, "fill": true, "fillColor": "blue", "fillOpacity": 1 }).addTo(map));
        }
        //alert(18);
    }

    this.destroy = function() {
        if (this.path_data) {
            for (var i = 0; i < this.path_data.length; i++) {
                this.map.removeLayer(this.path_data[i]);
            }
        }
    }
}
