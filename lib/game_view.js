

var GameView = function(game, ctx){
  this.game = game;
  this.ctx = ctx;
  this.gameStarted = false
}

GameView.prototype.startGame = function(){
  if(this.gameStarted){
  } else {
    this.gameStarted = true;
    setInterval( () => {
      this.game.updateBoard();
      this.game.draw(this.ctx);
      // something to check the status of the game needs to go here.
    }, 30)
  }
}

module.exports = GameView;
