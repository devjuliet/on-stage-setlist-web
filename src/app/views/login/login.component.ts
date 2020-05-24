import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../../services/api-data/api-data.service';
import { ServerMessage } from './../../classes/serverMessages.dto';
import { Router } from '@angular/router';
import { LogedResponse } from 'src/app/classes/logedResponse.class';
import { DataSessionService } from 'src/app/services/dataSession/data-session.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  username: string;
  password: string;

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.clearData();
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      if (this.dataSessionService.user.type == 0) {
        this.dataSessionService.logOut();
        this.utilitiesService.showNotification(1, "El usuario solo es musico.", 4000, () => { });
      } else if (this.dataSessionService.user.type == 1) {
        this.dataSessionService.navigateByUrl("/dashboard/manager");
      } else if (this.dataSessionService.user.type == 2) {
        this.dataSessionService.navigateByUrl("/dashboard/led/home");
      }
    }, (noLoginResponse: LogedResponse) => {
      console.log(noLoginResponse);
    });
  }

  clearData() {
    this.username = "hipsy-luu";
    this.password = "testpass";
  }

  validateLoginData(): Boolean {
    if (this.username.length < 8) {
      this.utilitiesService.showNotification(1, "Usuario invalido.", 4000, () => { });
      return false;
    } else if (this.password.length < 8) {
      this.utilitiesService.showNotification(1, "Contraseña invalida.", 4000, () => { });
      return false;
    } else {
      return true;
    }
  }

  loginUser() {
    if (this.validateLoginData()) {
      this.dataSessionService.loginUser(this.username, this.password).then((response: ServerMessage) => {
        //console.log(response);
        this.clearData();
        this.utilitiesService.showNotification(0, response.message, 2000, () => {
          if (response.data.user.type == 0) {
            this.dataSessionService.logOut();
            this.utilitiesService.showNotification(1, "El usuario solo es musico.", 4000, () => { });
          } else if (response.data.user.type == 1) {
            this.dataSessionService.navigateByUrl("/dashboard/manager");
          } else if (response.data.user.type == 2) {
            this.dataSessionService.navigateByUrl("/dashboard/led/home");
          }
        });
      }, (error) => {
        //console.log(error);
        this.utilitiesService.showNotification(1, error.message, 4000, () => { });
      });
    }
  }

}
