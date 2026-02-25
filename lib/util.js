var CANVAS_SIZE = 500;

var Util = {
  randomStartPosition: function () {
    var x = Math.floor(Math.random() * CANVAS_SIZE);
    return [x, CANVAS_SIZE];
  },

  randomPosition: function () {
    var x = Math.floor(Math.random() * CANVAS_SIZE);
    var y = Math.floor(Math.random() * CANVAS_SIZE);
    return [x, y];
  }
};

module.exports = Util;
