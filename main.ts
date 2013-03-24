/// <reference path="frb/references.ts" />
/// <reference path="definitions/jquery.d.ts" />

var ship: frb.Sprite;
var options: frb.FrbOptions = new frb.FrbOptions();
options.init = function () {
    ship = frb.spriteManager.add("Ship/f1.png");
};
options.update = function () {
    ship.x = frb.inputManager.mouse.worldX;
    ship.y = frb.inputManager.mouse.worldY;
};

frb.start(options);