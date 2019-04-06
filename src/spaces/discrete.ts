import Space from './space';
import * as tf from '@tensorflow/tfjs';
// import { choice } from '../utils';

/**
 * A `Discrete` `Space` class.
 *
 * @param {number[]} shape The shape of the space
 */
export default class Discrete implements Space {
  shape: number[];
  type: any;
  sampleSpace: tf.Tensor;
  seedValue: number;

  constructor(shape: number[]) {
    this.shape = shape;
    this.type = 'Discrete';
    let length = Number(
      tf
        .tensor(this.shape)
        .prod()
        .arraySync()
        .valueOf(),
    );
    this.sampleSpace = tf.range(0, length).reshape(shape);
  }

  /**
   * Sample a random value from this `Space`.
   *
   * @returns {number} A random sample.
   */
  sample(): number {
    // return choice(this.sampleSpace.reshape([-1]).arraySync());
    let idx = Math.floor(Math.random()*4);
    return this.sampleSpace.reshape([-1]).arraySync()[idx];
  }

  // Currently unused
  seed(seed: number): void {
    this.seedValue = seed;
  }

  set(space: tf.Tensor): void{
    this.sampleSpace = space;
  }

  get(): tf.Tensor{
    return this.sampleSpace;
  }

  // contains(action: number){
  //   // if(typeof this.sampleSpace.arraySync() == number) return action == this.sampleSpace.arraySync();
  //   return this.sampleSpace.arraySync().includes(action);
  // }

  toString() {
    return this.type + ": " + this.shape.toString();
  }
}
