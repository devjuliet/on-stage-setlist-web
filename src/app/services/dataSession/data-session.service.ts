import { Injectable } from '@angular/core';
import { User } from '../../classes/user.class';
import { Router } from '@angular/router';
import { ApiDataService } from '../api-data/api-data.service';
import { ServerMessage } from '../../classes/serverMessages.dto';
import { LogedResponse } from '../../classes/logedResponse.class';
import { ElementsManager } from '../../classes/elementsManager.class';
import { DomSanitizer } from '@angular/platform-browser';
import { Tag } from '../../classes/tag.class';

@Injectable({
  providedIn: 'root'
})
export class DataSessionService {
  token: String;
  alreadyLoged: Boolean = false;

  user: User;
  elementsManager: ElementsManager;
  tagsCatalog : Tag[];
  baseURL: String;

  constructor(private apiDataService: ApiDataService, private route: Router, ) {
    this.token = "";
    this.user = new User();
    this.elementsManager = new ElementsManager();
    this.tagsCatalog = [];
    this.baseURL = apiDataService.baseURL;
    //localStorage.setItem('token', JSON.stringify(this.token));
    let token = localStorage.getItem('token');
    if (!token) {
      console.log("Primer uso");
      localStorage.setItem('token', JSON.stringify(this.token));
    } else {
      this.token = JSON.parse(token);
      this.apiDataService.setToken(this.token);
      //Acciones a realizar cuando el token estaba ya guardado pero la data para la interfaz no esta disponible
      //Se sabe que no esta disponible porque apenas se mando llamar el contructor
      this.getBandsManager((response) => {
        //console.log(this.elementsManager.bands);
      }, (err) => {
        console.log(err);
      });
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

  getGenresCatalog(succesCallBack,errorCallBack){
    this.apiDataService.getCatalogGenresData().then((response: ServerMessage) => {
      if(response.error == true){
        errorCallBack(response.message);
      }else{
        this.elementsManager.genresCatalog = response.data;
        succesCallBack("Catalogo obtenido con exito.");
      }
    }, (error) => {
      console.log(error);
      errorCallBack("A ocurrido un error");
    });
  }

  getBandsManager(succesCallBack,errorCallBack){
    this.apiDataService.getBandsManager().then((response: ServerMessage) => {
      if(response.error == true){
        errorCallBack(response.message);
      }else{
        this.elementsManager.bands = response.data;
        succesCallBack("Bandas actualizadas con exito.");
      }
    }, (error) => {
      console.log(error);
      errorCallBack("A ocurrido un error");
    });
  };

  getEventsManager(succesCallBack,errorCallBack){
    this.apiDataService.getEventsManager().then((response: ServerMessage) => {
      if(response.error == true){
        errorCallBack(response.message);
      }else{
        this.elementsManager.upcomingEvents = response.data;
        for (let index = 0; index < this.elementsManager.upcomingEvents.length; index++) {
          this.elementsManager.upcomingEvents[index].date = new Date(this.elementsManager.upcomingEvents[index].date);
        }
        succesCallBack("Eventos actualizadas con exito.");
      }
    }, (error) => {
      console.log(error);
      errorCallBack("A ocurrido un error");
    });
  };

  getTagsCatalog(succesCallBack,errorCallBack){
    this.apiDataService.getCatalogTagsData().then((response: ServerMessage) => {
      if(response.error == true){
        errorCallBack(response.message);
      }else{
        this.tagsCatalog = response.data;
        succesCallBack("Catalogo de tags obtenido con exito.");
      }
    }, (error) => {
      console.log(error);
      errorCallBack("A ocurrido un error");
    });
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
          this.apiDataService.setToken(this.token);
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

  searchBandsUsersByName(name : String){
    return new Promise((resolve, reject) => {
      this.apiDataService.searchBandsUsersByName(name).then((response: ServerMessage) => {
        if (response.error) {
          reject(response)
        } else {
          resolve(response);
        }
      }, (error) => {
        reject(error)
      });
    });
  }

  getBandById(bandId : Number){
    return new Promise((resolve, reject) => {
      this.apiDataService.findBandById(bandId).then((response: ServerMessage) => {
        if (response.error) {
          reject(response)
        } else {
          resolve(response);
        }
      }, (error) => {
        reject(error)
      });
    });
  }

  getUserById(bandId : Number){
    return new Promise((resolve, reject) => {
      this.apiDataService.findUserById(bandId).then((response: ServerMessage) => {
        if (response.error) {
          reject(response)
        } else {
          resolve(response);
        }
      }, (error) => {
        reject(error)
      });
    });
  }
}
