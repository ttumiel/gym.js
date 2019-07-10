import { FrozenLake } from '../env';

describe('FrozenLake', () => {
  let env = new FrozenLake(4, 0.8, false);

  it('action space', () => {
    expect(env.action_space.length).toEqual(4);
  });

  it('observation space', () => {
    expect(env.observation_space.length).toEqual(16);
  });
});
