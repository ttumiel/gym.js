import * as tf from '@tensorflow/tfjs';
import Space from './spaces/space';

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
 *   - `actionSpace`: The Space object corresponding to valid actions
 *   - `observationSpace`: The Space object corresponding to valid observations
 *   - `reward_range`: A tuple corresponding to the min and max possible rewards
 */
// tslint:disable-next-line: interface-name
interface Env {
  /**
   * The possible actions that can be taken. Either continuous or discrete.
   */
  actionSpace: Space;

  /**
   * The observable world.
   */
  observationSpace: Space;

  /**
   * The possible rewards an agent can achieve.
   */
  rewardRange: Space;

  /**
   * Steps the environment according to some action.
   *
   * @param action - The action to take (in actionSpace)
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
  public actionSpace: Space;
  public observationSpace: Space;
  protected env: Env | Wrapper;
  /**
   * @param env - The environment to wrap. Can also be another `Wrapper`.
   */
  constructor(env: Env | Wrapper) {
    this.env = env;
    this.actionSpace = env.actionSpace;
    this.observationSpace = env.observationSpace;
  }

  public step(action: any): [any, any, any, any] {
    return this.env.step(action);
  }

  public reset(): any {
    return this.env.reset();
  }

  public toString():string {
    return `<Wrapper>${this.env.toString()}</Wrapper>`;
  }
}

// tslint:disable-next-line: max-classes-per-file
class ObservationWrapper extends Wrapper{
  public step(action: any): [any, any, any, any] {
    const [obs, rew, done, info] = this.env.step(action);
    return [this.observation(obs), rew, done, info];
  }

  public reset(): any {
    return this.observation(this.env.reset());
  }

  public observation(obs: any): any{
    return obs;
  }

  public toString():string {
    return `<ObservationWrapper>${this.env.toString()}</ObservationWrapper>`;
  }
}

// tslint:disable-next-line: max-classes-per-file
class ActionWrapper extends Wrapper{
  public step(action: any): [any, any, any, any] {
    action = this.action(action);
    return this.env.step(action);
  }

  public action(act: any): any{
    return act;
  }

  public toString():string {
    return `<ActionWrapper>${this.env.toString()}</ActionWrapper>`;
  }
}

// tslint:disable-next-line: max-classes-per-file
class RewardWrapper extends Wrapper {
  public step(action: any): [any, any, any, any] {
    const [obs, rew, done, info] = this.env.step(action);
    return [obs,this.reward(rew), done, info];
  }

  public reward(rew: any): any{
    return rew;
  }

  public toString():string {
    return `<RewardWrapper>${this.env.toString()}</RewardWrapper>`;
  }
}

export { Wrapper, ObservationWrapper, ActionWrapper, RewardWrapper };
