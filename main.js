var ship;
var options = new frb.FrbOptions();
options.init = function () {
    ship = frb.spriteManager.add("Ship/f1.png");
};
options.update = function () {
    ship.x = frb.inputManager.mouse.worldX;
    ship.y = frb.inputManager.mouse.worldY;
};
frb.start(options);
