const Util = {
  inherits(ChildClass, ParentClass){
    function Surrogate () {}
    Surrogate.prototype = BaseClass.prototype;
    Surrogate.constructor = childClass;
    ChildClass.prototype = new Surrogate();
  }
}


module.exports = Util
