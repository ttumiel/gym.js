import Reverse from '../envs/algorithmic/Reverse';

describe('Reverse', () => {
  let env = new Reverse();

  //   it('action space', () => {
  //     expect(env.actionSpace.shape).toEqual();
  //   });

  it('observation space', () => {
    expect(env.observationSpace.length).toEqual(env.base + 1);
  });

  it('steps', () => {
    let action = env.actionSpace.sample();
    env.step(action);
  })
});
