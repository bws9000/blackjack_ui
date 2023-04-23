import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { WsService } from 'src/app/shared/services/ws/ws.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent {

  constructor(private wsService:WsService){
    this.wsService.messages = new Subject<any>(); // avoid message pile-up
    this.wsService.messages.subscribe((message)=>{
      console.log(message);
    })
  }
}
