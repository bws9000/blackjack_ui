import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(){}
  init():void{
    //localStorage.setItem("ws:connected","false")
  }
}
