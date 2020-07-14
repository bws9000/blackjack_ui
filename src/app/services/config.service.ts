import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  URL_DEV_GAME_HOME = "http://localhost:5000";
  URL_PRO_GAME_HOME = "https://development-1.blackjackgame.us";
  constructor() { }
}
