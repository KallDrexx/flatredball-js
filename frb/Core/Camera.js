var frb;
(function (frb) {
    var Camera = (function () {
        function Camera() {
            this.x = 0;
            this.y = 0;
        }
        Camera.prototype.start = function () {
            frb.context.save();
            frb.context.translate((0 - this.x) + frb.graphics.width / 2, this.y + frb.graphics.height / 2);
        };
        Camera.prototype.end = function () {
            frb.context.restore();
        };
        return Camera;
    })();
    frb.Camera = Camera;    
})(frb || (frb = {}));
