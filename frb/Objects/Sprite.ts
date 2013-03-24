/// <reference path="../references.ts" />

module frb {
    export class Sprite extends PositionedObject {
        name: string;
        img: HTMLImageElement;
        width: number;
        height; number;
        alpha: number;
        textureCoordinate: TextureCoordinate;

        constructor(name: string, img: HTMLImageElement, x: number, y: number) {
            super();
            this.name = name;
            this.img = img;
            this.width = img.width;
            this.height = img.height;
            this.initialize(this);

            this.x = x;
            this.y = y;

            this.alpha = 1;

            // now handle delayed loading
            var sprite = this;
            //img.loadEvents.push(function () {
            sprite.width = img.width;
            sprite.height = img.height;
            //});
        }

        draw(): void {
            context.save();
            context.translate(this.xTarget, this.yTarget);

            context.rotate(this.zRotation);

            context.globalAlpha = this.alpha;

            if (!this.textureCoordinate) {
                context.drawImage(this.img, this.width / -2, this.height / -2);
            }
            else {
                // this is a sprite sheet
                var srcX = this.width * this.textureCoordinate.left;
                var srcY = this.height * this.textureCoordinate.top;
                var srcW = (this.width * this.textureCoordinate.right) - srcX;
                var srcH = (this.height * this.textureCoordinate.bottom) - srcY;

                context.drawImage(this.img, 0, 0, srcW, srcH, srcW / -2, srcH / -2, srcW, srcH);
            }

            context.restore();
        }

        update(): void {
            super.update();
            this.updateControlValues(this);
            this.updatePositionResults(this);

            this.xTarget = this.x;
            this.yTarget = MathHelper.invert(this.y);

            this.alpha = MathHelper.clamp(this.alpha, 0, 1);
        }

        addTextureCoordinate(left: number, right: number, top: number, bottom: number): void {
            this.textureCoordinate = new TextureCoordinate();
            this.textureCoordinate.left = left;
            this.textureCoordinate.right = right;
            this.textureCoordinate.top = top;
            this.textureCoordinate.bottom = bottom;
        }
    }
}