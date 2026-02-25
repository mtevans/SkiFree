var SASQUATCH_START_X = 250;
var SASQUATCH_START_Y = -230;
var SASQUATCH_RADIUS = 15;
var LATERAL_SPEED = 8;
var VERTICAL_TRACKING_SPEED = 0.3;
var DIRECTION_CHANGE_THRESHOLD = 500;
var CHASE_SPEED = 3;

// Animation timer thresholds
var WALK_FRAME_INTERVAL = 5;
var EAT_FRAME_INTERVAL = 5;
var DEATH_FRAME_INTERVAL = 10;
var DEATH_FINAL_FRAME = 7;

// Walk animation sprites [srcX, srcY, width, height]
var WALK_SPRITES = {
  right: [
    [91, 112, 31, 40],
    [62, 112, 29, 40]
  ],
  left: [
    [91, 158, 31, 40],
    [62, 158, 29, 40]
  ]
};

// Eating animation sprites (frames 0-8)
var EAT_SPRITES = [
  [35, 112, 25, 43],
  [0, 112, 32, 43],
  [122, 112, 34, 43],
  [156, 112, 31, 43],
  [187, 112, 31, 43],
  [219, 112, 25, 43],
  [243, 112, 26, 43],
  [35, 112, 25, 43],
  [0, 112, 32, 43]
];

// Death animation sprites (frames 0-7) with position offsets [srcX, srcY, w, h, offsetX, offsetY]
var DEATH_SPRITES = [
  [91, 349, 19, 27, 0, 8],
  [112, 349, 18, 28, 0, 8],
  [130, 349, 18, 28, 4, 8],
  [148, 348, 24, 28, 5, 8],
  [171, 348, 25, 28, 0, 8],
  [194, 348, 35, 28, 6, 8],
  [31, 410, 44, 69, 8, -2],
  [78, 411, 47, 44, 14, 4]
];

// Sasquatch standing sprite shown alongside death animation (frames 0-5)
var DEATH_SASQUATCH_SPRITE = [0, 112, 32, 43];

// Skier escaping sprite shown at final death frame
var SKIER_ESCAPE_SPRITE = [184, 0, 28, 34];

var Sasquatch = function (graphics) {
  this.graphics = graphics;
  this.position = [SASQUATCH_START_X, SASQUATCH_START_Y];
  this.radius = SASQUATCH_RADIUS;
  this.direction = 'left';
  this.gameOver = false;

  // Walk animation state
  this.walkFrame = 0;
  this.walkTimer = 0;

  // Eating animation state
  this.eatFrame = 1;
  this.eatTimer = 0;

  // Death animation state
  this.deathFrame = 0;
  this.deathTimer = 0;
};

Sasquatch.prototype.updatePosition = function (skierPosition) {
  // Adjust direction based on skier position
  if (skierPosition[0] < this.position[0] - DIRECTION_CHANGE_THRESHOLD) {
    this.position[0] -= CHASE_SPEED;
    this.direction = 'left';
  } else if (skierPosition[0] > this.position[0] + DIRECTION_CHANGE_THRESHOLD) {
    this.position[0] += CHASE_SPEED;
    this.direction = 'right';
  }

  // Slowly track the skier's vertical position
  if (this.position[1] < skierPosition[1]) {
    this.position[1] += VERTICAL_TRACKING_SPEED;
  }

  // Move laterally in current direction
  if (this.direction === 'left') {
    this.position[0] -= LATERAL_SPEED;
  } else {
    this.position[0] += LATERAL_SPEED;
  }
};

// Generic frame timer: increments timer, calls callback when threshold is reached, resets
Sasquatch.prototype.tickTimer = function (timerKey, frameInterval, onTick) {
  this[timerKey] += 1;
  if (this[timerKey] === frameInterval) {
    onTick.call(this);
  } else if (this[timerKey] > frameInterval) {
    this[timerKey] = 0;
  }
};

Sasquatch.prototype.advanceWalkFrame = function () {
  this.walkFrame = this.walkFrame === 0 ? 1 : 0;
};

Sasquatch.prototype.draw = function (ctx, skierPosition) {
  this.updatePosition(skierPosition);
  this.tickTimer('walkTimer', WALK_FRAME_INTERVAL, this.advanceWalkFrame);

  var sprites = WALK_SPRITES[this.direction];
  var sprite = sprites[this.walkFrame];
  ctx.drawImage(
    this.graphics,
    sprite[0], sprite[1], sprite[2], sprite[3],
    this.position[0], this.position[1], sprite[2], sprite[3]
  );
};

Sasquatch.prototype.advanceEatFrame = function () {
  if (this.eatFrame === 0) {
    this.eatFrame = 1;
  } else if (this.eatFrame >= 7) {
    // Oscillate between frames 7 and 8 once the sequence finishes
    this.eatFrame = this.eatFrame === 8 ? 7 : 8;
  } else {
    this.eatFrame += 1;
  }
};

Sasquatch.prototype.drawEating = function (ctx) {
  this.tickTimer('eatTimer', EAT_FRAME_INTERVAL, this.advanceEatFrame);

  var sprite = EAT_SPRITES[this.eatFrame];
  ctx.drawImage(
    this.graphics,
    sprite[0], sprite[1], sprite[2], sprite[3],
    this.position[0], this.position[1], sprite[2], sprite[3]
  );
};

Sasquatch.prototype.advanceDeathFrame = function () {
  if (this.deathFrame < DEATH_FINAL_FRAME) {
    this.deathFrame += 1;
  }
  if (this.deathFrame === DEATH_FINAL_FRAME) {
    this.gameOver = true;
  }
};

Sasquatch.prototype.drawDeath = function (ctx) {
  this.tickTimer('deathTimer', DEATH_FRAME_INTERVAL, this.advanceDeathFrame);

  // Draw the skier's death/explosion animation
  var sprite = DEATH_SPRITES[this.deathFrame];
  ctx.drawImage(
    this.graphics,
    sprite[0], sprite[1], sprite[2], sprite[3],
    this.position[0] + sprite[4], this.position[1] + sprite[5], sprite[2], sprite[3]
  );

  // Draw the sasquatch standing next to the skier during early frames
  if (this.deathFrame < 6) {
    var sq = DEATH_SASQUATCH_SPRITE;
    ctx.drawImage(
      this.graphics,
      sq[0], sq[1], sq[2], sq[3],
      this.position[0] + 28, this.position[1] - 8, sq[2], sq[3]
    );
  }

  // Draw the skier escaping at the final frame
  if (this.deathFrame === DEATH_FINAL_FRAME) {
    var esc = SKIER_ESCAPE_SPRITE;
    ctx.drawImage(
      this.graphics,
      esc[0], esc[1], esc[2], esc[3],
      this.position[0] - 8, this.position[1] + 2, esc[2], esc[3]
    );
  }
};

module.exports = Sasquatch;
