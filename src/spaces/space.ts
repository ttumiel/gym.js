import * as tf from '@tensorflow/tfjs';

export interface Space {
    shape:number[];
    type:any;

    sample():number;
    seed(seed: number):void;
}
