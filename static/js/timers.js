//管理多个处理程序的中央定时器控制 8.4.html
var timers = {

    timersID: 0,

    timers: [],

    add: function (fn) {
        this.timers.push(fn);
    },

    start: function () {
        if (this.timersID) return;
        (function runNext() {
            if (timers.timers.length > 0) {
                for (var i = 0; i < timers.timers.length; i++) {
                    if (timers.timers[i]() === false) {
                        timers.timers.splice(i, 1);
                        i++;
                    };
                };

                timers.timersID = setTimeout(runNext, 0);
            };
        })();
    },

    stop: function () {
        clearTimeout(this.timersID);
        this.timersID = 0;
    }
};