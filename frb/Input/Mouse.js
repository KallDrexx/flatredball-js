var frb;
(function (frb) {
    var Mouse = (function () {
        function Mouse() {
            this.x = 0;
            this.y = 0;
            this.worldX = 0;
            this.worldY = 0;
            this.leftButton = false;
            this.rightButton = false;
            this.middleButton = false;
            this.onCanvas = false;
        }
        return Mouse;
    })();
    frb.Mouse = Mouse;    
})(frb || (frb = {}));
