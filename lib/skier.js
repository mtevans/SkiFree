var Skier = function(skierGraphics){
  this.graphics = skierGraphics;
  this.radius = 20;
  this.pos = [250,250];
  this.state = "alive";
  this.isCaptured = false;

}

Skier.prototype.draw = function(ctx, keysPressed){
  switch (this.state) {
   case "alive":
      {
      if(keysPressed.left){
        ctx.drawImage(
         this.graphics,
         49, 37, 17, 34,
         this.pos[0], this.pos[1], 17, 34
       );
      } else if (keysPressed.right){
        ctx.drawImage(
         this.graphics,
         49, 0, 17, 34,
        this.pos[0], this.pos[1], 17, 34
       );
      } else{
       ctx.drawImage(
        this.graphics,
        65, 0, 17, 34,
        this.pos[0], this.pos[1], 17, 34
      );
    }


     }
   }
}


module.exports = Skier;
