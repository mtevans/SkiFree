const Util = {
  inherits(ChildClass, ParentClass){
    function Surrogate () {}
    Surrogate.prototype = BaseClass.prototype;
    Surrogate.constructor = childClass;
    ChildClass.prototype = new Surrogate();
  },
  randomPosition() {
    var position = [];
    for (var i = 0; i < 2; i++) {
      position.push(Math.floor(Math.random() * 500));
    }

    return position;
  },
}


module.exports = Util
