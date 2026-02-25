var Game = require('./game.js');
var GameView = require('./game_view.js');

// Key codes for game controls
var KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  ENTER: 13,
  R: 82
};

document.addEventListener('DOMContentLoaded', function () {
  var skierGraphics = document.getElementById('skier');
  var obstaclesGraphics = document.getElementById('obstacles');
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');
  var game = new Game(skierGraphics, obstaclesGraphics);
  var gameView = new GameView(game, ctx);

  document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case KEY.RIGHT:
        game.keysPressed.right = true;
        break;
      case KEY.LEFT:
        game.keysPressed.left = true;
        break;
      case KEY.UP:
        game.keysPressed.up = true;
        break;
    }
  }, false);

  document.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
      case KEY.RIGHT:
        game.keysPressed.right = false;
        break;
      case KEY.LEFT:
        game.keysPressed.left = false;
        break;
      case KEY.UP:
        game.keysPressed.up = false;
        break;
      case KEY.ENTER:
        canvas.className = 'play-canvas';
        var instructions = document.querySelector('.pre-instructions');
        if (instructions) {
          instructions.className = 'post-instructions';
        }
        var keyPanel = document.querySelector('.key');
        if (keyPanel) {
          keyPanel.className = 'post-key';
        }
        gameView.startGame();
        break;
      case KEY.R:
        game.reset();
        break;
    }
  }, false);
});
