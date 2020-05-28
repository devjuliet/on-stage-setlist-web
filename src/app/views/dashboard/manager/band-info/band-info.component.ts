import { Component, OnInit, OnChanges } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-band-info',
  templateUrl: './band-info.component.html',
  styleUrls: ['./band-info.component.css']
})
export class BandInfoComponent implements OnInit,OnChanges {

  idBandOpened : number;
  constructor(private route: ActivatedRoute,public dataSessionService : DataSessionService, public utilitiesService : UtilitiesService) {
    this.idBandOpened=0;
   }

  ngOnInit(): void {
    //Se obtiene el id abierto cada que la ruta cambia de id por eso me suscribo al evento
    this.route.paramMap.subscribe(params => {
      this.idBandOpened = this.route.snapshot.params.id;
    });
    
    
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

  ngOnChanges(){
    this.idBandOpened = this.route.snapshot.params.id;
  }

}
