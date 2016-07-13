var Skier = require('./skier'),
    Hazard = require('./hazard'),
    Util = require('./util');


var Game = function(skierGraphics, obstacleGraphics){
  this.skierGraphics = skierGraphics;
  this.obstacleGraphics = obstacleGraphics;
  this.reset();
  this.hazards = [];
  HAZARDS_NUM = 9;
  this.score = 0
  this.pauseGame = false
  this.populateHazards()
  this.toughLevel = false;
};


Game.prototype.reset = function(){
  this.skier = new Skier(this.skierGraphics);
  this.keysPressed = {left: false, right: false};
}

Game.prototype.populateHazards = function(){
  for (var i = 0; i < HAZARDS_NUM; i++) {
    this.hazards.push( new Hazard(Util.randomPosition(), this.obstacleGraphics))
  }
}


Game.prototype.createHazard = function(){
  if (this.hazards.length < HAZARDS_NUM){
    let newHazard = new Hazard(Util.randomStartPosition(), this.obstacleGraphics)
    if (this.toughLevel){
      newHazard.moveSpeed = 7
    }
    this.hazards.push(newHazard)
  }
}

Game.prototype.moveHazards = function(){
  this.hazards.forEach(hazard => {
    hazard.move()
  })
}

Game.prototype.deleteHazards = function(){
  for (var i = 0; i < this.hazards.length; i++) {
    if (this.hazards[i].position[1] < - 60){
      delete this.hazards[i];
    }
  }
  let updatedHazards = [];
  for (var i = 0; i < this.hazards.length; i++) {
    if(this.hazards[i] !== undefined){
      updatedHazards.push(this.hazards[i])
    }
  }
  this.hazards = updatedHazards
}

Game.prototype.moniterDifficulty = function(){
    if(this.score > 1000){
      HAZARDS_NUM = 40
    }
    else if(this.score > 750){
      HAZARDS_NUM = 30
    } else if (this.score > 500 ) {
      HAZARDS_NUM = 20
    }
    else if (this.score === 250) {
      HAZARDS_NUM = 15
      this.updateSpeed();
    } else if (this.score > 250 ) {
      HAZARDS_NUM = 15
    } else {
      HAZARDS_NUM = 9
    }
}

Game.prototype.updateSpeed = function(){
    this.toughLevel = true;
    this.hazards = this.hazards.map(hazard => {
      hazard.moveSpeed = 7;
      return hazard;
    })
}

Game.prototype.moniterHazards = function(){
  this.moveHazards();
  this.deleteHazards();
  this.moniterDifficulty();
  this.createHazard();
}

Game.prototype.checkForCollisions = function(){
  let skiX = this.skier.position[0];
  let skiY = this.skier.position[1];

  this.hazards.forEach(hazard => {
    let hazX = hazard.position[0];
    let hazY = hazard.position[1];
    if (hazard.collided == false){
      if((skiX < (hazX + hazard.radius)) &&
        (skiX > (hazX - hazard.radius)) &&
        (skiY < (hazY + 4)) &&
        (skiY > (hazY - 8))
      ){
         this.skier.state = "crashed"
         hazard.collided = true
         this.onCollision()
       }
   }
  })
}

Game.prototype.onCollision = function(){
  this.pauseGame = true
  setTimeout( () => {
    this.pauseGame = false;
  }, 1000);

}

Game.prototype.updateBoard = function(){
if(!this.pauseGame){
  this.checkForCollisions();
  this.score += 1
  this.moniterHazards();
}
}

Game.prototype.draw = function(ctx){
  if (!this.pauseGame){
    this.skier.state = "alive"
  }
  ctx.clearRect(0, 0, 500, 500);
  this.hazards.forEach(hazard => {
      hazard.draw(ctx);
  })


  this.skier.draw(ctx, this.keysPressed, this.pauseGame);

}

module.exports = Game;
