import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerMessage } from '../../classes/serverMessages.dto';
import { deployConf } from './../../utils/config';
import { DomSanitizer } from '@angular/platform-browser';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Band } from '../../classes/band.class';
import { User } from '../../classes/user.class';
import { ActualEvent } from '../../classes/actualEvent.class';
import { NewSong } from '../../classes/led/newSong.class';
import { SetLed } from '../../classes/led/setLed.class';

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
        haveImage : false,//valor default
        username : username,
        role : 0,
        password : password, 
        type : type, 
        description : "",
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

  getCatalogTagsData() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'catalogs/tags',{ headers: headers }).subscribe((response : ServerMessage)=>{
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

  findBandByIdAndByManagerId(idBand){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });
      this.http.get(this.baseURL + 'manager/band/'+idBand,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
      });
    });
  }

  async createEvent(newDataEvent : ActualEvent) : Promise<any>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'manager/create-event',newDataEvent,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateEvent(updatedDataEvent : ActualEvent) : Promise<any>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'manager/update-event',updatedDataEvent,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getEventsManager() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get(this.baseURL + 'manager/events',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }
  //FIN.MANAGER
  //LED
  getBandsLed() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      });
      this.http.get(this.baseURL + 'led/band-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getSetsLed() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      });
      this.http.get(this.baseURL + 'led/set-list',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getSongLed(idSong : Number) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      });
      this.http.get(this.baseURL + 'led/get-song/'+idSong,{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }
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

  async updateBand(updatesDataBand : Band){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'manager/band-update',updatesDataBand,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async deleteBand(idBandForDelete : Number){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.get(this.baseURL + 'manager/band-delete/'+idBandForDelete,{headers:headers}).subscribe((response : ServerMessage)=>{
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

  deleteImageBand(idBand){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });
      this.http.get(this.baseURL + 'uploads/band-delete-image/'+idBand,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
      });
    });
  }
  //FIN.BANDAS

  //CANCIONES
  async uploadImageSong(formData: FormData) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'uploads/song-image/', formData, {headers:headers })
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

  deleteImageSong(idSong,nameFile){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });
      this.http.get(this.baseURL + 'uploads/song-delete-image/'+idSong+'/'+nameFile,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
      });
    });
  }

  async createSong(newDataSong : NewSong) : Promise<any>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'led/create-song',newDataSong,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateSong(newDataSong : NewSong){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'led/update-song',newDataSong,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }  


  getListSongsOfBand(idBand){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });
      this.http.get(this.baseURL + 'led/band-songs-list/'+idBand,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
      });
    });
  }
  //FIN.CANCIONES
  //LISTAS - SET
  async createList(newDataList : SetLed) : Promise<any>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'led/create-set',newDataList,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateList(newDataList : SetLed) : Promise<any>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'led/update-set',newDataList,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

    //subida del archivo de la lista
    async uploadImageList(formData: FormData) {
      return new Promise((resolve,reject)=>{
        const headers = new HttpHeaders({
          'Authorization': 'Bearer '+this.token,
        });
  
        this.http.post(this.baseURL + 'uploads/set-image/', formData, {headers:headers })
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
  
    deleteImageList(idSet){
      return new Promise((resolve,reject)=>{
        const headers = new HttpHeaders({
          'Authorization': 'Bearer '+this.token,
        });
        this.http.get(this.baseURL + 'uploads/set-delete-image/'+idSet,{headers:headers}).subscribe((response : ServerMessage)=>{
          resolve(response);
        },(error)=>{
          reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
        });
      });
    }
  //FIN.LISTAS - SET
  //BUSCADOR
  searchBandsUsersByName(name : String) {
    return new Promise((resolve,reject)=>{
      this.http.get(this.baseURL + 'search?name='+name,{}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

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

  findBandById(idBand){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });
      this.http.get(this.baseURL + 'search/get-band?bandId='+idBand,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
      });
    });
  }

  findUserById(idUser){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });
      this.http.get(this.baseURL + 'search/get-artist-profile?idUser='+idUser,{headers:headers}).subscribe((response : ServerMessage)=>{
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
