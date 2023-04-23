import { Injectable } from '@angular/core';
import { SessionStorageService } from 'src/app/shared/services/sessionStorage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private sessionStorageService: SessionStorageService){}
  isAuthenticated(): Promise<any> {
    return new Promise((resolve) => {
      if(this.sessionStorageService.getUserPossiblyRobot() === 'false'){
        resolve(true);
      }
      resolve(false);
    });
  }
}
