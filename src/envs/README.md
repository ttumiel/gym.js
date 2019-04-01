# Environments

There are several environments already created. If you would like to add one of the original Gym's environment's please make a Pull Request. New environments should be created in separate repositories, extending from gym.js.

## Current Environments

__Arcade__

Arcade-type game environments.

- Snake

__Algorithmic__



## Creating a New Environment

Creating a new environment is as simple as created a file that implements the `Env` class. It should thus have the `step`, `reset`, `render`, `close`, and `seed` methods.

The environment can be created using any framework. Some of the examples here are created with [Phaser](), a JavaScript game engine.
