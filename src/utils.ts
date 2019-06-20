import * as tf from '@tensorflow/tfjs';

function choice(
  array: number[] | number[][] | number[][][] | number[][][][] | number[][][][][] | number[][][][][][],
) {
  var array_fix = toArrayLike(array);
  var index = Math.floor(Math.random() * array_fix.length);
  return array[index];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toArrayLike(obj:any):[]{
  return obj.hasOwnProperty('length') ? obj : [obj];
}

function toNumLike(obj:any):number{
  if (obj.hasOwnProperty('length') && obj.length > 1) {
    console.warn("Ambiguous conversion from array with more than one value. Using first element.");
  }
  return obj.hasOwnProperty('length') ? obj[0] : obj;
}

function range(s1:number, s2?:number): number[]{
  if (s2 === undefined) return (new Array(s1)).fill(undefined).map((_,i) => i);
  return (new Array(s2 - s1)).fill(undefined).map((_,i) => i + s1);
}

function randint(s1:number, s2?:number, n:number=1): number|number[]{
  if (n===1){
    if (s2 !== undefined) return Math.floor(Math.random()*(s2-s1)+s1);
    return Math.floor(Math.random()*s1);
  }
  if (s2 !== undefined) return range(n).map(()=>Math.floor(Math.random()*(s2-s1)+s1));
  return range(n).map(()=>Math.floor(Math.random()*s1));
}

export { choice, sleep, toArrayLike, range, randint, toNumLike };
