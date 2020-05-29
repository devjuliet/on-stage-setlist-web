import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { User } from '../../../classes/user.class';
import { ApiDataService } from '../../../services/api-data/api-data.service';
import { ServerMessage } from '../../../classes/serverMessages.dto';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  actualInfoUser: User;
  newPassword: String;
  confirmPassword: String;

  source: string = '';
  selectedFile: any;

  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  constructor(public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService, private apiDataService: ApiDataService) {
    this.actualInfoUser = new User();
    this.source = '';
    this.newPassword = "";
    this.confirmPassword = "";
  }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      //Manda al dashboard correspondiente o saca de la sesion
      if (this.dataSessionService.user.type == 1) {
        this.dataSessionService.navigateByUrl("/dashboard/manager");
      } else if (this.dataSessionService.user.type != 2) {
        this.dataSessionService.logOut();
      } else {
        //Cosas para hacer en caso de que el usario este logeado
        console.log("simonkiii");
        
        
      }
    }, (noLoginResponse: LogedResponse) => {
      console.log(noLoginResponse);
      this.dataSessionService.navigateByUrl("/");
    });
  }

  // If the input has changed(file picked) we project the file into the img previewer
  updateSource($event: Event) {
    // We access he file with $event.target['files'][0]
    let file = $event.target['files'][0];
    let reader = new FileReader;
    // TODO: Define type of 'e'
    reader.onload = (e: any) => {
      // Simply set e.target.result as our <img> src in the layout
      this.source = e.target.result;
      this.onChange.emit(file);
      this.selectedFile = file;
    };
    // This will process our file and get it's attributes/data
    reader.readAsDataURL(file);
  }

  cancelImage() {
    this.source = "";
    this.actualInfoUser.haveImage = false;
  }

  validateUserData(): Boolean {
    if (this.actualInfoUser.name.length < 8) {
      this.utilitiesService.showNotification(1, "Nombre de usuario invalido.", 4000, () => { });
      return false;
    } else if (this.actualInfoUser.username.length < 8) {
      this.utilitiesService.showNotification(1, "Usuario invalido.", 4000, () => { });
      return false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.actualInfoUser.email.toString())) { //Validacion del correo
      this.utilitiesService.showNotification(1, "Correo electronico no valido.", 4000, () => { });
      return false;
    } else {
      return true;
    }
  }

  saveData() {
    if(this.newPassword.length>8 && this.confirmPassword.length>8 && this.newPassword == this.confirmPassword){
      this.utilitiesService.showLoadingMsg("Cambiando contraseña", "Actualizando la contraseña del usuario.", () => {
         
        this.apiDataService.changePasswordUser(this.actualInfoUser.idUser,this.newPassword).then((response : ServerMessage) => {
          console.log(response);
          
          this.utilitiesService.closeLoadingSuccess("Exito cambiando contraseña", "Su contraseña a sido cambiada con exito", () => {});
          this.utilitiesService.showNotification(0, "Contraseña actualizada.", 5000, () => { 
            this.newPassword = "";
            this.confirmPassword = "";
          });  
        }).catch((error) => {
          console.log(error);
          this.utilitiesService.closeLoadingMsg();
          this.utilitiesService.showNotification(1, "A ocurrido un error cambiando la contraseña.", 5000, () => { });    
        });
      });
    }else if (this.validateUserData()) {
      console.log("valodciones ok");
      //Se elimino la imagen
      if (!this.actualInfoUser.haveImage && this.dataSessionService.user.haveImage && this.source.length == 0) {
        console.log("Elimino imagen");
        //Loading de carga
        this.utilitiesService.showLoadingMsg("Eliminando imagen", "Eliminando imagen del usuario #" + this.actualInfoUser.idUser, () => {
          this.apiDataService.deleteImageUser(this.actualInfoUser.idUser).then((response : ServerMessage) => {
            this.actualInfoUser.haveImage = false;
            this.utilitiesService.closeLoadingSuccess("Imagen eliminada", "Imagen del usuario #" + this.actualInfoUser.idUser + " eliminada correctamente", () => {});
            this.uploadDataUser(this.actualInfoUser);
          }).catch((error) => {
            console.log(error);
            this.utilitiesService.closeLoadingMsg();
            this.utilitiesService.showNotification(0, "A ocurrido un error eliminando la imagen.", 5000, () => { });
          });           
        });
      }
      //Si se selecciona una imagen
      else if ( this.source.length > 0) {
        console.log("imgagen diferente");

        this.uploadImage(this.selectedFile, "" + this.actualInfoUser.idUser).then((response: any) => {
          //Se guarda el estado actual de la imagen
          this.actualInfoUser.haveImage = true;
          this.uploadDataUser(this.actualInfoUser);
        }).catch((error) => {
          console.log(error);
          this.utilitiesService.showNotification(1, "Error subiendo imagen", 5000, () => { });
        });
      }
      //Si la imagen no se va a eliminar
      else {
        console.log("Misma imagen");
        this.uploadDataUser(this.actualInfoUser);
      }
    }
  }


  uploadImage(file: any, id: String) {
    return new Promise((resolve, reject) => {
      var newFileName = id + ".jpg";
      let reader = new FileReader;

      try {
        // TODO: Define type of 'e'
        reader.onload = (e: any) => {
          this.onChange.emit(file);

          const formData = new FormData();
          let image: Blob = new Blob([reader.result], {
            type: file.type
          });
          formData.append('files[]', image, newFileName);
          //Loading de carga
          this.utilitiesService.showLoadingMsg("Subiendo imagen", "Subiendo imagen del usuario #" + id, () => {
            this.apiDataService.uploadImageUser(formData).then((result: ServerMessage) => {
              this.utilitiesService.showNotification(result.error ? 1 : 0, result.message, 5000, () => { });
              this.utilitiesService.closeLoadingSuccess("Imagen subida", "Imagen del usuario #" + id + " subida", () => {
                resolve(result);
              });
            }, (error) => {
              this.utilitiesService.showNotification(0, "A ocurrido un error.", 5000, () => { });
              this.utilitiesService.closeLoadingMsg();
              reject(error);
            });
          });
        };
        // This will process our file and get it's attributes/data
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.log("sin imagen seleccionada");

        resolve({ url: "" });
      }
    });
  }

  uploadDataUser(newData: User) {
    //Loading de carga
    //console.log(newData);
    this.dataSessionService.user.haveImage = false;
    this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
      'uploads/user-image/' + this.actualInfoUser.idUser.toString()).then((image) => {
        this.dataSessionService.user.imageBlob = image;
        this.utilitiesService.showLoadingMsg("Actualizando Usuario", "Actualizando el usuario #" + newData.idUser, () => {
          this.apiDataService.updateUser(newData).then((response: ServerMessage) => {
            //console.log(response);
            if(response.error == true){
              this.utilitiesService.showNotification(1, response.message, 3000, () => {});
              this.utilitiesService.closeLoadingMsg();
              this.dataSessionService.user.haveImage = this.actualInfoUser.haveImage;
              this.actualInfoUser.name=this.dataSessionService.user.name;
              this.actualInfoUser.username=this.dataSessionService.user.username;
              this.actualInfoUser.email=this.dataSessionService.user.email;
            }else{
              /* Se Recarga el usuario actual*/
              this.dataSessionService.user.name = response.data.name;
              this.dataSessionService.user.username = response.data.username;
              this.dataSessionService.user.email = response.data.email;
              this.dataSessionService.user.haveImage = response.data.haveImage;
              this.utilitiesService.closeLoadingSuccess("Usuario Actualizado", "Informacion del usuario #" + newData.idUser + " actualizada.", () => {
                //ok
              });
            }
            
          }).catch((error) => {
            this.dataSessionService.user.haveImage = this.actualInfoUser.haveImage;

            console.log(error);
            this.utilitiesService.showNotification(1, "Error actualizando informacion del usuario", 5000, () => { });
            this.utilitiesService.closeLoadingMsg();
          });
        });
      }, (error) => {
        console.log(error);
        this.dataSessionService.user.imageBlob = "";
      });
  }

}
