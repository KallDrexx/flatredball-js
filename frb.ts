/// <reference path="definitions/jquery.d.ts" />

class MathHelper {
    static e: number = Math.E;
    static log10E: number = 0.4342945;
    static log2E: number = 1.442695;
    static pi: number = Math.PI;
    static piOver2: number = (Math.PI / 2.0);
    static piOver4: number = (Math.PI / 4.0);
    static twoPi: number = (Math.PI * 2.0);

    static invert(value: number) {
        return 0 - value;
    }

    static clamp(value: number, min: number, max: number) {
        if (value < min)
            return min;
        
        if (value > max)
            return max;

        return value;
    }

    static lerp(value1: number, value2: number, amount: number) {
        return value1 + (value2 - value1) * amount;
    }

    static toDegrees(radians: number) {
        return radians * 57.295779513082320876798154814105;
    }

    static toRadians(degrees: number) {
        return degrees * 0.017453292519943295769236907684886;
    }
}

/***********************
    Framework
***********************/
class AttachableList {
    list: any[];
    length: number;

    constructor() {
        this.list = [];
        this.length = 0;
    }

    get(index: number) {
        return this.list[index];
    }

    contains(value: any) {
        return this.list.indexOf(value) >= 0;
    }

    add(value: any) {
        if (!this.contains(value)) {
            this.list.push(value);
            this.length = this.list.length;

            if (!value.listsBelongingTo) value.listsBelongingTo = new Array();
            value.listsBelongingTo.push(this);
        }
    }

    push(value: any) {
        this.add(value);
    }

    pop() {
        if (this.length <= 0) throw "no more items to pop";

        var item = this.get(this.length - 1);
        this.remove(item);
        return item;
    }

    remove(value: any) {
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

    removeFromAll(value: any) {
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

    add(factory: any) {
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

    return (item: any) {
        this.active.remove(item);
        this.available.add(item);
    }
}

class frb {
    static pause: bool = false;
    static AttachableList: AttachableList = new AttachableList;
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
}