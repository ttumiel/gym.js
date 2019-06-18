import Env from "../../core";
import Discrete from "../../spaces/discrete";
import * as tf from '@tensorflow/tfjs';
import { range } from "../../utils";

/**
 * Environment for algorithms.
 * 
 * @param {number} base Number of distinct characters.
 * 
 * Action: A tuple containing [
 *  the move over the input,
 *  whether to write to the output,
 *  the prediction 
 * ]
 * 
 * Observations: The character under the read cursor.
 */
abstract class AlgorithmicEnv implements Env {
  constructor(base:number=10) {
    this.base = base;
    this.action_space = new Discrete([this.MOVEMENTS.length, 2, this.base]);
    this.observation_space = new Discrete([this.base + 1]);
    this.done = false;
    this.reward = 0.0;
    this.charmap = range(base).map(i=>String(i)).push(" ");
    this.cursor = 0;
    // this.seed();
    // this.reset();
  }

  action_space: Discrete;
  observation_space: Discrete;
  reward_range: Discrete;
  base:number;
  MOVEMENTS:number[];
  charmap: string[]
  done: boolean;
  reward: number;
  target: [];
  cursor: number;

  step(action: tf.Tensor): [tf.Tensor, number, boolean, {}] {
    // Check that action is in action space!

    if (!this.done){
      this.move(action);
      this.observation_space.set(this.toObs());

      if (action[1] === 1 && action[2] === this.target[this.cursor]){
        this.reward = 1;
      }else{
        this.done = true;
        this.reward = -0.5;
      }

    }else{
      console.warn("The environment has returned `done=True`. You should call `reset` before continuing.");
    }
    return [this.observation_space.get(), this.reward, this.done, {}];
  }

  reset(): tf.Tensor {
    this.done = false;
    this.reward = 0.0;
    this.cursor = 0;
    this.observation_space.set(this.toObs());
    return this.observation_space.get();
  }

  render(): void {
    console.log("Target:", this.charmap.join(""));
    console.log("Cursor Target:", this.getStrTgt());
    // console.log("Movement:", this.MOVEMENTS[])
    // Store last action to implement other functionality
  }

  renderHTML(): string {
    return ``
  }

  close(): void {}
  seed(seed: number): void {}

  getStrObs():string{ //??
    let ret = this.toObs().arraySync()[0];
    return this.charmap[ret];
  }

  getStrTgt():string{
    return this.charmap[this.cursor];
  }

  // Move the cursor according to the action
  abstract move(action: tf.Tensor): void; 
  
  // Return the current observation according to the cursor
  abstract toObs(): tf.Tensor; 

  // Set the target from the input data
  abstract setTarget(input_data:any):void;

  // Generate the target data
  abstract genInputData(size:number):any;
}

abstract class TapeAlgorithmicEnv extends AlgorithmicEnv{
  MOVEMENTS = ["Left", "Right"];
  cursor:number;

  move(action: tf.Tensor): void{
    if(action[0] == 0){
      this.cursor -= 1;
    }else if (action[0] == 1){
      this.cursor += 1;
    }
}

  toObs(): tf.Tensor{
    return this.target[this.cursor];
  }

  genInputData(size:number):any{
    return randint(this.base, undefined, size)
  }
}
