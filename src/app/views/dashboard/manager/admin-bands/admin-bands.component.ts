import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { ApiDataService } from '../../../../services/api-data/api-data.service';
import { async } from 'rxjs/internal/scheduler/async';
import { Band } from '../../../../classes/band.class';

@Component({
  selector: 'app-admin-bands',
  templateUrl: './admin-bands.component.html',
  styleUrls: ['./admin-bands.component.css']
})
export class AdminBandsComponent implements OnInit {
  searchValue: String;
  bandsFiltered : Band[];

  constructor(public dataSessionService : DataSessionService, public utilitiesService : UtilitiesService,
    private apiDataService: ApiDataService) {
      this.searchValue = "";
     }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      //Manda al dashboard correspondiente o saca de la sesion
      if(this.dataSessionService.user.type==2 || this.dataSessionService.user.type == 0){
        this.dataSessionService.navigateByUrl("/dashboard/led");
      }else if(this.dataSessionService.user.type!=1){
        this.dataSessionService.logOut();
      }else{
       console.log("usuario simonki");
       this.dataSessionService.getBandsManager(async (response) => {
          //console.log(this.dataSessionService.elementsManager.bands);
          this.bandsFiltered = Array.from(this.dataSessionService.elementsManager.bands);
          //Se cargan todas las imagenes de las bandas
          for (let index = 0; index < this.dataSessionService.elementsManager.bands.length; index++) {
            if(this.dataSessionService.elementsManager.bands[index].urlLogo.length > 0){
              this.dataSessionService.elementsManager.bands[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
              'uploads/band-image/' + this.dataSessionService.elementsManager.bands[index].idBand.toString());
            }
          };
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
      this.bandsFiltered = Array.from(this.dataSessionService.elementsManager.bands);
    } else {
      this.bandsFiltered = this.dataSessionService.elementsManager.bands.filter(function (band) {
        let fixed = band.name.charAt(0).toUpperCase() + band.name.slice(1);
        return fixed.toLowerCase().includes(ssearchValue);
      });
    }
  }

}
