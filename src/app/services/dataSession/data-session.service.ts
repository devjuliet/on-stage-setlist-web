import { Injectable } from '@angular/core';
import { User } from 'src/app/classes/user.class';
import { Router } from '@angular/router';
import { ApiDataService } from '../api-data/api-data.service';
import { ServerMessage } from 'src/app/classes/serverMessages.dto';
import { LogedResponse } from 'src/app/classes/logedResponse.class';
import { ElementsManager } from 'src/app/classes/elementsManager.class';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class DataSessionService {
  token: String;
  alreadyLoged: Boolean = false;

  user: User;
  elementsManager: ElementsManager;

  baseURL: String;

  constructor(private apiDataService: ApiDataService, private route: Router, ) {
    this.token = "";
    this.user = new User();
    this.elementsManager = new ElementsManager();
    this.baseURL = apiDataService.baseURL;
    //localStorage.setItem('token', JSON.stringify(this.token));
    let token = localStorage.getItem('token');
    if (!token) {
      console.log("Primer uso");
      localStorage.setItem('token', JSON.stringify(this.token));
    } else {
      this.token = JSON.parse(token);
    }
  }

  navigateByUrl(url: String) {
    this.route.navigateByUrl(url.toString());
  }

  checkLogin(succesCallBack, errorCallBack) {
    //console.log(this.token);
    if (this.token == "") {
      errorCallBack(new LogedResponse(true, "Sin token"))
    } else {
      this.apiDataService.setToken(this.token);
      if (this.user.username == "") {
        this.apiDataService.getUserData(this.token).then((response: ServerMessage) => {
          //console.log(response);
          if (response.error == true) {
            this.navigateByUrl("/login");
            errorCallBack(new LogedResponse(false, response.message))
          } else {
            this.user.idUser = response.data.user.idUser;
            this.user.username = response.data.user.username;
            this.user.name = response.data.user.name;
            this.user.type = response.data.user.type;
            this.user.email = response.data.user.email;
            this.user.haveImage = response.data.user.haveImage;

            if (this.user.haveImage) {
              this.apiDataService.getImage(this.baseURL.toString() +
                'uploads/user-image/' + this.user.idUser.toString()).then((image) => {
                  this.user.imageBlob = image;
                  succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
                }, (error) => {
                  console.log(error);
                  this.user.imageBlob = "";
                  errorCallBack(new LogedResponse(true, "A ocurrido un error obteniendo la imagen del usuario"));
                });
            } else {
              succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
            }
            /* console.log(this.user); */
          }
        }, (error) => {
          console.log(error);
          errorCallBack(new LogedResponse(true, "A ocurrido un error"));
        });
      } else {
        this.apiDataService.getImage(this.baseURL.toString() +
          'uploads/user-image/' + this.user.idUser.toString()).then((image: string) => {
            this.user.imageBlob = image;
            //console.log(image);
            succesCallBack(new LogedResponse(false, "Sesion Con token e informacion de usuario"));
          }, (error) => {
            console.log(error);
            this.user.imageBlob = "";
            errorCallBack(new LogedResponse(true, "A ocurrido un error obteniendo la imagen del usuario"));
          });
      }
    }
  }

  loginUser(username: String, password: String) {
    return new Promise((resolve, reject) => {
      this.apiDataService.doLogin(username, password).then((response: ServerMessage) => {
        if (response.error) {
          reject(response)
        } else {
          //Logica con la que guardamos los datos del inicio de sesion
          localStorage.setItem('token', JSON.stringify(response.data.token));
          this.token = response.data.token;
          resolve(response);
        }
      }, (error) => {
        reject(error)
      });
    });
  }

  logOut() {
    localStorage.setItem('token', "");
    this.token = localStorage.getItem('token');
    this.route.navigateByUrl('/')
  }
}
