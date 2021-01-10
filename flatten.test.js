const {flatten} = require('./flatten');
const {flattenDepth} = require('./flatten');

const deepArray = [[1, 2, [13, [14, 17]]], 3, 4, [5, [6], [7, [8, 9], 10]], [11, 12], [15, 16]];
const testCases = [
    {
        input: [],
        expected: {flatten: 0, flattenDepth: 0},
    },
    {
        input: [1, 2],
        expected: {flatten: 2, flattenDepth: 2},
    },
    {
        input: [1, 2, [3, 4]],
        expected: {flatten: 4, flattenDepth: 4},
    },
    {
        input: [[1, 2], 3, 4, [5, [6], [7, [8, 9], 10]]],
        expected: {flatten: 10, flattenDepth: 4},
        depth: 0,
    },
    {
        input: deepArray,
        expected: {flatten: 17, flattenDepth: 13},
        depth: 1,
    },
    {
        input: deepArray,
        expected: {flatten: 17, flattenDepth: 16},
        depth: 2,
    },
    {
        input: deepArray,
        expected: {flatten: 17, flattenDepth: 17},
        depth: Number.POSITIVE_INFINITY,
    }
];

const buildErrorMessage = (fnName, index, actual, expected) => {
    return `Test of ${fnName} with index = ${index} has failed. 
        Actual: ${actual}, expected: ${expected[fnName]}`
}

testCases.forEach(({input, expected, depth}, index) => {
    const flattenActual = flatten(input).length;
    if (flattenActual !== expected.flatten) {
        throw new Error(buildErrorMessage('flatten', index, flattenActual, expected));
    }

    const flattenDepthActual = flattenDepth(input, depth).length;
    if (flattenDepthActual !== expected.flattenDepth) {
        throw new Error(buildErrorMessage('recursiveFlatten', index, flattenDepthActual, expected));
    }
})

console.log('OK')