/***********************
    Framework
***********************/

function Camera() {
    this.x = 0;
    this.y = 0;
}
Camera.prototype.start = function() {
    canvas.save();
    canvas.translate(0-this.x, 0-this.y);
};
Camera.prototype.end = function() {
    canvas.restore();
};

var SpriteManager = {
    camera: new Camera(),
    images:{},
    sprites:new Array(),
    add:function(name) {
        var path = name;

        // handle the case where we want a static URL
        if (name.indexOf("http") < 0)
            path = "content/" + name + ".png";
        
        // now initialize the image
        var img;
        if (name in this.images) {
            img = this.images[name];            
        }
        else {
            img = new Image();
            img.src = path;

            this.images[name] = img;     
        }
        
        // now create the sprite
        var sprite = new Sprite(name, img, game.width/2-img.width/2, game.height/2-img.height/2);
        this.sprites.push(sprite);
        
        return sprite;
    }  ,
    update:function() {
        for(var i=0;i<this.sprites.length;i++) {
            var sprite = this.sprites[i];
            sprite.update();
        }   
    },
    draw:function() {
        this.camera.start();
        for(var i=0;i<this.sprites.length;i++) {
            var sprite = this.sprites[i];
            sprite.draw();
        }
        this.camera.end();
    }        
};

function Sprite(name, img, x, y) {
    this.name = name;
    this.img = img;
    this.width = img.width;
    this.height = img.height;
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.xAcceleration = 0;
    this.yAcceleration = 0;
    this.zRotation = 0;
    this.zRotationAcceleration = 0;
    this.zRotationVelocity = 0;
}
Sprite.prototype.draw = function() {
    canvas.save();
    canvas.translate(this.x + this.width/2, this.y + this.height/2);
    canvas.rotate(this.zRotation);
    canvas.drawImage(this.img, this.width/-2,this.height/-2);

    canvas.restore();
};
Sprite.prototype.update = function() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    this.xVelocity += this.xAcceleration;
    this.yVelocity += this.yAcceleration;  
    
    this.zRotation += this.zRotationVelocity;    
    this.zRotationVelocity += this.zRotationAcceleration;
};

/***********************
    Game initialization
***********************/

function coreUpdate() {
    SpriteManager.update();

    if (update && typeof(update) == "function")update();
}

function coreDraw() {
    canvas.fillStyle ="#6495ED";
    canvas.fillRect(0, 0, game.width, game.height);
    
    SpriteManager.draw();

    if (draw && typeof(draw) == "function")draw();   
}

function r(f){/in/(document.readyState)?setTimeout(r,9,f):f()}
r(function(){
    // initialize the canvas
    var game = {
        width:480,
        height:320,
        fps:30
    };

    var canvasElement = $("<canvas width='" + game.width + 
                          "' height='" + game.height + "'></canvas>");
    var canvas = canvasElement.get(0).getContext("2d");
    canvasElement.appendTo('body');

    // run the user's initialization code
    if (init && typeof(init) == "function") init();

    // set up the game loop
    setInterval(function() {
      coreUpdate();
      coreDraw();
    }, 1000/game.fps);
});


​