import * as tf from '@tensorflow/tfjs';

export default interface Space {
  shape: number[];
  type: any;

  // Change sampling to tensor?
  sample(): number | number[];
  seed(seed: number): void;
  set(space: tf.Tensor): void;
  get(): tf.Tensor;
  // contains(action: number): boolean;
}
