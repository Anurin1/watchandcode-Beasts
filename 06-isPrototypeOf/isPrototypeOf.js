function isPrototypeOf(prototypeObj, targetObj) {
  if (prototypeObj === null || prototypeObj === undefined) {
    throw new TypeError("Invalid argument.");
  }

  var prototypeOfTargetObj = Object.getPrototypeOf(targetObj);

  //base case A: reached the top of the chain
  if (prototypeOfTargetObj === null) {
    return false;
  }
  //base case B: found a match
  if (prototypeOfTargetObj === prototypeObj) {
    return true;
  } else {
    //recursion: goes one level up in the prototype chain
    return isPrototypeOf(prototypeObj, prototypeOfTargetObj);
  }
}

// testing variables
var canine = {};
var dog = Object.create(canine);
var myDog = Object.create(dog);
var empty = Object.create(null);

tests({
  "It should return a boolean value.": function() {
    var isTypeOfBoolen = false;

    var isPrototypeOfResult = isPrototypeOf({}, {});

    isTypeOfBoolen = typeof isPrototypeOfResult === "boolean";
    eq(isTypeOfBoolen, true);
  },

  "If prototypeObj is equal to null, it should throw a TypeError.": function() {
    var isTypeError = false;
    try {
      isPrototypeOf(null, {});
    } catch (error) {
      isTypeError = error instanceof TypeError;
    }

    eq(isTypeError, true);
  },

  "If prototypeObj is equal to undefined, it should throw a TypeError.": function() {
    var isTypeError = false;
    try {
      isPrototypeOf(undefined, {});
    } catch (error) {
      isTypeError = error instanceof TypeError;
    }

    eq(isTypeError, true);
  },

  "If 'dog' object is prototype of 'myDog' object, it should return true.": function() {
    var isPrototypeOfResult = isPrototypeOf(dog, myDog);
    eq(isPrototypeOfResult, true);
  },

  "If 'dog' object is not prototype of 'empty' object, it should return false.": function() {
    var isPrototypeOfResult = isPrototypeOf(dog, empty);
    eq(isPrototypeOfResult, false);
  },

  "If 'Object.prototype' is prototype of 'myDog' object, it should return true.": function() {
    var isPrototypeOfResult = isPrototypeOf(Object.prototype, myDog);
    eq(isPrototypeOfResult, true);
  },

  "If 'canine' object is prototype of 'myDog' object, it should return true.": function() {
    var isPrototypeOfResult = isPrototypeOf(canine, myDog);
    eq(isPrototypeOfResult, true);
  }
});
