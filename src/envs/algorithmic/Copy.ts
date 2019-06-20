import {TapeAlgorithmicEnv, decodeAction} from "./AlgorithmicEnv";

class Copy extends TapeAlgorithmicEnv {
  setTarget(input_data:any):void{
    this.target = input_data;
  }
}
