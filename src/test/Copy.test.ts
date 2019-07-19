import { Copy } from '../env';

describe('Copy', () => {
  let env = new Copy();

  //   it('action space', () => {
  //     expect(env.action_space.shape).toEqual();
  //   });

  it('observation space', () => {
    expect(env.observation_space.length).toEqual(env.base + 1);
  });

  it('steps', () => {
    let action = env.action_space.sample();
    env.step(action);
  })
});
