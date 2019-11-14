function toFixed(num, precision = 0) {
  var decimal = ".";

  if (typeof precision !== "number") {
    precision = Number(precision);
  }

  if (Object.is(precision, NaN)) {
    throw new TypeError("Invalid argument.");
  }

  if (precision < 0) {
    precision = Math.abs(precision);
  }

  var numString = num + "";
  var numArr = numString.split("");

  //finds the index of the decimal point separator
  var decimalIndex = numArr.indexOf(decimal);

  var numberOfDecimalPlaces = numArr.length - decimalIndex - 1;
  if (precision > numberOfDecimalPlaces) {
    //if precision is greater than number od decimal places, pads the end of the number
    return numString.padEnd(numArr.length + precision - numberOfDecimalPlaces, "0");
  }

  //creates 'multiplied' version of the number
  numArr.splice(decimalIndex, 1);
  numArr.splice(decimalIndex + precision, 0, decimal);
  var multipledNum = Number(numArr.join(""));

  //rounds 'multiplied' number
  var roundedNumString = Math.round(multipledNum) + "";

  if (precision === 0) {
    return roundedNumString;
  }

  //returns decimal point separator back to its original position
  numString = roundedNumString + "";
  numArr = numString.split("");
  numArr.splice(-precision, 0, decimal);

  var result = Number(numArr.join(""));
  return result + "";
}

console.log(toFixed(0.5, -5));

tests({
  "It should round numbers with precision equals to 0.": function() {
    var toFixedResult = toFixed(0.615, 0);

    eq(toFixedResult, "1");
  },

  "It should round numbers with precision equals to 1.": function() {
    var toFixedResult = toFixed(0.615, 1);

    eq(toFixedResult, "0.6");
  },

  "It should round numbers with precision equals to 2.": function() {
    var toFixedResult = toFixed(0.615, 2);

    eq(toFixedResult, "0.62");
  },

  "It should round numbers with precision equals to 3.": function() {
    var toFixedResult = toFixed(0.615, 3);

    eq(toFixedResult, "0.615");
  },
  "If the precision is greater than the number of decimal places, it should return the original number.": function() {
    var toFixedResult = toFixed(0.615, 4);
    eq(toFixedResult, "0.6150");

    var toFixedResult = toFixed(0.615, 7);
    eq(toFixedResult, "0.6150000");
  },

  "If the precision is negative, it should use the absolute value of the precision.": function() {
    var toFixedResult = toFixed(0.615, -2);

    eq(toFixedResult, "0.62");
  },

  "If the precision is not a number or string-like number, it should throw a typeError.": function() {
    var isTypeError = false;
    try {
      var toFixedResult = toFixed(0.615, "a");
    } catch (error) {
      isTypeError = error instanceof TypeError;
    }

    eq(isTypeError, true);

    var toFixedResult = toFixed(0.615, "2");

    eq(toFixedResult, "0.62");
  },

  "Random tests.": function() {
    var toFixedResult = toFixed(10.235, 2);
    eq(toFixedResult, "10.24");

    var toFixedResult = toFixed(10.235, 1);
    eq(toFixedResult, "10.2");

    var toFixedResult = toFixed(10.265, 1);
    eq(toFixedResult, "10.3");

    var toFixedResult = toFixed(10.235, 0);
    eq(toFixedResult, "10");

    var toFixedResult = toFixed(10.635, 0);
    eq(toFixedResult, "11");
    //
    var toFixedResult = toFixed(1.005, 2);
    eq(toFixedResult, "1.01");

    var toFixedResult = toFixed(1.005, 1);
    eq(toFixedResult, "1");

    var toFixedResult = toFixed(1.005, 0);
    eq(toFixedResult, "1");

    var toFixedResult = toFixed(1.005, 8);
    eq(toFixedResult, "1.00500000");
  }
});
