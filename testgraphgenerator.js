var V = new List(), E = new List();
var extra_json;

function findVertexById(id) {
    for (var i = V.iterator() ; !i.end() ; i.next()) {
        var v = i.get();
        if (v.id == id)
            return v;
    }
    return null;
}

function update(o) {
    switch (o.type) {
        case "vertex":
            updateVertex(o);
            break;
        case "edge":
            updateEdge(o);
            break;
    }
}

function updateInputs(inputs, o) {
    for (var i in inputs) {
        var e = inputs[i];
        var x = o[i];
        switch (e.valuetype) {
            //case "string":
            //break;
            case "json":
                x = JSON.stringify(x);
                break;
            case "vertex":
                x = x ? x.id : "(null)";
                break;
            default:
                break;
        }
        e.innerHTML = x;
    }
}

function updateVertex(v) {
    v.layer.setLatLng(v.loc);
    v.layer.setTooltipContent("[" + v.id + "]: " + v.name);
    updateInputs(v.targetElement.inputs, v)
    //update edges
    for (var i = v.edges.iterator() ; !i.end() ; i.next()) {
        Log.debug(i.get().name);
        updateEdge(i.get());
    }
}

function setLocation(e, loc) {
    e.loc = loc;
    updateVertex(e);
}

function updateEdge(e) {
    e.layer.setLatLngs([e.vs ? e.vs.loc : getDefaultLocation(), e.ve ? e.ve.loc : getDefaultLocation()])
    updateInputs(e.targetElement.inputs, e);
    if (e.vs && e.ve)
        Log.verbose("last edge length: " + getDistance(e.vs.loc, e.ve.loc));
}

function getDistance(a, b)
{
    Log.debug(a.toString());
    Log.debug(b.toString());
    var ca = CoordinateConversions.coordsToCartesian({ "lat": a[0], "lng": a[1], "alt": a[2] });
    var cb = CoordinateConversions.coordsToCartesian({ "lat": b[0], "lng": b[1], "alt": b[2] });
    var v = [ca.x - cb.x, ca.y - cb.y, ca.z - cb.z];
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

var vertex_style_default = { bubblingMouseEvents: false, pane: "vertices", radius: 12, stroke: false, fill: true, fillOpacity: 1, fillColor: "blue" };
var vertex_style_selected = { bubblingMouseEvents: false, pane: "selected", radius: 12, stroke: true, weight: 4, color: "lime", fill: true, fillOpacity: 1, fillColor: "blue" };
var edge_style_default = { bubblingMouseEvents: false, pane: "edges", weight: 4, color: "red" };
var edge_style_selected = { bubblingMouseEvents: false, pane: "selected", weight: 4, color: "lime" };

var vertex_attrs = {};
var edge_attrs = {};
["id", "name", "loc", "shown", "place"].forEach(function (e) { vertex_attrs[e] = true; });
["name", "vs", "ve", "w", "f"].forEach(function (e) { edge_attrs[e] = true; });

function loadData() {
    if (localStorage) {
        vertex_id_counter = parseInt(localStorage.getItem("test_graphgenerator_vertex_id_counter"));
        return localStorage.getItem("test_graphgenerator_data");
    }
    return null;
}

function storeData(data) {
    localStorage.setItem("test_graphgenerator_data", data);
    localStorage.setItem("test_graphgenerator_vertex_id_counter", vertex_id_counter);
}

function applyData(data) {
    var obj = JSON.parse(data);
    var vb = document.getElementById("vbtn");
    var eb = document.getElementById("ebtn");
    for (var i = 0; i < obj.vertices.length; i++) {
        var o = obj.vertices[i];
        if (o.loc.lat !== undefined) {
            o.loc = [o.loc.lat, o.loc.lng, 0];
        }
        var e = { id: o.id, name: o.name, loc: o.loc, shown: o.shown ? true : false, place: o.place, json: {} };
        for (var j in o) {
            if (!vertex_attrs[j])
                e.json[j] = o[j];
        }
        create_new_vertex(vb, e);
    }
    for (var i = 0; i < obj.edges.length; i++) {
        var o = obj.edges[i];
        var e = { name: o.name, vs: findVertexById(o.vs), ve: findVertexById(o.ve), w: o.w, f: o.f, json: {} };
        for (var j in o) {
            if (!edge_attrs[j])
                e.json[j] = o[j];
        }
        create_new_edge(eb, e);
    }

    extra_json = {};
    for (var i in obj)
    {
        if (i != "vertices" && i != "edges")
        {
            extra_json[i] = obj[i];
        }
    }

    if (vertex_id_counter != vertex_id_counter)
        vertex_id_counter = obj.vertices.length * 2;
    document.getElementById("json_string").innerHTML = data;
}

function getCurrentJSON() {
    var obj = {
        vertices: [],
        edges: []
    };
    for (var i = V.iterator() ; !i.end() ; i.next()) {
        var o = i.get();
        var e = { id: o.id, name: o.name, loc: o.loc, shown: o.shown, place: o.place };
        for (var j in o.json) {
            if (!vertex_attrs[j])
                e[j] = o.json[j];
        }
        obj.vertices.push(e);
    }
    for (var i = E.iterator() ; !i.end() ; i.next()) {
        var o = i.get();
        var e = { name: o.name, vs: o.vs.id, ve: o.ve.id, w: o.w, f: o.f };
        for (var j in o.json) {
            if (!edge_attrs[j])
                e[j] = o.json[j];
        }
        obj.edges.push(e);
    }
    for (var i in extra_json)
    {
        obj[i] = extra_json[i];
    }
    return JSON.stringify(obj);
}

function clearAll() {
    for (var i = V.iterator() ; !i.end() ; i.next()) {
        removeObj(i.get());
    }
    for (var i = E.iterator() ; !i.end() ; i.next()) {
        removeObj(i.get());
    }
}

var selected;
var two_vertices = [null, null];

function select(e) {
    if (e != selected/* && e.type == "vertex"*/) {
        if (selected) {
            unselect[selected.type](selected);
        }
        select[e.type](e);
        selected = e;
    }
}
var unselect = {};

function updateStyle(e) {
    e.removeFrom(mymap);
    e.addTo(mymap);
}

select["vertex"] = function (e) {
    e.targetElement.classList.add("selected");
    e.layer.setStyle(vertex_style_selected)
    ;//    .on(event_draggable_vertex);
    updateStyle(e.layer);
    two_vertices[1] = two_vertices[0];
    two_vertices[0] = e;
}
select["edge"] = function (e) {
    e.targetElement.classList.add("selected");
    e.layer.setStyle(edge_style_selected);
    updateStyle(e.layer);
}
unselect["vertex"] = function () {
    selected.targetElement.classList.remove("selected");
    selected.layer.setStyle(vertex_style_default)
    ;//    .off(event_draggable_vertex);
    updateStyle(selected.layer);
    selected = null;
}
unselect["edge"] = function () {
    selected.targetElement.classList.remove("selected");
    selected.layer.setStyle(edge_style_default);
    updateStyle(selected.layer);
    selected = null;
}

function removeObj(e) {
    if (selected == e)
        unselect[e.type](e);
    switch (e.type) {
        case "vertex":
            l = V;
            for (var i = 0, j = 0; i < 2; i++) {
                if (two_vertices[i] == e) {
                    j++;
                }
                two_vertices[i] = i + j < 2 ? two_vertices[i + j] : null;
            }
            for (var i = e.edges.iterator() ; !i.end() ; i.next()) {
                removeObj(i.get());
            }
            break;
        case "edge":
            l = E;
            if (e.vs)
                e.vs.edges.remove(e);
            if (e.ve)
                e.ve.edges.remove(e);
            break;
        default:
            return;
    }
    l.remove(e.node);
    //alert(e.targetElement.classList);
    e.targetElement.parentNode.removeChild(e.targetElement);
    mymap.removeLayer(e.layer);
}

function element_click(e) {
    var s = e.target;
    while (!s.targetObj)
        s = s.parentNode;
    select(s.targetObj);
}
function element_dblclick(e) {
    var s = e.target;
    while (!s.targetObj)
        s = s.parentNode;
    var l;
    removeObj(s.targetObj);
}
function element_value_change(e) {
    //alert(e);
    var s = e.target;
    var o = s.parentNode.targetObj;
    var x;
    switch (s.valuetype) {
        case "string":
            x = o[s.name];
            break;
        case "json":
            x = JSON.stringify(o[s.name]);
            break;
        case "vertex":
            x = o[s.name] ? o[s.name].id : "";
            break;
    }
    x = prompt(s.name, x);
    if (x !== null)
    {
        switch (s.valuetype) {
            case "string":
                o[s.name] = x;
                break;
            case "json":
                try {
                    x = JSON.parse(x);
                    o[s.name] = x;
                }
                catch (e) {
                    Log.error(e);
                }
                break;
            case "vertex":
                x = findVertexById(x);
                if (x !== null) {
                    if (o[s.name])
                        o[s.name].edges.remove(o);
                    o[s.name] = x;
                    x.edges.add(o);
                }
                break;
        }
    }
    update(o);
}
function layer_click(e) {
    select(e.target.targetObj);
}
function layer_dblclick(e) {
    removeObj(e.target.targetObj);
}

function layer_vertex_dragstart() {
    //Log.debug("dragstart");
    mymap.dragging.disable();
    mymap.on(event_map_dragging_layer);
}
function layer_vertex_dragend() {
    //Log.debug("dragend");
    mymap.off(event_map_dragging_layer);
    mymap.dragging.enable();
}
function layer_vertex_dragend_if_up(e) {
    Log.debug(e.originalEvent.button);
    //layer_vertex_dragend(e);
}

function map_drag(e) {
    setLocation(selected, [e.latlng.lat, e.latlng.lng, 0]);
}

var event_vertex = { mousedown: layer_click, dblclick: layer_dblclick };
var event_edge = { click: layer_click, dblclick: layer_dblclick };
var event_draggable_vertex = { mousedown: layer_vertex_dragstart, mouseup: layer_vertex_dragend };
var event_map_dragging_layer = { mousemove: map_drag, mouseup: layer_vertex_dragend /*, mouseover: layer_vertex_dragend_if_up*/ };

function create_new_element(btn) {
    var e = btn.ownerDocument.createElement("div");
    e.classList.add("listelement");
    //e.innerHTML = "test";
    btn.parentNode.insertBefore(e, btn);
    return e;
}
var vertex_id_counter = 0;

var element_data_vertex = [
    { label: "id: ", name: "id", type: "string" },
    { label: ", name: ", name: "name", type: "string" },
    { label: ", shown: ", name: "shown", type: "json" },
    { label: ", place: ", name: "place", type: "json" },
    { label: ", json: ", name: "json", type: "json" }
];
var element_data_edge = [
    { label: "name: ", name: "name", type: "string" },
    { label: ",vs: ", name: "vs", type: "vertex" },
    { label: ",ve: ", name: "ve", type: "vertex" },
    { label: ",w: ", name: "w", type: "json" },
    { label: ",f: ", name: "f", type: "json" },
    { label: ", json: ", name: "json", type: "json" }
];

function append_elements(e, data) {
    var doc = e.ownerDocument;
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var s = doc.createElement("span");
        s.classList.add("label");
        s.innerHTML = d.label;
        e.appendChild(s);

        s = doc.createElement("span");
        s.classList.add("input");
        s.name = d.name;
        s.valuetype = d.type;
        s.addEventListener("click", element_value_change);
        e.inputs[d.name] = s;
        e.appendChild(s);
    }
}

function create_new_vertex(btn, obj) {
    var e = create_new_element(btn);
    e.addEventListener("click", element_click);
    e.addEventListener("dblclick", element_dblclick);

    if (!obj)
        obj = { id: "v" + vertex_id_counter++, name: "New vertex", loc: getDefaultLocation(), "shown": false, json: {} };
    obj.type = "vertex";
    obj.edges = new List();

    obj.targetElement = e;
    e.targetObj = obj;

    obj.layer = L.circleMarker(obj.loc, vertex_style_default)
        .on(event_vertex)
        .on(event_draggable_vertex)
        .addTo(mymap);
    obj.layer.targetObj = obj;

    obj.node = V.add(obj);

    //alert(obj.loc);

    e.inputs = {};
    append_elements(e, element_data_vertex);

    updateVertex(obj);

    select(obj);
}

function create_new_edge(btn, obj) {
    var e = create_new_element(btn);
    e.addEventListener("click", element_click);
    e.addEventListener("dblclick", element_dblclick);

    if (!obj)
        obj = { name: "New Edge", vs: two_vertices[1], ve: two_vertices[0], w: null, f: {}, json: { undir: true } };
    obj.type = "edge";
    if (obj.vs)
        obj.vs.edges.add(obj);
    if (obj.ve)
        obj.ve.edges.add(obj);

    obj.targetElement = e;
    e.targetObj = obj;

    obj.layer = L.polyline([obj.vs ? obj.vs.loc : getDefaultLocation(), obj.ve ? obj.ve.loc : getDefaultLocation()], edge_style_default)
        .on(event_edge)
        .addTo(mymap);
    obj.layer.targetObj = obj;

    obj.node = E.add(obj);

    //alert(obj.loc);

    e.inputs = {};
    append_elements(e, element_data_edge)

    updateEdge(obj);

    select(obj);
}
