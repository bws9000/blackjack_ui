import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss']
})
export class AppHomeComponent {

  constructor(
    private router: Router
    ) {
  }

  joinTable() {
    this.router.navigate(['/tables']);
  }

}
