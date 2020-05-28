import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerMessage } from '../../classes/serverMessages.dto';
import { deployConf } from './../../utils/config';
import { DomSanitizer } from '@angular/platform-browser';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Band } from '../../classes/band.class';
import { User } from '../../classes/user.class';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  baseURL: string = deployConf.apiUrl;
  token: String;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}
  
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

  setToken(newToken : String){
    this.token = newToken;
  }

  getImage(url : string) : Promise<any> {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });
      
      this.http.get(url, { headers: headers,responseType: 'blob' })
      .pipe(
        timeout(2000),
        catchError(e => {
          // do something on a timeout
          //reject(e);
          return of(null);
        })
      ).subscribe((imageBlob)=>{
        let objectURL = "";
        if(imageBlob!=null && imageBlob!=undefined){
          objectURL = URL.createObjectURL(imageBlob);
        }
        resolve(this.sanitizer.bypassSecurityTrustUrl(objectURL) );
      },(error : ServerMessage)=>{
        reject(error)
      });
    })
  }  

  //CATALOGOS
  getCatalogGenresData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'catalogs/genres',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }
  //FIN.CATALOGOS

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

  async updateUser(updatedUser : User){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'user/update-user',updatedUser,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async changePasswordUser(idUser : Number,newPassword : String,){
    return new Promise((resolve,reject)=>{
      const data = {
        idUser : idUser,
        newPassword : newPassword,
      };
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'user/change-user-pass',data,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async uploadImageUser(formData: FormData) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'uploads/user-image/', formData, {headers:headers })
        .subscribe((res: ServerMessage) => {
          if (res.error == false) {
            resolve(res);
          } else if( res.error == undefined){
            console.log("error no llego nada");
            reject(res);
          }else{
            resolve(res);
          }
        },(error)=>{
          reject(error);
        },);
    });
  }

  deleteImageUser(idUser){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });
      this.http.get(this.baseURL + 'uploads/user-delete-image/'+idUser,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
      });
    });
  }

  //MANAGER
  getBandsManager() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'manager/bands',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }
  //FIN.MANAGER

  //BANDAS
  async createBand(newDataBand : Band) : Promise<any>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'manager/create-band',newDataBand,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async uploadImageBand(formData: FormData) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'uploads/band-image/', formData, {headers:headers })
        .subscribe((res: ServerMessage) => {
          if (res.error == false) {
            resolve(res);
          } else if( res.error == undefined){
            console.log("error no llego nada");
            reject(res);
          }else{
            resolve(res);
          }
        },(error)=>{
          reject(error);
        },);
    });
  }
  //FIN.BANDAS

  //BUSCADOR
  getDataUserHistory(username){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });
      this.http.get(this.baseURL + 'search/username/?username='+username,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
      });
    });
  }
  //FIN.BUSCADOR

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
