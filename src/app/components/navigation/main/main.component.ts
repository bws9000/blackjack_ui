import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  wsStateListener: Subject<boolean> = new Subject<boolean>();

  constructor(
    private routerService: RouterService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {});
  }

  checkRobotPopup() {
    this.routerService.navigateToGameHomeFromNonSocketArea();
  }
}
