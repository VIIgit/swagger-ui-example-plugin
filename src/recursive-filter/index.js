'use strict';

// Travers recursively an object an call the provided function
var toString = Object.prototype.toString;

function isPlainObject(obj) {
    var prototype;
    return toString.call(obj) === '[object Object]' && (prototype = Object.getPrototypeOf(obj), prototype === null || prototype === Object.getPrototypeOf({}));
}

function isCollection(value) {
    return Array.isArray(value) || isPlainObject(value);
}

function filter(value, fn, pathParam) {
    var path = pathParam ? pathParam : "";
    if (Array.isArray(value)) {
        return filterArray(value, fn, path);
    } else if (isPlainObject(value)) {
        return filterObject(value, fn, path);
    }
    return value;
}

function filterObject(obj, fn, path) {
    var newObj = {};
    var key;
    var value;

    for (key in obj) {
        var subpath = path + '/' + key;
        value = filter(obj[key], fn, subpath);

        if (fn.call(obj, value, key, obj, subpath)) {
            if (value !== obj[key] && !isCollection(value)) {
                value = obj[key];
            }
            newObj[key] = value;
        }
    }
    return newObj;
}

function filterArray(array, fn, path) {
    var filtered = [];

    array.forEach(function(value, index, array) {
        value = filter(value, fn);
        var subpath = path + '/' + index;
        if (fn.call(array, value, index, array, subpath)) {
            if (value !== array[index] && !isCollection(value)) {
                value = array[index];
            }
            filtered.push(value);
        }
    });

    return filtered;
}

module.exports = {filter};