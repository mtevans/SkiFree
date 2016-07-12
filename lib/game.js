var Skier = require('./skier'),
    Hazard = require('./hazard'),
    Util = require('./util');


var Game = function(skierGraphics, obstacleGraphics){
  this.skierGraphics = skierGraphics;
  this.obstacleGraphics = obstacleGraphics;
  this.reset();
  this.hazards = [];
  HAZARDS_NUM = 5;


  this.populateHazards()
};

Game.prototype.populateHazards = function(){
for (var i = 0; i < HAZARDS_NUM; i++) {
  this.hazards.push( new Hazard(Util.randomPosition(), this.obstacleGraphics))
  }
}

Game.prototype.reset = function(){
  this.skier = new Skier(this.skierGraphics);
  this.keysPressed = {left: false, right: false};
}

Game.prototype.draw = function(ctx){
  ctx.clearRect(0, 0, 500, 500);
  this.hazards.forEach(hazard => {
    hazard.draw(ctx);
  })

  this.skier.draw(ctx, this.keysPressed);
}

module.exports = Game;
