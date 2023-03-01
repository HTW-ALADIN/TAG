import seedrandom from "seedrandom";

export class RNG {
	private rng: seedrandom.PRNG;

	constructor(seed: any) {
		this.rng = seedrandom(seed);
	}

	public coinFlip() {
		return this.trueByChanceOf(0.5);
	}

	public trueByChanceOf(n: number) {
		return this.floatBetween(0, 1) < n;
	}

	public floatBetween(min?: number, max?: number) {
		if (min && max) return this.rng() * (max - min) + min;
		return this.rng();
	}

	public intBetween(min: number, max: number) {
		return Math.round(this.rng() * (max - min) + min);
	}

	public intPairBetween(min: number, max: number): Array<number> {
		const n1 = this.intBetween(min, max);
		const n2 = this.intBetween(min, max);
		if (n1 < n2) {
			return [n1, n2];
		} else {
			return [n2, n1];
		}
	}
}

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
export function shuffle<T>(iterable: Iterable<T>, rng: RNG): Array<T> {
	const array = [...iterable];
	let j, x;

	for (let i = array.length - 1; i > 0; i--) {
		j = rng.intBetween(0, i);
		x = array[i];
		array[i] = array[j];
		array[j] = x;
	}
	return array;
}

export function randomSample<T>(iterable: Iterable<T>, n: number, rng: RNG, replace: true): Array<T>;
export function randomSample<T>(iterable: Iterable<T>, n: number, rng: RNG, replace: false): IterableIterator<Array<T>>;
export function randomSample<T>(
	iterable: Iterable<T>,
	n: number,
	rng: RNG,
	replace?: boolean
): IterableIterator<Array<T>>;
export function randomSample<T>(
	iterable: Iterable<T>,
	n: number,
	rng: RNG,
	replace?: boolean
): IterableIterator<Array<T>> | Array<T> {
	const array = shuffle(iterable, rng);
	if (n > array.length) {
		throw new Error(`Samplesize is greater than number of elements in the given array.\n${n}\n${array}`);
	}

	function* elementGenerator(): IterableIterator<Array<T>> {
		while (array.length) {
			yield array.splice(0, n);
		}
	}

	if (replace) {
		return elementGenerator().next().value;
	}

	return elementGenerator();
}

export function minMaxScaler(
	measurementMin: number,
	measurementMax: number,
	targetMin: number,
	targetMax: number
): Function {
	return (value: number): number =>
		((value - measurementMin) / (measurementMax - measurementMin)) * (targetMax - targetMin) + targetMin;
}

export function range(min: number, max: number) {
	return Array(max - min)
		.fill(0)
		.map((e) => min++);
}
