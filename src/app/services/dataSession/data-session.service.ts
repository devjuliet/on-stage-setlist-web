import { Injectable } from '@angular/core';
import { User } from 'src/app/classes/user.class';
import { Router } from '@angular/router';
import { ApiDataService } from '../api-data/api-data.service';
import { ServerMessage } from 'src/app/classes/serverMessages.dto';
import { LogedResponse } from 'src/app/classes/logedResponse.class';

@Injectable({
  providedIn: 'root'
})
export class DataSessionService {
  token: String;
  alreadyLoged: Boolean = false;

  user: User;

  constructor(private apiService: ApiDataService, private route: Router, ) {
    this.token = "";
    this.user = new User();
    let token = localStorage.getItem('token');
    //localStorage.removeItem("user")
    if (!token) {
      console.log("Primer uso");
      localStorage.setItem('token', JSON.stringify(this.token));
    } else {
      this.token = JSON.parse(token);
    }
  }

  checkLogin(succesCallBack, errorCallBack) {
    /* console.log(this.user); */
    if (this.token == "") {
      errorCallBack(new LogedResponse(true, "Sin token"))
    } else {
      //TO DO - mandar traer la data de la api en caso de que el token este correcto pero no hacerlo si ya exite info de la sesion 
      //        en el servicio
      succesCallBack(new LogedResponse(false, "Con token"))
    }
  }


  logOut() {
    localStorage.setItem('user', JSON.stringify(new User()));
    this.user = JSON.parse(localStorage.getItem('user'));
    this.alreadyLoged = false;

    this.route.navigateByUrl('/')
  }
}
