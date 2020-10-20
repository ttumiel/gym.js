import Copy from '../envs/algorithmic/Copy';

describe('Copy', () => {
  let env = new Copy();

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
