import { Injectable } from '@angular/core';
import { SessionStorageService } from '../shared/services/sessionStorage/session-storage.service';
import { LoadingService } from '../shared/services/loading/loading.service';

@Injectable({
  providedIn: 'root',
})
export class InitAppService {
  private loadingWS: boolean;
  private loadingGoogleRecaptcha: boolean;
  constructor(private sessionStorageService: SessionStorageService,
    private loadingService: LoadingService) {
    this.sessionStorageService.setWSConnected(false);
  }

  setLoadingWS(value: boolean) {
    this.loadingWS = value;
    console.log('LOADING WS: ' + value);
    if(!value){
      this.loadingService.hide();
    }
  }
  getLoadingWS(): boolean {
    return this.loadingWS;
  }

  setLoadingGoogleCaptcha(value: boolean){
    this.loadingGoogleRecaptcha = value;
    console.log('LOADING GR: ' + value);
  }
  getLoadingGoogleCaptcha():boolean{
    return this.loadingGoogleRecaptcha;
  }

  initialize(): void {
    this.setLoadingWS(false);
    this.setLoadingGoogleCaptcha(false);
  }
}
