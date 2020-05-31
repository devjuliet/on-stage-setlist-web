import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { ApiDataService } from 'src/app/services/api-data/api-data.service';
import { DataSessionService } from 'src/app/services/dataSession/data-session.service';
import { LogedResponse } from 'src/app/classes/logedResponse.class';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActualEvent } from '../../../../classes/actualEvent.class';

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent implements OnInit {
  searchValue : String;
  dropdownSearchTagSettings: IDropdownSettings;
  selectedSearchTag : [];
  eventsFiltered : ActualEvent[];
  
  constructor(public dataSessionService : DataSessionService, public utilitiesService : UtilitiesService) { 
    this.searchValue = "";
    this.selectedSearchTag = [];
    this.dropdownSearchTagSettings = {
      singleSelection: true,
      idField: 'idTag',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    this.eventsFiltered = [];
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
       this.dataSessionService.getTagsCatalog((response) => {
        //console.log(this.dataSessionService.elementsManager.bands);
        this.dataSessionService.getEventsManager((response) => {
          this.eventsFiltered = Array.from(this.dataSessionService.elementsManager.upcomingEvents);
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

}
