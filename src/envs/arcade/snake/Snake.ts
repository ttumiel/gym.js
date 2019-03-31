import * as Phaser from "phaser";

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

export default class Snake extends Phaser.Scene {
    headPosition;
    body;
    head;
    alive;
    speed;
    moveTime;
    tail;
    heading;
    direction;

    constructor (scene, x, y)
    {
        super({
            key: "GameScene"
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

    update(time: number): boolean
    {
        if (time >= this.moveTime)
        {
            return this.move(time);
        }
    }

    private faceLeft()
    {
        if (this.direction === UP || this.direction === DOWN)
        {
            this.heading = LEFT;
        }
    }

    private faceRight()
    {
        if (this.direction === UP || this.direction === DOWN)
        {
            this.heading = RIGHT;
        }
    }

    private faceUp()
    {
        if (this.direction === LEFT || this.direction === RIGHT)
        {
            this.heading = UP;
        }
    }

    private faceDown()
    {
        if (this.direction === LEFT || this.direction === RIGHT)
        {
            this.heading = DOWN;
        }
    }

     private move(time)
    {
        /**
        * Based on the heading property (which is the direction the pgroup pressed)
        * we update the headPosition value accordingly.
        *
        * The Math.wrap call allow the snake to wrap around the screen, so when
        * it goes off any of the sides it re-appears on the other.
        */
        switch (this.heading)
        {
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
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

        //  Check to see if any of the body pieces have the same x/y as the head
        //  If they do, the head ran into the body

        var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

        if (hitBody)
        {
            console.log('dead');

            this.alive = false;

            return false;
        }
        else
        {
            //  Update the timer ready for the next movement
            this.moveTime = time + this.speed;

            return true;
        }
    }

    private grow()
    {
        var newPart = this.body.create(this.tail.x, this.tail.y, 'block');

        newPart.setOrigin(0);
    }

    private collideWithFood(food)
    {
        if (this.head.x === food.x && this.head.y === food.y)
        {
            this.grow();

            food.eat();

            //  For every 5 items of food eaten we'll increase the snake speed a little
            if (this.speed > 20 && food.total % 5 === 0)
            {
                this.speed -= 5;
            }

            return true;
        }
        else
        {
            return false;
        }
    }

    private updateGrid(grid)
    {
        //  Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {

            var bx = segment.x / 16;
            var by = segment.y / 16;

            grid[by][bx] = false;

        });

        return grid;
    }

};
