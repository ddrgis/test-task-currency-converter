exports.flattenDepth = function (arr, depth = 1) {
    if (!Array.isArray(arr)){
        throw new TypeError('This function works only with arrays');
    }
    if (depth < 1) {
        return arr;
    }

    const iter = (array, currentDepth) => {
        return array.reduce((acc, val) => {
            if (Array.isArray(val)) {
                return currentDepth <= depth ? [...acc, ...iter(val, ++currentDepth)] : [...acc, ...val];
            } else {
                return [...acc, val];
            }
        }, []);
    }

    return iter(arr, 1);
}

exports.flatten = function(arr) {
    if (!Array.isArray(arr)){
        throw new TypeError('This function works only with arrays');
    }

    const result = [];
    let queue = [...arr];
    while (queue.length) {
        const first = queue.shift();
        if (Array.isArray(first)) {
            queue = [...first, ...queue];
            continue;
        } else {
            result.push(first);
        }
    }

    return result;
};


