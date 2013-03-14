var ship = {};

frb.start({
    init: function () {
        ship = frb.SpriteManager.add("Ship/f1.png");
    },
    
    update: function () {
        ship.x = frb.InputManager.mouse.worldX;
        ship.y = frb.InputManager.mouse.worldY;
    }
});
