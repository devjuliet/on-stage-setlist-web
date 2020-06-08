import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { Song } from '../../../../classes/elementsManager.class';
import { ApiDataService } from '../../../../services/api-data/api-data.service';
import { ServerMessage } from '../../../../classes/serverMessages.dto';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  constructor(public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService,
    private apiDataService: ApiDataService) {
    this.source = '';
  }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);
      //Manda al dashboard correspondiente o saca de la sesion
      if (this.dataSessionService.user.type == 2 || this.dataSessionService.user.type == 0) {
        this.dataSessionService.navigateByUrl("/dashboard/led");
      } else if (this.dataSessionService.user.type != 1) {
        this.dataSessionService.logOut();
      } else {
        //console.log("usuario simonki");
        this.dataSessionService.getCatalogSongsBandsManager(async (response) => {
          //console.log(this.dataSessionService.elementsManager.songsCatalog);
          //Se cargan todas las imagenes de las bandas
          for (let index = 0; index < this.dataSessionService.elementsManager.songsCatalog.length; index++) {
            if (this.dataSessionService.elementsManager.songsCatalog[index].urlLogo.length > 0) {
              this.dataSessionService.elementsManager.songsCatalog[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                'uploads/band-image/' + this.dataSessionService.elementsManager.songsCatalog[index].idBand.toString());
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

  dynamicDownloadTxt(songs) {
    if (songs.length == 0) {
      this.utilitiesService.showNotification(1, "La banda no cuenta con canciones", 4000, () => { });
    } else {
      this.dyanmicDownloadByHtmlTag({
        fileName: this.utilitiesService.getDateForInputs() + "-" + songs.length + "-songs",
        text: JSON.stringify(songs, undefined, 4)
      });
    }
  }

  private dyanmicDownloadByHtmlTag(arg: { fileName: string, text: string }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  source: string = '';
  idBandUpload: number = 0;
  resultsImport: { songsNotSaved: any[], saved: any[] } = { songsNotSaved: [], saved: [] };
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  @ViewChild('OpenConfirmModal') openConfirmModal: ElementRef;
  @ViewChild('btnCloseConfirmImport') closeConfirmModal: ElementRef;
  @ViewChild('OpenInfoUpload') openInfoUpload: ElementRef;

  updateSource($event: Event) {
    // We access he file with $event.target['files'][0]
    let file = $event.target['files'][0];
    if (file != undefined) {
      let reader = new FileReader;
      // TODO: Define type of 'e'
      reader.onload = (e: any) => {
        // Simply set e.target.result as our <img> src in the layout
        this.source = e.target.result;
  
        this.onChange.emit(file);
        //console.log(e.target.result);
        this.openConfirmModal.nativeElement.click()
      };
      // This will process our file and get it's attributes/data
      reader.readAsText(file);
    }
  }
  updateBandId(indexBand: number) {
    this.idBandUpload = indexBand;
    //console.log(indexBand);
  }

  confirmUpload() {
    let songsBandCatalog: Song[] = JSON.parse(this.source);
    this.utilitiesService.showLoadingMsg("Importando nuevas canciones", "Importando " + songsBandCatalog.length + " canciones", () => {
      this.apiDataService.uploadCatalogSongsForBand(songsBandCatalog, this.idBandUpload).then((response: ServerMessage) => {
        if (response.error == false) {
          this.utilitiesService.showNotification(0, response.message, 4000, () => { });
          this.utilitiesService.closeLoadingSuccess("Exito", response.data.saved.length + " canciones importadas con exito.", () => {
            this.openInfoUpload.nativeElement.click();
            this.resultsImport = response.data;
            this.dataSessionService.getCatalogSongsBandsManager(async (response) => {
              //console.log(this.dataSessionService.elementsManager.songsCatalog);
              //Se cargan todas las imagenes de las bandas
              for (let index = 0; index < this.dataSessionService.elementsManager.songsCatalog.length; index++) {
                if (this.dataSessionService.elementsManager.songsCatalog[index].urlLogo.length > 0) {
                  this.dataSessionService.elementsManager.songsCatalog[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                    'uploads/band-image/' + this.dataSessionService.elementsManager.songsCatalog[index].idBand.toString());
                }
              };
            }, (err) => {
              console.log(err);
            });
          });
        } else {
          console.log(response);
          this.utilitiesService.showNotification(1, response.message, 4000, () => { });
          this.utilitiesService.closeLoadingMsg();
        }
        this.closeConfirmModal.nativeElement.click();
      }).catch((error) => {
        console.log(error);
        this.utilitiesService.showNotification(1, "A ocurrido un error subiendo las nuevas canciones", 4000, () => { });
        this.utilitiesService.closeLoadingMsg();
      });
    });

  }
}
