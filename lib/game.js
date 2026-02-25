var Skier = require('./skier'),
    Hazard = require('./hazard'),
    Util = require('./util'),
    Sasquatch = require('./sasquatch');

// Score thresholds for difficulty progression
var DIFFICULTY = {
  MEDIUM_THRESHOLD: 110,
  HARD_THRESHOLD: 750,
  WINNING_SCORE: 1000
};

// Hazard counts at each difficulty tier
var HAZARD_COUNTS = {
  BASE: 10,
  TIER_1: 14,   // score > 100
  TIER_2: 17,   // score === MEDIUM_THRESHOLD (medium unlocked)
  TIER_3: 20,   // score > 500
  TIER_4: 25,   // score > 600, and also at hard
  TIER_5: 30    // score > 1000
};

// Movement speeds per difficulty
var HAZARD_SPEED = {
  EASY: 5,
  MEDIUM: 7,
  HARD: 8
};

var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;
var COLLISION_PENALTY = 100;
var COLLISION_PAUSE_MS = 1000;
var OVERLAP_THRESHOLD = 20;
var INITIAL_HAZARD_COUNT = 9;
var JUMP_RAMP_VARIANT = 5;

var Game = function (skierGraphics, obstacleGraphics) {
  this.skierGraphics = skierGraphics;
  this.obstacleGraphics = obstacleGraphics;
  this.winningScore = DIFFICULTY.WINNING_SCORE;
  this.reset();
};

Game.prototype.reset = function () {
  this.skier = new Skier(this.skierGraphics);
  this.sasquatch = new Sasquatch(this.skierGraphics);
  this.keysPressed = { left: false, right: false, up: false };
  this.hazardCount = INITIAL_HAZARD_COUNT;
  this.hazards = [];
  this.populateHazards();
  this.level = 'easy';
  this.skierCaught = false;
  this.jumping = false;
  this.paused = false;
  this.score = 0;
  this.fallCount = 0;
  this.userWins = false;
};

Game.prototype.populateHazards = function () {
  for (var i = 0; i < this.hazardCount; i++) {
    this.hazards.push(new Hazard(Util.randomPosition(), this.obstacleGraphics));
  }
};

Game.prototype.createHazard = function () {
  if (this.hazards.length >= this.hazardCount) {
    return;
  }

  var position = Util.randomStartPosition();
  while (this.hasOverlap(position)) {
    position = Util.randomStartPosition();
  }

  var newHazard = new Hazard(position, this.obstacleGraphics);
  if (this.level === 'medium') {
    newHazard.moveSpeed = HAZARD_SPEED.MEDIUM;
  } else if (this.level === 'hard') {
    newHazard.moveSpeed = HAZARD_SPEED.HARD;
  }
  this.hazards.push(newHazard);
};

Game.prototype.hasOverlap = function (position) {
  var recentHazards = this.hazards.slice(Math.floor(this.hazards.length / 2));
  var posX = position[0];

  for (var i = 0; i < recentHazards.length; i++) {
    var hazX = recentHazards[i].position[0];
    if (posX < hazX + OVERLAP_THRESHOLD && posX > hazX - OVERLAP_THRESHOLD) {
      return true;
    }
  }
  return false;
};

Game.prototype.moveHazards = function () {
  this.hazards.forEach(function (hazard) {
    hazard.move();
  });
};

Game.prototype.removeOffscreenHazards = function () {
  this.hazards = this.hazards.filter(function (hazard) {
    return hazard.position[1] >= -60;
  });
};

Game.prototype.monitorDifficulty = function () {
  if (this.score > DIFFICULTY.WINNING_SCORE) {
    this.hazardCount = HAZARD_COUNTS.TIER_5;
  } else if (this.score > DIFFICULTY.HARD_THRESHOLD) {
    this.hazardCount = HAZARD_COUNTS.TIER_4;
    this.level = 'hard';
    this.updateHazardSpeeds();
  } else if (this.score > 600) {
    this.hazardCount = HAZARD_COUNTS.TIER_4;
  } else if (this.score > 500) {
    this.hazardCount = HAZARD_COUNTS.TIER_3;
  } else if (this.score === DIFFICULTY.MEDIUM_THRESHOLD) {
    this.hazardCount = HAZARD_COUNTS.TIER_2;
    this.level = 'medium';
    this.updateHazardSpeeds();
  } else if (this.score > 100) {
    this.hazardCount = HAZARD_COUNTS.TIER_1;
  } else {
    this.hazardCount = HAZARD_COUNTS.BASE;
  }
};

Game.prototype.updateHazardSpeeds = function () {
  var level = this.level;
  this.hazards.forEach(function (hazard) {
    if (level === 'medium') {
      hazard.moveSpeed = HAZARD_SPEED.MEDIUM;
    } else if (level === 'hard') {
      hazard.moveSpeed = HAZARD_SPEED.HARD;
    }
  });
};

Game.prototype.monitorHazards = function () {
  this.moveHazards();
  this.removeOffscreenHazards();
  this.monitorDifficulty();
  this.createHazard();
};

Game.prototype.checkForCollisions = function () {
  var skiX = this.skier.position[0];
  var skiY = this.skier.position[1];
  var self = this;

  this.hazards.forEach(function (hazard) {
    if (hazard.collided) {
      return;
    }

    var hazX = hazard.position[0];
    var hazY = hazard.position[1];
    var withinX = skiX < hazX + hazard.radius && skiX > hazX - hazard.radius;
    var withinY = skiY < hazY + 4 && skiY > hazY - 8;

    if (!withinX || !withinY) {
      return;
    }

    if (hazard.variant === JUMP_RAMP_VARIANT) {
      self.jumping = true;
      self.skier.jumping = true;
    } else {
      self.skier.state = 'crashed';
      hazard.collided = true;
      self.score -= COLLISION_PENALTY;
      self.fallCount += 1;
      self.pauseAfterCollision();
    }
  });
};

Game.prototype.pauseAfterCollision = function () {
  var self = this;
  this.paused = true;
  setTimeout(function () {
    self.paused = false;
  }, COLLISION_PAUSE_MS);
};

Game.prototype.monitorSasquatch = function () {
  var skiX = this.skier.position[0];
  var skiY = this.skier.position[1];
  var sasqX = this.sasquatch.position[0];
  var sasqY = this.sasquatch.position[1];

  var withinX = skiX < sasqX + this.sasquatch.radius && skiX > sasqX - this.sasquatch.radius;
  var withinY = skiY < sasqY + 20 && skiY > sasqY - 20;

  if (withinX && withinY) {
    this.skierCaught = true;
  }
};

Game.prototype.updateBoard = function () {
  this.jumping = this.skier.jumping;

  if (!this.jumping) {
    this.monitorSasquatch();
  }

  if (!this.paused) {
    if (!this.jumping) {
      this.checkForCollisions();
    }
    if (!this.skierCaught) {
      this.monitorHazards();
    }
  }
};

Game.prototype.draw = function (ctx) {
  if (!this.paused) {
    this.skier.state = 'alive';
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  this.hazards.forEach(function (hazard) {
    hazard.draw(ctx);
  });

  if (!this.skierCaught) {
    this.score += 1;
    this.skier.draw(ctx, this.keysPressed, this.paused, this.level);
    this.sasquatch.draw(ctx, this.skier.position);
  } else {
    if (this.score >= this.winningScore) {
      this.sasquatch.drawDeath(ctx);
      this.userWins = true;
    } else {
      this.sasquatch.drawEating(ctx);
    }
  }

  this.drawScore(ctx);
  this.drawWinLossMessage(ctx);
};

Game.prototype.drawScore = function (ctx) {
  var scoreText = 'Points: ' + this.score;
  var crashText = 'Crashes: ' + this.fallCount;

  ctx.fillStyle = this.score > DIFFICULTY.WINNING_SCORE ? '#ffc0cb' : '#ff0000';
  ctx.font = "18px 'Arial'";
  ctx.fillText(scoreText, 10, 20);
  ctx.fillText(crashText, 120, 20);
};

Game.prototype.drawWinLossMessage = function (ctx) {
  if (!this.skierCaught) {
    return;
  }

  var canvas = document.getElementById('myCanvas');
  var message = this.userWins ? 'You Win!!' : 'You Lose';

  ctx.fillStyle = '#fd2047';
  ctx.font = "60px 'Monoton'";
  var messageWidth = ctx.measureText(message).width;
  ctx.fillText(
    message,
    (canvas.width / 2) - (messageWidth / 2),
    100
  );

  ctx.font = "22px 'Arial'";
  ctx.fillStyle = '#000000';
};

module.exports = Game;
