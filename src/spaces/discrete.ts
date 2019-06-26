import Space from './space';
import * as tf from '@tensorflow/tfjs';
import { randint, toNumLike, toArrayLike } from '../utils';

/**
 * A `Discrete` `Space` class.
 *
 * Used for spaces with a discrete sample space as opposed to continuous.
 * 
 * @example
 * ```typescript
 * const disc = new Discrete([6]);
 * console.log(disc.toString());
 * > Discrete: [6]
 * 
 * const sample = disc.sample();
 * console.log(sample);
 * > 2
 * ```
 */
export default class Discrete implements Space {
  shape: number[];
  type: any;
  sampleSpace: tf.Tensor;
  seedValue: number;
  length: number;

  /**
   * @param shape - The shape of the space
   */
  constructor(shape: number[]) {
    this.shape = shape;
    this.type = 'Discrete';
    this.length = Number(
      tf
        .tensor(this.shape)
        .prod()
        .arraySync()
        .valueOf(),
    );
    this.sampleSpace = tf.range(0, this.length).reshape(shape);
  }

  /**
   * Sample a random value from this `Space`.
   *
   * @returns - A random sample.
   */
  sample(): number {
    // TODO: change to tensor?
    return toNumLike(this.shape.map(v => randint(v)));
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

  // contains(action: number){
  //   // if(typeof this.sampleSpace.arraySync() === number) return action === this.sampleSpace.arraySync();
  //   return this.sampleSpace.arraySync().includes(action);
  // }

  toString(): string {
    return this.type + ': ' + this.shape.toString();
  }
}

/**
 * A tuple of [[Discrete]] Spaces.
 * 
 * A convenience class for sampling a tuple of [[Discrete]] spaces.
 * 
 * @example
 * ```typescript
 * const discTuple = new DiscreteTuple([2,2,6]);
 * console.log(discTuple.toString());
 * > DiscreteTuple: [2, 2, 6]
 * 
 * const sample = discTuple.sample();
 * console.log(sample);
 * > [0,1,3]
 * ```
 */
export class DiscreteTuple implements Space {
  shape: number[];
  type: string;
  sampleSpace: Discrete[];
  seedValue: number;
  length: number;

  /**
   * @param shape - The shape of the tuple.
   */
  constructor(shape: number[]) {
    this.shape = shape;
    this.type = 'DiscreteTuple';
    this.length = Number(
      tf
        .tensor(this.shape)
        .prod()
        .arraySync()
        .valueOf(),
    );
    this.setSampleSpace(shape);
  }

  setSampleSpace(value: any) {
    this.sampleSpace = value.map(i => new Discrete([i]));
  }

  /**
   * Sample a random value from this `Space`.
   *
   * @returns - A tuple of random samples.
   */
  sample(): number[] {
    return toArrayLike(this.sampleSpace.map(ss => ss.sample()));
  }

  // Currently unused
  seed(seed: number): void {
    this.seedValue = seed;
  }

  // These methods (get and set) are for observation spaces.
  // They shouldn't be implemented if the class
  // is only used for action spaces
  set(space: tf.Tensor): void {
    // assert contains(space)
    this.setSampleSpace(space.arraySync());
  }

  get(): tf.Tensor {
    return tf.tensor(toArrayLike(this.sampleSpace.map(i => i)));
  }

  // contains(action: number){
  //   // if(typeof this.sampleSpace.arraySync() === number) return action === this.sampleSpace.arraySync();
  //   return this.sampleSpace.arraySync().includes(action);
  // }

  toString(): string {
    return this.type + ': ' + this.shape.toString();
  }
}
