// Obstacle variant types
var VARIANT = {
  SMALL_TREE: 0,
  SMALL_TREE_ALT: 1,
  TALL_TREE: 2,
  ROCK: 3,
  STUMP: 4,
  JUMP_RAMP: 5,
  SNOWMAN: 6
};

var VARIANT_COUNT = 7;

// Sprite regions for each obstacle variant [srcX, srcY, width, height]
var OBSTACLE_SPRITES = {};
OBSTACLE_SPRITES[VARIANT.SMALL_TREE]     = [0, 28, 30, 34];
OBSTACLE_SPRITES[VARIANT.SMALL_TREE_ALT] = [0, 28, 30, 34];
OBSTACLE_SPRITES[VARIANT.TALL_TREE]      = [95, 66, 32, 64];
OBSTACLE_SPRITES[VARIANT.ROCK]           = [30, 52, 23, 11];
OBSTACLE_SPRITES[VARIANT.STUMP]          = [85, 138, 15, 32];
OBSTACLE_SPRITES[VARIANT.JUMP_RAMP]      = [110, 56, 30, 9];
OBSTACLE_SPRITES[VARIANT.SNOWMAN]        = [0, 103, 23, 27];

var DEFAULT_MOVE_SPEED = 5;
var DEFAULT_RADIUS = 17;

var Hazard = function (position, obstacleGraphics) {
  this.graphics = obstacleGraphics;
  this.variant = Math.floor(Math.random() * VARIANT_COUNT);
  this.position = position;
  this.radius = DEFAULT_RADIUS;
  this.moveSpeed = DEFAULT_MOVE_SPEED;
  this.collided = false;
};

Hazard.prototype.move = function () {
  this.position[1] -= this.moveSpeed;
};

Hazard.prototype.draw = function (ctx) {
  var sprite = OBSTACLE_SPRITES[this.variant];
  if (!sprite) {
    return;
  }

  ctx.drawImage(
    this.graphics,
    sprite[0], sprite[1], sprite[2], sprite[3],
    this.position[0], this.position[1], sprite[2], sprite[3]
  );
};

module.exports = Hazard;
