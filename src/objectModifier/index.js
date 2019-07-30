
var toString = Object.prototype.toString;

function isPlainObject(obj) {
    var prototype;
    return toString.call(obj) === '[object Object]' && (prototype = Object.getPrototypeOf(obj), prototype === null || prototype === Object.getPrototypeOf({}));
}

function isCollection(value) {
    return Array.isArray(value) || isPlainObject(value);
}

function filter(value, fn, path='', objPath='#', parent=undefined, parentKey=undefined) {
    if (Array.isArray(value)) {
        return filterArray(value, fn, path, objPath, parent, parentKey);
    } else if (isPlainObject(value)) {
        return filterObject(value, fn, path, objPath, parent, parentKey);
    }
    return value;
}

function filterObject(obj, fn, path, objPath, parent, parentKey) {
    var newObj = {};
    var key;
    var value;

    for (key in obj) {
        var subpath = path + '/' + key;
        var objSubpath;
        if(key === 'properties' && obj.type === 'object'){
            objSubpath = objPath;
        } else {
            objSubpath = objPath + '/' + key;
        }
        
        value = filter(obj[key], fn, subpath, objSubpath, obj, key);

        if (fn.call(obj, value, key, obj, subpath, objSubpath, parent, parentKey)) {
            if (value !== obj[key] && !isCollection(value)) {
                value = obj[key];
            }
            newObj[key] = value;
        }
    }
    return newObj;
}

function filterArray(array, fn, path, objPath, parent, parentKey) {
    var filtered = [];

    array.forEach(function (value, index, array) {
        var subpath = path + '/' + index;
        var objSubpath = objPath + '[' + index + ']';
        value = filter(value, fn, subpath, objSubpath, parent, parentKey);
        if (fn.call(array, value, index, array, subpath, objSubpath, parent, parentKey)) {
            if (value !== array[index] && !isCollection(value)) {
                value = array[index];
            }
            filtered.push(value);
        }
    });

    return filtered;
}

module.exports = filter;
