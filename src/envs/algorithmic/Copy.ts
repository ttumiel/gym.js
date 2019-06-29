import { TapeAlgorithmicEnv, decodeAction } from './AlgorithmicEnv';

/**
 * A 1D algorithmic environment where the target is the same
 * as the observation.
 *
 * The 1D [[TapeAlgorithmicEnv]] has an `action_space` tuple
 * with shape [2,2,10]. The first item is the chosen movement,
 * either left or right. The second item is whether to write
 * to the current position or not. Finally, the last value is
 * the actual value to write to the tape in the current position.
 * The environment terminates immediately when an incorrect item
 * is written or when the entire output is successfully outputted.
 * The `MIN_LENGTH` of the tape is `5` plus a random number between
 * 0 and 2.
 *
 * @example
 * ```typescript
 * import {Copy} from "gym-js";
 * let base = 10;
 * const env = new Copy(base);
 *
 * console.log(env.action_space.toString());
 * > DiscreteTuple: 2,2,10
 * console.log(env.observation_space.toString());
 * > Discrete: 11
 *
 * let action = env.action_space.sample();
 * let [obs, rew, done, info] = env.step(action);
 * ```
 */
export default class Copy extends TapeAlgorithmicEnv {
  setTarget(input_data: any): void {
    this.target = input_data;
  }
}

/**
 * Demo of the [[Copy]] environment.
 */
function demo() {
  let game = new Copy(3);
  let done = false;

  let outerEnv = document.getElementById('game');
  window.setInterval(() => {
    if (!done) {
      // game.render();
      outerEnv.innerHTML = game.renderHTML();
      let action = game.action_space.sample();
      console.log('Action:\n', decodeAction(action, game.MOVEMENTS));
      let stepInfo = game.step(action);
      console.log('Env obs:', stepInfo[0]);
      console.log('Env rew:', stepInfo[1]);
      done = stepInfo[2];
    } else {
      game.reset();
      done = false;
      console.log('Game terminated, resetting.');
      console.log('---------------------------');
    }
  }, 1000);
}

module.exports.demo = demo;
