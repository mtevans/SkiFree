var Skier = function(skierGraphics){
  this.graphics = skierGraphics;
  this.radius = 25;
  this.position = [250, 200];
  this.state = "alive";
  this.isCaptured = false;
  this.jumping = false;
  this.jumpStatus = "none"
}


Skier.prototype.updatePosition = function(keysPressed, level){
  let moveDistance = 3;
  if (level === 'hard'){
    moveDistance = 5;
  }

  if(keysPressed.right && this.position[0] < 480){
    this.position[0] = this.position[0] + moveDistance
  } else if (keysPressed.left && this.position[0] > 0) {
    this.position[0] = this.position[0] - moveDistance
  }
  if(this.jumping){
    this.addressJumping()
  }
}

Skier.prototype.addressJumping = function(){
  if(this.position[1] > 90 && this.jumpStatus !== "down"){
    this.jumpStatus = "up"
  } else if (this.position[1] <= 90) {
    this.jumpStatus = "down"
  }

  if(this.jumpStatus === "up"){
    this.position[1] -= 5
  } else if (this.jumpStatus === "down" && (this.position[1] + 15) >= 200) {
    this.position[1] = 200
    this.jumping = false
    this.jumpStatus = "none"
  }
  else if (this.jumpStatus === "down") {
    this.position[1] += 4
  }
}

Skier.prototype.draw = function(ctx, keysPressed, pauseGame, level){
  if(!pauseGame){
    this.updatePosition(keysPressed, level);
  }

  if(this.jumping){
    this.JumpDraw(ctx, keysPressed);
    return;
  }

  switch (this.state) {
   case "alive":
      {
    if(!pauseGame){
      if(keysPressed.left){
        ctx.drawImage(
         this.graphics,
         49, 37, 17, 34,
         this.position[0], this.position[1], 17, 34
       );
      } else if (keysPressed.right){
        ctx.drawImage(
         this.graphics,
         49, 0, 17, 34,
        this.position[0], this.position[1], 17, 34
       );
      } else{
       ctx.drawImage(
        this.graphics,
        65, 0, 17, 34,
        this.position[0], this.position[1], 17, 34
      );
      }
    }
  }
  break;
  case "crashed":
    {
      ctx.drawImage(
        this.graphics,
        240, 0, 31, 31,
        this.position[0], this.position[1], 31, 31
      )
    }
   }
}


Skier.prototype.JumpDraw = function(ctx, keysPressed){
  if(keysPressed.right){
    ctx.drawImage(
     this.graphics,
     184, 0, 28, 34,
     this.position[0], this.position[1], 28, 34
   );
 } else if (keysPressed.left){
    ctx.drawImage(
     this.graphics,
     184, 41, 30, 30,
    this.position[0], this.position[1], 30, 30
   );
 } else if (keysPressed.up){
     ctx.drawImage(
      this.graphics,
      119, 77, 30, 32,
     this.position[0], this.position[1], 30, 32
    );
  }
  else{
     ctx.drawImage(
      this.graphics,
      86, 0, 31, 34,
      this.position[0], this.position[1], 31, 34
    );
  }


}

module.exports = Skier;
