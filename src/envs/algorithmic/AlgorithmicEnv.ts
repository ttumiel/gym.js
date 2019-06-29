import Env from '../../core';
import Discrete, { DiscreteTuple } from '../../spaces/discrete';
import * as tf from '@tensorflow/tfjs';
import { range, randint, toNumLike, toArrayLike } from '../../utils';

declare type actionSpace = Discrete[] | number | number[];

/**
 * Abstract environment for algorithms.
 *
 * Action: A tuple containing [
 *  the move over the input,
 *  whether to write to the output,
 *  the predicted character
 * ]
 *
 * Observations: The character under the read cursor.
 *  A total of `base` + 1 with an extra out-of-bounds
 *  character.
 *
 * The environment terminates immediately when an incorrect item
 * is written or when the entire output is successfully outputted.
 */
abstract class AlgorithmicEnv implements Env {
  /**
   * @param movements The possible movements that the agent can make.
   * @param base Number of distinct characters.
   */
  constructor(movements: string[], base: number = 10) {
    this.base = base;
    this.MOVEMENTS = movements;
    this.action_space = new DiscreteTuple([this.MOVEMENTS.length, 2, this.base]);
    this.observation_space = new Discrete([this.base + 1]);
    this.charmap = range(base).map(i => String(i)); // range*rows for grid env
    this.charmap.push('_');
    // this.seed();
    this.reset();
  }

  action_space: DiscreteTuple;
  observation_space: Discrete;
  reward_range: Discrete;
  base: number;
  MOVEMENTS: string[];
  MIN_LENGTH: number = 5;
  charmap: string[];
  done: boolean;
  reward: number;
  target: [];
  cursor: number;
  inputData: any;
  agentActions: number[];
  targetLength: number;

  step(action: actionSpace): [tf.Tensor, number, boolean, {}] {
    // Check that action is in action space!

    if (!this.done) {
      // Write char
      if (action[1] === 1) {
        this.agentActions[this.cursor] = action[2];
        if (action[2] === this.target[this.cursor]) {
        this.reward = 1;
        } else {
        this.done = true;
        this.reward = -0.5;
        }
      }

      // Move cursor
      this.move(action);
      this.observation_space.set(this.toObs());
    } else {
      console.warn('The environment has returned `done=True`. You should call `reset` before continuing.');
    }
    return [this.observation_space.get(), this.reward, this.done, {}];
  }

  reset(): tf.Tensor {
    this.targetLength = toNumLike(randint(3)) + this.MIN_LENGTH;
    this.inputData = this.genInputData(this.targetLength);
    this.setTarget(this.inputData.slice());
    this.done = false;
    this.reward = 0.0;
    this.cursor = 0;
    this.agentActions = range(this.targetLength).map(() => -1);
    this.observation_space.set(this.toObs());
    return this.observation_space.get();
  }

  render(): void {
    console.log('-'.repeat(20));
    console.log('Input:', this.inputData.map(i => this.charmap[i]).join(''));
    console.log('Target:', this.target.map(i => this.charmap[i]).join(''));
    console.log('Predictions:', this.agentActions.map(i => (i === -1 ? '_' : this.charmap[i])).join(''));
    console.log('Obs:', this.getStrObs());
    console.log('-'.repeat(20));
  }

  renderHTML(): string {
    return `
    <style>.currentState{background-color: red}</style>
    <div class="game-input"><span${this.inputData.map((v,i) => (i==this.cursor ? ' class="currentState">' : ">")
                                                          + this.charmap[v]).join("</span><span")}</span></div>
    <div class="game-target">${this.target.map(i => this.charmap[i]).join("")}</div>
    <div class="agent-preds">${this.agentActions.map(i => "<span>" + (i===-1 ? "_" : this.charmap[i])+"</span>").join("")}</div>
    `
  }

  close(): void {}
  seed(seed: number): void {}

  getStrObs(): string {
    let ret = Number(this.toObs());
    return this.charmap[ret];
  }

  // getStrTgt():string{
  //   return this.charmap[this.cursor];
  // }

  // Move the cursor according to the action
  abstract move(action: actionSpace): void;

  // Return the current observation according to the cursor
  abstract toObs(): tf.Tensor;

  // Set the target from the input data
  abstract setTarget(input_data: any): void;

  // Generate the target data
  abstract genInputData(size: number): any;
}

/**
 * A 1 dimensional algorithmic env.
 *
 * Environment observations wrap around tape with an additional
 * observation for the out-of-bounds case.
 *
 * The `MIN_LENGTH` of the tape is `5` plus a random number between
 * 0 and 2.
 */
abstract class TapeAlgorithmicEnv extends AlgorithmicEnv {
  MOVEMENTS: string[];
  cursor: number;

  constructor(base: number = 10) {
    super(['Left', 'Right'], base);
  }

  move(action: actionSpace): void {
    if (action[0] === 0 && this.cursor <= 0) {
      this.cursor = this.targetLength;
    } else if (action[0] === 1 && this.cursor >= this.targetLength) {
      this.cursor = 0;
    } else {
      if (action[0] === 0) {
      this.cursor -= 1;
      } else if (action[0] === 1) {
      this.cursor += 1;
      }
    }
  }

  toObs(): any {
    if (this.cursor === this.targetLength) return this.base;
    return this.inputData[this.cursor];
  }

  genInputData(size: number): any {
    return randint(this.base, undefined, size);
  }
}

/**
 * A 2 dimensional algorithmic env.
 * Not tested yet.
 */
abstract class GridAlgorithmicEnv extends AlgorithmicEnv {
  constructor(rows: number, base: number = 10) {
    super(['Up', 'Right', 'Down', 'Left'], base);
    this.rows = rows;
  }

  MOVEMENTS: string[];
  rows: number;
  row: number;
  col: number;

  move(action: actionSpace): void {
    // TODO: Out of bounds check
    if (action[0] === 0) {
      this.row -= 1;
    } else if (action[0] === 1) {
      this.col += 1;
    } else if (action[0] === 2) {
      this.row += 1;
    } else if (action[0] === 3) {
      this.col -= 1;
    }
    this.cursor = this.row * this.base + this.col;
  }

  toObs(): tf.Tensor {
    return this.inputData[this.cursor];
  }

  genInputData(size: number): any {
    return range(this.rows).map(() => randint(this.base, undefined, size));
  }
}

/**
 * Decode the algorithmic env tuple action_space into an object containing
 * the decoded movement, write boolean, and the character to write.
 *
 * @param action An action in the `action_space` of the env.
 * @param movements The allowed movements of the env.
 */
function decodeAction(action: actionSpace, movements: string[]): {} {
  return { Movement: movements[action[0]], Write: Boolean(action[1]).toString(), Character: String(action[2]) };
}

export { TapeAlgorithmicEnv, GridAlgorithmicEnv, decodeAction };
