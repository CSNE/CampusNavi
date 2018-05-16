// 그래프.

//elemenet: { w:..., v:..., p:..., s:... }
//min w
function Heap() {
    this.buf = [];
    this.n = 1;
    this.isEmpty = function () {
        return this.n == 1;
    }
    this.enqueue = function (e) {
        var i = n++;
        for (var j; this.cmp(this.buf[i], this.buf[j = i >> 1]) ; i = j) {
            this.buf[i] = this.buf[j];
        }
        this.buf[i] = e;
    }
    this.dequeue = function () {
        var i = 1;
        var ret = this.buf[i];
        for (; ;) {
            var k = i;
            var j = i << 1;
            if (this.cmp(this.buf[j], this.buf[k])) {
                k = j;
            }
            j++;
            if (this.cmp(this.buf[j], this.buf[k])) {
                k = j;
            }
            if (i == k)
                break;
            this.buf[i] = this.buf[k];
            i = k;
        }
        this.buf[i] = this.buf[--n];
        return ret;
    }
    this.peek = function () {
        return this.buf[1];
    }
    this.cmp = function (a, b) {
        return a.w < b.w;
    }
}
//constants


function Graph() {
    this.edges = [];
    this.vertices = [];

    this.shortest_path = function (src, dst, pref) {
        //src, dst는 각각 정점의 집합(배열) 또는 하나의 정점
        //pref: preference, 뛰기, 실내 우선 등
        //배열이 아닌 경우 src = [src], dst도

        var ssrc = {}, sdst = {};
        for (var i = 0; i < src.length; i++) {
            ssrc[src[i].id] = 1;
        }
        for (var i = 0; i < dst.length; i++)
        {
            sdst[dst[i].id] = 1;
        }

        return this.shortest_path_id_set(ssrc, sdst, pref);
    }

    //returns: ret.p.p.p....p.v in src, p.p.....p.e: edge in path p.e: last edge
    this.shortest_path_id_set = function (src, dst, pref)
    {
        var q = new Heap();
        for (var k in src)
            q.enqueue({ "w": 0, "v": this.vertices[k], "p": undefined, "e": undefined });
        while (!q.isEmpty())
        {
            var p = q.dequeue();
            if (dst[p.v.id])
                p;
            for (var i = 0; i < p.v.out_edges.length; i++)
            {
                var e = p.v.out_edges[i];
                q.enqueue({ "w": p.w + e.timeRequired[pref.time_name], "v": e.vEnd, "p": p, "e": e });
            }
        }
    }

    this.addEdge = function (e) {
        // 그래프에 간선을 더합니다.
        // 이름이 같은 간선이 있다면 에러 로그가 찍힙니다. O(n^2)
        /*
      for(var i=0;i<this.edges.length;i++){
        if (e.name===this.edges[i].name) Log.error("Duplicate edge. name="+e.name);
      }
      //*/
        //같은 이름은 넣지 말자
        this.edges.push(e);
    }

    this.addVertex = function (v) {
        // 그래프에 꼭짓점을 더합니다.
        // 이름이 같은 꼭짓점이 있다면 에러 로그가 찍힙니다.
        /*
      for(var i=0;i<this.vertices.length;i++){
        if (v.name===this.vertices[i].name) Log.error("Duplicate vertex. name="+v.name);
      }
      //*/
        v.id = this.vertices.length;
        this.vertices.push(v);
    }

}

var Edge_id_counter = 0;

function Edge(vStart, vEnd, id) {
    // 간선을 표현하는 클래스

    this.id = id;//실질적인 comparable identifier

    //양쪽 꼭짓점
    this.vStart = vStart;
    vStart.out_edges.push(this);
    this.vEnd = vEnd;

    //이 간선을 통과하는데 걸리는 시간
    this.timeRequired = {};
    this.timeRequired.weight = 0; //걷기
    this.timeRequired.run = 0; //뛰기
    //방향에 따라 가중치가 다른 경우 digraph로 하는 것이 맞을 듯
    //데이터베이스상에는 edge별로 directed인지 포함하고 실제 로드된 데이터에는 undirected는 두 edge로

    //간선의 길이 (자동으로 계산됨)
    //this.distance=vStart.coordinates.getDistance(vEnd.coordinates);필요하지 않을 것 같음

    //간선의 특성
    this.flags = {};
    this.flags.outside = true;

    //간선의 이름
    this.name = "Unnamed edge";
}

function Vertex(lat, long, alt) {
    // 꼭짓점을 표현하는 클래스
    // 위도, 경도, 고도를 받음.
    this.coordinates = new CoordinateConversions.CoordinateSystem(lat, long, alt);

    //이 꼭짓점에서 나가는 edges
    this.out_edges = [];

    //꼭짓점의 이름
    this.name = "Unnamed vertex";
}
