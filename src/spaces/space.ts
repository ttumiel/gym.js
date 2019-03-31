import * as tf from '@tensorflow/tfjs';

export interface Space {
    shape:tf.Tensor;
    type:any;

    sample():number;
    seed(seed: number):void;
}
