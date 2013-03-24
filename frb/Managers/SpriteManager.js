var frb;
(function (frb) {
    var SpriteManager = (function () {
        function SpriteManager() {
            this.camera = new frb.Camera();
            this.images = {
            };
            this.sprites = [];
        }
        SpriteManager.prototype.add = function (name) {
            var path = name;
            if(name.indexOf("http") < 0) {
                path = "content/" + name;
                if(path.indexOf(".") < 0) {
                    path += ".png";
                }
            }
            var img;
            if(name in this.images) {
                img = this.images[name];
            } else {
                img = new Image();
                img.src = path;
                img.loadEvents = new Array();
                img.onload = function () {
                    for(var i = 0; i < img.loadEvents.length; i++) {
                        img.loadEvents[i]();
                    }
                };
                this.images[name] = img;
            }
            var sprite = new frb.Sprite(name, img, 0, 0);
            this.sprites.push(sprite);
            return sprite;
        };
        SpriteManager.prototype.addCircle = function (radius) {
            var circle = new frb.Circle(0, 0, radius);
            this.sprites.push(circle);
            return circle;
        };
        SpriteManager.prototype.update = function () {
            for(var i = 0; i < this.sprites.length; i++) {
                var sprite = this.sprites[i];
                sprite.update();
            }
        };
        SpriteManager.prototype.draw = function () {
            this.camera.start();
            for(var i = 0; i < this.sprites.length; i++) {
                var sprite = this.sprites[i];
                sprite.draw();
            }
            this.camera.end();
        };
        return SpriteManager;
    })();
    frb.SpriteManager = SpriteManager;    
})(frb || (frb = {}));
