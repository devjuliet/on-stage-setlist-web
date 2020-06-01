import { Component, OnInit, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { Band } from '../../../../classes/band.class';
import { ApiDataService } from '../../../../services/api-data/api-data.service';
import { DOCUMENT } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BandMemberProfile } from '../../../../classes/bandMemberProfile.class';
import { ServerMessage } from '../../../../classes/serverMessages.dto';
import { BandMember } from '../../../../classes/bandMember.class';

@Component({
  selector: 'app-add-band',
  templateUrl: './add-band.component.html',
  styleUrls: ['./add-band.component.css']
})
export class AddBandComponent implements OnInit {
  newBand: Band;

  //Variables para implementar el dropdown 
  dropdownGenresSettings: IDropdownSettings;

  //Variables para desplegar el nuevo usuario en el modal
  inputNewUser: String;
  newBandMember: BandMemberProfile;
  newMemberIsLiveDesigner: Boolean;
  bandMembersFiltered: BandMember[];
  memberSelectedForDelete: BandMember;

  searchValue: String;
  //Variables para la fotografia
  source: string = '';
  selectedFile: any;
  loaded: Boolean;
  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('btnCloseDelete') btnCloseDelete: ElementRef;

  constructor(public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService,
    private apiDataService: ApiDataService) {
    this.newBand = new Band();
    this.newBand.bandMembers = [];
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
    this.newBand.name = "";
    this.newBand.description = "";
    this.newBand.bandMembers = [];
    this.bandMembersFiltered = Array.from(this.newBand.bandMembers);
    this.newMemberIsLiveDesigner = false;
    this.newBand.genres = [];

    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      //Manda al dashboard correspondiente o saca de la sesion
      if (this.dataSessionService.user.type == 2 || this.dataSessionService.user.type == 0) {
        this.dataSessionService.navigateByUrl("/dashboard/led");
      } else if (this.dataSessionService.user.type != 1) {
        this.dataSessionService.logOut();
      } else {
        //Cosas para hacer en caso de que el usario este logeado
        this.initForNewBand();
        this.dataSessionService.getGenresCatalog((message) => {
          //this.utilitiesService.showNotification(0, message, 3000, () => { });
        }, (messageError) => {
          this.utilitiesService.showNotification(1, messageError, 3000, () => { });
        });
      }
    }, (noLoginResponse: LogedResponse) => {
      console.log(noLoginResponse);
      this.dataSessionService.navigateByUrl("/");
    });
  }

  initForNewBand() {
    this.newBand = new Band();
    this.newBand.name = "";
    this.newBand.description = "";
    this.newBand.bandMembers = [];
    this.bandMembersFiltered = Array.from(this.newBand.bandMembers);
    this.newMemberIsLiveDesigner = false;
    this.newBand.genres = [];
    this.newBand.idUserManager = this.dataSessionService.user.idUser;
    this.cancelImage();
    this.dataSessionService.getBandsManager((response) => {
      //console.log(this.dataSessionService.elementsManager.bands);
    }, (err) => {
      console.log(err);
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
    } else {
      return true;
    }
  }

  saveData() {
    console.log(this.newBand);
    if (this.validateBandData()) {
      console.log("valodciones ok");

      this.uploadDataBand(this.newBand).then((response: any) => {
        //Se procede a guardar o no la imagen
        if (this.source.length > 0) {
          console.log("imgagen diferente");
          this.utilitiesService.showLoadingMsg("Guardando Imagen", "Guardando la banda: " + this.newBand.name, () => {
            this.uploadImage(this.selectedFile, "" + response.data.idBand).then((response: any) => {
              //Se guarda el estado actual de la imagen
              this.utilitiesService.closeLoadingSuccess("Imagen Guardada", "Imagen de la banda " + this.newBand.name + " guardada.", () => {
                this.initForNewBand();
              });
            }).catch((error) => {
              console.log(error);
              this.utilitiesService.showNotification(1, "Error subiendo imagen", 5000, () => {
                this.initForNewBand();
              });
              this.utilitiesService.closeLoadingMsg();
            });
          });
        }
        //Sin imagen
        else {
          console.log("Sin nueva imagen");
          this.initForNewBand();
        }
      }).catch((error) => {
        //console.log(error);
        //this.utilitiesService.showNotification(1, "Error creando la nueva banda", 5000, () => { });
      });
    }
  }

  uploadDataBand(newBand: Band) {
    return new Promise((resolve, reject) => {
      let data: Band = JSON.parse(JSON.stringify(newBand));
      data.urlLogo = this.source.length > 0 ? "bands/" + this.newBand.idBand : "";
      //Loading de carga
      //console.log(newData);
      this.utilitiesService.showLoadingMsg("Guardando Banda", "Guardando la banda: " + newBand.name, () => {
        this.apiDataService.createBand(data).then((response: ServerMessage) => {
          console.log(response);
          if (response.error == true) {
            this.utilitiesService.showNotification(1, response.message, 3000, () => { });
            this.utilitiesService.closeLoadingMsg();
            reject(response);
          } else {
            this.utilitiesService.showNotification(0, response.message, 3000, () => { });
            this.utilitiesService.closeLoadingSuccess("Banda Creada", "Informacion de la banda " + newBand.name + " guardada.", () => {

            });
            resolve(response);
          }

        }).catch((error) => {
          console.log(error);
          this.utilitiesService.showNotification(1, "Error creando la banda", 5000, () => { });
          this.utilitiesService.closeLoadingMsg();
          reject(error);
        });
      });
    });
  }

  uploadImage(file: any, id: String) {
    return new Promise((resolve, reject) => {
      var newFileName = id + ".jpg";
      console.log(newFileName);

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
          this.utilitiesService.showLoadingMsg("Subiendo imagen", "Subiendo imagen de la nueva banda " + this.newBandMember.name, () => {
            this.apiDataService.uploadImageBand(formData).then((result: ServerMessage) => {
              this.utilitiesService.showNotification(result.error ? 1 : 0, result.message, 5000, () => { });
              this.utilitiesService.closeLoadingSuccess("Imagen subida", "Imagen de la banda " + this.newBand.name + " subida", () => {
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



  getNewUserData() {
    this.apiDataService.getDataUserHistory(this.inputNewUser).then((response: ServerMessage) => {
      console.log(response);
      if(response.data == null){
        this.newBandMember = new BandMemberProfile();
        this.utilitiesService.showNotification(1, "Perfil no encontrado", 3000, () => { });
      } else if (response.data.haveImage) {
        this.newBandMember = response.data;
        this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
          'uploads/user-image/' + this.newBandMember.idUser.toString()).then((urlImage) => {
            this.newBandMember.imageBlob = urlImage;
          });
        this.inputNewUser = "";
      }
    }).catch((error) => {
      console.log(error);
      this.utilitiesService.showNotification(1, "A ocurrido un error consultando el usuario", 5000, () => { });
    });
  }

  addNewBandMember() {
    let isNew = this.newBand.bandMembers.find((element) => {
      return element.idMember == this.newBandMember.idUser;
    });

    if (this.newBandMember.name.length < 5) {
      this.utilitiesService.showNotification(1, "Ingrese un miembro valido.", 5000, () => { });
    } else if (isNew != undefined) {
      this.utilitiesService.showNotification(1, "El usuario ya fue añadido.", 5000, () => { });
    } else {
      let newMember = new BandMember();
      newMember.idMember = this.newBandMember.idUser;
      newMember.role = this.newBandMember.role;
      newMember.haveImage = this.newBandMember.haveImage;
      newMember.imageBlob = this.newBandMember.imageBlob;
      newMember.name = this.newBandMember.name;

      if (this.newMemberIsLiveDesigner) {
        this.newBand.bandLiveDesigners.push(this.newBandMember.idUser);
      }
      this.newBand.bandMembers.push(newMember);
      this.utilitiesService.showNotification(0, "Nuevo integrante añadido", 3000, () => { });
      this.btnClose.nativeElement.click();
      this.bandMembersFiltered = Array.from(this.newBand.bandMembers);
      //console.log(this.newBand);
    }
  }

  cancelAddUser() {
    this.inputNewUser = "jennyrivera";
    this.newBandMember = new BandMemberProfile();
    this.newMemberIsLiveDesigner = false;
  }

  selectForDelete(memberSelected: BandMember) {
    this.memberSelectedForDelete = new BandMember();
    this.memberSelectedForDelete.idMember = new Number(memberSelected.idMember);
    this.memberSelectedForDelete.name = new String(memberSelected.name);
    this.memberSelectedForDelete.role = new Number(memberSelected.role);
    this.memberSelectedForDelete.haveImage = new Boolean(memberSelected.haveImage);
    this.memberSelectedForDelete.imageBlob = memberSelected.imageBlob;
  }

  deleteMember() {
    //Se elimina de la lista de miembros
    let indexItem = this.newBand.bandMembers.findIndex((element) => {
      return element.idMember == this.memberSelectedForDelete.idMember;
    })
    this.newBand.bandMembers.splice(indexItem, 1);
    //Se elimina de la lista de miembros
    let indexItemDesigner = this.newBand.bandLiveDesigners.findIndex((element) => {
      return element == this.memberSelectedForDelete.idMember;
    })
    this.newBand.bandLiveDesigners.splice(indexItemDesigner, 1);

    this.utilitiesService.showNotification(1, "A eliminado a " + this.memberSelectedForDelete.name + " de la banda", 3000, () => {
      this.memberSelectedForDelete = new BandMember();
    });
    this.bandMembersFiltered = Array.from(this.newBand.bandMembers);
    this.btnCloseDelete.nativeElement.click();
  }

  filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.bandMembersFiltered = Array.from(this.newBand.bandMembers);
    } else {
      this.bandMembersFiltered = this.newBand.bandMembers.filter(function (member) {
        let fixed = member.name.charAt(0).toUpperCase() + event.slice(1);
        return member.name.toLowerCase().includes(ssearchValue);
      });
    }
  }
}
