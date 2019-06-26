import * as tf from '@tensorflow/tfjs';

/** @ignore */
function choice(array: number[] | number[][] | number[][][] | number[][][][] | number[][][][][] | number[][][][][][]) {
  var array_fix = toArrayLike(array);
  var index = Math.floor(Math.random() * array_fix.length);
  return array[index];
}

/** @ignore */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Convert an array-like type to an actual array. */
function toArrayLike(obj: any): [] {
  return obj.hasOwnProperty('length') ? obj : [obj];
}

/** Convert a num-like type to an actual number. */
function toNumLike(obj: any): number {
  if (obj.hasOwnProperty('length') && obj.length > 1) {
    console.warn('Ambiguous conversion from array with more than one value. Using first element.');
  }
  return obj.hasOwnProperty('length') ? obj[0] : obj;
}

/** 
 * Get a range of numbers. 
 * 
 * @param s1 - The end of the range if `s2` is undefined else the start.
 *  Starting at 0.
 * @param s2 - The end of the range.
 */
function range(s1: number, s2?: number): number[] {
  if (s2 === undefined) return new Array(s1).fill(undefined).map((_, i) => i);
  return new Array(s2 - s1).fill(undefined).map((_, i) => i + s1);
}

/**
 * Get a random array of integers with size `n` in the range [0; s1) or [s1, s2).
 * 
 * @param s1 - The maximum random value (not inclusive) if `s2` is undefined else the minimum (inclusive).
 * @param s2 - The maximum random value (not inclusive).
 * @param n - The size of the array to return. If 1, returns `number`.
 * @returns - An array of random values.
 */
function randint(s1: number, s2?: number, n: number = 1): number | number[] {
  if (n === 1) {
    if (s2 !== undefined) return Math.floor(Math.random() * (s2 - s1) + s1);
    return Math.floor(Math.random() * s1);
  }
  if (s2 !== undefined) return range(n).map(() => Math.floor(Math.random() * (s2 - s1) + s1));
  return range(n).map(() => Math.floor(Math.random() * s1));
}

export { choice, sleep, toArrayLike, range, randint, toNumLike };
