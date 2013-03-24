﻿/// <reference path="../references.ts" />

module frb {

    export var pause: bool = false;
    export var attachableList: AttachableList = new AttachableList();
    export var spriteManager: SpriteManager = new SpriteManager();
    export var inputManager: InputManager = new InputManager();
    export var timeManager: TimeManager = new TimeManager();
    export var context: CanvasRenderingContext2D;
    export var graphics: Graphics;
    export var keys: { [name: string]: number; } = {
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