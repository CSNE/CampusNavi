//그래프를 사용한 계산 과정을 모아둠.
var GraphCalculations=(function(){
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

    var findShortestPath = function (graph, src, dst, pref) {
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

        return findShortestPathWithId(graph, ssrc, sdst, pref);
    }

    //returns: ret.p.p.p....p.v in src, p.p.....p.e: edge in path p.e: last edge
    var findShortestPathWithId = function (graph, src, dst, pref)
    {
        var q = new Heap();
        for (var k in src)
            q.enqueue({ "w": 0, "v": graph.vertices[k], "p": undefined, "e": undefined });
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

    return {
        "findShortestPath":findShortestPath,
        "findShortestPathWithId":findShortestPathWithId
    }

})();
