import Env from '../../core';
import Discrete from '../../spaces/discrete';
import Space from '../../spaces/space';
import * as tf from '@tensorflow/tfjs';

/**
 * An environment implementing the toy text "Frozen Lake" game.
 *
 * Actions:
 *  0. Up.
 *  1. Right.
 *  2. Down.
 *  3. Left.
 *
 * Rewards:
 *  - 1: If reach target 'G'.
 *  - 0: Otherwise.
 *
 * @example
 * ```typescript
 * import {FrozenLake} from "gym-js";
 * let mapSize=4,p=0.8,isSlippery=false;
 * const env = new FrozenLake(mapSize, p, isSlippery);
 *
 * console.log(env.action_space.toString());
 * > Discrete: 4    // 4 possible movements
 * console.log(env.observation_space.toString());
 * > Discrete: 16   // 4x4 map
 *
 * let action = env.action_space.sample();
 * let [obs, rew, done, info] = env.step(action);
 * ```
 */
export default class FrozenLake implements Env {
  /**
   * @param mapSize - The size of the map
   * @param p - The probability of not slipping
   * @param isSlippery - Set the ice to slippery or not. This makes the agent move
   * in a random direction with probability `1-p`.
   */
  constructor(mapSize: number = 4, p: number = 0.8, isSlippery: boolean = true) {
    this.action_space = new Discrete([4]);
    this.reward_range = new Discrete([2]);
    this.isSlippery = isSlippery;
    this.p = p;
    this.done = false;
    this.row = 0;
    this.col = 0;
    this.mustRender = false;

    if (mapSize === 8) {
      this.mapSize = mapSize;
      this.map = MAPS['8x8'];
    } else {
      this.mapSize = 4;
      this.map = MAPS['4x4'];
    }

    this.observation_space = new Discrete([this.mapSize * this.mapSize]);
    //this.generateRandomMap(mapSize, p);
    this.observation_space.set(tf.tensor([0]));
  }

  action_space: Discrete;
  observation_space: Discrete;
  reward_range: Space;
  done: boolean;
  map: string[][];
  isSlippery: boolean;
  mapSize: number;
  p: number;
  row: number;
  col: number;
  mustRender: boolean;
  renderMode: string;
  HTMLData: string;

  step(action: number): [tf.Tensor, number, boolean, {}] {
    let reward = 0;

    if (!this.done) {
      let newPos = this.move(this.row, this.col, action);
      this.row = newPos[0];
      this.col = newPos[1];

      let currentState = this.map[this.row][this.col];
      this.observation_space.set(this._toObs());

      if (currentState === 'H') {
        this.done = true;
        // reward = -1;
      } else if (currentState === 'G') {
        this.done = true;
        reward = 1;
      }
    } else {
      console.warn('This environment has terminated. You should call `reset` before continuing.');
    }

    this._callRender();

    return [this.observation_space.get(), reward, this.done, {}];
  }

  reset(): tf.Tensor {
    this.done = false;
    this.observation_space.set(tf.tensor([0]));
    this.row = 0;
    this.col = 0;
    this._callRender();
    return this.observation_space.get();
  }

  /**
   * Set the environment to render to a particular output ("html" or "console").
   *
   * @param mode - To render in a particular mode - either "html" or "console".
   */
  render(mode:string="html"): void {
    const renderModes = ["html", "console"];
    console.assert(renderModes.includes(mode), `Mode ${mode} is not recognized, try any of ${renderModes.toString()}.`)
    this.mustRender = true;
    this.renderMode = mode;
  }

  private _callRender():void{
    if(this.mustRender){
      if (this.renderMode === "html"){
        let currentObs = this.observation_space.get().dataSync()[0];
        this.HTMLData = "<style>.currentState{background-color: red}</style>" +
          this.map.map((row, rowId) => (
            "<div>" + row.map((col, colId) => (
              "<span" +
              ((colId + (rowId * this.mapSize) == currentObs) ? " class=\"currentState\"" : "") +
              ">" + col + "</span>"
            )).join("") + "</div>"
          )).join("");
      } else if (this.renderMode === "console") {
        console.log(this.observation_space.get().dataSync());
      }
    }
  }

  renderHTML(): string {
    return this.HTMLData;
  }

  close(): void {
    console.clear();
    this.mustRender = false;
    this.HTMLData = "";
  }

  seed(seed: number): void {}

  private move(row: number, col: number, action: number): [number, number] {
    if (this.isSlippery && Math.random() > 1 / 3) {
      action = this.action_space.sample();
    }
    if (this.inMap(row, col, action)) {
      if (action === Direction.Up) {
        row -= 1;
      }
      if (action === Direction.Down) {
        row += 1;
      }
      if (action === Direction.Right) {
        col += 1;
      }
      if (action === Direction.Left) {
        col -= 1;
      }
    }
    return [row, col];
  }

  // generateRandomMap(size = 8, p = 0.8) {}

  private inMap(row: number, col: number, action: number) {
    if (row === 0 && action === Direction.Up) {
      return false;
    }
    if (row === this.mapSize - 1 && action === Direction.Down) {
      return false;
    }
    if (col === 0 && action === Direction.Left) {
      return false;
    }
    if (col === this.mapSize - 1 && action === Direction.Right) {
      return false;
    }
    return true;
  }

  private _toObs(): tf.Tensor {
    return tf.tensor([this.row * this.mapSize + this.col]);
  }
}

function demo(): void {
  let game = new FrozenLake(8, 0.8, false);
  game.reset();
  game.render();
  let done = false;

  let outerEnv = document.getElementById('game');
  window.setInterval(() => {
    if (!done) {
      // game.render();
      outerEnv.innerHTML = game.renderHTML();
      let action = game.action_space.sample();
      console.log(decodeAction(action));
      let stepInfo = game.step(action);
      done = stepInfo[2];
    } else {
      game.reset();
      done = false;
      console.log('Game terminated, resetting.');
      console.log('---------------------------');
    }
  }, 1000);
}

module.exports.demo = demo;

enum Direction {
  Up,
  Right,
  Left,
  Down,
}

let MAPS = {
  '4x4': [['S', 'F', 'F', 'F'],
          ['F', 'H', 'F', 'H'],
          ['F', 'F', 'F', 'H'],
          ['H', 'F', 'F', 'G']],
  '8x8': [
    ['S', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
    ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
    ['F', 'F', 'F', 'H', 'F', 'F', 'F', 'F'],
    ['F', 'F', 'F', 'F', 'F', 'H', 'F', 'F'],
    ['F', 'F', 'F', 'H', 'F', 'F', 'F', 'F'],
    ['F', 'H', 'H', 'F', 'F', 'F', 'H', 'F'],
    ['F', 'H', 'F', 'F', 'H', 'F', 'H', 'F'],
    ['F', 'F', 'F', 'H', 'F', 'F', 'F', 'G'],
  ],
};

/** Decode an action from the [[FrozenLake]] env for debugging. */
function decodeAction(action: number): string {
  if (action === Direction.Up) return 'Up';
  if (action === Direction.Right) return 'Right';
  if (action === Direction.Left) return 'Left';
  if (action === Direction.Down) return 'Down';
  return 'Not in action space';
}
