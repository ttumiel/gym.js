import * as tf from '@tensorflow/tfjs';

/**
 * A simple spatial interface to extend.
 */
export default interface Space {
  shape: number[];
  type: any;

  sample(): number | number[] | tf.Tensor;
  seed(seed: number): void;
  set(space: tf.Tensor): void;
  get(): tf.Tensor;
  // contains(action: number): boolean;
}
