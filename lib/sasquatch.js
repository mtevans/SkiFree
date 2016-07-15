var Sasquatch = function(graphics){
  this.gotSkier = false
  this.position = [250, -230]; ///// -230
  this.radius = 15;
  this.graphics = graphics;
  this.direction = "left";
  this.moveFrame = 0;
  this.moveFrameTimer = 0;
  this.eatFrame = 1;
  this.eatFrameTimer= 0;
  this.deathFrame = 0;
  this.deathFrameTimer = 0;
  this.gameOver = false
}


Sasquatch.prototype.updatePosition = function(SkierPosition){
  let moveDelta = 3  //////
  if(SkierPosition[0] < this.position[0] - 500){
    this.position[0] = this.position[0] - moveDelta
    this.direction = "left";
  } else if (SkierPosition[0] > this.position[0] + 500){
    this.position[0] = this.position[0] + moveDelta
    this.direction = "right"
  }
  if (this.position[1] < SkierPosition[1]){
    this.position[1] += 0.3;
  }
  if (this.direction === "left"){
    this.position[0] -= 8
  } else {
    this.position[0] += 8
  }
}

Sasquatch.prototype.updateFrame = function(){
  if(this.moveFrame === 0){
    this.moveFrame = 1
  } else if (this.moveFrame === 1){
    this.moveFrame = 0
  }
}

Sasquatch.prototype.updateFrameTimer = function(){
  if (this.moveFrameTimer > 5){
    this.moveFrameTimer = 0
  } else if (this.moveFrameTimer === 5){
    this.updateFrame()
  }
  this.moveFrameTimer += 1
}

Sasquatch.prototype.manageSasquatch = function(SkierPosition){
  this.updatePosition(SkierPosition);
  this.updateFrameTimer();
}


Sasquatch.prototype.draw = function(ctx, SkierPosition){
  this.manageSasquatch(SkierPosition)

  if(this.direction === "right"){
    switch (this.moveFrame) {
      case 0:
        ctx.drawImage(
         this.graphics,
         91, 112, 31, 40,
         this.position[0], this.position[1], 31, 40
       );
        break;
      case 1:
      ctx.drawImage(
        this.graphics,
        62, 112, 29, 40,
        this.position[0], this.position[1], 29, 40
      );
      break;
    }
  } else if (this.direction === "left"){
    switch (this.moveFrame) {
      case 0:
        ctx.drawImage(
          this.graphics,
          91, 158, 31, 40,
          this.position[0], this.position[1], 31, 40
        );
        break;
      case 1:
        ctx.drawImage(
          this.graphics,
          62, 158, 29, 40,
          this.position[0], this.position[1], 29, 40
        );
        break;
      }
    }
  }

  Sasquatch.prototype.updateEatFrame = function(){

    if(this.eatFrame === 0){
      this.eatFrame = 1
    } else if (this.eatFrame === 8){
      this.eatFrame = 7
    } else if (this.eatFrame === 7){
      this.eatFrame = 8
    } else (this.eatFrame += 1)
  }

  Sasquatch.prototype.updateEatFrameTimer = function(){

    if (this.eatFrameTimer > 5){
      this.eatFrameTimer = 0
    } else if (this.eatFrameTimer === 5){
      this.updateEatFrame()
    }
    this.eatFrameTimer += 1
  }



Sasquatch.prototype.drawSasquatchFeeds = function(ctx){
  this.updateEatFrameTimer();

  switch (this.eatFrame) {
    case 0:
      ctx.drawImage(
        this.graphics,
        35, 112, 25, 43,
        this.position[0], this.position[1], 25, 43
      );
      break;
    case 1:
      ctx.drawImage(
        this.graphics,
        0, 112, 32, 43,
        this.position[0], this.position[1], 32, 43
      );
      break;
    case 2:
      ctx.drawImage(
        this.graphics,
        122, 112, 34, 43,
        this.position[0], this.position[1], 34, 43
      );
      break;
    case 3:
      ctx.drawImage(
        this.graphics,
        156, 112, 31, 43,
        this.position[0], this.position[1], 31, 43
      );
      break;
    case 4:
      ctx.drawImage(
        this.graphics,
        187, 112, 31, 43,
        this.position[0], this.position[1], 31, 43
      );
      break;
    case 5:
      ctx.drawImage(
        this.graphics,
        219, 112, 25, 43,
        this.position[0], this.position[1], 25, 43
      );
      break;
    case 6:
      ctx.drawImage(
        this.graphics,
        243, 112, 26, 43,
        this.position[0], this.position[1], 26, 43
      );
      break;
    case 7:
      ctx.drawImage(
        this.graphics,
        35, 112, 25, 43,
        this.position[0], this.position[1], 25, 43
      );
      break;
    case 8:
      ctx.drawImage(
        this.graphics,
        0, 112, 32, 43,
        this.position[0], this.position[1], 32, 43
      );
      break;
  }
}

Sasquatch.prototype.updateDeathFrame = function(){
  if(this.deathFrame < 7){
      this.deathFrame += 1
    }
    if(this.deathFrame === 7){
      this.gameOver = true
    }
}

Sasquatch.prototype.updateDeathFrameTimer = function(){

  if (this.deathFrameTimer > 10){
    this.deathFrameTimer = 0
  } else if (this.deathFrameTimer === 10){
    this.updateDeathFrame()
  }
  this.deathFrameTimer += 1
}


Sasquatch.prototype.drawDeath = function(ctx){
  this.updateDeathFrameTimer()

  switch (this.deathFrame) {

    case 0:
      ctx.drawImage(
        this.graphics,
        91, 349, 19, 27,
        this.position[0], this.position[1] + 8, 19, 27
      );
      break;
    case 1:
      ctx.drawImage(
        this.graphics,
        112, 349, 18, 28,
        this.position[0], this.position[1] + 8, 18, 28
      );
      break;
    case 2:
      ctx.drawImage(
        this.graphics,
        130, 349, 18, 28,
        this.position[0] + 4, this.position[1] + 8, 18, 28
      );
      break;
    case 3:
      ctx.drawImage(
        this.graphics,
        148, 348, 24, 28,
        this.position[0] + 5, this.position[1] + 8, 24, 28
      );
      break;
    case 4:
      ctx.drawImage(
        this.graphics,
        171, 348, 25, 28,
        this.position[0], this.position[1] + 8, 25, 28
      );
      break;
    case 5:
      ctx.drawImage(
        this.graphics,
        194, 348, 35, 28,
        this.position[0] + 6, this.position[1] + 8, 35, 28
      );
      break;
    case 6:
      ctx.drawImage(
        this.graphics,
        31, 410, 44, 69,
        this.position[0] + 8, this.position[1] - 2, 44, 69
      );
      break;
    case 7:
      ctx.drawImage(
        this.graphics,
        78, 411, 47, 44,
        this.position[0] + 14, this.position[1] + 4, 47, 44
      );
  }

  if(this.deathFrame < 6){
    ctx.drawImage(
      this.graphics,
      0, 112, 32, 43,
      this.position[0] + 28, this.position[1] - 8, 32, 43
    );
  }
  if(this.deathFrame === 7){
    ctx.drawImage(
     this.graphics,
     184, 0, 28, 34,
     this.position[0] - 8, this.position[1] + 2, 28, 34
    )
  }
}


module.exports = Sasquatch;
