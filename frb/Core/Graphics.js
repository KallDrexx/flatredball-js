var frb;
(function (frb) {
    var Graphics = (function () {
        function Graphics(width, height) {
            this.width = width;
            this.height = height;
        }
        return Graphics;
    })();
    frb.Graphics = Graphics;    
})(frb || (frb = {}));
