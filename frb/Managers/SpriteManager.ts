/// <reference path="../references.ts" />

module frb {
    export class SpriteManager {
        camera: Camera = new Camera();
        images: { [name: string]: HTMLImageElement; } = {};
        sprites: PositionedObject[] = [];

        add(name: string): Sprite {
            var path = name;

            // handle the case where we want a static URL
            if (name.indexOf("http") < 0) {
                path = "content/" + name;

                if (path.indexOf(".") < 0) path += ".png";
            }

            // now initialize the image
            var img;
            if (name in this.images) {
                img = this.images[name];
            }
            else {
                img = new Image();
                img.src = path;
                img.loadEvents = new Array();
                img.onload = function () {
                    for (var i = 0; i < img.loadEvents.length; i++) {
                        img.loadEvents[i]();
                    }
                };
                this.images[name] = img;
            }

            // now create the sprite
            var sprite = new Sprite(name, img, 0, 0);
            this.sprites.push(sprite);

            return sprite;
        }

        addCircle(radius: number): Circle {
            var circle = new Circle(0, 0, radius);
            this.sprites.push(circle);

            return circle;
        }

        update(): void {
            for (var i = 0; i < this.sprites.length; i++) {
                var sprite = this.sprites[i];
                sprite.update();
            }
        }

        draw(): void {
            this.camera.start();
            for (var i = 0; i < this.sprites.length; i++) {
                var sprite = this.sprites[i];
                sprite.draw();
            }
            this.camera.end();
        }
    }
}