/// <reference path="../Input/Mouse.ts" />
/// <reference path="../Input/Keyboard.ts" />

module frb {
    export class InputManager {
        mouse: Mouse = new Mouse();
        keyboard: Keyboard = new Keyboard();

        update(): void {
            // update the mouse's world coordinates
            var left = spriteManager.camera.x - (graphics.width / 2);
            var top = MathHelper.invert(spriteManager.camera.y) - (graphics.height / 2);
            this.mouse.worldX = left + this.mouse.x;
            this.mouse.worldY = MathHelper.invert(top + this.mouse.y);
        }
    }
}