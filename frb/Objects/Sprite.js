var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var frb;
(function (frb) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(name, img, x, y) {
                _super.call(this);
            this.name = name;
            this.img = img;
            this.width = img.width;
            this.height = img.height;
            this.initialize(this);
            this.x = x;
            this.y = y;
            this.alpha = 1;
            var sprite = this;
            sprite.width = img.width;
            sprite.height = img.height;
        }
        Sprite.prototype.draw = function () {
            frb.context.save();
            frb.context.translate(this.xTarget, this.yTarget);
            frb.context.rotate(this.zRotation);
            frb.context.globalAlpha = this.alpha;
            if(!this.textureCoordinate) {
                frb.context.drawImage(this.img, this.width / -2, this.height / -2);
            } else {
                var srcX = this.width * this.textureCoordinate.left;
                var srcY = this.height * this.textureCoordinate.top;
                var srcW = (this.width * this.textureCoordinate.right) - srcX;
                var srcH = (this.height * this.textureCoordinate.bottom) - srcY;
                frb.context.drawImage(this.img, 0, 0, srcW, srcH, srcW / -2, srcH / -2, srcW, srcH);
            }
            frb.context.restore();
        };
        Sprite.prototype.update = function () {
            _super.prototype.update.call(this);
            this.updateControlValues(this);
            this.updatePositionResults(this);
            this.xTarget = this.x;
            this.yTarget = frb.MathHelper.invert(this.y);
            this.alpha = frb.MathHelper.clamp(this.alpha, 0, 1);
        };
        Sprite.prototype.addTextureCoordinate = function (left, right, top, bottom) {
            this.textureCoordinate = new frb.TextureCoordinate();
            this.textureCoordinate.left = left;
            this.textureCoordinate.right = right;
            this.textureCoordinate.top = top;
            this.textureCoordinate.bottom = bottom;
        };
        return Sprite;
    })(frb.PositionedObject);
    frb.Sprite = Sprite;    
})(frb || (frb = {}));
