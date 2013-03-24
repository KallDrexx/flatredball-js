/// <reference path="../references.ts" />

module frb {

    export class FrbOptions {
        canvas: HTMLCanvasElement;
        draw: Function;
        update: Function;
        init: Function;
    }

    export function start(options: FrbOptions): void {
        function coreUpdate() {
            timeManager.update();
            inputManager.update();

            if (!pause) {
                if (options.update) options.update();
                spriteManager.update();

            }
        }

        function coreDraw() {
            context.fillStyle = "#6495ED";
            context.fillRect(0, 0, graphics.width, graphics.height);

            spriteManager.draw();

            if (options.draw) options.draw();
        }

        // initialize the canvas

        // create the canvas, if necessary
        if (options.canvas) {
            if (jQuery && options.canvas instanceof jQuery) {
                context = options.canvas.getContext("2d");
                graphics = new Graphics(options.canvas.width, options.canvas.height);
            }
            else {
                context = options.canvas.getContext("2d");
                graphics = new Graphics(options.canvas.width, options.canvas.height);
            }
        }
        else if (document.getElementsByTagName("canvas").length > 0) {
            var canvasElement = <HTMLCanvasElement> document.getElementsByTagName("canvas").item(0);
            options.canvas = canvasElement;
            context = canvasElement.getContext("2d");
            graphics = new Graphics(canvasElement.width, canvasElement.height);
        }
        else {
            graphics = new Graphics(480, 320);

            var canvasElement = <HTMLCanvasElement> document.createElement("canvas");
            canvasElement.width = graphics.width;
            canvasElement.height = graphics.height;
            var body = document.getElementsByTagName("body").item(0);

            body.appendChild(canvasElement);

            options.canvas = canvasElement;
            context = canvasElement.getContext("2d");
        }

        if (!graphics.fps) graphics.fps = 60;

        // if the user is using jQuery, start tracking input
        if ($) {
            $(function () {
                // mouse events
                $(options.canvas).mouseenter(function () {
                    inputManager.mouse.onCanvas = true;
                });
                $(options.canvas).mouseleave(function () {
                    inputManager.mouse.onCanvas = false;
                });
                $(options.canvas).mousemove(function (e) {
                    var relativeXPosition = e.pageX - this.offsetLeft;
                    var relativeYPosition = e.pageY - this.offsetTop;
                    inputManager.mouse.x = relativeXPosition;
                    inputManager.mouse.y = relativeYPosition;
                });
                $(options.canvas).mousedown(function (e) {
                    if (e.which === 1) inputManager.mouse.leftButton = true;
                    if (e.which === 3) inputManager.mouse.rightButton = true;
                    if (e.which === 2) inputManager.mouse.middleButton = true;
                });
                $(options.canvas).mouseup(function (e) {
                    if (e.which === 1) inputManager.mouse.leftButton = false;
                    if (e.which === 3) inputManager.mouse.rightButton = false;
                    if (e.which === 2) inputManager.mouse.middleButton = false;
                });

                // keyboard events
                $(document).keydown(function (e) {
                    inputManager.keyboard.pressed[e.which] = true;

                    if (keys["Space"] === e.which) {
                        e.preventDefault();
                    }
                });
                $(document).keyup(function (e) {
                    inputManager.keyboard.pressed[e.which] = false;
                });
            });
        }

        (function () {
            // run the user's initialization code
            if (options.init) options.init();

            // set up the game loop
            if (Worker) {
                // we have workers, let the worker drive the loop
                var worker = new Worker('frb-thread.js');

                worker.addEventListener('message', function (e) {
                    coreUpdate();
                    coreDraw();
                }, false);

                worker.postMessage(graphics);
            }
            else {
                // no workers
                //alert ('cry');

                setInterval(function () {
                    coreUpdate();
                    coreDraw();
                }, 1000 / graphics.fps);

            }
        })();
    }
}