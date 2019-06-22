import Space from './spaces/space';
import * as tf from '@tensorflow/tfjs';

/**
 * This class is derived from OpenAI's Gym (https://github.com/openai/gym)
 * and thus the API is very similar. For a list of differences, see
 * here:
 *
 * The main Gym.js class. It encapsulates an environment with
 * arbitrary behind-the-scenes dynamics. An environment can be
 * partially or fully observed.
 *
 *  The main API methods that users of this class need to know are:
 *      step
 *      reset
 *      render
 *      close
 *      seed
 *
 *  And set the following attributes:
 *      action_space: The Space object corresponding to valid actions
 *      observation_space: The Space object corresponding to valid observations
 *      reward_range: A tuple corresponding to the min and max possible rewards
 */
interface Env {
  /**
   * @property action_space The possible actions that can be taken.
   *           either continuous or discrete.
   */
  action_space: Space;

  /**
   * @property observation_space The observable world.
   */
  observation_space: Space;

  /**
   * @property reward_range The possible rewards an agent can achieve.
   */
  reward_range: Space;

  /**
   * @function step Steps the environment according to some action.
   * @param action The action to take (in action_space)
   * @returns [tf.Tensor, number, boolean, {}]
   */
  step(action: number): [tf.Tensor, number, boolean, {}];

  /**
   * @function step Overloaded step for Phaser Games.
   * @param time Phaser time
   * @param delta Phaser time delta
   * @param action The action to take (in action_space)
   * @returns [tf.Tensor, number, boolean, {}]
   */
  step(time: number, delta: number, action: number): [tf.Tensor, number, boolean, {}];

  /**
   * @function reset Restore the environment to a random starting state
   * @returns tf.Tensor The initial observation
   */
  reset(): tf.Tensor;

  /**
   * @function render Display the game environment
   */
  render(): void;

  /**
   * @function close Terminate the game session and close environment
   */
  close(): void;

  /**
   * @function seed Seed the randomness in the environment
   * @param seed The seed value
   */
  seed(seed: number): void;
}

export default Env;
