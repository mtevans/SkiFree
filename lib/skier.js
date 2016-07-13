var Skier = function(skierGraphics){
  this.graphics = skierGraphics;
  this.radius = 25;
  this.position = [250, 200];
  this.state = "alive";
  this.isCaptured = false;
}


Skier.prototype.updatePosition = function(keysPressed){
  if(keysPressed.right && this.position[0] < 480){
    this.position[0] = this.position[0] + 3
  } else if (keysPressed.left && this.position[0] > 0) {
    this.position[0] = this.position[0] - 3
  } else{
    return
  }
}

Skier.prototype.draw = function(ctx, keysPressed, pauseGame){
  if(!pauseGame){
    this.updatePosition(keysPressed);
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


module.exports = Skier;
