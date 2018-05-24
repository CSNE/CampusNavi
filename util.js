var Util = (function () {
    function humanReadableTime(seconds) {
        var min = Math.floor(seconds / 60);
        var sec = Math.round(seconds % 60);
        return "" + min + "min" + sec + "sec.";
    }

    return {
        "humanReadableTime": humanReadableTime
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
