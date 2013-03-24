var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MathHelper = (function () {
    function MathHelper() { }
    MathHelper.e = Math.E;
    MathHelper.log10E = 0.4342945;
    MathHelper.log2E = 1.442695;
    MathHelper.pi = Math.PI;
    MathHelper.piOver2 = (Math.PI / 2.0);
    MathHelper.piOver4 = (Math.PI / 4.0);
    MathHelper.twoPi = (Math.PI * 2.0);
    MathHelper.invert = function invert(value) {
        return 0 - value;
    };
    MathHelper.clamp = function clamp(value, min, max) {
        if(value < min) {
            return min;
        }
        if(value > max) {
            return max;
        }
        return value;
    };
    MathHelper.lerp = function lerp(value1, value2, amount) {
        return value1 + (value2 - value1) * amount;
    };
    MathHelper.toDegrees = function toDegrees(radians) {
        return radians * 57.295779513082320876798154814105;
    };
    MathHelper.toRadians = function toRadians(degrees) {
        return degrees * 0.017453292519943295769236907684886;
    };
    return MathHelper;
})();
var AttachableList = (function () {
    function AttachableList() {
        this.list = [];
        this.length = 0;
    }
    AttachableList.prototype.get = function (index) {
        return this.list[index];
    };
    AttachableList.prototype.contains = function (value) {
        return this.list.indexOf(value) >= 0;
    };
    AttachableList.prototype.add = function (value) {
        if(!this.contains(value)) {
            this.list.push(value);
            this.length = this.list.length;
            if(!value.listsBelongingTo) {
                value.listsBelongingTo = new Array();
            }
            value.listsBelongingTo.push(this);
        }
    };
    AttachableList.prototype.push = function (value) {
        this.add(value);
    };
    AttachableList.prototype.pop = function () {
        if(this.length <= 0) {
            throw "no more items to pop";
        }
        var item = this.get(this.length - 1);
        this.remove(item);
        return item;
    };
    AttachableList.prototype.remove = function (value) {
        var index = this.list.indexOf(value);
        if(index >= 0) {
            this.list.splice(index, 1);
            this.length = this.list.length;
            if(value.listsBelongingTo) {
                var listIndex = value.listsBelongingTo.indexOf(this);
                if(listIndex >= 0) {
                    value.listsBelongingTo.splice(listIndex, 1);
                }
            }
        }
    };
    AttachableList.prototype.removeFromAll = function (value) {
        if(value.listsBelongingTo) {
            var numLists = value.listsBelongingTo.length;
            for(var i = 0; i < numLists; i++) {
                value.listsBelongingTo[i].remove(value);
            }
        }
    };
    return AttachableList;
})();
var ResourcePool = (function () {
    function ResourcePool() {
        this.active = new AttachableList();
        this.available = new AttachableList();
    }
    ResourcePool.prototype.add = function (factory) {
        var newItem = null;
        if(this.available.length > 0) {
            newItem = this.available.pop();
        }
        if(newItem === null) {
            newItem = factory();
        }
        this.active.add(newItem);
        return newItem;
    };
    ResourcePool.prototype.return = function (item) {
        this.active.remove(item);
        this.available.add(item);
    };
    return ResourcePool;
})();
var TimeManager = (function () {
    function TimeManager() { }
    TimeManager.start = new Date();
    TimeManager.last = new Date();
    TimeManager.secondDifference = 0;
    TimeManager.secondDifferenceFromStart = 0;
    TimeManager.update = function update() {
        var startMilli = this.start.getTime();
        var lastMilli = this.last.getTime();
        this.last = new Date();
        var nowMilli = this.last.getTime();
        var diff = nowMilli - lastMilli;
        var startDiff = nowMilli - startMilli;
        this.secondDifference = diff / 1000;
        this.secondDifferenceFromStart = startDiff / 1000;
    };
    return TimeManager;
})();
var PositionedObject = (function () {
    function PositionedObject() {
        this.x = 0;
        this.y = 0;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xTarget = 0;
        this.yTarget = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.zRotation = 0;
        this.zRotationAcceleration = 0;
        this.zRotationVelocity = 0;
        this.listsBelongingTo = [];
    }
    PositionedObject.prototype.update = function () {
        var diff = TimeManager.secondDifference;
        this.x += this.xVelocity * diff + this.xAcceleration * diff;
        this.y += this.yVelocity * diff + this.yAcceleration * diff;
        this.xVelocity += this.xAcceleration * diff;
        this.yVelocity += this.yAcceleration * diff;
        this.zRotation += this.zRotationVelocity * diff + this.zRotationAcceleration * diff;
        this.zRotationVelocity += this.zRotationAcceleration * diff;
    };
    PositionedObject.prototype.initialize = function (target) {
        this.updatePositionResults(target);
        target.listsBelongingTo = this.listsBelongingTo;
        target.removeSelfFromListsBelongingTo = this.removeSelfFromListsBelongingTo;
    };
    PositionedObject.prototype.updatePositionResults = function (target) {
        target.x = this.x;
        target.y = this.y;
        target.xVelocity = this.xVelocity;
        target.yVelocity = this.yVelocity;
        target.xAcceleration = this.xAcceleration;
        target.yAcceleration = this.yAcceleration;
        target.zRotation = this.zRotation;
        target.zRotationAcceleration = this.zRotationAcceleration;
        target.zRotationVelocity = this.zRotationVelocity;
    };
    PositionedObject.prototype.removeSelfFromListsBelongingTo = function () {
        frb.attachableList.removeFromAll(this);
    };
    return PositionedObject;
})();
var Camera = (function () {
    function Camera() {
        this.x = 0;
        this.y = 0;
    }
    Camera.prototype.start = function () {
    };
    Camera.prototype.end = function () {
    };
    return Camera;
})();
var Mouse = (function () {
    function Mouse() {
        this.x = 0;
        this.y = 0;
        this.worldX = 0;
        this.worldY = 0;
        this.leftButton = false;
        this.rightButton = false;
        this.middleButton = false;
        this.onCanvas = false;
    }
    return Mouse;
})();
var Keyboard = (function () {
    function Keyboard() {
        this.pressed = null;
        this.chars = {
            8: "Backspace",
            9: "Tab",
            13: "Enter",
            16: "Shift",
            17: "Ctrl",
            18: "Alt",
            19: "PauseBreak",
            20: "CapsLock",
            27: "Esc",
            32: "Space",
            33: "PageUp",
            34: "PageDown",
            35: "End",
            36: "Home",
            37: "Left",
            38: "Up",
            39: "Right",
            40: "Down",
            45: "Insert",
            46: "Delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "A",
            66: "B",
            67: "C",
            68: "D",
            69: "E",
            70: "F",
            71: "G",
            72: "H",
            73: "I",
            74: "J",
            75: "K",
            76: "L",
            77: "M",
            78: "N",
            79: "O",
            80: "P",
            81: "Q",
            82: "R",
            83: "S",
            84: "T",
            85: "U",
            86: "V",
            87: "W",
            88: "X",
            89: "Y",
            90: "Z",
            91: "Windows",
            93: "RightClick",
            96: "Num0",
            97: "Num1",
            98: "Num2",
            99: "Num3",
            100: "Num4",
            101: "Num5",
            102: "Num6",
            103: "Num7",
            104: "Num8",
            105: "Num9",
            106: "Num*",
            107: "Num+",
            109: "Num-",
            110: "Num.",
            111: "Num/",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "NumLock",
            145: "ScrollLock",
            182: "MyComputer",
            183: "MyCalculator",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'"
        };
    }
    Keyboard.prototype.keyDown = function (key) {
        return this.pressed[frb.keys[key]] === true;
    };
    return Keyboard;
})();
var SpriteManager = (function () {
    function SpriteManager() {
        this.camera = new Camera();
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
        var sprite = new Sprite(name, img, 0, 0);
        this.sprites.push(sprite);
        return sprite;
    };
    SpriteManager.prototype.addCircle = function (radius) {
        var circle = new Circle(0, 0, radius);
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
var InputManager = (function () {
    function InputManager() { }
    InputManager.mouse = new Mouse();
    InputManager.keyboard = new Keyboard();
    InputManager.update = function update() {
        var left = frb.spriteManager.camera.x - (frb.graphics.width / 2);
        var top = MathHelper.invert(frb.spriteManager.camera.y) - (frb.graphics.height / 2);
        this.mouse.worldX = left + this.mouse.x;
        this.mouse.worldY = MathHelper.invert(top + this.mouse.y);
    };
    return InputManager;
})();
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(x, y, radius) {
        _super.call(this);
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
    Circle.prototype.draw = function () {
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
    };
    Circle.prototype.update = function () {
        _super.prototype.update.call(this);
        this.updateControlValues(this);
        this.update();
        this.updatePositionResults(this);
        this.xTarget = this.x;
        this.yTarget = MathHelper.invert(this.y);
        this.alpha = MathHelper.clamp(this.alpha, 0, 1);
    };
    return Circle;
})(PositionedObject);
var TextureCoordinate = (function () {
    function TextureCoordinate() { }
    return TextureCoordinate;
})();
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(name, img, x, y) {
        _super.call(this);
        this.name = name;
        this.img = img;
        this.width = img.width;
        this.height = img.height;
        this.initialize(this);
        this.x = x;
        this.y = y;
        this.alpha = 1;
        var sprite = this;
        img.loadEvents.push(function () {
            sprite.width = img.width;
            sprite.height = img.height;
        });
    }
    Sprite.prototype.draw = function () {
        frb.context.save();
        frb.context.translate(this.xTarget, this.yTarget);
        frb.context.rotate(this.zRotation);
        frb.context.globalAlpha = this.alpha;
        if(!this.textureCoordinate) {
            frb.context.drawImage(this.img, this.width / -2, this.height / -2);
        } else {
            var srcX = this.width * this.textureCoordinate.left;
            var srcY = this.height * this.textureCoordinate.top;
            var srcW = (this.width * this.textureCoordinate.right) - srcX;
            var srcH = (this.height * this.textureCoordinate.bottom) - srcY;
            frb.context.drawImage(this.img, 0, 0, srcW, srcH, srcW / -2, srcH / -2, srcW, srcH);
        }
        frb.context.restore();
    };
    Sprite.prototype.update = function () {
        _super.prototype.update.call(this);
        this.updateControlValues(this);
        this.update();
        this.updatePositionResults(this);
        this.xTarget = this.x;
        this.yTarget = MathHelper.invert(this.y);
        this.alpha = MathHelper.clamp(this.alpha, 0, 1);
    };
    Sprite.prototype.addTextureCoordinate = function (left, right, top, bottom) {
        this.textureCoordinate = new TextureCoordinate();
        this.textureCoordinate.left = left;
        this.textureCoordinate.right = right;
        this.textureCoordinate.top = top;
        this.textureCoordinate.bottom = bottom;
    };
    return Sprite;
})(PositionedObject);
var FrbOptions = (function () {
    function FrbOptions() { }
    return FrbOptions;
})();
var frb = (function () {
    function frb() { }
    frb.pause = false;
    frb.attachableList = new AttachableList();
    frb.spriteManager = new SpriteManager();
    frb.inputManager = new InputManager();
    frb.timeManager = new TimeManager();
    frb.keys = {
        "Backspace": 8,
        "Tab": 9,
        "Enter": 13,
        "Shift": 16,
        "Ctrl": 17,
        "Alt": 18,
        "PauseBreak": 19,
        "CapsLock": 20,
        "Esc": 27,
        "Space": 32,
        "PageUp": 33,
        "PageDown": 34,
        "End": 35,
        "Home": 36,
        "Left": 37,
        "Up": 38,
        "Right": 39,
        "Down": 40,
        "Insert": 45,
        "Delete": 46,
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        "A": 65,
        "B": 66,
        "C": 67,
        "D": 68,
        "E": 69,
        "F": 70,
        "G": 71,
        "H": 72,
        "I": 73,
        "J": 74,
        "K": 75,
        "L": 76,
        "M": 77,
        "N": 78,
        "O": 79,
        "P": 80,
        "Q": 81,
        "R": 82,
        "S": 83,
        "T": 84,
        "U": 85,
        "V": 86,
        "W": 87,
        "X": 88,
        "Y": 89,
        "Z": 90,
        "Windows": 91,
        "RightClick": 93,
        "Num0": 96,
        "Num1": 97,
        "Num2": 98,
        "Num3": 99,
        "Num4": 100,
        "Num5": 101,
        "Num6": 102,
        "Num7": 103,
        "Num8": 104,
        "Num9": 105,
        "Num*": 106,
        "Num+": 107,
        "Num-": 109,
        "Num.": 110,
        "Num/": 111,
        "F1": 112,
        "F2": 113,
        "F3": 114,
        "F4": 115,
        "F5": 116,
        "F6": 117,
        "F7": 118,
        "F8": 119,
        "F9": 120,
        "F10": 121,
        "F11": 122,
        "F12": 123,
        "NumLock": 144,
        "ScrollLock": 145,
        "MyComputer": 182,
        "MyCalculator": 183,
        ";": 186,
        "=": 187,
        ",": 188,
        "-": 189,
        ".": 190,
        "/": 191,
        "`": 192,
        "[": 219,
        "\\": 220,
        "]": 221,
        "'": 222
    };
    frb.start = function start(options) {
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
                frb.context = options.canvas.get(0).getContext("2d");
                frb.graphics = {
                    width: options.canvas.width(),
                    height: options.canvas.height()
                };
            } else {
                frb.context = options.canvas.getContext("2d");
                frb.graphics = {
                    width: options.canvas.width,
                    height: options.canvas.height
                };
            }
        } else if(document.getElementsByTagName("canvas").length > 0) {
            var canvasElement = document.getElementsByTagName("canvas").item(0);
            options.canvas = canvasElement;
            frb.context = canvasElement.getContext("2d");
            frb.graphics = {
                width: canvasElement.width,
                height: canvasElement.height
            };
        } else {
            frb.graphics = {
                width: 480,
                height: 320
            };
            var canvasElement = document.createElement("canvas");
            canvasElement.setAttribute("width", frb.graphics.width);
            canvasElement.setAttribute("height", frb.graphics.height);
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
                    frb.InputManager.onCanvas = true;
                });
                $(options.canvas).mouseleave(function () {
                    frb.InputManager.onCanvas = false;
                });
                $(options.canvas).mousemove(function (e) {
                    var relativeXPosition = e.pageX - this.offsetLeft;
                    var relativeYPosition = e.pageY - this.offsetTop;
                    frb.InputManager.mouse.x = relativeXPosition;
                    frb.InputManager.mouse.y = relativeYPosition;
                });
                $(options.canvas).mousedown(function (e) {
                    if(e.which === 1) {
                        frb.InputManager.mouse.leftButton = true;
                    }
                    if(e.which === 3) {
                        frb.InputManager.mouse.rightButton = true;
                    }
                    if(e.which === 2) {
                        frb.InputManager.mouse.middleButton = true;
                    }
                });
                $(options.canvas).mouseup(function (e) {
                    if(e.which === 1) {
                        frb.InputManager.mouse.leftButton = false;
                    }
                    if(e.which === 3) {
                        frb.InputManager.mouse.rightButton = false;
                    }
                    if(e.which === 2) {
                        frb.InputManager.mouse.middleButton = false;
                    }
                });
                $(document).keydown(function (e) {
                    frb.InputManager.keyboard.pressed[e.which] = true;
                    if(frb.keys["Space"] === e.which) {
                        e.preventDefault();
                    }
                });
                $(document).keyup(function (e) {
                    frb.InputManager.keyboard.pressed[e.which] = false;
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
    };
    return frb;
})();
