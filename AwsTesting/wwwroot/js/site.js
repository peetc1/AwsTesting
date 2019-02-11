$(function () {
    function appendTable(func, expected, actual) {
        var tr = $("<tr>");
        var fnc = $("<td>").text(func);
        var exp = $("<td>").text(expected);
        var act = $("<td>").text(actual);

        tr.append(fnc);
        tr.append(exp);
        tr.append(act);

        // if successful green background
        var cssClass = "danger";
        if (expected === actual || (isNaN(expected) && isNaN(actual))) {
            cssClass = "success";
        }
        tr.addClass(cssClass);

        $("#results tbody").append(tr);
    }

    // Number test for all parameters
    function areNumbers() {
        var val = true;
        for (i = 0; i < arguments.length; i++) {
            if (isNaN(arguments[i])) {
                val = false;
                break;
            }
        }
        return val;
    }

    // check is it's an array
    function isArray(obj) {
        return Array.isArray(obj);
    }

    // check parameters for 2 length array
    function isArrayTwoLength(obj) {
        return (isArray(obj) && obj.length === 2);
    }

    var Calculator = function () {
        // Addition
        this.add = function(x, y) {
            return (areNumbers(x, y)) ? x + y : NaN;
        };

        // Subtraction
        this.subtract = function(x, y) {
            return (areNumbers(x, y)) ? x - y : NaN;
        };

        // Multiplication
        this.multiply = function(x, y) {
            return (areNumbers(x, y)) ? x * y : NaN;
        };

        // Division
        this.divide = function(x, y) {
            return (areNumbers(x, y) && y !== 0) ? x / y : NaN;
        };
    };

    var ScientificCalculator = function () {
        // sine
        this.sin = function(x) {
            return (areNumbers(x)) ? Math.sin(x) : NaN;
        };

        // cosine
        this.cos = function(x) {
            return (areNumbers(x)) ? Math.cos(x) : NaN;
        };

        // tangent
        this.tan = function(x) {
            return (areNumbers(x)) ? Math.tan(x) : NaN;
        };

        // logarithm
        this.log = function(x) {
            return (areNumbers(x)) ? Math.log(x) : NaN;
        };
    };


    var withExponents = function () {
        // x to the power of y
        this.pow = function(x, y) {
            return (areNumbers(x, y)) ? Math.pow(x, y) : NaN;
        };
        
        // multiple 2 exponents
        this.multiplyExp = function(x, y) {
            var ary = this.checkArrayAndPow(x, y);
            return (areNumbers(ary[0], ary[1])) ? ary[0] * ary[1] : NaN;
        };


        // divide two exponents
        this.divideExp = function(x, y) {
            var ary = this.checkArrayAndPow(x, y);
            return (areNumbers(ary[0], ary[1]) && ary[1] !== 0) ? ary[0] / ary[1] : NaN;
        };

        // Checks the array for proper length and resolves exponent
        this.checkArrayAndPow = function(x, y) {
            var ary = [NaN, NaN];
            if (isArrayTwoLength(x) && isArrayTwoLength(y)) {
                ary[0] = this.pow(x[0], x[1]);
                ary[1] = this.pow(y[0], y[1]);
            }
            return ary;
        };
    };

    function delay(ms, obj, func, parms) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    resolve(obj[func].apply(this, parms));
                } catch (err) {
                    reject("rejected");
                }
            }, ms);
        });
    }

    // inherit from calculator instance
    ScientificCalculator.prototype = new Calculator();

    var basic = new Calculator();

    // check basic calculator  
    appendTable("add", 3, basic.add(1, 2));

    appendTable("subtract", 7, basic.subtract(9, 2));
    appendTable("multiply", 12, basic.multiply(4, 3));
    appendTable("divide", 5, basic.divide(10, 2));
    appendTable("divide by 0", NaN, basic.divide(5, 0));

    var sci = new ScientificCalculator();

    // check instances
    appendTable("instanceof Calculator", true, sci instanceof Calculator);
    appendTable("instanceof ScientificCalculator", true, sci instanceof ScientificCalculator);

    // check scientific calculator
    appendTable("sin", 1, sci.sin(Math.PI / 2));
    appendTable("cos", -1, sci.cos(Math.PI));
    appendTable("tan", 0, sci.tan(0));
    appendTable("log", 0, sci.log(1));

    // functional mixin
    var exp = new Calculator();
    withExponents.call(exp);

    // check with exponents calculator
    appendTable("pow", 8, exp.pow(2, 3));
    appendTable("multiplyExp", 128, exp.multiplyExp([2, 3], [2, 4]));
    appendTable("divideExp", 0.25, exp.divideExp([2, 3], [2, 5]));

    // delay add
    var delAdd = new Calculator();
    var willAdd = delay(100, delAdd, "add", [1, 1]);

    appendTable("instanceof Promise", true, willAdd instanceof Promise);
    willAdd.then(function () {
        appendTable("fulfilled", true, true);
    }, function (err) {
        appendTable("fulfilled", true, err);
    });

    // delay add 2
    var delAdd2 = new Calculator();
    var willAdd2 = delay(1000, delAdd2, "add", [10, 5]);
    willAdd2.then(function (val) {
        console.log(willAdd2);
        appendTable("delay execution add", 15, val);
        //appendTable("delay execution sub", 4, false); 
    }, function (err) {
        appendTable("delay execution add", 15, err);
    });

    // delay subtract
    var delSub = new Calculator();
    var willSub = delay(500, delSub, "subtract", [9, 5]);
    willSub.then(function (val) {
        appendTable("delay execution sub", 4, val);
    }, function (err) {
        appendTable("delay execution sub", 4, err);
    });

    // delay non-existant
    var delBad = new Calculator();
    var bad = delay(500, delBad, "sqrt", [2, 2]);
    bad.then(function (val) {
        appendTable("delay execution non-existant", "rejected", val);
    }, function (err) {
        appendTable("delay execution non-existant", "rejected", err);
    });
});