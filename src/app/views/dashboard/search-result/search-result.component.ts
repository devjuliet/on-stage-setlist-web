import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { ActivatedRoute } from '@angular/router';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { SearchResultList } from '../../../classes/searchResultList.class';
import { ServerMessage } from '../../../classes/serverMessages.dto';
import { ApiDataService } from '../../../services/api-data/api-data.service';
import { Band } from '../../../classes/band.class';
import { async } from 'rxjs/internal/scheduler/async';
import { BandMemberProfile } from '../../../classes/bandMemberProfile.class';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  searchQuery : String ;
  results : SearchResultList[];
  bandSelected : Band;
  artistSelected : BandMemberProfile;

  constructor(private route: ActivatedRoute, public dataSessionService: DataSessionService,
    public utilitiesService: UtilitiesService,private apiDataService: ApiDataService) {
    this.results = [];
    this.bandSelected = new Band();
    this.artistSelected = new BandMemberProfile();
    //Se obtiene el search abierto cada que la ruta cambia de search por eso me suscribo al evento
    this.route.paramMap.subscribe(params => {
      this.searchQuery = this.route.snapshot.params.search; 
      this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
        //console.log(logedResponse);
        //Manda al dashboard correspondiente o saca de la sesion
        if (this.dataSessionService.user.type != 1 && this.dataSessionService.user.type != 2) {
          this.dataSessionService.logOut();
        } else {
          //Cosas para hacer en caso de que el usario este logeado
          this.dataSessionService.searchBandsUsersByName(this.searchQuery).then(async (response: ServerMessage)=>{
            //console.log(response);
            if(response.error == false){
              this.results = response.data;
              //Se cargan todas las imagenes de los resultados 
              for (let index = 0; index < this.results.length; index++) {
                let url : String = 'uploads/user-image/';
                if(this.results[index].isBand == true){
                  url = 'uploads/band-image/';
                }
                this.results[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                  url + this.results[index].id.toString());
              };
            }else{
              this.utilitiesService.showNotification(1,response.message,4000,()=>{});
            }
          }).catch((error)=>{
            console.log(error);
            this.utilitiesService.showNotification(1,"A ocurrido un error en la consulta",4000,()=>{});
          });
        }
      }, (noLoginResponse: LogedResponse) => {
        console.log(noLoginResponse);
        this.dataSessionService.navigateByUrl("/");
      });
    });
  }

  ngOnInit(): void {
    this.bandSelected = new Band();
    this.artistSelected = new BandMemberProfile();
  }

  selectBand(idBand : Number){
    this.bandSelected = new Band();
    this,this.dataSessionService.getBandById(idBand).then(async(response: ServerMessage)=>{
      //console.log(response);
      this.bandSelected = response.data;
      if(this.bandSelected.urlLogo.length > 0){
        this.bandSelected.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
        'uploads/band-image/' + this.bandSelected.idBand.toString());
      }
      //Se cargan todas las imagenes de los usuarios si tienen una seteada
      for (let index = 0; index < this.bandSelected.bandMembers.length; index++) {
          if(this.bandSelected.bandMembers[index].haveImage == true){
            this.bandSelected.bandMembers[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
            'uploads/user-image/' + this.bandSelected.bandMembers[index].idUser.toString());
          } 
      };
    }).catch((error)=>{
      console.log(error);
      this.utilitiesService.showNotification(1,"Error consultando informacion de la banda",4000,()=>{});
    })
  }

  selectArtist(idUser : Number){
    this.bandSelected = new Band();
    this,this.dataSessionService.getUserById(idUser).then(async(response: ServerMessage)=>{
      //console.log(response);
      this.artistSelected = response.data;
      //Se carga la imagen del usuario
      if(this.artistSelected.haveImage == true){
        this.artistSelected.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
        'uploads/user-image/' + this.artistSelected.idUser.toString());
      };
    }).catch((error)=>{
      console.log(error);
      this.utilitiesService.showNotification(1,"Error consultando informacion del musico",4000,()=>{});
    })
  }

}
