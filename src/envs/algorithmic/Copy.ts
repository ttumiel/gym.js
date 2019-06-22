import {TapeAlgorithmicEnv, decodeAction} from "./AlgorithmicEnv";

export default class Copy extends TapeAlgorithmicEnv {
  setTarget(input_data:any):void{
    this.target = input_data;
  }
}
