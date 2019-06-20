import {TapeAlgorithmicEnv, decodeAction} from "./AlgorithmicEnv";

class Reverse extends TapeAlgorithmicEnv {
  setTarget(input_data:any):void{
    this.target = input_data.reverse();
  }
}
