
var toString = Object.prototype.toString;

function isPlainObject(obj) {
    var prototype;
    return toString.call(obj) === '[object Object]' && (prototype = Object.getPrototypeOf(obj), prototype === null || prototype === Object.getPrototypeOf({}));
}

function isCollection(value) {
    return Array.isArray(value) || isPlainObject(value);
}

function mapper(value, fn, path='', objPath='#', parent=undefined, parentKey=undefined,target={}, isObj= false, isArray= false) {
    if (Array.isArray(value)) {
        return filterArray(value, fn, path, objPath, parent, parentKey, target, false, true);
    } else if (isPlainObject(value)) {
        return filterObject(value, fn, path, objPath, parent, parentKey, target, true, false);
    }
    return value;
}

function filterObject(obj, fn, path, objPath, parent, parentKey, target, isObj, isArray) {
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
        
        value = mapper(obj[key], fn, subpath, objSubpath, obj, key, target);

        if (fn.call(obj, value, key, obj, subpath, objSubpath, parent, parentKey, target, isObj, isArray)) {
            if (value !== obj[key] && !isCollection(value)) {
                value = obj[key];
            }
            newObj[key] = value;
        }
    }
    return newObj;
}

function filterArray(array, fn, path, objPath, parent, parentKey, target, isObj, isArray) {
    var filtered = [];

    array.forEach(function (value, index, array) {
        var subpath = path + '/' + index;
        var objSubpath = objPath + '[' + index + ']';
        value = mapper(value, fn, subpath, objSubpath, parent, parentKey, target, isObj, isArray);
        if (fn.call(array, value, index, array, subpath, objSubpath, parent, parentKey, target, isObj, isArray)) {
            if (value !== array[index] && !isCollection(value)) {
                value = array[index];
            }
            filtered.push(value);
        }
    });

    return filtered;
}

module.exports = mapper;
