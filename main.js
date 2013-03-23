var ship = {};

frb.start({
    init: function () {
        ship = frb.spriteManager.add("Ship/f1.png");
    },
    
    update: function () {
        ship.x = frb.inputManager.mouse.worldX;
        ship.y = frb.inputManager.mouse.worldY;
    }
});