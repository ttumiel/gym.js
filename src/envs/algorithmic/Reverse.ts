import {TapeAlgorithmicEnv, decodeAction} from "./AlgorithmicEnv";

export default class Reverse extends TapeAlgorithmicEnv {
  setTarget(input_data:any):void{
    this.target = input_data.reverse();
  }
}
