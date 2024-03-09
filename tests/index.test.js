const { compare, findBestMatch } = require('../src/index.js'); // Adjust the path as necessary

describe('compare', () => {
    test('returns 1 for identical strings', () => {
        expect(compare('hello', 'hello')).toBe(1);
    });

    test('returns 0 for completely different strings', () => {
        expect(compare('hello', 'world')).toBe(0);
    });

    test('ignores spaces correctly', () => {
        expect(compare('h e l l o', 'hello')).toBe(1);
    });

    test('handles one or both empty strings', () => {
        expect(compare('', '')).toBe(1);
        expect(compare('hello', '')).toBe(0);
        expect(compare('', 'world')).toBe(0);
    });

    test('returns 0 for strings shorter than 2 characters', () => {
        expect(compare('h', 'w')).toBe(0);
    });

    test('calculates similarity score for similar strings', () => {
        expect(compare('hello', 'hallo')).toBeGreaterThan(0);
        expect(compare('hello', 'hallo')).toBeLessThan(1);
    });
});

describe('findBestMatch', () => {
    test('finds the correct best match from an array of target strings', () => {
        const result = findBestMatch('hello', ['hello', 'world', 'hell', 'hello world']);
        expect(result.bestMatch.target).toBe('hello');
        expect(result.bestMatch.rating).toBe(1);
    });

    test('handles no matches gracefully', () => {
        const result = findBestMatch('hello', ['world', 'planet', 'galaxy']);
        expect(result.bestMatch.rating).toBeLessThan(1);
    });

    test('throws error for invalid arguments', () => {
        expect(() => findBestMatch(123, ['hello', 'world']))
            .toThrow('Bad arguments: First argument should be a string, second should be an array of strings');
    });

    test('handles empty target strings array', () => {
        expect(() => {
            findBestMatch('hello', []);
        }).toThrow('Bad arguments: First argument should be a string, second should be an array of strings');
    });

    test('correctly identifies the first string as the best match when all target strings are identical to the main string', () => {
        const result = findBestMatch('hello', ['hello', 'hello', 'hello']);
        expect(result.bestMatchIndex).toBe(0);
        expect(result.bestMatch.rating).toBe(1);
    });
});
