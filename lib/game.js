var Skier = require('./skier');


var Game = function(skierGraphics, obstaclesGraphics){
  this.skierGraphics = skierGraphics;
  this.obsactlesGraphics = obstaclesGraphics;
  this.reset();
};


Game.prototype.reset = function(){
  this.skier = new Skier(this.skierGraphics);
  this.keysPressed = {left: false, right: false};
}

Game.prototype.draw = function(ctx){
  ctx.clearRect(0, 0, 500, 500);
  this.skier.draw(ctx, this.keysPressed);
}

module.exports = Game;
