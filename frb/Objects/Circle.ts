/// <reference path="../references.ts" />

module frb {
    export class Circle extends PositionedObject {
        radius: number;
        width: number;
        height: number;
        alpha: number;
        color: string;
        borderColor: string;
        borderWidth: number;

        constructor(x: number, y: number, radius: number) {
            super();
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

        draw(): void {
            context.save();
            context.translate(this.xTarget, this.yTarget);

            context.rotate(this.zRotation);

            context.globalAlpha = this.alpha;

            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, MathHelper.twoPi, false);

            context.fillStyle = this.color;
            context.fill();
            context.lineWidth = this.borderWidth;
            context.strokeStyle = this.borderColor;
            context.stroke();

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
    }
}