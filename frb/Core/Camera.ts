/// <reference path="../references.ts" />

module frb {
    export class Camera {
        x: number = 0;
        y: number = 0;

        start() {
            context.save();
            context.translate((0 - this.x) + graphics.width / 2, this.y + graphics.height / 2);
        }

        end(): void {
            context.restore();
        }
    }
}