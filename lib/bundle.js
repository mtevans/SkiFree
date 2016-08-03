/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(6);
	
	document.addEventListener('DOMContentLoaded', function () {
	  var skierGraphics = document.getElementById('skier');
	  var obstaclesGraphics = document.getElementById('obstacles');
	  var canvas = document.getElementById('myCanvas');
	  var ctx = canvas.getContext('2d');
	  var game = new Game(skierGraphics, obstaclesGraphics);
	  var gameView = new GameView(game, ctx);
	
	  document.addEventListener("keydown", function (e) {
	    console.log("pressed a key");
	
	    if (e.keyCode == 39) {
	      game.keysPressed.right = true;
	    } else if (e.keyCode == 37) {
	      game.keysPressed.left = true;
	    } else if (e.keyCode == 38) {
	      game.keysPressed.up = true;
	    }
	  }, false);
	
	  document.addEventListener("keyup", function (e) {
	    if (e.keyCode == 39) {
	      game.keysPressed.right = false;
	    } else if (e.keyCode == 37) {
	      game.keysPressed.left = false;
	    } else if (e.keyCode == 38) {
	      game.keysPressed.up = false;
	    } else if (e.keyCode == 13) {
	      $("canvas").removeClass("pre-canvas").addClass("play-canvas");
	      $("instructions").removeClass("pre-instructions").addClass("post-instructions");
	      $("key").removeClass("key").addClass("post-key");
	      gameView.startGame();
	    } else if (e.keyCode == 82) {
	      game.reset();
	    }
	  }, false);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Skier = __webpack_require__(2),
	    Hazard = __webpack_require__(3),
	    Util = __webpack_require__(4),
	    Sasquatch = __webpack_require__(5);
	
	var EasyWinScore = 1000;
	
	var Game = function Game(skierGraphics, obstacleGraphics) {
	  this.skierGraphics = skierGraphics;
	  this.obstacleGraphics = obstacleGraphics;
	  this.reset();
	  this.winningScore = EasyWinScore;
	};
	
	Game.prototype.reset = function () {
	  this.skier = new Skier(this.skierGraphics);
	  this.sasquatch = new Sasquatch(this.skierGraphics);
	  this.keysPressed = { left: false, right: false, up: false };
	  this.hazards_num = 9;
	  this.hazards = [];
	  this.populateHazards();
	  this.level = 'easy';
	  this.SkierCaught = false;
	  this.jumping = false;
	  this.pauseGame = false;
	  this.score = 0;
	  this.fallCount = 0;
	  this.userWins = false;
	};
	
	Game.prototype.populateHazards = function () {
	  for (var i = 0; i < this.hazards_num; i++) {
	    this.hazards.push(new Hazard(Util.randomPosition(), this.obstacleGraphics));
	  }
	};
	
	Game.prototype.createHazard = function () {
	  if (this.hazards.length < this.hazards_num) {
	
	    var Hazardposition = Util.randomStartPosition();
	    while (this.avoidOverlapPosition(Hazardposition)) {
	      Hazardposition = Util.randomStartPosition();
	    }
	
	    var newHazard = new Hazard(Util.randomStartPosition(), this.obstacleGraphics);
	    if (this.level === 'medium') {
	      newHazard.moveSpeed = 7;
	    }if (this.level === 'hard') {
	      newHazard.moveSpeed = 8;
	    }
	    this.hazards.push(newHazard);
	  }
	};
	
	Game.prototype.avoidOverlapPosition = function (position) {
	  var latestHazards = this.hazards.slice(this.hazards.length / 2, -1);
	  var posX = position[0];
	  var posY = position[1];
	  var result = true;
	  latestHazards.forEach(function (hazard) {
	    var hazX = hazard.position[0];
	    var hazY = hazard.position[1];
	    if (posX < hazX + 20 && posX > hazX - 20) {
	      result = false;
	    }
	  });
	  return !result;
	};
	
	Game.prototype.moveHazards = function () {
	  this.hazards.forEach(function (hazard) {
	    hazard.move();
	  });
	};
	
	Game.prototype.deleteHazards = function () {
	  for (var i = 0; i < this.hazards.length; i++) {
	    if (this.hazards[i].position[1] < -60) {
	      delete this.hazards[i];
	    }
	  }
	  var updatedHazards = [];
	  for (var i = 0; i < this.hazards.length; i++) {
	    if (this.hazards[i] !== undefined) {
	      updatedHazards.push(this.hazards[i]);
	    }
	  }
	  this.hazards = updatedHazards;
	};
	
	Game.prototype.moniterDifficulty = function () {
	  if (this.score > 1000) {
	    this.hazards_num = 30;
	  } else if (this.score > 750) {
	    this.hazards_num = 25;
	    this.level = 'hard';
	    this.updateSpeed();
	  } else if (this.score > 600) {
	    this.hazards_num = 25;
	  } else if (this.score > 500) {
	    this.hazards_num = 20;
	  } else if (this.score === 110) {
	    this.hazards_num = 17;
	    this.level = 'medium';
	    this.updateSpeed();
	  } else if (this.score > 100) {
	    this.hazards_num = 14;
	  } else {
	    this.hazards_num = 10;
	  }
	};
	
	Game.prototype.updateSpeed = function () {
	  var _this = this;
	
	  this.hazards = this.hazards.map(function (hazard) {
	    if (_this.level === 'medium') {
	      hazard.moveSpeed = 7;
	    } else if (_this.level === 'hard') {
	      hazard.moveSpeed = 8;
	    }
	    return hazard;
	  });
	};
	
	Game.prototype.moniterHazards = function () {
	  this.moveHazards();
	  this.deleteHazards();
	  this.moniterDifficulty();
	  this.createHazard();
	};
	
	Game.prototype.checkForCollisions = function () {
	  var _this2 = this;
	
	  var skiX = this.skier.position[0];
	  var skiY = this.skier.position[1];
	
	  this.hazards.forEach(function (hazard) {
	    var hazX = hazard.position[0];
	    var hazY = hazard.position[1];
	    if (hazard.collided == false) {
	      if (skiX < hazX + hazard.radius && skiX > hazX - hazard.radius && skiY < hazY + 4 && skiY > hazY - 8) {
	        if (hazard.variant !== 5) {
	          _this2.skier.state = "crashed";
	          hazard.collided = true;
	          _this2.score -= 100;
	          _this2.fallCount += 1;
	          _this2.onCollision();
	        } else if (hazard.variant === 5) {
	          _this2.jumping = true;
	          _this2.initiateJumpSequence();
	        }
	      }
	    }
	  });
	};
	
	Game.prototype.initiateJumpSequence = function () {
	  this.skier.jumping = true;
	};
	
	Game.prototype.onCollision = function () {
	  var _this3 = this;
	
	  this.pauseGame = true;
	  setTimeout(function () {
	    _this3.pauseGame = false;
	  }, 1000);
	};
	
	Game.prototype.moniterSasquatch = function () {
	  var skiX = this.skier.position[0];
	  var skiY = this.skier.position[1];
	  var sasqX = this.sasquatch.position[0];
	  var sasqY = this.sasquatch.position[1];
	  if (skiX < sasqX + this.sasquatch.radius && skiX > sasqX - this.sasquatch.radius && skiY < sasqY + 20 && skiY > sasqY - 20) {
	    this.SkierCaught = true;
	    ;
	  }
	};
	
	Game.prototype.checkJumpStatus = function () {
	  this.jumping = this.skier.jumping;
	};
	
	Game.prototype.updateBoard = function () {
	  this.checkJumpStatus();
	  if (!this.jumping) {
	    this.moniterSasquatch();
	  }
	  if (!this.pauseGame) {
	    if (!this.jumping) {
	      this.checkForCollisions();
	    }
	    if (!this.SkierCaught) {
	      this.moniterHazards();
	    }
	  }
	};
	
	Game.prototype.draw = function (ctx) {
	  if (!this.pauseGame) {
	    this.skier.state = "alive";
	  }
	
	  ctx.clearRect(0, 0, 500, 500);
	  this.hazards.forEach(function (hazard) {
	    hazard.draw(ctx);
	  });
	
	  if (!this.SkierCaught) {
	    this.score += 1;
	    this.skier.draw(ctx, this.keysPressed, this.pauseGame, this.level);
	    this.sasquatch.draw(ctx, this.skier.position);
	  } else {
	    if (this.score >= this.winningScore) {
	      this.sasquatch.drawDeath(ctx);
	      this.userWins = true;
	    } else {
	      this.sasquatch.drawSasquatchFeeds(ctx);
	    }
	  }
	  this.drawNumbers(ctx);
	  this.WinLossMessage(ctx);
	};
	
	Game.prototype.drawNumbers = function (ctx) {
	  var score = "Points: " + this.score;
	  var crash = "Crashes: " + this.fallCount;
	
	  if (this.score > 1000) {
	    ctx.fillStyle = "#ffc0cb";
	  } else {
	    ctx.fillStyle = "#ff0000";
	  }
	
	  ctx.font = "18px 'Arial'";
	  ctx.fontWeight = "bold";
	  ctx.fillText(score, 10, 20);
	  ctx.fillText(crash, 120, 20);
	};
	
	Game.prototype.WinLossMessage = function (ctx) {
	  var canvas = document.getElementById('myCanvas');
	  if (this.SkierCaught) {
	    ctx.fillStyle = "#fd2047";
	    ctx.font = "60px 'Monoton'";
	    var Message = "You Lose";
	    if (this.userWins) {
	      Message = "You Win!!";
	    }
	    var MessageTextWidth = ctx.measureText(Message).width;
	    ctx.fillText(Message, canvas.width / 2 - MessageTextWidth / 2, 100);
	
	    ctx.font = "22px 'Arial'";
	    ctx.fillStyle = "#000000";
	    ctx.fontWeight = "bold";
	    var playAgainMessage = "Hit R to play again";
	    var playAgainTextWidth = ctx.measureText(playAgainMessage).width;
	    ctx.fillText(playAgainMessage, canvas.width / 2 - playAgainTextWidth / 2, 400);
	  }
	};
	
	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var Skier = function Skier(skierGraphics) {
	  this.graphics = skierGraphics;
	  this.radius = 25;
	  this.position = [250, 200];
	  this.state = "alive";
	  this.isCaptured = false;
	  this.jumping = false;
	  this.jumpStatus = "none";
	};
	
	Skier.prototype.updatePosition = function (keysPressed, level) {
	  var moveDistance = 3;
	  if (level === 'hard') {
	    moveDistance = 5;
	  }
	
	  if (keysPressed.right && this.position[0] < 480) {
	    this.position[0] = this.position[0] + moveDistance;
	  } else if (keysPressed.left && this.position[0] > 0) {
	    this.position[0] = this.position[0] - moveDistance;
	  }
	  if (this.jumping) {
	    this.addressJumping();
	  }
	};
	
	Skier.prototype.addressJumping = function () {
	  if (this.position[1] > 90 && this.jumpStatus !== "down") {
	    this.jumpStatus = "up";
	  } else if (this.position[1] <= 90) {
	    this.jumpStatus = "down";
	  }
	
	  if (this.jumpStatus === "up") {
	    this.position[1] -= 5;
	  } else if (this.jumpStatus === "down" && this.position[1] + 15 >= 200) {
	    this.position[1] = 200;
	    this.jumping = false;
	    this.jumpStatus = "none";
	  } else if (this.jumpStatus === "down") {
	    this.position[1] += 4;
	  }
	};
	
	Skier.prototype.draw = function (ctx, keysPressed, pauseGame, level) {
	  if (!pauseGame) {
	    this.updatePosition(keysPressed, level);
	  }
	
	  if (this.jumping) {
	    this.JumpDraw(ctx, keysPressed);
	    return;
	  }
	
	  switch (this.state) {
	    case "alive":
	      {
	        if (!pauseGame) {
	          if (keysPressed.left) {
	            ctx.drawImage(this.graphics, 49, 37, 17, 34, this.position[0], this.position[1], 17, 34);
	          } else if (keysPressed.right) {
	            ctx.drawImage(this.graphics, 49, 0, 17, 34, this.position[0], this.position[1], 17, 34);
	          } else {
	            ctx.drawImage(this.graphics, 65, 0, 17, 34, this.position[0], this.position[1], 17, 34);
	          }
	        }
	      }
	      break;
	    case "crashed":
	      {
	        ctx.drawImage(this.graphics, 240, 0, 31, 31, this.position[0], this.position[1], 31, 31);
	      }
	  }
	};
	
	Skier.prototype.JumpDraw = function (ctx, keysPressed) {
	  if (keysPressed.right) {
	    ctx.drawImage(this.graphics, 184, 0, 28, 34, this.position[0], this.position[1], 28, 34);
	  } else if (keysPressed.left) {
	    ctx.drawImage(this.graphics, 184, 41, 30, 30, this.position[0], this.position[1], 30, 30);
	  } else if (keysPressed.up) {
	    ctx.drawImage(this.graphics, 119, 77, 30, 32, this.position[0], this.position[1], 30, 32);
	  } else {
	    ctx.drawImage(this.graphics, 86, 0, 31, 34, this.position[0], this.position[1], 31, 34);
	  }
	};
	
	module.exports = Skier;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	var Hazard = function Hazard(position, obstacleGraphics) {
	  this.graphics = obstacleGraphics;
	  this.variant = Math.floor(Math.random() * 7);
	  this.position = position;
	  this.radius = 17;
	  this.moveSpeed = 5;
	  this.collided = false;
	};
	
	Hazard.prototype.move = function () {
	  this.position[1] -= this.moveSpeed;
	};
	
	Hazard.prototype.draw = function (ctx) {
	
	  switch (this.variant) {
	    case 0:
	      ctx.drawImage(this.graphics, 0, 28, 30, 34, this.position[0], this.position[1], 30, 34);
	      break;
	    case 1:
	      ctx.drawImage(this.graphics, 0, 28, 30, 34, this.position[0], this.position[1], 30, 34);
	      break;
	    case 2:
	      ctx.drawImage(this.graphics, 95, 66, 32, 64, this.position[0], this.position[1], 32, 64);
	      break;
	    case 3:
	      ctx.drawImage(this.graphics, 30, 52, 23, 11, this.position[0], this.position[1], 23, 11);
	      break;
	    case 4:
	      ctx.drawImage(this.graphics, 85, 138, 15, 32, this.position[0], this.position[1], 15, 32);
	      break;
	    case 5:
	      ctx.drawImage(this.graphics, 110, 56, 30, 9, this.position[0], this.position[1], 30, 9);
	      break;
	    case 6:
	      ctx.drawImage(this.graphics, 0, 103, 23, 27, this.position[0], this.position[1], 23, 27);
	  }
	};
	
	module.exports = Hazard;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	var Util = {
	  // inherits(ChildClass, ParentClass){
	  //   function Surrogate () {}
	  //   Surrogate.prototype = BaseClass.prototype;
	  //   Surrogate.constructor = childClass;
	  //   ChildClass.prototype = new Surrogate();
	  // },
	
	  randomStartPosition: function randomStartPosition() {
	    var x_coord = Math.floor(Math.random() * 500);
	    var y_coord = 500;
	    var position = [x_coord, y_coord];
	    return position;
	  },
	  randomPosition: function randomPosition() {
	    var position = [];
	    for (var i = 0; i < 2; i++) {
	      position.push(Math.floor(Math.random() * 500));
	    }
	
	    return position;
	  }
	};
	
	module.exports = Util;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	var Sasquatch = function Sasquatch(graphics) {
	  this.gotSkier = false;
	  this.position = [250, -230]; ///// -230
	  this.radius = 15;
	  this.graphics = graphics;
	  this.direction = "left";
	  this.moveFrame = 0;
	  this.moveFrameTimer = 0;
	  this.eatFrame = 1;
	  this.eatFrameTimer = 0;
	  this.deathFrame = 0;
	  this.deathFrameTimer = 0;
	  this.gameOver = false;
	};
	
	Sasquatch.prototype.updatePosition = function (SkierPosition) {
	  var moveDelta = 3; //////
	  if (SkierPosition[0] < this.position[0] - 500) {
	    this.position[0] = this.position[0] - moveDelta;
	    this.direction = "left";
	  } else if (SkierPosition[0] > this.position[0] + 500) {
	    this.position[0] = this.position[0] + moveDelta;
	    this.direction = "right";
	  }
	  if (this.position[1] < SkierPosition[1]) {
	    this.position[1] += 0.3;
	  }
	  if (this.direction === "left") {
	    this.position[0] -= 8;
	  } else {
	    this.position[0] += 8;
	  }
	};
	
	Sasquatch.prototype.updateFrame = function () {
	  if (this.moveFrame === 0) {
	    this.moveFrame = 1;
	  } else if (this.moveFrame === 1) {
	    this.moveFrame = 0;
	  }
	};
	
	Sasquatch.prototype.updateFrameTimer = function () {
	  if (this.moveFrameTimer > 5) {
	    this.moveFrameTimer = 0;
	  } else if (this.moveFrameTimer === 5) {
	    this.updateFrame();
	  }
	  this.moveFrameTimer += 1;
	};
	
	Sasquatch.prototype.manageSasquatch = function (SkierPosition) {
	  this.updatePosition(SkierPosition);
	  this.updateFrameTimer();
	};
	
	Sasquatch.prototype.draw = function (ctx, SkierPosition) {
	  this.manageSasquatch(SkierPosition);
	
	  if (this.direction === "right") {
	    switch (this.moveFrame) {
	      case 0:
	        ctx.drawImage(this.graphics, 91, 112, 31, 40, this.position[0], this.position[1], 31, 40);
	        break;
	      case 1:
	        ctx.drawImage(this.graphics, 62, 112, 29, 40, this.position[0], this.position[1], 29, 40);
	        break;
	    }
	  } else if (this.direction === "left") {
	    switch (this.moveFrame) {
	      case 0:
	        ctx.drawImage(this.graphics, 91, 158, 31, 40, this.position[0], this.position[1], 31, 40);
	        break;
	      case 1:
	        ctx.drawImage(this.graphics, 62, 158, 29, 40, this.position[0], this.position[1], 29, 40);
	        break;
	    }
	  }
	};
	
	Sasquatch.prototype.updateEatFrame = function () {
	
	  if (this.eatFrame === 0) {
	    this.eatFrame = 1;
	  } else if (this.eatFrame === 8) {
	    this.eatFrame = 7;
	  } else if (this.eatFrame === 7) {
	    this.eatFrame = 8;
	  } else this.eatFrame += 1;
	};
	
	Sasquatch.prototype.updateEatFrameTimer = function () {
	
	  if (this.eatFrameTimer > 5) {
	    this.eatFrameTimer = 0;
	  } else if (this.eatFrameTimer === 5) {
	    this.updateEatFrame();
	  }
	  this.eatFrameTimer += 1;
	};
	
	Sasquatch.prototype.drawSasquatchFeeds = function (ctx) {
	  this.updateEatFrameTimer();
	
	  switch (this.eatFrame) {
	    case 0:
	      ctx.drawImage(this.graphics, 35, 112, 25, 43, this.position[0], this.position[1], 25, 43);
	      break;
	    case 1:
	      ctx.drawImage(this.graphics, 0, 112, 32, 43, this.position[0], this.position[1], 32, 43);
	      break;
	    case 2:
	      ctx.drawImage(this.graphics, 122, 112, 34, 43, this.position[0], this.position[1], 34, 43);
	      break;
	    case 3:
	      ctx.drawImage(this.graphics, 156, 112, 31, 43, this.position[0], this.position[1], 31, 43);
	      break;
	    case 4:
	      ctx.drawImage(this.graphics, 187, 112, 31, 43, this.position[0], this.position[1], 31, 43);
	      break;
	    case 5:
	      ctx.drawImage(this.graphics, 219, 112, 25, 43, this.position[0], this.position[1], 25, 43);
	      break;
	    case 6:
	      ctx.drawImage(this.graphics, 243, 112, 26, 43, this.position[0], this.position[1], 26, 43);
	      break;
	    case 7:
	      ctx.drawImage(this.graphics, 35, 112, 25, 43, this.position[0], this.position[1], 25, 43);
	      break;
	    case 8:
	      ctx.drawImage(this.graphics, 0, 112, 32, 43, this.position[0], this.position[1], 32, 43);
	      break;
	  }
	};
	
	Sasquatch.prototype.updateDeathFrame = function () {
	  if (this.deathFrame < 7) {
	    this.deathFrame += 1;
	  }
	  if (this.deathFrame === 7) {
	    this.gameOver = true;
	  }
	};
	
	Sasquatch.prototype.updateDeathFrameTimer = function () {
	
	  if (this.deathFrameTimer > 10) {
	    this.deathFrameTimer = 0;
	  } else if (this.deathFrameTimer === 10) {
	    this.updateDeathFrame();
	  }
	  this.deathFrameTimer += 1;
	};
	
	Sasquatch.prototype.drawDeath = function (ctx) {
	  this.updateDeathFrameTimer();
	
	  switch (this.deathFrame) {
	
	    case 0:
	      ctx.drawImage(this.graphics, 91, 349, 19, 27, this.position[0], this.position[1] + 8, 19, 27);
	      break;
	    case 1:
	      ctx.drawImage(this.graphics, 112, 349, 18, 28, this.position[0], this.position[1] + 8, 18, 28);
	      break;
	    case 2:
	      ctx.drawImage(this.graphics, 130, 349, 18, 28, this.position[0] + 4, this.position[1] + 8, 18, 28);
	      break;
	    case 3:
	      ctx.drawImage(this.graphics, 148, 348, 24, 28, this.position[0] + 5, this.position[1] + 8, 24, 28);
	      break;
	    case 4:
	      ctx.drawImage(this.graphics, 171, 348, 25, 28, this.position[0], this.position[1] + 8, 25, 28);
	      break;
	    case 5:
	      ctx.drawImage(this.graphics, 194, 348, 35, 28, this.position[0] + 6, this.position[1] + 8, 35, 28);
	      break;
	    case 6:
	      ctx.drawImage(this.graphics, 31, 410, 44, 69, this.position[0] + 8, this.position[1] - 2, 44, 69);
	      break;
	    case 7:
	      ctx.drawImage(this.graphics, 78, 411, 47, 44, this.position[0] + 14, this.position[1] + 4, 47, 44);
	  }
	
	  if (this.deathFrame < 6) {
	    ctx.drawImage(this.graphics, 0, 112, 32, 43, this.position[0] + 28, this.position[1] - 8, 32, 43);
	  }
	  if (this.deathFrame === 7) {
	    ctx.drawImage(this.graphics, 184, 0, 28, 34, this.position[0] - 8, this.position[1] + 2, 28, 34);
	  }
	};
	
	module.exports = Sasquatch;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	var GameView = function GameView(game, ctx) {
	  this.game = game;
	  this.ctx = ctx;
	  this.gameStarted = false;
	};
	
	GameView.prototype.startGame = function () {
	  var _this = this;
	
	  if (this.gameStarted) {} else {
	    this.gameStarted = true;
	    setInterval(function () {
	      _this.game.updateBoard();
	      _this.game.draw(_this.ctx);
	      // something to check the status of the game needs to go here.
	    }, 30);
	  }
	};
	
	module.exports = GameView;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map