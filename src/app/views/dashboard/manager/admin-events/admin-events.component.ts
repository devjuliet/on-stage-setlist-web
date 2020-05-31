import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActualEvent } from '../../../../classes/actualEvent.class';
import { ApiDataService } from '../../../../services/api-data/api-data.service';
import { ServerMessage } from '../../../../classes/serverMessages.dto';

@Component({
  selector: 'app-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css']
})
export class AdminEventsComponent implements OnInit {
  actualEvent : ActualEvent;
  isNew : boolean;
  date : String;
  //Variables para implementar el dropdown 
  dropdownBandSettings: IDropdownSettings;
  selectedBand : {};
  searchValue : String;

  eventsFiltered : ActualEvent[];

  dropdownTagSettings: IDropdownSettings;
  selectedTag : {};

  dropdownSearchTagSettings: IDropdownSettings;
  selectedSearchTag : [];
  @ViewChild('btnCOpenModal') btnCOpenModal: ElementRef;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;
  @ViewChild('concertModasl') concertModasl: ElementRef;
  
  constructor(public dataSessionService : DataSessionService, public utilitiesService : UtilitiesService,
    private apiDataService: ApiDataService) { 
    this.actualEvent = new ActualEvent();
    this.date = this.utilitiesService.getDateForInputs();
    this.isNew = true;
    this.searchValue = "";
    this.eventsFiltered = [];
    this.dropdownBandSettings = {
      singleSelection: true,
      idField: 'idBand',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

    this.dropdownTagSettings = {
      singleSelection: true,
      idField: 'idTag',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

    this.dropdownSearchTagSettings = {
      singleSelection: true,
      idField: 'idTag',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
  }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      //Manda al dashboard correspondiente o saca de la sesion
      if(this.dataSessionService.user.type==2){
        this.dataSessionService.navigateByUrl("/dashboard/led");
      }else if(this.dataSessionService.user.type!=1){
        this.dataSessionService.logOut();
      }else{
       console.log("usuario simonki");
       //Abre solo el modal como si le pocaran al boton de crear un evento
       //this.btnCOpenModal.nativeElement.click();


       this.dataSessionService.getTagsCatalog((response) => {
          //console.log(this.dataSessionService.elementsManager.bands);
          this.dataSessionService.getEventsManager((response) => {
            this.eventsFiltered = Array.from(this.dataSessionService.elementsManager.upcomingEvents);
            this.date = this.utilitiesService.getDateForInputs();
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
      }
    }, (noLoginResponse: LogedResponse) => {
      console.log(noLoginResponse);
      this.dataSessionService.navigateByUrl("/");
    });
  }

  validateBandData(): Boolean {
    if (this.actualEvent.name.length < 8) {
      this.utilitiesService.showNotification(1, "Nombre del evento invalido.", 4000, () => { });
      return false;
    } else if (this.actualEvent.location.length < 1) {
      this.utilitiesService.showNotification(1, "Ubicacion del evento muy corta.", 4000, () => { });
      return false;
    } else if (this.actualEvent.place.length < 1) {
      this.utilitiesService.showNotification(1, "Lugar del evento muy corto.", 4000, () => { });
      return false;
    } else if (this.actualEvent.tour.length < 1) {
      this.utilitiesService.showNotification(1, "Nombre del tour muy corto.", 4000, () => { });
      return false;
    }  else if (this.selectedTag == undefined ) {
      this.utilitiesService.showNotification(1, "Seleccione un Tag.", 4000, () => { });
      return false;
    } else if (this.selectedTag[0] == undefined ) {
      this.utilitiesService.showNotification(1, "Seleccione un Tag.", 4000, () => { });
      return false;
    } else if (this.selectedBand == undefined ) {
      this.utilitiesService.showNotification(1, "Seleccione una banda.", 4000, () => { });
      return false;
    } else if (this.selectedBand[0] == undefined ) {
      this.utilitiesService.showNotification(1, "Seleccione una banda.", 4000, () => { });
      return false;
    } else {
      return true;
    }
  }

  modalEvent(isNew : Boolean,event = new ActualEvent()){

    if(isNew){
      this.initNewEvent();
      //console.log(this.date);
      
    }else{
      this.isNew = false;
      //console.log(event);
      
      this.actualEvent = event;
      this.actualEvent.date = this.actualEvent.date;
      let fixMont = this.actualEvent.date.getMonth().toString().length == 1 ? "0"+this.actualEvent.date.getMonth() : this.actualEvent.date.getMonth();
      this.date =  "" + this.actualEvent.date.getFullYear() + "-" + fixMont + "-" + (this.actualEvent.date.getDate() );

      this.selectedTag = [{  idTag : event.idTag, name : event.nameTag}];
      this.selectedBand = [{  idBand : event.idBand, name : event.nameBand}];
      this.concertModasl.nativeElement.click();
    }
  }

  filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);
    if (this.searchValue == "") {
      this.eventsFiltered = Array.from(this.dataSessionService.elementsManager.upcomingEvents);
    } else {
      this.eventsFiltered = this.dataSessionService.elementsManager.upcomingEvents.filter(function (upcomingEvent) {
        let fixed = upcomingEvent.name.charAt(0).toUpperCase() + upcomingEvent.name.slice(1);
        return fixed.toLowerCase().includes(ssearchValue);
      });
    }
  }

  onTagSearchSelect(item: any) {
    let ssearchValue = item.name.charAt(0).toLowerCase() + item.name.slice(1);
    
    if (this.selectedSearchTag.length == 0) {
      this.eventsFiltered = Array.from(this.dataSessionService.elementsManager.upcomingEvents);
    } else {
      this.eventsFiltered = this.dataSessionService.elementsManager.upcomingEvents.filter(function (upcomingEvent) {
        let fixed = upcomingEvent.nameTag.charAt(0).toUpperCase() + upcomingEvent.nameTag.slice(1);
        return fixed.toLowerCase().includes(ssearchValue);
      });
    }
    
  }

  initNewEvent(){
    this.isNew = true;
    this.date = this.utilitiesService.getDateForInputs();
    this.actualEvent.date = this.actualEvent.date;
    this.actualEvent = new ActualEvent();
    this.selectedBand = [];
    this.selectedTag = [];
    this.actualEvent.name = "Concierto chidote";
    this.actualEvent.location = "Ubicacion chidota";
    this.actualEvent.place = "Concierto chidote";
    this.actualEvent.tour = "El tour de las bunyys";
  }

  saveEvent(){
    if( this.validateBandData() ){
      this.actualEvent.idBand = this.selectedBand[0].idBand;
      this.actualEvent.idTag = this.selectedTag[0].idTag;
      if(this.isNew == true){
        console.log("creando");
        this.actualEvent.date = new Date(this.date.toString());
        //console.log(this.actualEvent);
        this.utilitiesService.showLoadingMsg("Creando evento", "Guardanto tu nuevo evento: " + this.actualEvent.name, () => {
          this.apiDataService.createEvent(this.actualEvent).then((response : ServerMessage)=>{
            //console.log(response);
            if(response.error == true){
              this.utilitiesService.showNotification(1,response.message,5000,()=>{});
              this.utilitiesService.closeLoadingMsg();
            }else{
              this.utilitiesService.closeLoadingSuccess("Evento creado.", "Exito guardando la informacion del evento " + this.actualEvent.name, () => {
                this.initNewEvent();
                this.btnCloseModal.nativeElement.click();
                this.dataSessionService.getEventsManager((response) => {
                  this.eventsFiltered = Array.from(this.dataSessionService.elementsManager.upcomingEvents);
                }, (err) => {
                  console.log(err);
                });
              });  
            }
          }).catch((error)=>{
            console.log(error);
            this.utilitiesService.closeLoadingMsg();
          }); 
        });
      }else{
        console.log("editando");
        this.actualEvent.date = new Date( this.date.toString() )
        //console.log(this.actualEvent);
        
        this.utilitiesService.showLoadingMsg("Guardando evento", "Guardanto tu evento: " + this.actualEvent.name, () => {
          this.apiDataService.updateEvent(this.actualEvent).then((response : ServerMessage)=>{
            //console.log(response);
            if(response.error == true){
              this.utilitiesService.showNotification(1,response.message,5000,()=>{});
              this.utilitiesService.closeLoadingMsg();
            }else{
              this.utilitiesService.closeLoadingSuccess("Evento guardado.", "Exito guardando la informacion del evento " + this.actualEvent.name, () => {
                this.initNewEvent();
                this.btnCloseModal.nativeElement.click();
                this.dataSessionService.getEventsManager((response) => {
                  this.eventsFiltered = Array.from(this.dataSessionService.elementsManager.upcomingEvents);
                }, (err) => {
                  console.log(err);
                });
              });  
            }
          }).catch((error)=>{
            console.log(error);
            this.utilitiesService.closeLoadingMsg();
          });
        });
      }
    }
  }

}
