//saves IIFE to a variable, for resetting libraryStorage to an empty object in each test cases
(init = function() {
  var libraryStorage = {};

  function librarySystem(libraryName, dependencyNameArr, callback) {
    if (arguments.length === 1) {
      // returns library from libraryStorage object

      var libraryDependecyNameArr = libraryStorage[libraryName].dependencyNameArr;

      var libraryDependencyValueArr = libraryDependecyNameArr.map(function(dependencyName) {
        if (libraryStorage[dependencyName].data === undefined) {
          //if the library has no data, run callback
          libraryStorage[dependencyName].data = libraryStorage[dependencyName].callback();
        }
        return libraryStorage[dependencyName].data;
      });

      if (libraryStorage[libraryName].data === undefined) {
        //if the library has no data, run callback
        libraryStorage[libraryName].data = libraryStorage[libraryName].callback(...libraryDependencyValueArr);
      }

      return libraryStorage[libraryName].data;
    } else {
      // saves library to libraryStorage object
      if (!Array.isArray(dependencyNameArr)) {
        throw new TypeError("Invalid argument.");
      }

      libraryStorage[libraryName] = {
        dependencyNameArr: dependencyNameArr,
        callback: callback,
        data: undefined
      };
    }
  }

  window.librarySystem = librarySystem;
})();

tests({
  "If no dependencies, it should return the library.": function() {
    init(); //resets libraryStorage to an emypty object

    librarySystem("name", [], function() {
      return "Gordon";
    });

    var libraryValue = librarySystem("name");
    eq(libraryValue, "Gordon");
  },

  "If the second argument is not an array, it should throw a typeError.": function() {
    init(); //resets libraryStorage to an emypty object

    var isTypeError = false;
    try {
      librarySystem("name", '[]', function() {
        return "Gordon";
      });
    } catch (error) {
      isTypeError = error instanceof TypeError;
    }

    eq(isTypeError, true);
  },

  "If dependencies, and dependencies run first, it should return the library with loaded dependencies.": function() {
    init(); //resets libraryStorage to an emypty object

    librarySystem("name", [], function() {
      return "Gordon";
    });
    librarySystem("company", [], function() {
      return "Watch and Code";
    });
    librarySystem("workBlurb", ["name", "company"], function(name, company) {
      return name + " works at " + company;
    });

    var libraryValue = librarySystem("workBlurb");
    eq(libraryValue, "Gordon works at Watch and Code");
  },

  "If dependencies, and the library runs first, it should still return the library with loaded dependencies.": function() {
    init(); //resets libraryStorage to an emypty object

    librarySystem("workBlurb", ["name", "company"], function(name, company) {
      return name + " works at " + company;
    });
    librarySystem("name", [], function() {
      return "Gordon";
    });
    librarySystem("company", [], function() {
      return "Watch and Code";
    });

    var libraryValue = librarySystem("workBlurb");
    eq(libraryValue, "Gordon works at Watch and Code");
  },
  "It should return the library, even if the library and dependencies run in any order.": function() {
    init(); //resets libraryStorage to an emypty object

    librarySystem("company", [], function() {
      return "Watch and Code";
    });
    librarySystem("workBlurb", ["name", "company"], function(name, company) {
      return name + " works at " + company;
    });
    librarySystem("name", [], function() {
      return "Gordon";
    });

    var libraryValue = librarySystem("workBlurb");
    eq(libraryValue, "Gordon works at Watch and Code");
  },

  "If no dependencies, the callback function should run only once.": function() {
    init(); //resets libraryStorage to an emypty object
    var callbackRuns = 0;

    librarySystem("name", [], function() {
      callbackRuns++;
      return "Gordon";
    });

    librarySystem("name");
    librarySystem("name");
    librarySystem("name");

    eq(callbackRuns, 1);
  },

  "If dependencies, all callback functions should run only once.": function() {
    init(); //resets libraryStorage to an emypty object
    var callbackRuns = 0;

    librarySystem("workBlurb", ["name", "company"], function(name, company) {
      callbackRuns++;
      return name + " works at " + company;
    });
    librarySystem("company", [], function() {
      callbackRuns++;
      return "Watch and Code";
    });
    librarySystem("name", [], function() {
      callbackRuns++;
      return "Gordon";
    });

    librarySystem("workBlurb");
    librarySystem("workBlurb");
    librarySystem("workBlurb");
    librarySystem("name");
    librarySystem("name");
    librarySystem("company");
    librarySystem("company");

    eq(callbackRuns, 3);
  }
});
