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
var frb = (function () {
    function frb() { }
    frb.pause = false;
    frb.AttachableList = new AttachableList();
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
    return frb;
})();
