var FRAME_INTERVAL_MS = 30;

var GameView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
  this.gameStarted = false;
};

GameView.prototype.startGame = function () {
  if (this.gameStarted) {
    return;
  }

  this.gameStarted = true;
  var self = this;
  setInterval(function () {
    self.game.updateBoard();
    self.game.draw(self.ctx);
  }, FRAME_INTERVAL_MS);
};

module.exports = GameView;
