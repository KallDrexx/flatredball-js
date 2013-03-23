/// <reference path="definitions/jquery.d.ts" />

class MathHelper {
    static e: number = Math.E;
    static log10E: number = 0.4342945;
    static log2E: number = 1.442695;
    static pi: number = Math.PI;
    static piOver2: number = (Math.PI / 2.0);
    static piOver4: number = (Math.PI / 4.0);
    static twoPi: number = (Math.PI * 2.0);

    static invert(value: number): number {
        return 0 - value;
    }

    static clamp(value: number, min: number, max: number): number {
        if (value < min)
            return min;
        
        if (value > max)
            return max;

        return value;
    }

    static lerp(value1: number, value2: number, amount: number): number {
        return value1 + (value2 - value1) * amount;
    }

    static toDegrees(radians: number): number {
        return radians * 57.295779513082320876798154814105;
    }

    static toRadians(degrees: number): number {
        return degrees * 0.017453292519943295769236907684886;
    }
}

/***********************
    Framework
***********************/
class AttachableList {
    list: PositionedObject[];
    length: number;

    constructor() {
        this.list = [];
        this.length = 0;
    }

    get(index: number): PositionedObject {
        return this.list[index];
    }

    contains(value: PositionedObject): bool {
        return this.list.indexOf(value) >= 0;
    }

    add(value: PositionedObject): void {
        if (!this.contains(value)) {
            this.list.push(value);
            this.length = this.list.length;

            if (!value.listsBelongingTo) value.listsBelongingTo = new Array();
            value.listsBelongingTo.push(this);
        }
    }

    push(value: PositionedObject): void {
        this.add(value);
    }

    pop(): PositionedObject {
        if (this.length <= 0) throw "no more items to pop";

        var item = this.get(this.length - 1);
        this.remove(item);
        return item;
    }

    remove(value: PositionedObject): void {
        var index = this.list.indexOf(value);

        if (index >= 0) {
            this.list.splice(index, 1);
            this.length = this.list.length;

            if (value.listsBelongingTo) {
                var listIndex = value.listsBelongingTo.indexOf(this);
                if (listIndex >= 0) {
                    value.listsBelongingTo.splice(listIndex, 1);
                }
            }
        }
    }

    removeFromAll(value: PositionedObject): void {
        if (value.listsBelongingTo) {
            var numLists = value.listsBelongingTo.length;
            for (var i = 0; i < numLists; i++) {
                value.listsBelongingTo[i].remove(value);
            }
        }
    }
}

class ResourcePool {
    active: AttachableList;
    available: AttachableList;

    constructor() {
        this.active = new AttachableList();
        this.available = new AttachableList();
    }

    add(factory: Function): PositionedObject {
        var newItem = null;

        // now check and see if we can use a recycled item
        if (this.available.length > 0) {
            newItem = this.available.pop();
        }

        if (newItem === null) {
            // no recycled item available, make a new one
            newItem = factory();
        }

        this.active.add(newItem);
        return newItem;
    }

    return (item: any): void {
        this.active.remove(item);
        this.available.add(item);
    }
}

class TimeManager {
    start: Date = new Date();
    last: Date = new Date();
    secondDifference: number = 0;
    secondDifferenceFromStart: number = 0;

    update(): void {
        var startMilli = this.start.getTime();
        var lastMilli = this.last.getTime();
        this.last = new Date();
        var nowMilli = this.last.getTime();
        var diff = nowMilli - lastMilli;
        var startDiff = nowMilli - startMilli;
        this.secondDifference = diff / 1000;
        this.secondDifferenceFromStart = startDiff / 1000;
    }
}

class PositionedObject {
    x: number = 0;
    y: number = 0;
    xVelocity: number = 0;
    yVelocity: number = 0;
    xTarget: number = 0;
    yTarget: number = 0;
    xAcceleration: number = 0;
    yAcceleration: number = 0;
    zRotation: number = 0;
    zRotationAcceleration: number = 0;
    zRotationVelocity: number = 0;
    listsBelongingTo: any[] = [];

    update(): void {
        var diff = frb.timeManager.secondDifference;

        this.x += this.xVelocity * diff + this.xAcceleration * diff;
        this.y += this.yVelocity * diff + this.yAcceleration * diff;
        this.xVelocity += this.xAcceleration * diff;
        this.yVelocity += this.yAcceleration * diff;

        this.zRotation += this.zRotationVelocity * diff + this.zRotationAcceleration * diff;
        this.zRotationVelocity += this.zRotationAcceleration * diff;
    }

    draw(): void {
    }

    initialize(target: PositionedObject): void {
        this.updatePositionResults(target);
        target.listsBelongingTo = this.listsBelongingTo;
        target.removeSelfFromListsBelongingTo = this.removeSelfFromListsBelongingTo;
    }

    updatePositionResults(target: PositionedObject): void {
        target.x = this.x;
        target.y = this.y;
        target.xVelocity = this.xVelocity;
        target.yVelocity = this.yVelocity;
        target.xAcceleration = this.xAcceleration;
        target.yAcceleration = this.yAcceleration;
        target.zRotation = this.zRotation;
        target.zRotationAcceleration = this.zRotationAcceleration;
        target.zRotationVelocity = this.zRotationVelocity;
    }

    updateControlValues(source: PositionedObject): void {
        this.x = source.x;
        this.y = source.y;
        this.xVelocity = source.xVelocity;
        this.yVelocity = source.yVelocity;
        this.xAcceleration = source.xAcceleration;
        this.yAcceleration = source.yAcceleration;
        this.zRotation = source.zRotation;
        this.zRotationVelocity = source.zRotationVelocity;
        this.zRotationAcceleration = source.zRotationAcceleration;
    }

    removeSelfFromListsBelongingTo(): void {
        frb.attachableList.removeFromAll(this);
    }
}

class Camera {
    x: number = 0;
    y: number = 0;

    start() {
        frb.context.save();
        frb.context.translate((0 - this.x) + frb.graphics.width / 2, this.y + frb.graphics.height / 2);
    }

    end(): void {
        frb.context.restore();
    }
}

class Mouse {
    x: number = 0;
    y: number = 0;
    worldX: number = 0;
    worldY: number = 0;
    leftButton: bool = false;
    rightButton: bool = false;
    middleButton: bool = false;
    onCanvas: bool = false;
}

class Keyboard {
    pressed: bool[] = [];
    chars: { [index: string]: string; } = {
        8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt", 19: "PauseBreak",
        20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home",
        37: "Left", 38: "Up", 39: "Right", 40: "Down", 45: "Insert", 46: "Delete", 48: "0", 49: "1",
        50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 65: "A", 66: "B",
        67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L",
        77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V",
        87: "W", 88: "X", 89: "Y", 90: "Z", 91: "Windows", 93: "RightClick", 96: "Num0", 97: "Num1",
        98: "Num2", 99: "Num3", 100: "Num4", 101: "Num5", 102: "Num6", 103: "Num7", 104: "Num8",
        105: "Num9", 106: "Num*", 107: "Num+", 109: "Num-", 110: "Num.", 111: "Num/", 112: "F1",
        113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9",
        121: "F10", 122: "F11", 123: "F12", 144: "NumLock", 145: "ScrollLock", 182: "MyComputer",
        183: "MyCalculator", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`",
        219: "[", 220: "\\", 221: "]", 222: "'"
    };

    keyDown(key: string): bool {
        return this.pressed[frb.keys[key]] === true;
    }
}

class SpriteManager {
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

class InputManager {
    mouse: Mouse = new Mouse();
    keyboard: Keyboard = new Keyboard();

    update(): void {
        // update the mouse's world coordinates
        var left = frb.spriteManager.camera.x - (frb.graphics.width / 2);
        var top = MathHelper.invert(frb.spriteManager.camera.y) - (frb.graphics.height / 2);
        this.mouse.worldX = left + this.mouse.x;
        this.mouse.worldY = MathHelper.invert(top + this.mouse.y);
    }
}

class Circle extends PositionedObject {
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
        frb.context.save();
        frb.context.translate(this.xTarget, this.yTarget);

        frb.context.rotate(this.zRotation);

        frb.context.globalAlpha = this.alpha;

        frb.context.beginPath();
        frb.context.arc(this.x, this.y, this.radius, 0, MathHelper.twoPi, false);

        frb.context.fillStyle = this.color;
        frb.context.fill();
        frb.context.lineWidth = this.borderWidth;
        frb.context.strokeStyle = this.borderColor;
        frb.context.stroke();

        frb.context.restore();
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

class TextureCoordinate {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

class Sprite extends PositionedObject {
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
        frb.context.save();
        frb.context.translate(this.xTarget, this.yTarget);

        frb.context.rotate(this.zRotation);

        frb.context.globalAlpha = this.alpha;

        if (!this.textureCoordinate) {
            frb.context.drawImage(this.img, this.width / -2, this.height / -2);
        }
        else {
            // this is a sprite sheet
            var srcX = this.width * this.textureCoordinate.left;
            var srcY = this.height * this.textureCoordinate.top;
            var srcW = (this.width * this.textureCoordinate.right) - srcX;
            var srcH = (this.height * this.textureCoordinate.bottom) - srcY;

            frb.context.drawImage(this.img, 0, 0, srcW, srcH, srcW / -2, srcH / -2, srcW, srcH);
        }

        frb.context.restore();
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

class Graphics {
    width: number;
    height: number;
    fps: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

/***********************
    Game initialization
***********************/

class FrbOptions {
    canvas: HTMLCanvasElement;
    draw: Function;
    update: Function;
    init: Function;
}

class frb {
    static pause: bool = false;
    static attachableList: AttachableList = new AttachableList();
    static spriteManager: SpriteManager = new SpriteManager();
    static inputManager: InputManager = new InputManager();
    static timeManager: TimeManager = new TimeManager();
    static context: CanvasRenderingContext2D;
    static graphics: Graphics;
    static keys: { [name: string]: number; } = { 
        "Backspace": 8, "Tab": 9, "Enter": 13, "Shift": 16, "Ctrl": 17, "Alt": 18, "PauseBreak": 19, 
        "CapsLock": 20, "Esc": 27, "Space": 32, "PageUp": 33, "PageDown": 34, "End": 35, "Home": 36, 
        "Left": 37, "Up": 38, "Right": 39, "Down": 40, "Insert": 45, "Delete": 46, "0": 48, "1": 49,
        "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57, "A": 65, "B": 66, 
        "C": 67, "D": 68, "E": 69, "F": 70, "G": 71, "H": 72, "I": 73, "J": 74, "K": 75, "L": 76, 
        "M": 77, "N": 78, "O": 79, "P": 80, "Q": 81, "R": 82, "S": 83, "T": 84, "U": 85, "V": 86, 
        "W": 87, "X": 88, "Y": 89, "Z": 90, "Windows": 91, "RightClick": 93, "Num0": 96, "Num1": 97, 
        "Num2": 98, "Num3": 99, "Num4": 100, "Num5": 101, "Num6": 102, "Num7": 103, "Num8": 104, 
        "Num9": 105, "Num*": 106, "Num+": 107, "Num-": 109, "Num.": 110, "Num/": 111, "F1": 112, 
        "F2": 113, "F3": 114, "F4": 115, "F5": 116, "F6": 117, "F7": 118, "F8": 119, "F9": 120, 
        "F10": 121, "F11": 122, "F12": 123, "NumLock": 144, "ScrollLock": 145, "MyComputer": 182, 
        "MyCalculator": 183, ";": 186, "=": 187, ",": 188, "-": 189, ".": 190, "/": 191, "`": 192, 
        "[": 219, "\\": 220, "]": 221, "'": 222
    };

    static start(options: FrbOptions): void {
        function coreUpdate() {
            frb.timeManager.update();
            frb.inputManager.update();

            if (!frb.pause) {
                if (options.update) options.update();
                frb.spriteManager.update();

            }
        }

        function coreDraw() {
            frb.context.fillStyle = "#6495ED";
            frb.context.fillRect(0, 0, frb.graphics.width, frb.graphics.height);

            frb.spriteManager.draw();

            if (options.draw) options.draw();
        }

        // initialize the canvas

        // create the canvas, if necessary
        if (options.canvas) {
            if (jQuery && options.canvas instanceof jQuery) {
                frb.context = options.canvas.getContext("2d");
                frb.graphics = new Graphics(options.canvas.width, options.canvas.height);
            }
            else {
                frb.context = options.canvas.getContext("2d");
                frb.graphics = new Graphics(options.canvas.width, options.canvas.height);
            }
        }
        else if (document.getElementsByTagName("canvas").length > 0) {
            var canvasElement = <HTMLCanvasElement> document.getElementsByTagName("canvas").item(0);
            options.canvas = canvasElement;
            frb.context = canvasElement.getContext("2d");
            frb.graphics = new Graphics(canvasElement.width, canvasElement.height);
        }
        else {
            frb.graphics = new Graphics(480, 320);

            var canvasElement = <HTMLCanvasElement> document.createElement("canvas");
            canvasElement.width = frb.graphics.width;
            canvasElement.height = frb.graphics.height;
            var body = document.getElementsByTagName("body").item(0);

            body.appendChild(canvasElement);

            options.canvas = canvasElement;
            frb.context = canvasElement.getContext("2d");
        }

        if (!frb.graphics.fps) frb.graphics.fps = 60;

        // if the user is using jQuery, start tracking input
        if ($) {
            $(function () {
                // mouse events
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
                    if (e.which === 1) frb.inputManager.mouse.leftButton = true;
                    if (e.which === 3) frb.inputManager.mouse.rightButton = true;
                    if (e.which === 2) frb.inputManager.mouse.middleButton = true;
                });
                $(options.canvas).mouseup(function (e) {
                    if (e.which === 1) frb.inputManager.mouse.leftButton = false;
                    if (e.which === 3) frb.inputManager.mouse.rightButton = false;
                    if (e.which === 2) frb.inputManager.mouse.middleButton = false;
                });

                // keyboard events
                $(document).keydown(function (e) {
                    frb.inputManager.keyboard.pressed[e.which] = true;

                    if (frb.keys["Space"] === e.which) {
                        e.preventDefault();
                    }
                });
                $(document).keyup(function (e) {
                    frb.inputManager.keyboard.pressed[e.which] = false;
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

                worker.postMessage(frb.graphics);
            }
            else {
                // no workers
                //alert ('cry');

                setInterval(function () {
                    coreUpdate();
                    coreDraw();
                }, 1000 / frb.graphics.fps);

            }
        })();
    }
}