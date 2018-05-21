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
            //Log.debug("&nbsp;enqueue({ w: " + e.w + ", v: " + e.v.id + ", p: " + e.p + ", e: " + (e.ret ? "(" + e.e.vStart.id + ", " + e.e.vEnd.id + ")" : e.e) + " } })");
            //Log.debug("&nbsp;&nbsp;n: " + this.n);
            var i = this.n++;
            //Log.debug("&nbsp;&nbsp;i >> 1: " + (i >> 1));
            for (var j; i > 1 && this.cmp(e, this.buf[j = i >> 1]) ; i = j) {
                this.buf[i] = this.buf[j];
            }
            //Log.debug("&nbsp;&nbsp;i: " + i);
            this.buf[i] = e;
            //Log.debug("&nbsp;&nbsp;buf: [" + this.buf + "]");
            //Log.debug("&nbsp;&nbsp;n: " + this.n);
            //Log.debug("&nbsp;&nbsp;return");
            //this.validation();
        }
        this.dequeue = function () {
            //Log.debug("&nbsp;dequeue()");
            //Log.debug("&nbsp;&nbsp;n: " + this.n);
            var i = 1;
            var ret = this.buf[i];
            //var e = this.buf[--this.n];
            --this.n;
            for (; ;) {
                var k = this.n;
                //alert(k);
                var j = i << 1;
                //alert(j);
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
            //Log.debug("&nbsp;&nbsp;n: " + this.n);
            //Log.debug("&nbsp;&nbsp;return { w: " + ret.w + ", v: " + ret.v.id + ", p: " + ret.p + ", e: " + (ret.e ? "(" + ret.e.vStart.id + ", " + ret.e.vEnd.id + ")" : ret.e) + " }");
            //this.buf[this.n] = undefined;
            //this.validation();
            return ret;
        }
        this.peek = function () {
            return this.buf[1];
        }
        this.cmp = function (a, b) {
            return a.w < b.w;
        }
        this.validation = function () {
            for (var i = 2; i < this.n; i++)
            {
                if (this.cmp(this.buf[i], this.buf[i >> 1]))
                    Log.error("invalid heap");
            }
        }

        this.toString = function () {
            return "[" + this.buf + "]";
        }
    }

    var findShortestPath = function (graph, src, dst, pref) {
        //src, dst는 각각 정점의 집합(배열) 또는 하나의 정점
        //pref: preference, 뛰기, 실내 우선 등

        if (!Array.isArray(src))
            src = [src];
        if (!Array.isArray(dst))
            dst = [dst];

        //alert();

        var ssrc = {}, sdst = {};
        for (var i = 0; i < src.length; i++) {
            ssrc[src[i].id] = true;
        }
        for (var i = 0; i < dst.length; i++)
        {
            sdst[dst[i].id] = true;
        }
        //alert(66);
        return findShortestPathWithIdSet(graph, ssrc, sdst, pref);
    }

    var state_toString = function () { return "<" + this.e.vStart.name + ", " + this.e.vEnd.name + ">: " + this.w; };

    //returns: ret.p.p.p....p.v in src, p.p.....p.e: edge in path p.e: last edge
    var findShortestPathWithIdSet = function (graph, src, dst, pref)
    {
        //Log.debug("findShortestPathWithIdSet");
        var q = new Heap(), vv = {}, ve = {};
        for (var k in src)
        {
            q.enqueue({ "w": 0, "v": graph.vertices[k], "p": undefined, "e": undefined, toString: function () { return "<, " + this.v.name + ">: " + this.w } });
        }
        while (!q.isEmpty())
        {
            //alert(81);
            var p = q.dequeue();
            //alert(p.w + ", " + p.v.id)

            var v = p.v;
            //Log.debug("&nbsp;vv[" + v.id + "]: " + vv[v.id]);
            if (!vv[v.id])
            {
                //Log.debug("&nbsp;v: " + v.name);
                /*
                try {
                    Log.debug("&nbsp;&nbsp;&nbsp;heap: " + q);
                }
                catch (e)
                {
                    Log.error("[" + e.name + "]" + e.message);
                }
                //*/
                vv[v.id] = true;
                //Log.debug("&nbsp;dst[" + v.id + "]: " + dst[v.id]);
                if (dst[v.id])
                {
                    //alert(84);
                    //alert("return { w: " + p.w + ", v: " + p.v.id + ", p: " + "{ w: ..., v: " + p.p.v.id + ", p: {...}, e: " + p.p.e + "}" + ", e: (" + p.e.vStart.id + ", " + p.e.vEnd.id + ")}");
                    return p;
                }
                for (var i = 0; i < v.out_edges.length; i++)
                {
                    var e = v.out_edges[i];
                    //alert("(" + e.vStart.id + ", " + e.vEnd.id + "), " + p.v.id + ", " + p.p);
                    //alert("{ w: " + (p.w + e.timeRequired[pref.time_name]) + ", v: " + e.vEnd.id + ", p: " + p + ", e: (" + e.vStart.id + ", " + e.vEnd.id + ")}");
                    //Log.debug("&nbsp;ve[" + e.id + "]: " + ve[e.id]);
                    if (!ve[e.id])
                    {
                        ve[e.id] = true;
                        q.enqueue({ "w": p.w + e.timeRequired[pref.time_name], "v": e.vEnd, "p": p, "e": e, toString: state_toString });
                        //Log.debug("&nbsp;&nbsp;<" + e.vStart.name + ", " + e.vEnd.name + ">: " + (p.w + e.timeRequired[pref.time_name]));
                        //Log.debug("&nbsp;&nbsp;&nbsp;heap: " + q);
                    }
                }
            }
        }
        //return undefined;
    }

    return {
        "findShortestPath":findShortestPath,
        "findShortestPathWithIdSet":findShortestPathWithIdSet
    }

})();
