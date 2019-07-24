import { Wrapper } from '../core';
import FrozenLake from "../envs/text/FrozenLake";

describe('Wrapper', () => {
  let env = new FrozenLake(4,0.8,false);
  let copyEnv = new FrozenLake(4,0.8,false);
  let wrap = new Wrapper(env);

  it('reset', ()=>{
    expect(wrap.reset().dataSync())
      .toEqual(copyEnv.reset().dataSync());
  })

  it('step', ()=>{
    let action = 1;
    let [obs,rew,done,info] = wrap.step(action);
    let [envObs,envRew,envDone,envInfo] = copyEnv.step(action);

    expect(obs.dataSync())
      .toEqual(envObs.dataSync());

    expect(rew)
      .toEqual(envRew);

    expect(done)
      .toEqual(envDone);

    expect(info)
      .toEqual(envInfo);
  })
});
