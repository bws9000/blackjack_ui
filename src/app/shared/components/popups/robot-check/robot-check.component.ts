import { Component } from '@angular/core';
import { RecaptchaService } from 'src/app/services/recaptcha/recaptcha.service';
import { ModalServiceService } from 'src/app/shared/modules/modal/services/modal-service.service';
import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from 'src/app/shared/services/sessionStorage/session-storage.service';
import { reCaptchaV3 } from 'src/app/shared/interface/robot-check.interface';
import { Router } from '@angular/router';
import { InitAppService } from 'src/app/init/init-app.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

@Component({
  selector: 'app-robot-check',
  templateUrl: './robot-check.component.html',
  styleUrls: ['./robot-check.component.scss'],
  providers: [],
})
export class RobotCheckComponent {
  public data: any;
  possibleRobot: boolean = false;

  constructor(
    private modalService: ModalServiceService,
    private recaptchaService: RecaptchaService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private http: HttpClient,
    private initAppService: InitAppService,
    private loadingService: LoadingService
  ) {
    this.data = this.modalService.getData();
  }

  public submit(): void {
    this.loadingService.show();
    this.initAppService.setLoadingWS(true);
    this.initAppService.setLoadingGoogleCaptcha(true);

    this.recaptchaService.execute().subscribe((token: string) => {
      this.http
        .get<reCaptchaV3>(
          'http://localhost:3000/verify/responseToken=' + token,
          {}
        )
        .subscribe({
          next: (data) => {
            if (data && data.score && data.success) {
              // console.log(data);
              const score = parseFloat(data.score);
              const success = data.success;
              if (success && score < 0.9) {
                this.possibleRobot = true;
              }
            }
          },
          error: (err) => {
            console.log(err); // for now
          },
          complete: () => {
            // auth guard check
            this.sessionStorageService.setUserPossiblyRobot(this.possibleRobot);
            // this.router.navigate(['/', { outlets: { blackjackOutlet: ['blackjack'] }, queryParams: { level: 1 } }]);
            this.router.navigate(['blackjack/connect']);
            this.modalService.close();
            this.initAppService.setLoadingGoogleCaptcha(false);
          },
        });
    });
  }

  public close(): void {
    this.modalService.close();
  }
}
