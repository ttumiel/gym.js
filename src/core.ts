import {Space} from './space';

interface Env {
    action_space:Space;
    observation_space: Space;
    reward_range: [];

    reset():number[];
    step(action: number):[];
    render():void;
    close():void;
    seed(seed: number):void;
}
