import * as Phaser from 'phaser';
import Snake from './Snake';
import Food from './Food';
import Env from '../../../core';
import Discrete from '../../../spaces/discrete';
import Space from '../../../spaces/space';
import * as tf from '@tensorflow/tfjs';

var snake;
var food;
var cursors;

class SnakeGame extends Phaser.Scene {
  // Game code from https://labs.phaser.io/view.html?src=src\games\snake\part7.js

  preload() {
    this.load.image('block', './src/envs/arcade/snake/block.png');
  }

  create() {
    food = new Food(this, 3, 4);

    snake = new Snake(this, 8, 8);

    //  Create our keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    if (!snake.alive) {
      return;
    }

    /**
     * Check which key is pressed, and then change the direction the snake
     * is heading based on that. The checks ensure you don't double-back
     * on yourself, for example if you're moving to the right and you press
     * the LEFT cursor, it ignores it, because the only valid directions you
     * can move in at that time is up and down.
     */
    if (cursors.left.isDown) {
      snake.faceLeft();
    } else if (cursors.right.isDown) {
      snake.faceRight();
    } else if (cursors.up.isDown) {
      snake.faceUp();
    } else if (cursors.down.isDown) {
      snake.faceDown();
    }

    if (snake.update(time)) {
      //  If the snake updated, we need to check for collision against food

      if (snake.collideWithFood(food)) {
        this.repositionFood();
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

export class StarfallGame extends Phaser.Game implements Env {
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
  observation_space: Space = new Discrete([640,480]);

  /**
   * @property reward_range the value of eating the food
   * +1 for eating food
   * -1 for crashing into itself
   * 0 else
   */
  reward_range: Space = new Discrete([3]);

  // step(action: number): []{

  // }

  // reset(): number[]{

  // }

  // render(): void {

  // }

  // close(): void{

  // }

  // seed(seed: number): void{

  // }

  private _getObs() {
    return tf.browser.fromPixels(this.canvas);
  }
}

window.onload = () => {
  var game = new StarfallGame(config);
};
