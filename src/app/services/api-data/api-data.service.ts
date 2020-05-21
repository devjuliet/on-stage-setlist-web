import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerMessage } from '../../classes/serverMessages.dto';
import { deployConf } from './../../utils/config';


@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  baseURL: string = deployConf.apiUrl;

  constructor(private http: HttpClient,) {}
  
  async registerUser(name : String,email : String, password : String, type : Number, username : String){
    return new Promise((resolve,reject)=>{
      const data = {
        name : name,
        email : email, 
        password : password, 
        type : type, 
        username : username
      };

      this.http.post(this.baseURL + 'user/register',data,{}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  doLogin(username : String, password : String) {
    return new Promise((resolve,reject)=>{
      const data = {username : username , password : password};

      this.http.post(this.baseURL + 'login',data,{}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getUserData(token : String) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
      })
       
      this.http.get(this.baseURL + 'login/validate-token',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  //EJEMPLO DE USO DEL METODO GET 
  /* async getRespuestas( entidad : string ) {
    return new Promise(async (resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.user.token
      })
       
      this.http.get(this.baseURL + 'user/obtener-respuestas',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    });
  } */

  //EJEMPLO DE USO DEL METODO POST 
  /* async saveRespuestas(respuestas : any){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.user.token
      });

      this.http.post(this.baseURL + 'user/save-respuestas',respuestas,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  } */
}
