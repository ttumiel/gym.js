import Space from './space';
import * as tf from '@tensorflow/tfjs';

/**
 * A `Box` `Space` class.
 *
 * Used for spaces with a continuous sample space as opposed to discrete.
 *
 * @example
 * ```typescript
 * ```
 */
export default class Box implements Space {
  shape: number[];
  type: any;
  seedValue: number;
  low: number[] | number;
  high: number[] | number;
  isShaped: boolean;
  sampleSpace: tf.Tensor;

  /**
   * @param low - The lower bound of the box
   * @param high - The upper bound of the box
   * @param shape - The shape of the space. Must be provided if
   *  the low and high are single numbers
   */
  constructor(low:number[], high:number[], shape: number[]=null) {
    this.type = 'Box';

    if (shape !== null){
      this.shape = shape;
      this.low = low[0];
      this.high = high[0];
      this.isShaped = true;
    } else {
      // assert low.length === high.length;
      this.shape = [low.length];
      this.low = low;
      this.high = high;
      this.isShaped = false;
    }
  }

  /**
   * Sample a random value from this `Space`.
   *
   * @returns - A random sample.
   */
  sample(): tf.Tensor {
    if (this.isShaped){
      return tf.randomNormal(this.shape, <number>this.low, <number>this.high)
    } else {
      return tf.tidy(()=>{
        let stack = [];
        for (let q=0;q<(<number><unknown>this.shape);q++){
          stack.push(tf.randomUniform([1], this.low[q], this.high[q]));
        }
        return tf.concat1d(stack);
      });
    }
  }

  // Currently unused
  seed(seed: number): void {
    this.seedValue = seed;
  }

  set(space: tf.Tensor): void {
    this.sampleSpace = space;
  }

  get(): tf.Tensor {
    return this.sampleSpace;
  }

  toString(): string {
    return this.type + ': ' + this.shape.toString();
  }
}
