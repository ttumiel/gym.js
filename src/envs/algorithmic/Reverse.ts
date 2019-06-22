import { TapeAlgorithmicEnv, decodeAction } from './AlgorithmicEnv';

export default class Reverse extends TapeAlgorithmicEnv {
  setTarget(input_data: any): void {
    this.target = input_data.reverse();
  }
}

////////////////////////
////// Game Demo ///////
////////////////////////
function demo() {
  let game = new Reverse(2);
  let done = false;

  let outerEnv = document.getElementById('game');
  window.setInterval(() => {
    if (!done) {
      // game.render();
      outerEnv.innerHTML = game.renderHTML();
      let action = game.tuple_action_space.sample();
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
