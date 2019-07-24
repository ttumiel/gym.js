import FrozenLake from '../envs/text/FrozenLake';

describe('FrozenLake', () => {
  let env = new FrozenLake(4, 0.8, false);

  it('action space', () => {
    expect(env.action_space.length).toEqual(4);
  });

  it('observation space', () => {
    expect(env.observation_space.length).toEqual(16);
  });

  it('steps', () => {
    let action = env.action_space.sample();
    env.step(action);
  })
});
