String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] !== 'undefined'
            ? args[number]
            : match
            ;
    });
};
String.prototype.is = function() {
    for (var i= 0; i < arguments.length; i++){
        if(this.toString() === arguments[i].toString())
            return true;
    }
    return false;
};
Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
        return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
        k = n;
    } else {
        k = len + n;
        if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement ||
            (searchElement !== searchElement && currentElement !== currentElement)) {
            return true;
        }
        k++;
    }
    return false;
};
