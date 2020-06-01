import { Component, OnInit } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';

@Component({
  selector: 'app-repertories',
  templateUrl: './repertories.component.html',
  styleUrls: ['./repertories.component.css']
})
export class RepertoriesComponent implements OnInit {

  constructor(public dataSessionService : DataSessionService, public utilitiesService : UtilitiesService) { }

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

}