var Game = require('./game.js');
var GameView = require('./game_view.js');






document.addEventListener('DOMContentLoaded', function() {
  var skierGraphics = document.getElementById('skier');
  var obstaclesGraphics = document.getElementById('obstacles');
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');
  var game = new Game(skierGraphics, obstaclesGraphics)
  var gameView = new GameView(game, ctx)

  document.addEventListener("keydown", function(e){
    if(e.keyCode == 39) {
      game.keysPressed.right = true;
    }
    else if(e.keyCode == 37) {
      game.keysPressed.left = true;
    }
  }, false);

  document.addEventListener("keyup", function(e){
    if(e.keyCode == 39) {
        game.keysPressed.right = false;

    }
    else if(e.keyCode == 37) {
        game.keysPressed.left = false;
    }
  }, false);

  canvas.addEventListener('click', function (e) {
      gameView.startGame();
  });
})
