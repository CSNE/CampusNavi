﻿
//alert("test.js");

Log.debug(GraphDatabase.edges.length);

var path1 = new Path(mymap, GraphDatabase, GraphDatabase.vertices[0], GraphDatabase.vertices[1]);
//alert(path1);
window.setInterval(function () {
    path1.destroy();
    var vertices = GraphDatabase.vertices;
    //Log.debug(vertices.length);
    var v1 = vertices[Math.floor(Math.random() * vertices.length)];
    var v2 = vertices[Math.floor(Math.random() * vertices.length)];
    //Log.debug([v1.id, v2.id]);
    path1 = new Path(mymap, GraphDatabase, v1, v2);
    //Log.debug("success");
}, 5000);

mymap.on("click", function (e) {
    Log.info(e.latlng);
});

/*
(function () {
    var g = GraphDatabase;
    Log.debug("show markers");
    for (var i = 0; i < g.vertices.length; i++)
    {
        var v = g.vertices[i];
        //Log.debug(v.coordinates);
        //Log.debug(
        L.marker([v.coordinates.lat, v.coordinates.long], { "title": v.name, "autoPan": true }).addTo(mymap)
        //);
    }
})();
//*/