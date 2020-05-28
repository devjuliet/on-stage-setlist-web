import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { Band } from '../../../../classes/band.class';
import { ApiDataService } from '../../../../services/api-data/api-data.service';
import { DOCUMENT } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BandMemberProfile } from '../../../../classes/bandMemberProfile.class';
import { ServerMessage } from '../../../../classes/serverMessages.dto';

@Component({
  selector: 'app-add-band',
  templateUrl: './add-band.component.html',
  styleUrls: ['./add-band.component.css']
})
export class AddBandComponent implements OnInit {
  newBand: Band;

  //Variables para implementar el dropdown 
  dropdownGenresSettings  :IDropdownSettings;

  //Variables para desplegar el nuevo usuario en el modal
  inputNewUser : String;
  newBandMember : BandMemberProfile;

  //Variables para la fotografia
  source: string = '';
  selectedFile: any;
  loaded: Boolean;
  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  constructor(public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService,
    private apiDataService: ApiDataService) {
    this.newBand = new Band();
    this.source = '';
    this.inputNewUser = "";
    this.newBandMember = new BandMemberProfile();
    this.loaded = true;
    this.dropdownGenresSettings = {
      singleSelection: false,
      idField: 'idGenre',
      textField: 'name',
      selectAllText: 'Seleccionar todos',
      enableCheckAll: false,
      unSelectAllText: 'Deseleccionar todos',
      searchPlaceholderText: 'Busca por nombre',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  ngOnInit(): void {
    this.newBand = new Band();
    this.newBand.name = "La bunny banda";
    this.newBand.description = "Banda mamalona que puede tocar musica pal corazon"
    this.newBand.genres = [];
     
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      //Manda al dashboard correspondiente o saca de la sesion
      if (this.dataSessionService.user.type == 2) {
        this.dataSessionService.navigateByUrl("/dashboard/led/home");
      } else if (this.dataSessionService.user.type != 1) {
        this.dataSessionService.logOut();
      } else {
        //Cosas para hacer en caso de que el usario este logeado
        this.newBand.idUserManager = this.dataSessionService.user.idUser;
        this.dataSessionService.getGenresCatalog((message)=>{
          this.utilitiesService.showNotification(0,message,3000,()=>{});
        },(messageError)=>{
          this.utilitiesService.showNotification(1,messageError,3000,()=>{});
        });
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
    this.newBand.urlLogo = "";
  }

  validateBandData(): Boolean {
    if (this.newBand.name.length < 8) {
      this.utilitiesService.showNotification(1, "Nombre de la banda invalido.", 4000, () => { });
      return false;
    } else if (this.newBand.description.length < 50) {
      this.utilitiesService.showNotification(1, "Descripcion invalida.", 4000, () => { });
      return false;
    } else if (this.newBand.genres.length < 1) {
      this.utilitiesService.showNotification(1, "Seleccione por lo menos un genero.", 4000, () => { });
      return false;
    } else if (this.newBand.bandMembers.length < 1) {
      this.utilitiesService.showNotification(1, "La banda no tiene miembros.", 4000, () => { });
      return false;
    }else {
      return true;
    }
  }

  saveData() {
    console.log(this.newBand);
    if (this.validateBandData()) {
      console.log("valodciones ok");
      if (this.source.length > 0) {
        /* console.log("imgagen diferente");

        this.uploadImage(this.selectedFile, "" + this.actualInfoUser.idUser).then((response: any) => {
          //Se guarda el estado actual de la imagen
          this.actualInfoUser.haveImage = true;
          this.uploadDataUser(this.actualInfoUser);
        }).catch((error) => {
          console.log(error);
          this.utilitiesService.showNotification(1, "Error subiendo imagen", 5000, () => { });
        }); */
      }
      //Sin imagen
      else {
        /* console.log("Misma imagen");
        this.uploadDataUser(this.actualInfoUser); */
      }
    }
  }


  uploadImage(file: any, id: String) {
    /* return new Promise((resolve, reject) => {
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
    }); */
  }

  uploadDataUser(newBand: Band) {
    //Loading de carga
    //console.log(newData);
    /* this.dataSessionService.user.haveImage = false;
    this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
      'uploads/user-image/' + this.actualInfoUser.idUser.toString()).then((image) => {
        this.dataSessionService.user.imageBlob = image;
        this.utilitiesService.showLoadingMsg("Actualizando Usuario", "Actualizando el usuario #" + newData.idUser, () => {
          this.apiDataService.updateUser(newData.idUser, newData.name, newData.username, newData.email, newData.haveImage).then((response: ServerMessage) => {
            //console.log(response);
            // Se Recarga el usuario actual
            this.dataSessionService.user.name = response.data.name;
            this.dataSessionService.user.username = response.data.username;
            this.dataSessionService.user.email = response.data.email;
            this.dataSessionService.user.haveImage = response.data.haveImage;

            this.utilitiesService.showNotification(0, response.message, 3000, () => { });
            this.utilitiesService.closeLoadingSuccess("Usuario Actualizado", "Informacion del usuario #" + newData.idUser + " actualizada.", () => {
              //ok
            });
          }).catch((error) => {
            console.log(error);
            this.utilitiesService.showNotification(1, "Error actualizando informacion del usuario", 5000, () => { });
            this.utilitiesService.closeLoadingMsg();
          });
        });
      }, (error) => {
        console.log(error);
        this.dataSessionService.user.imageBlob = "";
      }); */
  }

  getNewUserData(){
    this.apiDataService.getDataUserHistory(this.inputNewUser).then((response : ServerMessage)=>{
      this.newBandMember = response.data ? response.data : new BandMemberProfile();
      if(response.data.haveImage){
        this.apiDataService.getImage(this.dataSessionService.baseURL.toString() + 
          'uploads/user-image/'+this.newBandMember.idUser.toString()).then((urlImage)=>{
            this.newBandMember.imageBlob = urlImage;
          });
      }
      this.inputNewUser = "";
    }).catch((error)=>{
      console.log(error);
      this.utilitiesService.showNotification(1,"A ocurrido un error consultando el usuario",5000,()=>{});
    });
  }

  cancelAddUser(){
    this.inputNewUser = "";
    this.newBandMember = new BandMemberProfile();
  }
}
