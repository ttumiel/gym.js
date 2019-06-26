import * as Phaser from 'phaser';

/** @ignore */
export default class Food extends Phaser.GameObjects.Image {
  total: number;

  constructor(scene, x, y) {
    super(scene, x * 16, y * 16, 'block');

    this.setOrigin(0);

    this.total = 0;

    scene.children.add(this);
  }

  eat() {
    this.total++;
  }
}
