var frb;
(function (frb) {
    var InputManager = (function () {
        function InputManager() {
            this.mouse = new frb.Mouse();
            this.keyboard = new frb.Keyboard();
        }
        InputManager.prototype.update = function () {
            var left = frb.spriteManager.camera.x - (frb.graphics.width / 2);
            var top = frb.MathHelper.invert(frb.spriteManager.camera.y) - (frb.graphics.height / 2);
            this.mouse.worldX = left + this.mouse.x;
            this.mouse.worldY = frb.MathHelper.invert(top + this.mouse.y);
        };
        return InputManager;
    })();
    frb.InputManager = InputManager;    
})(frb || (frb = {}));
