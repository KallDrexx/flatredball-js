var frb;
(function (frb) {
    var TimeManager = (function () {
        function TimeManager() {
            this.start = new Date();
            this.last = new Date();
            this.secondDifference = 0;
            this.secondDifferenceFromStart = 0;
        }
        TimeManager.prototype.update = function () {
            var startMilli = this.start.getTime();
            var lastMilli = this.last.getTime();
            this.last = new Date();
            var nowMilli = this.last.getTime();
            var diff = nowMilli - lastMilli;
            var startDiff = nowMilli - startMilli;
            this.secondDifference = diff / 1000;
            this.secondDifferenceFromStart = startDiff / 1000;
        };
        return TimeManager;
    })();
    frb.TimeManager = TimeManager;    
})(frb || (frb = {}));
