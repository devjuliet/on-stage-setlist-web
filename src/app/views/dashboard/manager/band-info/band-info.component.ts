import { Component, OnInit, OnChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { ActivatedRoute } from '@angular/router';
import { Band } from '../../../../classes/band.class';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BandMemberProfile } from '../../../../classes/bandMemberProfile.class';
import { BandMember } from '../../../../classes/bandMember.class';
import { ApiDataService } from '../../../../services/api-data/api-data.service';
import { ServerMessage } from '../../../../classes/serverMessages.dto';

@Component({
  selector: 'app-band-info',
  templateUrl: './band-info.component.html',
  styleUrls: ['./band-info.component.css']
})
export class BandInfoComponent implements OnInit {
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

  idBandOpened: number;
  constructor(private route: ActivatedRoute, public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService,
    private apiDataService: ApiDataService) {
    this.idBandOpened = 0;
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
    this.bandMembersFiltered = Array.from(this.newBand.bandMembers);

    //Se obtiene el id abierto cada que la ruta cambia de id por eso me suscribo al evento
    this.route.paramMap.subscribe(params => {
      this.idBandOpened = this.route.snapshot.params.id;
      /* this.newBand = new Band();
      this.newBand.name = "";
      this.newBand.description = "";
      this.newBand.bandMembers = [];
      this.bandMembersFiltered = Array.from(this.newBand.bandMembers);
      this.newMemberIsLiveDesigner = false;
      this.newBand.genres = []; */
      this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
        //console.log(logedResponse);
        //Manda al dashboard correspondiente o saca de la sesion
        if (this.dataSessionService.user.type == 2 || this.dataSessionService.user.type == 0) {
          this.dataSessionService.navigateByUrl("/dashboard/led");
        } else if (this.dataSessionService.user.type != 1) {
          this.dataSessionService.logOut();
        } else {
          //Cosas para hacer en caso de que el usario este logeado
          this.loadDataBand(this.idBandOpened);
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
    });
  }

  ngOnInit(): void {

  }

  async loadDataBand(idBand : number) {
    this.dataSessionService.getBandsManager((response) => {
      //console.log(this.dataSessionService.elementsManager.bands);
    }, (err) => {
      console.log(err);
    });
    this.newBand = new Band();
    this.cancelImage();
    this.apiDataService.findBandByIdAndByManagerId(idBand).then(async (response : ServerMessage) => {
      //console.log(this.dataSessionService.elementsManager.bands);
      if(response.error == false){
        this.newBand = response.data;
        //console.log(this.newBand);
        
        //Se cargan todas las imagenes de los usuarios 
        for (let index = 0; index < response.data.bandMembers.length; index++) {
          this.newBand.bandMembers[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
            'uploads/user-image/' + this.newBand.bandMembers[index].idUser.toString());
        };

        //Se cargan todas las imagenes de las listas 
        for (let index = 0; index < response.data.sets.length; index++) {
          if(this.newBand.sets[index].haveImage == true){
            this.newBand.sets[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
            'uploads/set-image/' + this.newBand.sets[index].idSet.toString());
          }
        };
        //console.log(this.newBand.sets);
        this.bandMembersFiltered = Array.from(this.newBand.bandMembers);
        if(this.newBand.urlLogo.length > 2){
          this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
          'uploads/band-image/' + this.newBand.idBand.toString()).then((urlImage) => {
            this.newBand.imageBlob = urlImage;
          });
        }
        //console.log(this.newBand.name);
      }else{
        console.log(response);
        this.utilitiesService.showNotification(1, "Error obteniendo la informacion de la banda.", 4000, () => { });
        this.newBand = new Band();
      }
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

  getNewUserData() {
    this.apiDataService.getDataUserHistory(this.inputNewUser).then((response: ServerMessage) => {
      //console.log(response);
      if(response.data == null){
        this.newBandMember = new BandMemberProfile();
        this.utilitiesService.showNotification(1, "Perfil no encontrado", 3000, () => { });
      } else {
        this.newBandMember = response.data;
        if (this.newBandMember.haveImage == true) {
          //console.log(this.newBandMember);
          this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
            'uploads/user-image/' + this.newBandMember.idUser.toString()).then((urlImage) => {
              this.newBandMember.imageBlob = urlImage;
            });
        }
        this.inputNewUser = "";
      }
      
    }).catch((error) => {
      console.log(error);
      this.utilitiesService.showNotification(1, "A ocurrido un error consultando el usuario", 5000, () => { });
    });
  }

  addNewBandMember() {
    let isNew = this.newBand.bandMembers.find((element) => {
      /* if(element.idMember == this.newBandMember.idUser){
        console.log(element);
      } */
      return element.idUser == this.newBandMember.idUser;
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

  deleteMember() {
    //Se elimina de la lista de miembros
    let indexItemMember = this.newBand.bandMembers.findIndex((element) => {
      return element.idMember == this.memberSelectedForDelete.idMember;
    })
    this.newBand.bandMembers.splice(indexItemMember, 1);

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
  /////////////////////

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

  uploadDataBand(newBand: Band) {
    return new Promise((resolve, reject) => {
      let data: Band = JSON.parse(JSON.stringify(newBand));
      if(this.source.length == 0 && newBand.urlLogo.length == 0){
        //console.log("imagen borrada");
        data.urlLogo = "";
      }else if(this.source.length > 0){
        //console.log("nueva imagen");
        data.urlLogo = "bands/" + this.newBand.idBand
      }else{
        //console.log("sin cambios");
        
        data.urlLogo = newBand.urlLogo;
      }
      this.newBand.urlLogo = data.urlLogo;
      //Loading de carga
      //console.log(data.urlLogo);
      this.utilitiesService.showLoadingMsg("Guardando Banda", "Guardando la banda: " + newBand.name, () => {
        this.apiDataService.updateBand(data).then((response: ServerMessage) => {
          //console.log(response);
          if (response.error == true) {
            this.utilitiesService.showNotification(1, response.message, 3000, () => { });
            this.utilitiesService.closeLoadingMsg();
            reject(response);
          } else {
            this.utilitiesService.showNotification(0, response.message, 3000, () => { });
            this.utilitiesService.closeLoadingSuccess("Banda Guardada", "Informacion de la banda " + newBand.name + " guardada.", () => {

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
      //console.log(newFileName);

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
          this.utilitiesService.showLoadingMsg("Subiendo imagen", "Subiendo imagen de la banda " + this.newBandMember.name, () => {
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

  saveData() {
    //console.log(this.newBand.imageBlob);
    if (this.validateBandData()) {
      //console.log("valodciones ok");

      this.uploadDataBand(this.newBand).then((response: any) => {
        //Se procede a guardar o no la imagen
        //console.log(response);
        
        if(this.source.length == 0 && this.newBand.urlLogo.length == 0 && this.newBand.imageBlob != undefined){
          //console.log("imagen borrada");
          this.utilitiesService.showLoadingMsg("Borrando Imagen", "Eliminando imagen de la banda " + response.data.name, () => {
            this.apiDataService.deleteImageBand(this.idBandOpened).then((response)=>{
              this.utilitiesService.closeLoadingSuccess("Imagen Borrada", "Exito eliminando ", () => {
                this.loadDataBand(this.idBandOpened);
              });
            }).catch((error)=>{
              this.utilitiesService.closeLoadingMsg();
            })
          });
          
          this.loadDataBand(this.idBandOpened);
        }else if(this.newBand.urlLogo.length >= 0 && this.source.length == 0){
          //console.log("sin cambios");
          this.loadDataBand(this.idBandOpened);
        }else if(this.source.length > 0){
          //console.log("nueva imagen");
          this.utilitiesService.showLoadingMsg("Guardando Imagen", "Guardando la banda: " + this.newBand.name, () => {
            this.uploadImage(this.selectedFile, "" + response.data.idBand).then((response: any) => {
              //Se guarda el estado actual de la imagen
              this.utilitiesService.closeLoadingSuccess("Imagen Guardada", "Imagen de la banda " + this.newBand.name + " guardada.", () => {
                this.loadDataBand(this.idBandOpened);
              });
            }).catch((error) => {
              console.log(error);
              this.utilitiesService.showNotification(1, "Error subiendo imagen", 5000, () => {
                this.loadDataBand(this.idBandOpened);
              });
              this.utilitiesService.closeLoadingMsg();
            });
          }); 
        }

        
      }).catch((error) => {
        //console.log(error);
        //this.utilitiesService.showNotification(1, "Error creando la nueva banda", 5000, () => { });
      });
    }
  }

  deleteBand(){
    this.utilitiesService.showLoadingMsg("Eliminando banda", "Borrando la banda: " + this.newBand.name, () => {
      this.apiDataService.deleteBand(this.newBand.idBand).then((response)=>{
        this.dataSessionService.getBandsManager((response) => {
          //console.log(this.dataSessionService.elementsManager.bands);
        }, (err) => {
          console.log(err);
        });
        this.utilitiesService.showNotification(0,"Banda eliminada",5000,()=>{})
        this.utilitiesService.closeLoadingSuccess("Banda eliminada", "Banda borrada exitosamente.", () => {
          this.dataSessionService.navigateByUrl("/dashboard/manager/admin-bands");
        });
      }).catch((error)=>{
        console.log(error);
        this.utilitiesService.closeLoadingMsg();
      })
    });
  }

  isLiveDesigner(id:number): boolean{
    let index = this.newBand.bandLiveDesigners.findIndex((idDesigner)=>{
      return idDesigner == id;
    });

    if(index > -1){
      return true;
    }else{
      return false;
    }
  }
}
