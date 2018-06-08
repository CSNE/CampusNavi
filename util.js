var Util = (function () {
    function humanReadableTime(seconds) {
        var min = Math.floor(seconds / 60);
        var sec = Math.round(seconds % 60);
        return "" + min + "min" + sec + "sec.";
    }
    function timeStampToFormattedTime(timestamp){
        var d=new Date(timestamp);
        
        var h=""+d.getHours();
        var m=""+d.getMinutes();
        var s=""+d.getSeconds();
        
        while (h.length<2) h="0"+h;
        while (m.length<2) m="0"+m;
        while (s.length<2) s="0"+s;
        
        return h+":"+m+":"+s;
    }

    function colonSeparatedTimeToTimeStamp(timeinday)
    {
        var h = parseInt(timeinday.split(":")[0]);
        var m = parseInt(timeinday.split(":")[1]);

        if (Number.isInteger(m) && Number.isInteger(h)) {
            var date = new Date();
            date.setHours(h);
            date.setMinutes(m);
            date.setSeconds(0);
        } else {
            var date = null;
        }

        var ret = Number.MAX_SAFE_INTEGER;
        if (date) ret = date.getTime();

        return ret;
    }
    
    //https://dracoblue.net/dev/linear-least-squares-in-javascript/
    function findLineByLeastSquares(values_x, values_y) {
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var count = 0;

        /*
        * We'll use those variables for faster read/write access.
        */
        var x = 0;
        var y = 0;
        var values_length = values_x.length;

        if (values_length != values_y.length) {
            throw new Error('The parameters values_x and values_y need to have same size!');
        }

        /*
        * Nothing to do.
        */
        if (values_length === 0) {
            return [ [], [] ];
        }

        /*
        * Calculate the sum for each of the parts necessary.
        */
        for (var v = 0; v < values_length; v++) {
            x = values_x[v];
            y = values_y[v];
            sum_x += x;
            sum_y += y;
            sum_xx += x*x;
            sum_xy += x*y;
            count++;
        }

        /*
        * Calculate m and b for the formular:
        * y = x * m + b
        */
        var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
        var b = (sum_y/count) - (m*sum_x)/count;
        
        return [m,b];
        
        /*
        * We will make the x and y result line now
        */
        var result_values_x = [];
        var result_values_y = [];

        for (var v = 0; v < values_length; v++) {
            x = values_x[v];
            y = x * m + b;
            result_values_x.push(x);
            result_values_y.push(y);
        }

        return [result_values_x, result_values_y];
    }
    
    function fitLine(points){
        //points=[[x,y],...]
        //returns {"a": _, "b": _};
        var xs=[];
        var ys=[];
        for(var i=0;i<points.length;i++){
            xs.push(points[i][0]);
            ys.push(points[i][1]);
        }
        var res=findLineByLeastSquares(xs,ys);
        return {"a":res[0],"b":res[1]};
    }


    function getBuilding(cr)
    {
        for (var i = 0; i < cr.length; i++)
        {
            var c = cr.charAt(i);
            if (c >= '0' && c <= '9')
                return cr.substring(0, i);
        }
        return cr;
    }

    return {
        "humanReadableTime": humanReadableTime,
        "timeStampToFormattedTime": timeStampToFormattedTime,
        "colonSeparatedTimeToTimeStamp": colonSeparatedTimeToTimeStamp,
        "getBuilding": getBuilding,
        "fitLine":fitLine
    }
})();

function List() {
    this.h = {};
    this.h.next = this.h;
    this.h.prev = this.h;
    this.h.isHeader = true;

    this.add = function (e) {
        var ret = { v: e, next: this.h, prev: this.h.prev };
        this.h.prev.next = ret;
        this.h.prev = ret;
        return ret;
    }

    this.remove = function (n) {
        if (n.prev && n.next)//static
        {
            n.prev.next = n.next;
            n.next.prev = n.prev;
        }
        else {
            for (var i = this.iterator() ; !i.end() ; i.next()) {
                if (i.get() == n) {
                    i.remove();
                    break;
                }
            }
        }
    }

    function Iterator(l) {
        this.p = l.h.next;

        this.end = function () {
            return this.p.isHeader;
        }

        this.next = function () {
            this.p = this.p.next;
        }

        this.get = function () {
            return this.p.v;
        }

        this.remove = function () {
            this.p.prev.next = this.p.next;
            this.p.next.prev = this.p.prev;
        }
    }

    this.iterator = function () {
        return new Iterator(this);
    }
}
