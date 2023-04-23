import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {

  clear(){
    sessionStorage.clear();
  }
  setWSConnected(value: boolean) {
    sessionStorage.setItem('ws:connected', '' + value);
  }
  getWSConnected() {
    return sessionStorage.getItem('ws:connected');
  }
  setUserSocketID(value: string) {
    sessionStorage.setItem('socket:sid', value);
  }
  getUserSocketID(){
    return sessionStorage.getItem('socket:sid');
  }
  setUserPossiblyRobot(value: boolean) {
    sessionStorage.setItem('possibleRobot',""+value);
  }
  getUserPossiblyRobot(){
    return sessionStorage.getItem('possibleRobot');
  }
}
