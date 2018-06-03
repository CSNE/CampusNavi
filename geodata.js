// 지도상 데이터를 저장하는 파일.
// 이런 것에는 자바스크립트가 아니라 제대로 된
// 데이터베이스를 쓰는 것이 맞지만,
// 데이터 양이 크지 않기 때문에
// 자바스크립트 파일로 저장함.

var Geodata = (function () {

    function createDataJson() {
        var masterGraph = new Graph();

        var json = Geodata.json, obj;

        if (json)
            obj = JSON.parse(json);
        else
            obj = _test_json;
        Geodata.obj = obj;

        /**** parsing ****/
        var v_by_id = {};

        for (var i = 0; i < obj.vertices.length; i++) {
            var v = obj.vertices[i];
            var vo = new Vertex(v.loc[0], v.loc[1], v.loc[2]);
            vo.shown = v.shown;
            if (vo.shown)
            {
                vo.name = v.name;
                vo.place = v.place;
            }
            v_by_id[v.id] = vo;
            //Log.verbose("Vertex[\"" + vo.name + "\"]: (" + vo.coordinates.x + ", " + vo.coordinates.y + ", " + vo.coordinates.z + ")");
            //Log.verbose("Vertex[\"" + vo.name + "\"]: (" + v.loc + ")");
            masterGraph.addVertex(vo);
        }

        for (var i = 0; i < obj.edges.length; i++) {
            var e = obj.edges[i];
            var eo = new Edge(v_by_id[e.vs], v_by_id[e.ve]);
            eo.name = e.name;
            eo.timeRequired = e.w;
            eo.flags = e.f;

            //
            if (eo.flags.outside === false)
                eo.flags.inside = true;

            masterGraph.addEdge(eo);
            if (e.undir) {
                eo = new Edge(v_by_id[e.ve], v_by_id[e.vs]);
                eo.name = e.name;
                eo.timeRequired = e.w;
                eo.flags = e.f;
                masterGraph.addEdge(eo);
            }
        }

        /**** test ****/
        /*
        걷는 속도; 1
        뛰는 속도: 2
        */
        for (var i = 0; i < masterGraph.edges.length; i++) {
            var e = masterGraph.edges[i];
            if (!e.timeRequired) {
                var d = e.vStart.coordinates.getDistance(e.vEnd.coordinates);
                e.timeRequired = { "walk": d, "run": d / 2, "fly": d / 30 };
                //Log.verbose("<" + e.vStart.name + ", " + e.vEnd.name + ">: " + d);
            }
        }
        //

        Log.info("Geodata database created.");
        Geodata.graph = masterGraph;
    }

    var onupdate =[createDataJson];
    var req;

    function addUpdateListener(f)
    {
        onupdate.push(f);
    }
    function callback()
    {
        if (req.readyState == 4 && req.status == 200) {
            Geodata.json = req.responseText;
            update();
        }
    }
    function update()
    {
        for (var i = 0; i < onupdate.length; i++) {
            onupdate[i]();
        }
    }
    function load(url)
    {
        if (document.location.protocol === "file:") {
            update();
            return;
        }
        try {
            req = new XMLHttpRequest();
            req.addEventListener("readystatechange", callback, false);

            req.open("GET", url);
            req.setRequestHeader("Accept", "application/json; charset=utf-8");
            req.send();
        }
        catch (e) {
            Log.error(e.message);
        }
    }
    return {
        "json": null,
        "obj": null,
        "graph": null,
        "addUpdateListener": addUpdateListener,
        "load": load
    };
}) ();
