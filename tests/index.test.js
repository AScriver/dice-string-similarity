const test = require('node:test');
const assert = require('node:assert/strict');
const { compare, findBestMatch } = require('../dist/cjs/index.js');

test('compare returns 1 for identical strings', () => {
    assert.equal(compare('hello', 'hello'), 1);
});

test('compare returns 0 for completely different strings', () => {
    assert.equal(compare('hello', 'world'), 0);
});

test('compare ignores spaces correctly', () => {
    assert.equal(compare('h e l l o', 'hello'), 1);
});

test('compare handles one or both empty strings', () => {
    assert.equal(compare('', ''), 1);
    assert.equal(compare('hello', ''), 0);
    assert.equal(compare('', 'world'), 0);
});

test('compare returns 0 for strings shorter than 2 characters', () => {
    assert.equal(compare('h', 'w'), 0);
});

test('compare calculates similarity score for similar strings', () => {
    const score = compare('hello', 'hallo');
    assert.ok(score > 0);
    assert.ok(score < 1);
});

test('findBestMatch finds the correct best match from an array of target strings', () => {
    const result = findBestMatch('hello', ['hello', 'world', 'hell', 'hello world']);
    assert.equal(result.bestMatch.target, 'hello');
    assert.equal(result.bestMatch.rating, 1);
});

test('findBestMatch handles no matches gracefully', () => {
    const result = findBestMatch('hello', ['world', 'planet', 'galaxy']);
    assert.ok(result.bestMatch.rating < 1);
});

test('findBestMatch throws error for invalid arguments', () => {
    assert.throws(
        () => findBestMatch(123, ['hello', 'world']),
        /Bad arguments: First argument should be a string, second should be an array of strings/
    );
});

test('findBestMatch handles empty target strings array', () => {
    assert.throws(
        () => findBestMatch('hello', []),
        /Bad arguments: First argument should be a string, second should be an array of strings/
    );
});

test('findBestMatch identifies first identical string as best match', () => {
    const result = findBestMatch('hello', ['hello', 'hello', 'hello']);
    assert.equal(result.bestMatchIndex, 0);
    assert.equal(result.bestMatch.rating, 1);
});
