import * as Phaser from 'phaser';
import SnakeBody from './SnakeBody';
import Food from './Food';
import Env from '../../../core';
import Discrete from '../../../spaces/discrete';
import Space from '../../../spaces/space';
import * as tf from '@tensorflow/tfjs';
import { toNumLike } from '../../../utils';

let snake;
let food;
let cursors;

class SnakeGame extends Phaser.Scene {
  // Game code adapted from https://labs.phaser.io/view.html?src=src\games\snake\part7.js

  action: number = 0;
  done: boolean = false;
  mode: string = 'bot';
  reward: number = 0;
  seed: number;
  random = new Phaser.Math.RandomDataGenerator();

  preload() {
    this.load.image('block', './src/envs/arcade/snake/block.png');
  }

  create() {
    food = new Food(this, 3, 4);

    snake = new SnakeBody(this, 8, 8); // change to random initialisation

    // Create keyboard controls
    if (this.mode === 'interactive') {
      cursors = this.input.keyboard.createCursorKeys();
    }
  }

  update(time, delta) {
    if (!snake.alive) {
      this.done = true;
      this.reward--;
      return;
    }

    /**
     * Check which key is pressed, and then change the direction the snake
     * is heading based on that. The checks ensure you don't double-back
     * on yourself, for example if you're moving to the right and you press
     * the LEFT cursor, it ignores it, because the only valid directions you
     * can move in at that time is up and down.
     */
    if (this.mode === 'interactive') {
      if (cursors.left.isDown) {
        snake.faceLeft();
      } else if (cursors.right.isDown) {
        snake.faceRight();
      } else if (cursors.up.isDown) {
        snake.faceUp();
      } else if (cursors.down.isDown) {
        snake.faceDown();
      }
    } else {
      if (this.action === 0) {
        snake.faceLeft();
      } else if (this.action === 1) {
        snake.faceUp();
      } else if (this.action === 2) {
        snake.faceRight();
      } else if (this.action === 3) {
        snake.faceDown();
      }
    }

    if (snake.update(time)) {
      //  If the snake updated, we need to check for collision against food

      if (snake.collideWithFood(food)) {
        this.repositionFood();
        this.reward++;
      }
    }
  }

  /**
   * We can place the food anywhere in our 40x30 grid
   * *except* on-top of the snake, so we need
   * to filter those out of the possible food locations.
   * If there aren't any locations left, they've won!
   *
   * @method repositionFood
   * @return {boolean} true if the food was placed, otherwise false
   */
  repositionFood() {
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < 30; y++) {
      testGrid[y] = [];

      for (var x = 0; x < 40; x++) {
        testGrid[y][x] = true;
      }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++) {
      for (var x = 0; x < 40; x++) {
        if (testGrid[y][x] === true) {
          //  Is this position valid for food? If so, add it here ...
          validLocations.push({ x: x, y: y });
        }
      }
    }

    if (validLocations.length > 0) {
      //  Use the RNG to pick a random food position
      var pos = Phaser.Math.RND.pick(validLocations);

      //  And place it
      food.setPosition(pos.x * 16, pos.y * 16);

      return true;
    } else {
      return false;
    }
  }
}

const config = {
  title: 'Snake',
  width: 640,
  height: 480,
  parent: 'game',
  scene: SnakeGame,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  backgroundColor: '#f4e542',
};

export default class Snake extends Phaser.Game implements Env {
  constructor(config) {
    super(config);
  }

  /**
   * @property action_space Possible Actions:
   * 0: left
   * 1: up
   * 2: right
   * 3: down
   * The snake is not able to move opposite its current direction.
   */
  action_space: Space = new Discrete([4]);

  /**
   * @property observation_space The pixel values of the game (640x480).
   */
  observation_space: Space = new Discrete([640, 480, 3]);

  /**
   * @property reward_range the value of eating the food
   * +1 for eating food
   * -1 for crashing into itself
   * 0 else
   */
  reward_range: Space = new Discrete([3]);

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

  step(action: number): [tf.Tensor, number, boolean, {}];
  step(time: number, delta: number, action: number): [tf.Tensor, number, boolean, {}];
  step(time: number, delta?: number, action?: number): [tf.Tensor, number, boolean, {}] {
    let info = {};

    if (this.renderDisplay) {
      super.step(time, delta);
    } else {
      super.headlessStep(time, delta);
    }

    action = toNumLike(this.action_space.sample());
    console.assert(action >= 0 && action <= 3, 'The action you made is not in the action space!');

    if (this.done === true) {
      console.warn(
        "You've called 'step()' although the environment has already returned 'done=true'. You should always call 'reset()' once you receive 'done=true'",
      );
    }
    this.done = this._checkDone();
    this._setAction(action);

    this.observation_space.set(this._getObs());
    let reward = this._getReward();

    if (reward != 0 && this.verbose) {
      console.info('Reward received: ' + reward.toString());
    }

    // this.observation_space.get().print();

    return [this.observation_space.get(), reward, this.done, info];
  }

  reset(): tf.Tensor {
    this.start();
    this.observation_space.set(this._getObs());
    return this.observation_space.get();
  }

  render(value: boolean = true): void {
    this.renderDisplay = value;
  }

  close(removeCanvas: boolean = false): void {
    this.destroy(removeCanvas);
  }

  seed(seed: number): void {
    this.scene.scenes.forEach(s => {
      s.seed = seed;
      s.random.sow(seed.toString());
    });
  }

  private _getObs() {
    return tf.browser.fromPixels(this.canvas);
  }

  private _setAction(action: number): void {
    this.scene.scenes[0].action = action;
  }

  private _checkDone(): boolean {
    return this.scene.scenes[0].done;
  }

  private _getReward(): number {
    let rew = this.scene.scenes[0].reward;
    this.scene.scenes[0].reward = 0;
    return rew;
  }
}

function demo() {
  var game = new Snake(config);
}

module.exports.demo = demo;
