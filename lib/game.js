var Skier = require('./skier'),
    Hazard = require('./hazard'),
    Util = require('./util'),
    Sasquatch = require('./sasquatch');

const EasyWinScore = 1000


var Game = function(skierGraphics, obstacleGraphics){
  this.skierGraphics = skierGraphics;
  this.obstacleGraphics = obstacleGraphics;
  this.reset();
  this.winningScore = EasyWinScore;

};

Game.prototype.reset = function(){
  this.skier = new Skier(this.skierGraphics);
  this.sasquatch = new Sasquatch(this.skierGraphics)
  this.keysPressed = {left: false, right: false, up: false};
  this.hazards_num = 9;
  this.hazards = [];
  this.populateHazards()
  this.level = 'easy';
  this.SkierCaught = false;
  this.jumping = false;
  this.pauseGame = false;
  this.score = 0;
  this.fallCount = 0;
  this.userWins = false;
}

Game.prototype.populateHazards = function(){
  for (var i = 0; i < this.hazards_num; i++) {
    this.hazards.push( new Hazard(Util.randomPosition(), this.obstacleGraphics))
  }
}


Game.prototype.createHazard = function(){
  if (this.hazards.length < this.hazards_num){

let Hazardposition = Util.randomStartPosition()
    while(this.avoidOverlapPosition(Hazardposition)){
      Hazardposition = Util.randomStartPosition()
    }


    let newHazard = new Hazard(Util.randomStartPosition(), this.obstacleGraphics)
    if (this.level === 'medium'){
      newHazard.moveSpeed = 7
    } if (this.level === 'hard'){
      newHazard.moveSpeed = 8
    }
    this.hazards.push(newHazard)
  }
}

Game.prototype.avoidOverlapPosition = function(position){
  let latestHazards= this.hazards.slice((this.hazards.length / 2), -1)
  let posX = position[0];
  let posY = position[1];
  let result = true
  latestHazards.forEach( hazard => {
    let hazX = hazard.position[0];
    let hazY = hazard.position[1];
      if(posX < hazX + 20 && posX > hazX - 20){
        result = false
      }
    })
    return !result
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
      this.hazards_num = 30
    }
    else if(this.score > 750){
      this.hazards_num = 25;
      this.level = 'hard';
      this.updateSpeed();
    } else if (this.score > 600 ) {
      this.hazards_num = 25
    } else if (this.score > 500 ) {
      this.hazards_num = 20
    }
    else if (this.score === 110) {
      this.hazards_num = 17;
      this.level = 'medium';
      this.updateSpeed();
    } else if (this.score > 100 ) {
      this.hazards_num = 14
    } else {
      this.hazards_num = 10
    }
}

Game.prototype.updateSpeed = function(){

    this.hazards = this.hazards.map(hazard => {
      if (this.level === 'medium'){
      hazard.moveSpeed = 7;
    } else if (this.level === 'hard') {
      hazard.moveSpeed = 8;
    }
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
          if (hazard.variant !== 5){
           this.skier.state = "crashed"
           hazard.collided = true
           this.score -= 100;
           this.fallCount += 1
           this.onCollision()
         } else if(hazard.variant === 5){
           this.jumping = true;
           this.initiateJumpSequence()
         }
       }
   }
  })
}

Game.prototype.initiateJumpSequence = function(){
  this.skier.jumping = true;
}

Game.prototype.onCollision = function(){
  this.pauseGame = true
  setTimeout( () => {
    this.pauseGame = false;
  }, 1000);

}

Game.prototype.moniterSasquatch = function(){
  let skiX = this.skier.position[0];
  let skiY = this.skier.position[1];
  let sasqX = this.sasquatch.position[0];
  let sasqY = this.sasquatch.position[1];
  if((skiX < (sasqX + this.sasquatch.radius)) &&
    (skiX > (sasqX - this.sasquatch.radius)) &&
    (skiY < (sasqY + 20)) &&
    (skiY > (sasqY - 20))
  ) {
    this.SkierCaught = true;
    ;
  }
}

Game.prototype.checkJumpStatus = function(){
  this.jumping = this.skier.jumping
}

Game.prototype.updateBoard = function(){
  this.checkJumpStatus()
  if(!this.jumping){
    this.moniterSasquatch();
  }
  if(!this.pauseGame){
    if(!this.jumping){
      this.checkForCollisions();
    }
    if(!this.SkierCaught){
      this.moniterHazards();
    }
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

  if(!this.SkierCaught){
    this.score += 1
    this.skier.draw(ctx, this.keysPressed, this.pauseGame, this.level);
    this.sasquatch.draw(ctx, this.skier.position)
  } else {
    if (this.score >= this.winningScore){
      this.sasquatch.drawDeath(ctx)
      this.userWins = true
    } else {
    this.sasquatch.drawSasquatchFeeds(ctx)
  }
  }
  this.drawNumbers(ctx);
  this.WinLossMessage(ctx)
}



Game.prototype.drawNumbers = function(ctx){
  let score = "Points: " + this.score;
  let crash = "Crashes: " + this.fallCount;

  if(this.score > 1000){
    ctx.fillStyle = "#ffc0cb";
  } else{
    ctx.fillStyle = "#ff0000"
  }

  ctx.font = "18px 'Arial'";
  ctx.fontWeight = "bold"
  ctx.fillText(score, 10, 20);
  ctx.fillText(crash, 120, 20);

}

Game.prototype.WinLossMessage = function (ctx) {
  var canvas = document.getElementById('myCanvas');
  if (this.SkierCaught) {
    ctx.fillStyle = "#fd2047";
    ctx.font = "60px 'Monoton'";
    var Message = "You Lose";
    if(this.userWins){
      Message = "You Win!!";
    }
    var MessageTextWidth = ctx.measureText(Message).width;
    ctx.fillText(
      Message,
      (canvas.width/2) - (MessageTextWidth / 2),
      100
    );

    ctx.font = "22px 'Arial'";
    ctx.fillStyle = "#000000";
    ctx.fontWeight = "bold"

  }
};


module.exports = Game;
