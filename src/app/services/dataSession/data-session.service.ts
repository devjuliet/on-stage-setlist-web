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

  constructor(private apiDataService: ApiDataService, private route: Router, ) {
    this.token = "";
    this.user = new User();
    let token = localStorage.getItem('token');
    if (!token) {
      console.log("Primer uso");
      localStorage.setItem('token', JSON.stringify(this.token));
    } else {
      this.token = JSON.parse(token);
    }
  }
  
  navigateByUrl(url : String){
    this.route.navigateByUrl(url.toString());
  }

  checkLogin(succesCallBack, errorCallBack) {
    /* console.log(this.user); */
    if (this.token == "") {
      errorCallBack(new LogedResponse(true, "Sin token"))
    } else {
      //TO DO - mandar traer la data de la api en caso de que el token este correcto pero no hacerlo si ya exite info de la sesion 
      //        en el servicio
      this.apiDataService.getUserData(this.token).then((response: ServerMessage) => {
        //console.log(response);
        if (response.error == true) {
          this.navigateByUrl("/login");
          errorCallBack(new LogedResponse(false, response.message))
        } else {
            if(this.user.type==0){
              //this.dataSessionService.navigateByUrl("/login");
            }else if(this.user.type==1){
              this.navigateByUrl("/dashboard/manager");
            }else if(this.user.type==2){
              this.navigateByUrl("/dashboard/live-experience-designer");
            }
            succesCallBack(new LogedResponse(false, "Con token"));
        }
      }, (error) => {
        console.log(error);
        this.navigateByUrl("/login");
        errorCallBack(new LogedResponse(false, "A ocurrido un error"))
      }); 
      
    }
  }

  loginUser(username : String, password : String) {
    return new Promise((resolve,reject)=>{
      this.apiDataService.doLogin(username,password).then((response: ServerMessage) => {
        if(response.error){
          reject(response)
        }else{
          //Logica con la que guardamos los datos del inicio de sesion
          localStorage.setItem('token', JSON.stringify(response.data.token));
          this.user = response.data.user;
          resolve(response);
        }
      }, (error) => {
        reject(error)
      }); 
    })
      
   }

  logOut() {
    localStorage.setItem('token', "");
    this.token = localStorage.getItem('token');
    this.route.navigateByUrl('/')
  }
}
