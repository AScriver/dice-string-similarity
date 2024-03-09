/**
 * Compares two strings and calculates their similarity score based on bigram comparison.
 * @param {string} first The first string to compare.
 * @param {string} second The second string to compare.
 * @returns {number} The similarity score between the two strings, ranging from 0 to 1.
 */
function compare(first, second) {
	first = first.replace(/\s+/g, '')
	second = second.replace(/\s+/g, '')

	if (first === second) return 1; // identical or empty
	if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

	let firstBigrams = createBigramsMap(first);
	let intersectionSize = 0;

	for (let i = 0; i < second.length - 1; i++) {
		const bigram = second.substring(i, i + 2);
		const count = firstBigrams.get(bigram) ?? 0;

		if (count > 0) {
			firstBigrams.set(bigram, count - 1);
			intersectionSize++;
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

/**
 * Creates a map of bigrams and their counts from the given string.
 * @param {string} string The string to create bigrams for.
 * @returns {Map<string, number>} A map where each key is a bigram and each value is the count of that bigram in the string.
 */
function createBigramsMap(string) {
	const bigramsMap = new Map();
	for (let i = 0; i < string.length - 1; i++) {
		const bigram = string.substring(i, i + 2);
		bigramsMap.set(bigram, (bigramsMap.get(bigram) ?? 0) + 1);
	}
	return bigramsMap;
}

/**
 * Finds the best match for a main string from an array of target strings based on similarity scores.
 * @param {string} mainString The main string to compare against.
 * @param {string[]} targetStrings An array of strings to compare the main string with.
 * @returns {{ ratings: Array<{ target: string, rating: number }>, bestMatch: { target: string, rating: number }, bestMatchIndex: number }} An object containing the similarity ratings for each target string, the best match, and its index.
 */
function findBestMatch(mainString, targetStrings) {
	if (!areArgsValid(mainString, targetStrings)) {
		throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
	}

	const ratings = [];
	let bestMatchIndex = 0;

	for (let i = 0; i < targetStrings.length; i++) {
		const currentTargetString = targetStrings[i];
		const currentRating = compare(mainString, currentTargetString)
		ratings.push({ target: currentTargetString, rating: currentRating })
		if (currentRating > ratings[bestMatchIndex].rating) {
			bestMatchIndex = i
		}
	}

	const bestMatch = ratings[bestMatchIndex]

	return { ratings, bestMatch, bestMatchIndex };
}

/**
 * Checks if the provided arguments are valid for the findBestMatch function.
 * @param {string} mainString The main string to validate.
 * @param {Array} targetStrings The array of target strings to validate.
 * @returns {boolean} True if the arguments are valid, false otherwise.
 */
function areArgsValid(mainString, targetStrings) {
    return typeof mainString === 'string' && 
           Array.isArray(targetStrings) && 
           targetStrings.length > 0 && 
           targetStrings.every(s => typeof s === 'string');
}

exports = module.exports = { compare, findBestMatch };