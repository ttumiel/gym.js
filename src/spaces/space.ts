import * as tf from '@tensorflow/tfjs';

export default interface Space {
  shape: number[];
  type: any;

  sample(): number;
  seed(seed: number): void;
  set(space: tf.Tensor): void;
  get(): tf.Tensor;
  // contains(action: number): boolean;
}
