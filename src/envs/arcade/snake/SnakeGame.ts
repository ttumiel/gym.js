// import codependency from "codependency";
// var requirePeer = codependency.register(module);
// var Phaser = requirePeer("phaser");

import * as Phaser from "phaser";
import Food from "./Food";

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

/** @ignore */
class SnakeBody extends Phaser.Scene {
  headPosition;
  body;
  head;
  alive;
  speed;
  moveTime;
  tail;
  heading;
  direction;

  constructor(scene, x, y) {
    super({
      key: 'GameScene',
    });
    this.headPosition = new Phaser.Geom.Point(x, y);

    this.body = scene.add.group();

    this.head = this.body.create(x * 16, y * 16, 'block');
    this.head.setOrigin(0);

    this.alive = true;

    this.speed = 100;

    this.moveTime = 0;

    this.tail = new Phaser.Geom.Point(x, y);

    this.heading = RIGHT;
    this.direction = RIGHT;
  }

  update(time: number): boolean {
    if (time >= this.moveTime) {
      return this.move(time);
    }
  }

  private faceLeft() {
    if (this.direction === UP || this.direction === DOWN) {
      this.heading = LEFT;
    }
  }

  private faceRight() {
    if (this.direction === UP || this.direction === DOWN) {
      this.heading = RIGHT;
    }
  }

  private faceUp() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = UP;
    }
  }

  private faceDown() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = DOWN;
    }
  }

  private move(time) {
    /**
     * Based on the heading property (which is the direction the pgroup pressed)
     * we update the headPosition value accordingly.
     *
     * The Math.wrap call allow the snake to wrap around the screen, so when
     * it goes off any of the sides it re-appears on the other.
     */
    switch (this.heading) {
      case LEFT:
        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
        break;

      case RIGHT:
        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
        break;

      case UP:
        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
        break;

      case DOWN:
        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
        break;
    }

    this.direction = this.heading;

    //  Update the body segments and place the last coordinate into this.tail
    Phaser.Actions.ShiftPosition(
      this.body.getChildren(),
      this.headPosition.x * 16,
      this.headPosition.y * 16,
      1,
      this.tail,
    );

    //  Check to see if any of the body pieces have the same x/y as the head
    //  If they do, the head ran into the body

    var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

    if (hitBody) {
      this.alive = false;
      return false;
    } else {
      //  Update the timer ready for the next movement
      this.moveTime = time + this.speed;
      return true;
    }
  }

  private grow() {
    var newPart = this.body.create(this.tail.x, this.tail.y, 'block');

    newPart.setOrigin(0);
  }

  private collideWithFood(food) {
    if (this.head.x === food.x && this.head.y === food.y) {
      this.grow();

      food.eat();

      //  For every 5 items of food eaten we'll increase the snake speed a little
      if (this.speed > 20 && food.total % 5 === 0) {
        this.speed -= 5;
      }

      return true;
    } else {
      return false;
    }
  }

  private updateGrid(grid) {
    //  Remove all body pieces from valid positions list
    this.body.children.each(function(segment) {
      var bx = segment.x / 16;
      var by = segment.y / 16;

      grid[by][bx] = false;
    });

    return grid;
  }
}


/** @ignore */
export default class SnakeGame extends Phaser.Scene {
  action: number = 0;
  done: boolean = false;
  mode: string = 'bot';
  reward: number = 0;
  seed: number;
  random = new Phaser.Math.RandomDataGenerator();

  snake;
  food;
  cursors;

  preload() {
    this.load.image('block', './src/envs/arcade/snake/block.png');
  }

  create() {
    this.food = new Food(this, 3, 4);

    this.snake = new SnakeBody(this, 8, 8); // change to random initialisation

    // Create keyboard controls
    if (this.mode === 'interactive') {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  }

  update(time, delta) {
    if (!this.snake.alive) {
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
      if (this.cursors.left.isDown) {
        this.snake.faceLeft();
      } else if (this.cursors.right.isDown) {
        this.snake.faceRight();
      } else if (this.cursors.up.isDown) {
        this.snake.faceUp();
      } else if (this.cursors.down.isDown) {
        this.snake.faceDown();
      }
    } else {
      if (this.action === 0) {
        this.snake.faceLeft();
      } else if (this.action === 1) {
        this.snake.faceUp();
      } else if (this.action === 2) {
        this.snake.faceRight();
      } else if (this.action === 3) {
        this.snake.faceDown();
      }
    }

    if (this.snake.update(time)) {
      //  If the snake updated, we need to check for collision against food

      if (this.snake.collideWithFood(this.food)) {
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

    this.snake.updateGrid(testGrid);

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
      this.food.setPosition(pos.x * 16, pos.y * 16);

      return true;
    } else {
      return false;
    }
  }
}
