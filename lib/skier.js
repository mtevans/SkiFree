var Skier = function(skierGraphics){
  this.graphics = skierGraphics;
  this.radius = 20;
  this.position = [250, 200];
  this.state = "alive";
  this.isCaptured = false;
}


Skier.prototype.updatePosition = function(keysPressed){
  if(keysPressed.right && this.position[0] < 480){
    this.position[0] = this.position[0] + 7
  } else if (keysPressed.left && this.position[0] > 0) {
    this.position[0] = this.position[0] - 7
  } else{
    return
  }
}

Skier.prototype.draw = function(ctx, keysPressed){
  this.updatePosition(keysPressed);

  switch (this.state) {
   case "alive":
      {
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
}


module.exports = Skier;
