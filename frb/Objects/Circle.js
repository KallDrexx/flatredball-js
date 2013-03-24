var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var frb;
(function (frb) {
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(x, y, radius) {
                _super.call(this);
            this.radius = radius;
            this.width = radius * 2;
            this.height = this.width;
            this.initialize(this);
            this.x = x;
            this.y = y;
            this.alpha = 1;
            this.color = "yellow";
            this.borderColor = "red";
            this.borderWidth = 1;
        }
        Circle.prototype.draw = function () {
            frb.context.save();
            frb.context.translate(this.xTarget, this.yTarget);
            frb.context.rotate(this.zRotation);
            frb.context.globalAlpha = this.alpha;
            frb.context.beginPath();
            frb.context.arc(this.x, this.y, this.radius, 0, frb.MathHelper.twoPi, false);
            frb.context.fillStyle = this.color;
            frb.context.fill();
            frb.context.lineWidth = this.borderWidth;
            frb.context.strokeStyle = this.borderColor;
            frb.context.stroke();
            frb.context.restore();
        };
        Circle.prototype.update = function () {
            _super.prototype.update.call(this);
            this.updateControlValues(this);
            this.updatePositionResults(this);
            this.xTarget = this.x;
            this.yTarget = frb.MathHelper.invert(this.y);
            this.alpha = frb.MathHelper.clamp(this.alpha, 0, 1);
        };
        return Circle;
    })(frb.PositionedObject);
    frb.Circle = Circle;    
})(frb || (frb = {}));
