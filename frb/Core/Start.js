var frb;
(function (frb) {
    var FrbOptions = (function () {
        function FrbOptions() { }
        return FrbOptions;
    })();
    frb.FrbOptions = FrbOptions;    
    function start(options) {
        function coreUpdate() {
            frb.timeManager.update();
            frb.inputManager.update();
            if(!frb.pause) {
                if(options.update) {
                    options.update();
                }
                frb.spriteManager.update();
            }
        }
        function coreDraw() {
            frb.context.fillStyle = "#6495ED";
            frb.context.fillRect(0, 0, frb.graphics.width, frb.graphics.height);
            frb.spriteManager.draw();
            if(options.draw) {
                options.draw();
            }
        }
        if(options.canvas) {
            if(jQuery && options.canvas instanceof jQuery) {
                frb.context = options.canvas.getContext("2d");
                frb.graphics = new frb.Graphics(options.canvas.width, options.canvas.height);
            } else {
                frb.context = options.canvas.getContext("2d");
                frb.graphics = new frb.Graphics(options.canvas.width, options.canvas.height);
            }
        } else if(document.getElementsByTagName("canvas").length > 0) {
            var canvasElement = document.getElementsByTagName("canvas").item(0);
            options.canvas = canvasElement;
            frb.context = canvasElement.getContext("2d");
            frb.graphics = new frb.Graphics(canvasElement.width, canvasElement.height);
        } else {
            frb.graphics = new frb.Graphics(480, 320);
            var canvasElement = document.createElement("canvas");
            canvasElement.width = frb.graphics.width;
            canvasElement.height = frb.graphics.height;
            var body = document.getElementsByTagName("body").item(0);
            body.appendChild(canvasElement);
            options.canvas = canvasElement;
            frb.context = canvasElement.getContext("2d");
        }
        if(!frb.graphics.fps) {
            frb.graphics.fps = 60;
        }
        if($) {
            $(function () {
                $(options.canvas).mouseenter(function () {
                    frb.inputManager.mouse.onCanvas = true;
                });
                $(options.canvas).mouseleave(function () {
                    frb.inputManager.mouse.onCanvas = false;
                });
                $(options.canvas).mousemove(function (e) {
                    var relativeXPosition = e.pageX - this.offsetLeft;
                    var relativeYPosition = e.pageY - this.offsetTop;
                    frb.inputManager.mouse.x = relativeXPosition;
                    frb.inputManager.mouse.y = relativeYPosition;
                });
                $(options.canvas).mousedown(function (e) {
                    if(e.which === 1) {
                        frb.inputManager.mouse.leftButton = true;
                    }
                    if(e.which === 3) {
                        frb.inputManager.mouse.rightButton = true;
                    }
                    if(e.which === 2) {
                        frb.inputManager.mouse.middleButton = true;
                    }
                });
                $(options.canvas).mouseup(function (e) {
                    if(e.which === 1) {
                        frb.inputManager.mouse.leftButton = false;
                    }
                    if(e.which === 3) {
                        frb.inputManager.mouse.rightButton = false;
                    }
                    if(e.which === 2) {
                        frb.inputManager.mouse.middleButton = false;
                    }
                });
                $(document).keydown(function (e) {
                    frb.inputManager.keyboard.pressed[e.which] = true;
                    if(frb.keys["Space"] === e.which) {
                        e.preventDefault();
                    }
                });
                $(document).keyup(function (e) {
                    frb.inputManager.keyboard.pressed[e.which] = false;
                });
            });
        }
        (function () {
            if(options.init) {
                options.init();
            }
            if(Worker) {
                var worker = new Worker('frb-thread.js');
                worker.addEventListener('message', function (e) {
                    coreUpdate();
                    coreDraw();
                }, false);
                worker.postMessage(frb.graphics);
            } else {
                setInterval(function () {
                    coreUpdate();
                    coreDraw();
                }, 1000 / frb.graphics.fps);
            }
        })();
    }
    frb.start = start;
})(frb || (frb = {}));
