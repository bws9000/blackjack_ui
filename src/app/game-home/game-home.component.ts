import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-game-home',
  templateUrl: './game-home.component.html',
  styleUrls: ['./game-home.component.css']
})
export class GameHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  joinTable(){
    this.router.navigate(['/tables']).then(r => {
      alert("Welcome to the Blackjack tables.");
    });
  }

}
