# String Similarity 

A simple and efficient JavaScript utility for comparing string similarity using bigram comparison/Dice's Coefficient. This utility provides functions to compare two strings for their similarity and to find the best match for a given string from an array of strings. This project is a continuation/enhancement of [string-similarity](https://github.com/aceakash/string-similarity) originally developed by [aceakash](https://github.com/aceakash).

## Features

- **Compare Two Strings**: Calculate the similarity score between two strings based on bigram comparison, ranging from 0 (completely different) to 1 (identical).
- **Find Best Match**: Find the best matching string from an array of strings for a given main string, based on their similarity scores.

## Installation

To use the String Similarity in your project, simply copy the provided code into your JavaScript file or module.

## Usage

### Comparing Two Strings

To compare the similarity between two strings, use the `compare` function:

```javascript
const { compare } = require('dice-string-similarity');

const similarityScore = compare('string1', 'string2');
console.log(similarityScore); // Outputs the similarity score between 0 and 1
```

### Finding the Best Match

To find the best match for a string from an array of target strings, use the findBestMatch function:

```javascript
const { findBestMatch } = require('dice-string-similarity');

const mainString = 'main string to compare';
const targetStrings = ['target string 1', 'target string 2', 'target string 3'];
const bestMatch = findBestMatch(mainString, targetStrings);

console.log(bestMatch); // Outputs the best match object containing `ratings`, `bestMatch`, and `bestMatchIndex`
```

## API Reference

### `compare(first, second)`

- **Parameters**
  - `first` (string): The first string to compare.
  - `second` (string): The second string to compare.
- **Returns**
  - A `number`: The similarity score between the two strings, ranging from 0 to 1.

### `findBestMatch(mainString, targetStrings)`

- **Parameters**
  - `mainString` (string): The main string to compare against.
  - `targetStrings` (Array<string>): An array of strings to compare the main string with.
- **Returns**
  - An object containing:
    - `ratings`: An array of objects, each containing a `target` string and its `rating`.
    - `bestMatch`: The object from `ratings` with the highest rating.
    - `bestMatchIndex`: The index of `bestMatch` in the `ratings` array.

## Contributing

Contributions to the String Similarity are welcome. Please ensure to follow the coding standards and submit your pull requests for review.

## License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).
