import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RobotCheckComponent } from 'src/app/shared/components/popups/robot-check/robot-check.component';
import { ModalServiceService } from 'src/app/shared/modules/modal/services/modal-service.service';
import { SessionStorageService } from 'src/app/shared/services/sessionStorage/session-storage.service';
import { WsService } from 'src/app/shared/services/ws/ws.service';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(
    private router: Router,
    private sessionService: SessionStorageService,
    private modalService: ModalServiceService,
    private wsService: WsService
  ) {}

  navigateToGameHomeFromNonSocketArea(): void {
    const connected = this.sessionService.getWSConnected() ?? false;
    const robot = this.sessionService.getUserPossiblyRobot() ?? false;
    const sid = this.sessionService.getUserSocketID() ?? false;

    if (this.wsService.ws2) {
      if (!connected || connected === 'false') {
        this.openRobotCheckPopup();
      } else {
        this.router.navigate(['/blackjack/connect']);
      }
    } else {
      this.openRobotCheckPopup();
    }
  }

  openRobotCheckPopup(): void {
    this.modalService.open({
      popupComponent: RobotCheckComponent,
      data: {
        title: '',
        message: `Welcome, click connect to get started.`,
      },
    });
  }
}
