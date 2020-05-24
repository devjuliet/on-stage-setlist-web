import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerMessage } from '../../classes/serverMessages.dto';
import { deployConf } from './../../utils/config';
import { DomSanitizer } from '@angular/platform-browser';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  baseURL: string = deployConf.apiUrl;

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

  getImage(url : string) : Promise<any> {
    return new Promise((resolve,reject)=>{
      this.http.get(url, { responseType: 'blob' })
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
          console.log("imagen obtenida");
        }
        resolve(this.sanitizer.bypassSecurityTrustUrl(objectURL) );
      },(error : ServerMessage)=>{
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

  async updateUser(idUser : Number,name : String,username : String, email : String, haveImage : Boolean){
    return new Promise((resolve,reject)=>{
      const data = {
        idUser : idUser,
        name : name,
        email : email, 
        haveImage : haveImage, 
        username : username
      };

      this.http.post(this.baseURL + 'user/update-user',data,{}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async uploadImageUser(formData: FormData) {
    return new Promise((resolve,reject)=>{
      var url= this.baseURL + 'uploads/user-image/';
      //this.appiEissa.presentAlert("","","Url para subir "+url);
      this.http.post(url, formData, { })
        .subscribe((res: ServerMessage) => {
          if (res.error == false) {
            resolve(res);
          } else if( res.error == undefined){
            console.log("error no llego nada");
            reject(res);
            //this.presentAlert("", "", 'File upload failed.Error desconocido')
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
      this.http.get(this.baseURL + 'uploads/user-delete/'+idUser,{}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
      });
    });
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
