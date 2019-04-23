import Space from './spaces/space';
import * as tf from "@tensorflow/tfjs";

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
  action_space: Space;
  observation_space: Space;
  reward_range: Space;

  step(action: number): [tf.Tensor, number, boolean, {}];
  step(time: number, delta: number, action: number): [tf.Tensor, number, boolean, {}];
  reset(): tf.Tensor;
  render(): void;
  close(): void;
  seed(seed: number): void;
}

export default Env;
