var SKIER_RADIUS = 25;
var SKIER_START_X = 250;
var SKIER_START_Y = 200;
var RIGHT_BOUNDARY = 480;
var LEFT_BOUNDARY = 0;
var JUMP_PEAK_Y = 90;
var JUMP_RISE_SPEED = 5;
var JUMP_FALL_SPEED = 4;
var MOVE_SPEED_NORMAL = 3;
var MOVE_SPEED_HARD = 5;

// Sprite regions from the skier sprite sheet [srcX, srcY, width, height]
var SPRITES = {
  SKIING_LEFT:     [49, 37, 17, 34],
  SKIING_RIGHT:    [49, 0, 17, 34],
  SKIING_STRAIGHT: [65, 0, 17, 34],
  CRASHED:         [240, 0, 31, 31],
  JUMP_RIGHT:      [184, 0, 28, 34],
  JUMP_LEFT:       [184, 41, 30, 30],
  JUMP_UP:         [119, 77, 30, 32],
  JUMP_STRAIGHT:   [86, 0, 31, 34]
};

var Skier = function (skierGraphics) {
  this.graphics = skierGraphics;
  this.radius = SKIER_RADIUS;
  this.position = [SKIER_START_X, SKIER_START_Y];
  this.state = 'alive';
  this.jumping = false;
  this.jumpDirection = 'none';
};

Skier.prototype.updatePosition = function (keysPressed, level) {
  var moveDistance = level === 'hard' ? MOVE_SPEED_HARD : MOVE_SPEED_NORMAL;

  if (keysPressed.right && this.position[0] < RIGHT_BOUNDARY) {
    this.position[0] += moveDistance;
  } else if (keysPressed.left && this.position[0] > LEFT_BOUNDARY) {
    this.position[0] -= moveDistance;
  }

  if (this.jumping) {
    this.updateJump();
  }
};

Skier.prototype.updateJump = function () {
  // Rising phase: move upward until reaching the peak
  if (this.position[1] > JUMP_PEAK_Y && this.jumpDirection !== 'down') {
    this.jumpDirection = 'up';
  } else if (this.position[1] <= JUMP_PEAK_Y) {
    this.jumpDirection = 'down';
  }

  if (this.jumpDirection === 'up') {
    this.position[1] -= JUMP_RISE_SPEED;
  } else if (this.jumpDirection === 'down') {
    // Falling phase: descend back to starting Y
    if (this.position[1] + JUMP_FALL_SPEED >= SKIER_START_Y) {
      this.position[1] = SKIER_START_Y;
      this.jumping = false;
      this.jumpDirection = 'none';
    } else {
      this.position[1] += JUMP_FALL_SPEED;
    }
  }
};

Skier.prototype.draw = function (ctx, keysPressed, paused, level) {
  if (!paused) {
    this.updatePosition(keysPressed, level);
  }

  if (this.jumping) {
    this.drawJumping(ctx, keysPressed);
    return;
  }

  if (this.state === 'crashed') {
    this.drawSprite(ctx, SPRITES.CRASHED);
    return;
  }

  // Alive state
  if (!paused) {
    if (keysPressed.left) {
      this.drawSprite(ctx, SPRITES.SKIING_LEFT);
    } else if (keysPressed.right) {
      this.drawSprite(ctx, SPRITES.SKIING_RIGHT);
    } else {
      this.drawSprite(ctx, SPRITES.SKIING_STRAIGHT);
    }
  }
};

Skier.prototype.drawJumping = function (ctx, keysPressed) {
  if (keysPressed.right) {
    this.drawSprite(ctx, SPRITES.JUMP_RIGHT);
  } else if (keysPressed.left) {
    this.drawSprite(ctx, SPRITES.JUMP_LEFT);
  } else if (keysPressed.up) {
    this.drawSprite(ctx, SPRITES.JUMP_UP);
  } else {
    this.drawSprite(ctx, SPRITES.JUMP_STRAIGHT);
  }
};

Skier.prototype.drawSprite = function (ctx, sprite) {
  ctx.drawImage(
    this.graphics,
    sprite[0], sprite[1], sprite[2], sprite[3],
    this.position[0], this.position[1], sprite[2], sprite[3]
  );
};

module.exports = Skier;
