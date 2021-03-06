import Space from './spaces/space';
import * as tf from '@tensorflow/tfjs';

/**
 * The main Gym.js class. It encapsulates an environment with
 * arbitrary behind-the-scenes dynamics. An environment can be
 * partially or fully observed.
 *
 * This class is derived from OpenAI's [Gym](https://github.com/openai/gym)
 * and thus the API is very similar and in most cases the same. The key
 * differences are as follows:
 * - gym.js uses tensorflow.js for tensor manipulation instead of numpy.
 *   As a result, all of the returned datatypes are `tf.Tensor` in place
 *   of `np.array`.
 * - The `render` method prints the environment to the console. `renderHTML`
 *   either returns an HTML string or, in the case of a Phaser env, renders
 *   on the canvas.
 *
 *  The main API methods that users of this class need to know are:
 *   - step
 *   - reset
 *   - render
 *   - close
 *   - seed
 *
 *  And set the following attributes:
 *   - `action_space`: The Space object corresponding to valid actions
 *   - `observation_space`: The Space object corresponding to valid observations
 *   - `reward_range`: A tuple corresponding to the min and max possible rewards
 */
interface Env {
  /**
   * The possible actions that can be taken. Either continuous or discrete.
   */
  action_space: Space;

  /**
   * The observable world.
   */
  observation_space: Space;

  /**
   * The possible rewards an agent can achieve.
   */
  reward_range: Space;

  /**
   * Steps the environment according to some action.
   *
   * @param action - The action to take (in action_space)
   * @returns - [observation, reward, done, info] tuple
   */
  step(action: number): [tf.Tensor, number, boolean, {}];

  /**
   * Restore the environment to a random starting state
   * @returns The initial observation
   */
  reset(): tf.Tensor;

  /**
   * Display the game environment
   */
  render(): void;

  /**
   * Terminate the game session and close environment
   */
  close(): void;

  /**
   * Seed the randomness in the environment
   *
   * @param seed - The seed value
   */
  seed(seed: number): void;
}

export default Env;

/**
 * Wrap an [[Env]]
 *
 * This class is constructed with any gym.js `Env`. The methods
 * of the wrapper will be the same as that of the env. This
 * class can be used to preprocess the outputs of any of the
 * env methods by changing the call to the method.
 *
 * @example
 * ```typescript
 * import {Wrapper, FrozenLake} from "gym-js";
 * env = new Wrapper(new FrozenLake());
 * ```
 */
class Wrapper {
  /**
   * @param env - The environment to wrap. Can also be another `Wrapper`.
   */
  constructor(env: Env | Wrapper) {
    this.env = env;
    this.action_space = env.action_space;
    this.observation_space = env.observation_space;
  }

  env: Env | Wrapper;
  action_space: Space;
  observation_space: Space;

  step(action: any): [any, any, any, any] {
    return this.env.step(action);
  }

  reset(): any {
    return this.env.reset();
  }

  toString():string {
    return `<Wrapper>${this.env.toString()}</Wrapper>`;
  }
}

class ObservationWrapper extends Wrapper{
  step(action: any): [any, any, any, any] {
    let [obs,rew,done,info] = this.env.step(action);
    return [this.observation(obs),rew,done,info];
  }

  reset(): any {
    return this.observation(this.env.reset());
  }

  observation(obs: any): any{
    return obs;
  }

  toString():string {
    return `<ObservationWrapper>${this.env.toString()}</ObservationWrapper>`;
  }
}

class ActionWrapper extends Wrapper{
  step(action: any): [any, any, any, any] {
    action = this.action(action);
    return this.env.step(action);
  }

  action(act: any): any{
    return act;
  }

  toString():string {
    return `<ActionWrapper>${this.env.toString()}</ActionWrapper>`;
  }
}

class RewardWrapper extends Wrapper {
  step(action: any): [any, any, any, any] {
    let [obs,rew,done,info] = this.env.step(action);
    return [obs,this.reward(rew),done,info];
  }

  reward(rew: any): any{
    return rew;
  }

  toString():string {
    return `<RewardWrapper>${this.env.toString()}</RewardWrapper>`;
  }
}

export { Wrapper, ObservationWrapper, ActionWrapper, RewardWrapper };
