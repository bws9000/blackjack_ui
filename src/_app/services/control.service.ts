import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlService {
  public gamePosition: number;
  public playerLeftGame: boolean;

  constructor() {
    this.playerLeftGame = false; //set on join and leave game
    this.gamePosition = 0;
  }
}
