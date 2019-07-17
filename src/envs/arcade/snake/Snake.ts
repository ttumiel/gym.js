// import codependency from "codependency";
// var requirePeer = codependency.register(module);
// var Phaser = requirePeer("phaser");

import * as Phaser from "phaser";
import SnakeGame from './SnakeGame';
import Env from '../../../core';
import Discrete from '../../../spaces/discrete';
import * as tf from '@tensorflow/tfjs';
import { toNumLike } from '../../../utils';
import { PHASER_PARENT, validateConfig } from '../../../PhaserUtils';

const defaultConfig = {
  title: 'Snake',
  width: 640,
  height: 480,
  scene: SnakeGame,
  parent: PHASER_PARENT,
  backgroundColor: '#f4e542',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  }
};

/**
 * The game of snake. Made with `Phaser`.
 *
 * Observations are the pixels of the game of default size `[640, 480, 3]`;
 *
 * Game code adapted from https://labs.phaser.io/view.html?src=src\games\snake\part7.js
 *
 * @example
 * ```typescript
 * import {Snake} from "gym-js";
 * const env = new Snake();
 *
 * console.log(env.action_space.toString());
 * > Discrete [4]
 * console.log(env.observation_space.toString());
 * > Discrete [640, 480, 3]
 *
 * let action = env.action_space.sample();
 * let [obs, rew, done, info] = env.step(action);
 * ```
 */
export default class Snake implements Env {
  /**
   * @param config - A configuration object, detailing the game settings. See
   * the default config below.
   */
  constructor(config: {} = defaultConfig) {
    this.config = validateConfig(config, defaultConfig);
    this.game = new Phaser.Game(config);

    // Post render callback doesn't seem to work for stopping
    // the game from running despite my best efforts.
    // This is my current fix - it's hideous but until I
    // find a better way to pause the game from running and
    // step it manually, this is it.
    setTimeout(()=>this.game.loop.sleep(), 200);
  }

  game: Phaser.Game;
  config: {};

  /**
   * Possible Actions:
   * 0. left
   * 1. up
   * 2. right
   * 3. down
   * The snake is not able to move opposite its current direction.
   */
  action_space: Discrete = new Discrete([4]);

  /**
   * The pixel values of the game (640x480).
   */
  observation_space: Discrete = new Discrete([640, 480, 3]);

  /**
   * The value of eating the food:
   * - +1 for eating food
   * - -1 for crashing into itself
   * - 0 else
   */
  reward_range: Discrete = new Discrete([3]);

  renderDisplay: boolean = true;
  done: boolean = false;
  verbose: boolean = true;
  readonly info: {} = {
    observationSpace: this.observation_space.toString(),
    rewardSpace: this.reward_range.toString(),
    actionSpace: this.action_space.toString(),
    actionDesc: {
      0: 'left',
      1: 'right',
      2: 'up',
      3: 'down',
    },
  };

  step(action: number): [tf.Tensor, number, boolean, {}] {
    let info = {};

    console.assert(action >= 0 && action <= 3, 'The action you made is not in the action space!');

    if (this.done === true) {
      console.warn(
        "You've called 'step()' although the environment has already returned 'done=true'. You should always call 'reset()' once you receive 'done=true'",
      );
    }
    this.done = this._checkDone();
    this._setAction(action);

    // Step the game
    this.game.loop.tick();

    this.observation_space.set(this._getObs());
    let reward = this._getReward();

    if (reward != 0 && this.verbose) {
      console.info('Reward received: ' + reward.toString());
    }

    return [this.observation_space.get(), reward, this.done, info];
  }

  reset(config?:{}): tf.Tensor {
    this.game.destroy(true);
    if (config !== undefined)
      this.config = validateConfig(config, defaultConfig);
    this.game = new Phaser.Game(this.config);
    setTimeout(()=>this.game.loop.sleep(), 200);
    this.observation_space.set(this._getObs());
    return this.observation_space.get();
  }

  render(value: boolean = true): void {
    this.game.destroy(true);
    this.config["type"] = value ? Phaser.WEBGL : Phaser.HEADLESS;
    this.game = new Phaser.Game(this.config);
    setTimeout(()=>this.game.loop.sleep(), 200);
    this.renderDisplay = value;
  }

  close(removeCanvas: boolean = false): void {
    this.game.destroy(removeCanvas);
  }

  seed(seed: number): void {
    this.game.scene.scenes.forEach(s => {
      s.seed = seed;
      s.random.sow(seed.toString());
    });
  }

  private _getObs() {
    return tf.browser.fromPixels(this.game.canvas);
  }

  private _setAction(action: number): void {
    this.game.scene.scenes[0].action = action;
  }

  private _checkDone(): boolean {
    return this.game.scene.scenes[0].done;
  }

  private _getReward(): number {
    let rew = this.game.scene.scenes[0].reward;
    this.game.scene.scenes[0].reward = 0;
    return rew;
  }
}

function demo() {
  var game = new Snake();

  setInterval(()=>{
    let action = toNumLike(game.action_space.sample());
    game.step(action);
  },1000);
}

module.exports.demo = demo;
