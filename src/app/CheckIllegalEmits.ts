import {environment} from "../environments/environment";

export class CheckIllegalEmits {

  /**
   *  check for emits not allowed at
   *  current game position enum pattern class
   */

  public static gameHome = new CheckIllegalEmits(
    0,
    [
      "leaveTable",
      "readyToBet"
    ]);

  public static tableSelect = new CheckIllegalEmits(
    1,
    [
      "leaveTable",
      "readyToBet"
    ]);

  public static tableDetail = new CheckIllegalEmits(
    2,
    []);


  private readonly gamePosition: number;
  private illegalEmits: Array<string>;

  constructor(gamePosition: number, illegalEmits: Array<string>) {
    this.gamePosition = gamePosition;
    this.illegalEmits = illegalEmits;
  }

  public checkForIllegals(emit: string) {

    let result = false;
    if (this.illegalEmits.includes(emit)) {
      CheckIllegalEmits.logStuff("Emit " + emit +
        " stopped at gamePosition:" + this.gamePosition);
      result = true;
    }
    return result;
  }

  private static logStuff(stuff: any) {
    if (!environment.production) {
      console.log("***CheckIllegalEmit***");
      console.log(stuff);
      console.log("**********************");
    }
  }
}
