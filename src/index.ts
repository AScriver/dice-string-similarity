
export interface Rating {
	target: string;
	rating: number;
}

export interface BestMatchResult {
	ratings: Rating[];
	bestMatch: Rating;
	bestMatchIndex: number;
}

function normalize(value: string): string {
  return /\s/.test(value) ? value.replace(/\s+/g, "") : value;
}

/**
 * Compare using a pre-normalized first string + its precomputed bigram counts.
 * Does NOT mutate firstCounts, so it can be reused across many comparisons.
 */
function comparePrecomputed(
  firstNorm: string,
  firstCounts: Map<string, number>,
  secondNorm: string
): number {
  if (firstNorm === secondNorm) return 1;
  if (firstNorm.length < 2 || secondNorm.length < 2) return 0;

  const used: Record<string, number> = Object.create(null);

  let intersectionSize = 0;

  for (let i = 0; i < secondNorm.length - 1; i++) {
    const bigram = secondNorm.slice(i, i + 2);
    const available = firstCounts.get(bigram) ?? 0;
    if (available === 0) continue;

    const usedCount = used[bigram] ?? 0;
    if (usedCount < available) {
      used[bigram] = usedCount + 1;
      intersectionSize++;
    }
  }

  return (2 * intersectionSize) / (firstNorm.length + secondNorm.length - 2);
}

/**
 * Compares two strings and calculates their similarity score based on bigram comparison.
 * @param first The first string to compare.
 * @param second The second string to compare.
 * @returns The similarity score between the two strings, ranging from 0 to 1.
 */
export function compare(first: string, second: string): number {
  const firstNorm = normalize(first);
  const secondNorm = normalize(second);
  if (firstNorm === secondNorm) return 1;
  if (firstNorm.length < 2 || secondNorm.length < 2) return 0;
  return comparePrecomputed(firstNorm, createBigramsMap(firstNorm), secondNorm);
}

/**
 * Creates a map of bigrams and their counts from the given string.
 * @param value The string to create bigrams for.
 * @returns A map where each key is a bigram and each value is the count of that bigram in the string.
 */
function createBigramsMap(value: string): Map<string, number> {
	const bigramsMap = new Map<string, number>();
	for (let i = 0; i < value.length - 1; i++) {
		const bigram = value.substring(i, i + 2);
		bigramsMap.set(bigram, (bigramsMap.get(bigram) ?? 0) + 1);
	}
	return bigramsMap;
}

/**
 * Finds the best match for a main string from an array of target strings based on similarity scores.
 * @param mainString The main string to compare against.
 * @param targetStrings An array of strings to compare the main string with.
 * @returns An object containing the similarity ratings for each target string, the best match, and its index.
 */
export function findBestMatch(mainString: string, targetStrings: string[]): BestMatchResult {
	if (!areArgsValid(mainString, targetStrings)) {
		throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
	}

	const ratings: Rating[] = [];
	let bestMatchIndex = 0;

	for (let i = 0; i < targetStrings.length; i++) {
		const currentTargetString = targetStrings[i];
		const currentRating = compare(mainString, currentTargetString);
		ratings.push({ target: currentTargetString, rating: currentRating });
		if (currentRating > ratings[bestMatchIndex].rating) {
			bestMatchIndex = i;
		}
	}

	const bestMatch = ratings[bestMatchIndex];

	return { ratings, bestMatch, bestMatchIndex };
}

/**
 * Checks if the provided arguments are valid for the findBestMatch function.
 * @param mainString The main string to validate.
 * @param targetStrings The array of target strings to validate.
 * @returns True if the arguments are valid, false otherwise.
 */
function areArgsValid(mainString: string, targetStrings: string[]): boolean {
	return typeof mainString === 'string' &&
		Array.isArray(targetStrings) &&
		targetStrings.length > 0 &&
		targetStrings.every((s) => typeof s === 'string');
}