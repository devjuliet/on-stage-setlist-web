import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';

@Component({
  selector: 'app-admin-bands',
  templateUrl: './admin-bands.component.html',
  styleUrls: ['./admin-bands.component.css']
})
export class AdminBandsComponent implements OnInit {

  constructor(public dataSessionService : DataSessionService, public utilitiesService : UtilitiesService) { }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      //Manda al dashboard correspondiente o saca de la sesion
      if(this.dataSessionService.user.type==2){
        this.dataSessionService.navigateByUrl("/dashboard/led/home");
      }else if(this.dataSessionService.user.type!=1){
        this.dataSessionService.logOut();
        console.log("usuario simonki............");
      }else{
       console.log("usuario simonki");
       
      }
    }, (noLoginResponse: LogedResponse) => {
      console.log(noLoginResponse);
      this.dataSessionService.navigateByUrl("/");
    });
  }

}
