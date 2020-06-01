import { Component, OnInit } from '@angular/core';
import { DataSessionService } from '../../services/dataSession/data-session.service';
import { LogedResponse } from '../../classes/logedResponse.class';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username : String;

  constructor(public dataSessionService: DataSessionService) {
    this.username = "";
  }

  ngOnInit(): void {
    this.dataSessionService.checkLogin(async (logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      //Cosas para hacer en caso de que el usario este logeado
      console.log("simonkiii");
      this.username = new String( this.dataSessionService.user.username);
    }, (noLoginResponse: LogedResponse) => {
      console.log(noLoginResponse);
      this.username = "";
    });
  }
}
