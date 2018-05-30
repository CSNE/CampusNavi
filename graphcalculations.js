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
            var i = this.n++;
            for (var j; i > 1 && this.cmp(e, this.buf[j = i >> 1]) ; i = j) {
                this.buf[i] = this.buf[j];
            }
            this.buf[i] = e;
        }
        this.dequeue = function () {
            var i = 1;
            var ret = this.buf[i];
            --this.n;
            for (; ;) {
                var k = this.n;
                var j = i << 1;
                if (j < this.n && this.cmp(this.buf[j], this.buf[k])) {
                    k = j;
                }
                j++;
                if (j < this.n && this.cmp(this.buf[j], this.buf[k])) {
                    k = j;
                }
                this.buf[i] = this.buf[k];
                if (k == this.n)
                    break;
                i = k;
            }
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

        if (!Array.isArray(src))
            src = [src];
        if (!Array.isArray(dst))
            dst = [dst];

        var ssrc = {}, sdst = {};
        for (var i = 0; i < src.length; i++) {
            ssrc[src[i].id] = true;
        }
        for (var i = 0; i < dst.length; i++)
        {
            sdst[dst[i].id] = true;
        }
        return findShortestPathWithIdSet(graph, ssrc, sdst, pref);
    }

    var state_toString = function () { return "<" + this.e.vStart.name + ", " + this.e.vEnd.name + ">: " + this.w; };

    //returns: ret.p.p.p....p.v in src, p.p.....p.e: edge in path p.e: last edge
    var findShortestPathWithIdSet = function (graph, src, dst, pref)
    {
        var q = new Heap(), vv = {}, ve = {};
        for (var k in src)
        {
            q.enqueue({ "w": 0, "v": graph.vertices[k], "p": undefined, "e": undefined, toString: function () { return "<, " + this.v.name + ">: " + this.w } });
        }
        while (!q.isEmpty())
        {
            var p = q.dequeue();
            var v = p.v;
            if (!vv[v.id])
            {
                vv[v.id] = true;
                if (dst[v.id])
                {
                    return p;
                }
                for (var i = 0; i < v.out_edges.length; i++)
                {
                    var e = v.out_edges[i];
                    if (!ve[e.id])
                    {
                        ve[e.id] = true;
                        q.enqueue({ "w": p.w + e.timeRequired[pref.time_name], "v": e.vEnd, "p": p, "e": e, toString: state_toString });
                    }
                }
            }
        }
    }

    return {
        "findShortestPath":findShortestPath,
        "findShortestPathWithIdSet":findShortestPathWithIdSet
    }

})();
