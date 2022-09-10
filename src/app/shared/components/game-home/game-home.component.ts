import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-game-home',
  templateUrl: './game-home.component.html',
  styleUrls: ['./game-home.component.scss']
})
export class GameHomeComponent {

  constructor(
    private router: Router
    ) {
  }

  joinTable() {
    this.router.navigate(['/tables']);
  }

}
