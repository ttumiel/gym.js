export interface Space {
    shape:[];
    type:any;

    sample():number;
    seed(seed: number):void;
}
