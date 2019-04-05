import Space from './space';
import * as tf from '@tensorflow/tfjs';
import { choice } from '../utils';

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

  sample() {
    return choice(this.sampleSpace.reshape([-1]).arraySync());
  }

  // Currently unused
  seed(seed: number) {
    this.seedValue = seed;
  }
}
