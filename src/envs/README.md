# Environments

There are several environments already created. If you would like to add one of the original Gym's environment's please make a Pull Request. New environments should be created in separate repositories, extending from `gym.js`.

## Current Environments

__Arcade__

Arcade-type game environments.

- Snake

__Algorithmic__

Environments applying an algorithm from input to output.

- Copy
- Reverse

__Toy Text__

Simple test environments.

- FrozenLake


## Creating a New Environment

Creating a new environment is as simple as created a file that implements the `Env` class. It should thus have the `step`, `reset`, `render`, `close`, and `seed` methods.

The environment can be created using any framework. Some of the examples here are created with [Phaser](https://phaser.io/), a JavaScript game engine.

## Environments still to add
This is a list of environments that I think should still be added to `gym.js`. Many more will hopefully be created as separate modules.

### Algorithmic
- Blackjack
- GuessingGame
- HotterColder
- NChain
- Taxi
- Roulette

### Classic Control
- CartPole
- MountainCar
- Pendulum

### Toy Text
- ReversedAddition
