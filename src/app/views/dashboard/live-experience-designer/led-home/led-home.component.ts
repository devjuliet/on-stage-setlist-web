import { Component, OnInit } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { SetLed } from '../../../../classes/led/setLed.class';

@Component({
  selector: 'app-led-home',
  templateUrl: './led-home.component.html',
  styleUrls: ['./led-home.component.css']
})
export class LedHomeComponent implements OnInit {
  setsListFiltered: SetLed[];
  searchValue: String;

  constructor(public dataSessionService : DataSessionService, public utilitiesService : UtilitiesService) {
    this.setsListFiltered = [];
    this.searchValue = "";
   }

  ngOnInit(): void {
    this.setsListFiltered = [];
    this.searchValue = "";
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
        this.refreshLists();
      }
    }, (noLoginResponse: LogedResponse) => {
      console.log(noLoginResponse);
      this.dataSessionService.navigateByUrl("/");
    });
  }

  refreshLists(){
    this.dataSessionService.getSetsLed((message) => {
      //this.utilitiesService.showNotification(0, message, 3000, () => { });
      this.setsListFiltered = Array.from(this.dataSessionService.elementsLed.setsList);
    }, (messageError) => {
      this.utilitiesService.showNotification(1, messageError, 3000, () => { });
    });
  }

  filterByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);
    if (this.searchValue == "") {
      this.setsListFiltered = Array.from(this.dataSessionService.elementsLed.setsList);
    } else {
      this.setsListFiltered = this.dataSessionService.elementsLed.setsList.filter(function (set) {
        let fixed = set.name.charAt(0).toUpperCase() + set.name.slice(1);
        return fixed.toLowerCase().includes(ssearchValue);
      });
    }
  }
}
