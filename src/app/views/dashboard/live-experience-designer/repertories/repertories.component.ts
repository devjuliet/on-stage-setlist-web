import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { Repertorie } from '../../../../classes/led/repertorieLed.class';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BandLed } from '../../../../classes/led/bandLed.class';
import { ApiDataService } from '../../../../services/api-data/api-data.service';
import { ServerMessage } from '../../../../classes/serverMessages.dto';
import { BandSetLed } from '../../../../classes/led/bandSetLed.class';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-repertories',
  templateUrl: './repertories.component.html',
  styleUrls: ['./repertories.component.css']
})
export class RepertoriesComponent implements OnInit {
  actualRepertoire : Repertorie;

  dropdownSearchBandSettings: IDropdownSettings;
  selectedBand: BandLed[];

  dropdownEventsOfBandSettings: IDropdownSettings;
  eventsAvailableOfBand : {idLiveEvent : number, name : string}[];
  selectedEvent: {idLiveEvent : number, name : string}[];

  dropdownSearchTagSettings: IDropdownSettings;
  selectedSearchTag : {idTag : number,name : string}[];

  setsOfBand : BandSetLed[];
  
  isNewRepertorie : boolean;
  idRepertorieForDelete : number;

  searchValue : String;
  repertoriesFiltered : Repertorie[];

  @ViewChild('CloseModal') closeModal: ElementRef;
  @ViewChild('CloseModalConfirmDelete') closeModalConfirmDelete: ElementRef;

  constructor(public dataSessionService : DataSessionService, public utilitiesService : UtilitiesService,
    private apiDataService : ApiDataService) {
    this.actualRepertoire = new Repertorie();
    this.selectedBand = [];
    this.eventsAvailableOfBand = [];
    this.setsOfBand = [];
    this.isNewRepertorie = true;
    this.idRepertorieForDelete = 0;
    this.searchValue = "";
    this.repertoriesFiltered = [];

    this.dropdownSearchBandSettings = {
      singleSelection: true,
      idField: 'idBand',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText : "Por el momento no eres diseñador de alguna banda"
    };

    this.dropdownEventsOfBandSettings = {
      singleSelection: true,
      idField: 'idLiveEvent',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText : "Sin eventos disponibles"
    };

    this.dropdownSearchTagSettings = {
      singleSelection: true,
      idField: 'idTag',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText : "Etiquetas no disponibles"
    };
   }

  ngOnInit(): void {
    this.actualRepertoire = new Repertorie();
    this.setsOfBand = [];
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      //Manda al dashboard correspondiente o saca de la sesion
      if (this.dataSessionService.user.type == 1) {
        this.dataSessionService.navigateByUrl("/dashboard/manager");
      } else if (this.dataSessionService.user.type != 2 && this.dataSessionService.user.type != 0) {
        this.dataSessionService.logOut();
      } else {
        //Cosas para hacer en caso de que el usario este logeado
        console.log("simonkiii");
        //this.utilitiesService.showNotification(0, message, 3000, () => { });
        this.dataSessionService.getTagsCatalog((response) => {
          //console.log(this.dataSessionService.elementsManager.bands);
          this.updateRepertories();
        }, (err) => {
          console.log(err);
        });
      }
    }, (noLoginResponse: LogedResponse) => {
      console.log(noLoginResponse);
      this.dataSessionService.navigateByUrl("/");
    });
  }

  updateRepertories(){
    this.dataSessionService.getRepertoriesLed((message) => {
      //this.utilitiesService.showNotification(0, message, 3000, () => { });
      this.searchValue = "";
      this.repertoriesFiltered = this.repertoriesFiltered = Array.from(this.dataSessionService.elementsLed.repertories);
    }, (messageError) => {
      this.utilitiesService.showNotification(1, messageError, 3000, () => { });
    });
  }

  filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);
    if (this.searchValue == "") {
      this.repertoriesFiltered = Array.from(this.dataSessionService.elementsLed.repertories);
    } else {
      this.repertoriesFiltered = this.dataSessionService.elementsLed.repertories.filter(function (repertorie) {
        let fixed = repertorie.name.charAt(0).toUpperCase() + repertorie.name.slice(1);
        return fixed.toLowerCase().includes(ssearchValue);
      });
    }
  }

  initNewRepertoire(){
    this.actualRepertoire = new Repertorie();
    this.actualRepertoire.idLiveDesigner = parseInt( this.dataSessionService.user.idUser.toString(), 10 );
    this.selectedBand = [];
    this.selectedEvent = [];
    this.selectedSearchTag = [];
    this.setsOfBand = [];
    this.isNewRepertorie = true;
    this.dataSessionService.getBandsLed((messageOk)=>{

    },(messageError)=>{

    });
  }

  initSelectionRepertoire(selectedRepertorie : Repertorie){
    this.actualRepertoire = new Repertorie();
    this.actualRepertoire = JSON.parse(JSON.stringify(selectedRepertorie));
    this.actualRepertoire.idLiveDesigner = parseInt( this.dataSessionService.user.idUser.toString(), 10 );
    this.selectedBand = [{ 
      idBand : parseInt( this.actualRepertoire.band.idBand.toString() , 10 ) , 
      name : this.actualRepertoire.band.name.toString() ,
      urlLogo : "",
      description : "",
      managerName : "",
    }];
    if(this.actualRepertoire.event.name.length == 0){
      this.selectedEvent = [];
    }else{
      this.selectedEvent = [{ 
        idLiveEvent : parseInt( this.actualRepertoire.event.idLiveEvent.toString() , 10 ) , 
        name : this.actualRepertoire.event.name.toString() 
      }];
    }
    
    this.selectedSearchTag = [{ 
      idTag : parseInt( this.actualRepertoire.tag.idTag.toString() , 10 ) , 
      name : this.actualRepertoire.tag.name.toString() 
    }];
    this.setsOfBand = [];
    //Se obtienen las listas que la banda tiene disponibles y se marcan las que ya estan en el repertorio
    this.apiDataService.getBandAvailableEventsLed(this.actualRepertoire.band.idBand).then(async(response : ServerMessage)=>{
      //console.log(response);
      if(response.error == false){
        this.eventsAvailableOfBand = response.data.events;
        this.setsOfBand = response.data.sets;
        for (let index = 0; index < this.setsOfBand.length; index++) {
          if(this.setsOfBand[index].haveImage == true){
            this.setsOfBand[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
            'uploads/set-image/' + this.setsOfBand[index].idSet.toString());
          }
        }
        this.actualRepertoire.sets.forEach((actualSet)=>{
          let index = this.setsOfBand.findIndex((set)=>{
            return set.idSet == actualSet.idSet;
          });
          if(index != -1){
            this.setsOfBand[index].selected = true;
          }
        });
      }else{
        this.utilitiesService.showNotification(1,"Error obteniendo las listas disponibles de la banda",4000,()=>{});
      }
    }).catch((error)=>{
      console.log(error);
      this.utilitiesService.showNotification(1,"Error obteniendo las listas",4000,()=>{});
    });
    this.isNewRepertorie = false; 
    //console.log(this.actualRepertoire);
    this.dataSessionService.getBandsLed((messageOk)=>{

    },(messageError)=>{

    });
  }

  onBandSearchSelect(item: any) {
    this.setsOfBand = [];
    this.selectedEvent = [];
    if (this.selectedBand.length == 0) {
      //console.log("sin seleccion");
    } else {
      //console.log("con seleccion");
      this.actualRepertoire.band.idBand = this.selectedBand[0].idBand;
      this.actualRepertoire.band.name = this.selectedBand[0].name;
      //Se obtienen los eventos que aun no tienen un repertorio de la banda actualmente seleccionada
      this.apiDataService.getBandAvailableEventsLed(this.actualRepertoire.band.idBand).then(async(response : ServerMessage)=>{
        //console.log(response);
        if(response.error == false){
          this.eventsAvailableOfBand = response.data.events;
          this.setsOfBand = response.data.sets;

          for (let index = 0; index < this.setsOfBand.length; index++) {
            if(this.setsOfBand[index].haveImage == true){
              this.setsOfBand[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
              'uploads/set-image/' + this.setsOfBand[index].idSet.toString());
            }
          }
        }else{
          this.utilitiesService.showNotification(1,"Error obteniendo los eventos disponibles de la banda",4000,()=>{});
        }
      }).catch((error)=>{
        console.log(error);
        this.utilitiesService.showNotification(1,"Error obteniendo los eventos",4000,()=>{});
      });
    }
  }

  onEventSearchSelect(item: any) {
    if (this.selectedEvent.length == 0) {
      //console.log("sin seleccion");
      if(this.eventsAvailableOfBand.length == 0){
        this.eventsAvailableOfBand = [{
          idLiveEvent : parseInt(this.actualRepertoire.event.idLiveEvent.toString()), 
          name : item }]
      }

      this.actualRepertoire.event.idLiveEvent = 0;
      this.actualRepertoire.event.name = "";
    } else {
      //console.log("con seleccion");
      this.actualRepertoire.event.idLiveEvent = this.selectedEvent[0].idLiveEvent;
      this.actualRepertoire.event.name = this.selectedEvent[0].name;
    }
  }

  onTagSearchSelect(item: any) {    
    if (this.selectedSearchTag.length == 0) {
      //console.log("sin seleccion");
    } else {
      //console.log("con seleccion");
      this.actualRepertoire.tag.idTag = this.selectedSearchTag[0].idTag;
      this.actualRepertoire.tag.name = this.selectedSearchTag[0].name;
    }
  }

  selectSet(index : number){
    this.setsOfBand[index].selected = !this.setsOfBand[index].selected;
  }


  validateRepertoireData(): Boolean {
    if (this.actualRepertoire.name.length < 3) {
      this.utilitiesService.showNotification(1, "Nombre del repertorio invalido.", 4000, () => { });
      return false;
    }else if (this.selectedBand[0] == undefined ) {
      this.utilitiesService.showNotification(1, "Seleccione una banda.", 4000, () => { });
      return false;
    }/*  else if (this.selectedEvent[0] == undefined ) {
      this.utilitiesService.showNotification(1, "Seleccione un Evento.", 4000, () => { });
      return false;
    }  */ else if (this.selectedSearchTag[0] == undefined ) {
      this.utilitiesService.showNotification(1, "Seleccione un Tag.", 4000, () => { });
      return false;
    } else if (this.actualRepertoire.sets.length < 1) {
      this.utilitiesService.showNotification(1, "Seleccione por lo menos una lista.", 4000, () => { });
      return false;
    } else {
      return true;
    }
  }

  save(){
    this.actualRepertoire.sets = [];
    this.setsOfBand.forEach((set)=>{
      if(set.selected==true){
        this.actualRepertoire.sets.push({ idSet : set.idSet, name : set.name })
      }
    });

    if( this.validateRepertoireData() ){
      if(this.isNewRepertorie == true){
        //console.log("creando repertorio");
        //console.log(this.actualRepertoire);
        this.utilitiesService.showLoadingMsg("Creando repertorio", "Guardando informacion.", () => {
          this.apiDataService.createRepertorie(this.actualRepertoire).then((response: ServerMessage) => {
            //console.log(response);
            if (response.error == true) {
              //Cosas para hacer en caso de que se suba mal
              this.utilitiesService.showNotification(1, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingMsg();
            } else {
              //Cosas por hacer en caso de que se suba bien
              this.utilitiesService.showNotification(0, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingSuccess("Nueva Repertorio Guardado", "Informacion del repertorio " + this.actualRepertoire.name + " guardado.", () => {
                //Cosas para hacer en caso de que se suba correctamente
                //console.log(response);
                this.closeModal.nativeElement.click();
                this.updateRepertories();
              });
            }
          }).catch((error) => {
            console.log(error);
            this.utilitiesService.showNotification(1, "Error creando la lista", 5000, () => { });
            this.utilitiesService.closeLoadingMsg();
          });
        });
      }else{
        //console.log("editando");
        //console.log(this.actualRepertoire);
        this.utilitiesService.showLoadingMsg("Creando repertorio", "Guardando informacion.", () => {
          this.apiDataService.updateRepertorie(this.actualRepertoire).then((response: ServerMessage) => {
            //console.log(response);
            if (response.error == true) {
              //Cosas para hacer en caso de que se suba mal
              this.utilitiesService.showNotification(1, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingMsg();
            } else {
              //Cosas por hacer en caso de que se suba bien
              this.utilitiesService.showNotification(0, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingSuccess("Repertorio Actualizado", "Informacion del repertorio " + this.actualRepertoire.name + " guardado.", () => {
                //Cosas para hacer en caso de que se suba correctamente
                //console.log(response);
                this.closeModal.nativeElement.click();
                this.updateRepertories()
              });
            }
          }).catch((error) => {
            console.log(error);
            this.utilitiesService.showNotification(1, "Error guardando la lista", 5000, () => { });
            this.utilitiesService.closeLoadingMsg();
          });
        });
      }
    }
  }

  selectForDelete(idRepertorie : number){
    this.idRepertorieForDelete = idRepertorie;
  }

  deleteConfirmed(){
    this.apiDataService.deleteRepertorie(this.idRepertorieForDelete).then((response : ServerMessage)=>{
      //console.log(response);
      if(response.error == false){
        //Cosas para hacer en caso de que se elimine
        this.closeModalConfirmDelete.nativeElement.click();
        this.utilitiesService.showNotification(0, response.message, 3000, () => { });
        //Se recargan los repertorios
        this.updateRepertories();
      }else{
        console.log(response.data);
        this.utilitiesService.showNotification(1,response.message,5000,()=>{});
      }
    }).catch((error)=>{
      console.log(error);
      this.utilitiesService.showNotification(1,"A ocurrido un error eliminando la lista",5000,()=>{});
    })
  }

  countSelected(): number{
    let selected = [];
    this.setsOfBand.forEach((set)=>{
      if(set.selected==true){
        selected.push({ idSet : set.idSet, name : set.name })
      }
    });

    return selected.length;
  }

}
