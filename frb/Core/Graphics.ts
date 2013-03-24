module frb {
    export class Graphics {
        width: number;
        height: number;
        fps: number;

        constructor(width: number, height: number) {
            this.width = width;
            this.height = height;
        }
    }
}