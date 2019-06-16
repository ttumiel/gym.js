import Env from "../../core";
import Discrete from "../../spaces/discrete";
import Space from "../../spaces/space";
import * as tf from '@tensorflow/tfjs';

/**
 * An environment implementing the toy text "Frozen Lake" game.
 * 
 * @param mapSize The size of the map
 * @param p The probability of not slipping
 * @param isSlippery Set the ice to slippery or not
 * 
 * Actions:
 *  0 - Up
 *  1 - Right
 *  2 - Down
 *  3 - Left
 * 
 * Rewards:
 *  1 - If reach target 'G'
 *  0 - Otherwise
 */
class FrozenLake implements Env {
  constructor(mapSize: number = 4, p: number = 0.8, isSlippery: boolean = true) {
    this.action_space = new Discrete([4]);
    this.reward_range = new Discrete([2]);
    this.isSlippery = isSlippery;
    this.mapSize = mapSize;
    this.p = p;
    this.done = false;
    this.row = 0;
    this.col = 0;

    this.observation_space = new Discrete([mapSize * mapSize])
    this.map = [["S", "F", "F", "F"],
    ["F", "H", "F", "H"],
    ["F", "F", "F", "H"],
    ["H", "F", "F", "G"]]

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

  step(action: number): [tf.Tensor, number, boolean, {}] {
    let reward = 0;

    if (!this.done) {
      let newPos = this.move(this.row, this.col, action);
      this.row = newPos[0];
      this.col = newPos[1];

      let currentState = this.map[this.row][this.col];
      this.observation_space.set(this._toObs());

      if (currentState == "H") {
        this.done = true;
        // reward = -1;
      }
      else if (currentState == "G") {
        this.done = true;
        reward = 1;
      }
    } else {
      console.warn("This environment has terminated. You should call `reset` before continuing.");
    }
    return [this.observation_space.get(), reward, this.done, {}]
  }

  reset(): tf.Tensor {
    this.done = false;
    this.observation_space.set(tf.tensor([0]));
    return this.observation_space.get();
  }

  render(): void {
    console.log(this.observation_space.get().dataSync());
  }

  render_html(): string{
    return `
    <style>.currentState{background-color: red}</style>
    <div id="environment">
      <div>
        <span class="currentState">${this.map[0][0]}</span>
        <span>${this.map[0][1]}</span>
        <span>${this.map[0][2]}</span>
        <span>${this.map[0][3]}</span>
      </div>
      <div>
        <span>${this.map[1][0]}</span>
        <span>${this.map[1][1]}</span>
        <span>${this.map[1][2]}</span>
        <span>${this.map[1][3]}</span>
      </div>
      <div>
        <span>${this.map[2][0]}</span>
        <span>${this.map[2][1]}</span>
        <span>${this.map[2][2]}</span>
        <span>${this.map[2][3]}</span>
      </div>
      <div>
        <span>${this.map[3][0]}</span>
        <span>${this.map[3][1]}</span>
        <span>${this.map[3][2]}</span>
        <span>${this.map[3][3]}</span>
      </div>
    </div>
    `
  }

  close(): void { }

  seed(seed: number): void {

  }

  move(row: number, col: number, action: number): [number, number] {
    if (this.isSlippery && Math.random() > 1 / 3) {
      action = this.action_space.sample();
    }
    if (this.inMap(row, col, action)) {
      if (action == Direction.Up) {
        row -= 1;
      }
      if (action == Direction.Down) {
        row += 1;
      }
      if (action == Direction.Right) {
        col += 1;
      }
      if (action == Direction.Left) {
        col -= 1;
      }
    }
    return [row, col];
  }

  // generateRandomMap(size = 8, p = 0.8) {

  // }

  inMap(row: number, col: number, action: number) {
    if (row == 0 && action == Direction.Up) {
      return false;
    }
    if (row == this.mapSize - 1 && action == Direction.Down) {
      return false;
    }
    if (col == 0 && action == Direction.Left) {
      return false;
    }
    if (col == this.mapSize - 1 && action == Direction.Right) {
      return false;
    }
    return true;
  }

  // private _encodeMap2Tensor(): tf.Tensor{
  //   // Turn the text based map into a tensor
  //   /**
  //    * 0 - S
  //    * 1 - F
  //    * 2 - G
  //    */
  // }

  private _toObs(): tf.Tensor {
    return tf.tensor([this.row * 4 + this.col]);
  }
}

window.onload = () => {
  let testLen = 15;
  let done = false;

  var game = new FrozenLake(4, 0.8, false);
  game.reset();

  for (let i=0; i<testLen; i++){
    if (!done){
      game.render();
      let action = game.action_space.sample();
      console.log(decodeAction(action));
      let stepInfo = game.step(action);
      done = stepInfo[2];
    }else{
      game.reset();
      done = false;
      console.log("Game terminated, resetting.");
      console.log("---------------------------");
    }
  }
};

enum Direction {
  Up,
  Right,
  Left,
  Down
}

function decodeAction(action: number): string{
  if (action == Direction.Up) return "Up";
  if (action == Direction.Right) return "Right";
  if (action == Direction.Left) return "Left";
  if (action == Direction.Down) return "Down";
  return "Not in action space"
}
