import FrozenLake from '../envs/text/FrozenLake';

describe('FrozenLake', () => {
  let env = new FrozenLake(4, 0.8, false);

  it('action space', () => {
    expect(env.actionSpace.length).toEqual(4);
  });

  it('observation space', () => {
    expect(env.observationSpace.length).toEqual(16);
  });

  it('steps', () => {
    let action = env.actionSpace.sample();
    env.step(action);
  })
});
