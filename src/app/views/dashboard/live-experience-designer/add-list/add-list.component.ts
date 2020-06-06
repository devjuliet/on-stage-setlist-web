import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BandLed } from '../../../../classes/led/bandLed.class';
import { SetLed } from '../../../../classes/led/setLed.class';
import { NewSong } from '../../../../classes/led/newSong.class';
import { ApiDataService } from '../../../../services/api-data/api-data.service';
import { ServerMessage } from '../../../../classes/serverMessages.dto';
import { async } from 'rxjs/internal/scheduler/async';
import { SongBand } from '../../../../classes/led/songBand.class';
import { throwIfEmpty } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.css']
})
export class AddListComponent implements OnInit {
  newList: SetLed;
  newSong: NewSong;
  //Variables para la imagen de la banda
  source: string = '';
  selectedFile: any;
  //Variables para las imagenes del instrumento
  sourceChordsGuitar: string = '';
  selectedFileChordsGuitar: any;
  sourceTabGuitar: string = '';
  selectedFileTabGuitar: any;
  sourceChordsBass: string = '';
  selectedFileChordsBass: any;
  sourceTabBass: string = '';
  selectedFileTabBass: any;
  sourceChordsPiano: string = '';
  selectedFileChordsPiano: any;
  sourceTabPiano: string = '';
  selectedFileTabPiano: any;

  dropdownSearchBandSettings: IDropdownSettings;
  selectedBand: BandLed[];

  //Variable para cargar la lista de canciones disponibles para añadir al set actual
  songBandList: SongBand[];
  songFiltered: SongBand[];
  searchValue: string;

  dropdownTagSettings: IDropdownSettings;
  selectedTag: { idTag: number, name: string }[];

  isNewSong: Boolean;
  isNewList: Boolean;

  idSongForDelete: Number;

  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();


  @ViewChild('newSongModal') newSongModal: ElementRef;
  @ViewChild('CloseNewSong') closeNewSong: ElementRef;
  @ViewChild('TabAddSong') tabAddSong: ElementRef;
  @ViewChild('CloseDeleteModal') closeDeleteModal: ElementRef;
  @ViewChild('CloseEditSong') closeEditSong: ElementRef;

  idListOpened: number;

  constructor(private route: ActivatedRoute, public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService,
    private apiDataService: ApiDataService) {
    this.selectedBand = [];
    this.selectedTag = [];
    this.songBandList = [];
    this.songFiltered = [];
    this.searchValue = "";
    this.idSongForDelete = 0;
    this.newList = new SetLed();
    this.newSong = new NewSong();
    this.isNewSong = true;
    this.isNewList = true;
    this.source = '';
    this.dropdownSearchBandSettings = {
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

    //Se obtiene el id abierto cada que la ruta cambia de id por eso me suscribo al evento
    this.route.paramMap.subscribe(params => {
      this.idListOpened = this.route.snapshot.params.id;
      //console.log(this.idListOpened);

      this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
        //console.log(logedResponse);
        //Manda al dashboard correspondiente o saca de la sesion
        if (this.dataSessionService.user.type == 1) {
          this.dataSessionService.navigateByUrl("/dashboard/manager");
        } else if (this.dataSessionService.user.type != 2 && this.dataSessionService.user.type != 0) {
          this.dataSessionService.logOut();
        } else {
          //Cosas para hacer en caso de que el usario este logeado
          this.selectedBand = [];
          this.selectedTag = [];
          this.newSong = new NewSong();
          this.newList = new SetLed();
          this.isNewList = true;
          //Se carga la lista de sets o listas que tiene el live designer
          this.dataSessionService.getSetsLed((message) => {
            //this.utilitiesService.showNotification(0, message, 3000, () => { });
            //Si es una nueva lista viene como indefinido
            this.dataSessionService.getTagsCatalog((response) => {
                    
            }, (err) => {
              console.log(err);
            });
            if (this.idListOpened == undefined) {
              this.isNewList = true;
              this.dataSessionService.getBandsLed((response) => {
              
              }, (err) => {
                console.log(err);
                this.utilitiesService.showNotification(1,"A ocurrido un error obteniendo las bandas.",4000,()=>{});
              });
            } else {
              this.isNewList = false;
              //Cargar los datos de la lista de esta manera evita que los elementos del slider se afecten cuando editas
              let newList = JSON.parse(JSON.stringify(this.dataSessionService.elementsLed.setsList));
              this.newList = newList.find((set) => {
                return set.idSet == this.idListOpened;
              });
              //console.log(this.newList);
              if (this.newList == undefined || this.newList == null) {
                this.newList = new SetLed();
                this.utilitiesService.showNotification(1, "La lista no se encuentra en tus listas.", 4000, () => { });
              } else {
                //Se recarga la imagen
                let itemForImage = this.dataSessionService.elementsLed.setsList.find((set) => {
                  return set.idSet == this.idListOpened;
                });
                this.newList.imageBlob = itemForImage.imageBlob;

                this.dataSessionService.getBandsLed((response) => {
                    //Se carga en el drop down la opcion seleccionada de la banda
                    let bandSelectedDrop = this.dataSessionService.elementsLed.bands.find((band)=>{
                      return band.idBand == this.newList.idBand;
                    });

                    if(bandSelectedDrop == null || bandSelectedDrop == undefined){
                      this.utilitiesService.showNotification(1, "La banda no se encuentra en tu lista de bandas.", 4000, () => { });
                    }else{
                      this.selectedBand = [{ idBand: this.newList.idBand , name: bandSelectedDrop.name, urlLogo: "", description: "", managerName: bandSelectedDrop.managerName }];
                    }
                  
                }, (err) => {
                  console.log(err);
                });
              }
            }
          }, (messageError) => {
            this.utilitiesService.showNotification(1, messageError, 3000, () => { });
          });
        }
      }, (noLoginResponse: LogedResponse) => {
        console.log(noLoginResponse);
        this.dataSessionService.navigateByUrl("/");
      });
    });
  }

  ngOnInit(): void {}

  onBandSearchSelect(item: any) {
    console.log(item);
    
    if (this.selectedBand.length == 0) {
      //console.log("sin seleccion");
    } else {
      //console.log("con seleccion");
      this.newList = new SetLed();
      this.newList.idBand = this.selectedBand[0].idBand;
      let bandSelectedDrop = this.dataSessionService.elementsLed.bands.find((band)=>{
        return band.idBand == this.newList.idBand;
      });
      this.selectedBand[0].managerName = bandSelectedDrop.managerName;
    }
  }

  ///Funciones para guardar la imagen de la lista
  updateSource($event: Event) {
    // We access he file with $event.target['files'][0]
    //console.log("smn");

    let file = $event.target['files'][0];
    let reader = new FileReader;
    // TODO: Define type of 'e'
    reader.onload = (e: any) => {
      // Simply set e.target.result as our <img> src in the layout
      this.source = e.target.result;
      this.onChange.emit(file);
      this.selectedFile = file;
    };
    // This will process our file and get it's attributes/data
    reader.readAsDataURL(file);
  }

  cancelImage() {
    this.source = "";
    this.newList.haveImage = false;
  }
  //Cosas que se usan dentro del modal de añadir cancion
  /////////////////////////////////////////SONG////////////////////////////////////////////////
  //Modal Añadir nueva cancion
  initNewSong() {
    this.selectedTag = [];
    this.newSong = new NewSong();
    this.isNewSong = true;
    /////////////////////////////////////
    this.newSong.name = "";
    this.newSong.artist = "";
    this.newSong.tempo = 0;
    this.newSong.lyric = "";
    //this.selectedTag = [{ idTag: 1, name: "Rock" }];
    //Reseteo de los seleccionadores de imagenes
    this.sourceTabGuitar = "";
    this.sourceChordsGuitar = '';
    this.sourceChordsBass = '';
    this.sourceTabBass = '';
    this.sourceChordsPiano = '';
    this.sourceTabPiano = '';
    this.searchValue = "";
    //Se cargan las canciones de la banda
    this.loadSongBandList(this.selectedBand[0].idBand);
    this.tabAddSong.nativeElement.click();
  }
  //Modal Añadir nueva cancion
  async initEditingSong(idSelectedSong: Number) {
    this.selectedTag = [];
    this.apiDataService.getSongLed(idSelectedSong).then(async (response: ServerMessage) => {
      //console.log(response);
      this.newSong = JSON.parse(JSON.stringify(response.data));
      this.isNewSong = false;
      /////////////////////////////////////
      this.loadSongBandList(this.selectedBand[0].idBand);
      let actualTag = this.dataSessionService.tagsCatalog.find((tag) => {
        return tag.idTag == this.newSong.idTag
      })
      this.selectedTag = [{ idTag: actualTag.idTag, name: actualTag.name.toString() }];
      //Reseteo de los seleccionadores de imagenes
      this.sourceTabGuitar = "";
      this.sourceChordsGuitar = '';
      this.sourceChordsBass = '';
      this.sourceTabBass = '';
      this.sourceChordsPiano = '';
      this.sourceTabPiano = '';
      this.searchValue = "";
      //Carga de las imagenes de la cancion 
      //Acordes
      if (this.newSong.chordsGuitar == true) {
        this.newSong.chordsGuitarBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
          'uploads/song-image/' + this.newSong.idSong.toString() + '/guitar-chords');
      }
      if (this.newSong.chordsBass == true) {
        this.newSong.chordsBassBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
          'uploads/song-image/' + this.newSong.idSong.toString() + '/bass-chords');
      }
      if (this.newSong.chordsPiano == true) {
        this.newSong.chordsPianoBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
          'uploads/song-image/' + this.newSong.idSong.toString() + '/piano-chords');
      }
      //Partituras
      if (this.newSong.tabGuitar == true) {
        this.newSong.tabGuitarBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
          'uploads/song-image/' + this.newSong.idSong.toString() + '/guitar-tabs');
      }
      if (this.newSong.tabBass == true) {
        this.newSong.tabBassBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
          'uploads/song-image/' + this.newSong.idSong.toString() + '/bass-tabs');
      }
      if (this.newSong.tabPiano == true) {
        this.newSong.tabPianoBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
          'uploads/song-image/' + this.newSong.idSong.toString() + '/piano-tabs');
      }

    }).catch((error) => {
      console.log(error);
    });
    this.tabAddSong.nativeElement.click();
  }
  ///Funciones para guardar la imagen de los instrunmentos 0-5 segun interfaz
  updateInstrumentSource($event: Event, opc: Number) {
    let file = $event.target['files'][0];
    let reader = new FileReader;
    // TODO: Define type of 'e'
    reader.onload = (e: any) => {
      // Simply set e.target.result as our <img> src in the layout
      switch (opc) {
        case 0:
          this.sourceChordsGuitar = e.target.result;
          this.selectedFileChordsGuitar = file;
          //this.newSong.chordsGuitar  = true;
          break;
        case 1:
          this.sourceChordsBass = e.target.result;
          this.selectedFileChordsBass = file;
          //this.newSong.chordsBass = true;
          break;
        case 2:
          this.sourceChordsPiano = e.target.result;
          this.selectedFileChordsPiano = file;
          //this.newSong.chordsPiano = true;
          break;
        case 3:
          this.sourceTabGuitar = e.target.result;
          this.selectedFileTabGuitar = file;
          //this.newSong.tabPiano = true;
          break;
        case 4:
          this.sourceTabBass = e.target.result;
          this.selectedFileTabBass = file;
          //this.newSong.tabBass = true;
          break;
        case 5:
          this.sourceTabPiano = e.target.result;
          this.selectedFileTabPiano = file;
          //this.newSong.tabPiano = true;
          break;
        default:
          break;
      }
      this.onChange.emit(file);
    };
    // This will process our file and get it's attributes/data
    reader.readAsDataURL(file);
  }
  //Funciones para eliminar la imagen de los instrunmentos 0-5 segun interfaz
  cancelImageInstrument(opc: number) {
    switch (opc) {
      case 0:
        this.sourceChordsGuitar = "";
        this.newSong.chordsGuitar = false;
        break;
      case 1:
        this.sourceChordsBass = "";
        this.newSong.chordsBass = false;
        break;
      case 2:
        this.sourceChordsPiano = "";
        this.newSong.chordsPiano = false;
        break;
      case 3:
        this.sourceTabGuitar = "";
        this.newSong.tabGuitar = false;
        break;
      case 4:
        this.sourceTabBass = "";
        this.newSong.tabBass = false;
        break;
      case 5:
        this.sourceTabPiano = "";
        this.newSong.tabPiano = false;
        break;
      default:
        break;
    }
  }

  validateNewSongData(): Boolean {
    if (this.newSong.name.length < 1) {
      this.utilitiesService.showNotification(1, "Nombre de la cancion invalido.", 4000, () => { });
      return false;
    } else if (this.newSong.artist.length < 1) {
      this.utilitiesService.showNotification(1, "Nombre del artista invalido.", 4000, () => { });
      return false;
    } else if (this.newSong.tempo == 0) {
      this.utilitiesService.showNotification(1, "Timpo o BPM invalido.", 4000, () => { });
      return false;
    } else if (this.newSong.lyric.length < 1) {
      this.utilitiesService.showNotification(1, "Letra de la cancion invalida.", 4000, () => { });
      return false;
    } else if (this.selectedTag.length == 0) {
      this.utilitiesService.showNotification(1, "Seleccione un Tag.", 4000, () => { });
      return false;
    } else if (this.selectedBand.length == 0) {
      this.utilitiesService.showNotification(1, "Seleccione una banda.", 4000, () => { });
      return false;
    } else {
      return true;
    }
  }

  uploadImage(file: any, fileName: String) {
    return new Promise((resolve, reject) => {
      var newFileName = fileName + ".jpg";
      //console.log(newFileName);

      let reader = new FileReader;

      try {
        // TODO: Define type of 'e'
        reader.onload = (e: any) => {
          this.onChange.emit(file);

          const formData = new FormData();
          let image: Blob = new Blob([reader.result], {
            type: file.type
          });
          formData.append('files[]', image, newFileName);

          this.apiDataService.uploadImageSong(formData).then((result: ServerMessage) => {
            //this.utilitiesService.showNotification(result.error ? 1 : 0, result.message, 5000, () => { });
            //this.utilitiesService.closeLoadingSuccess("Imagen subida", "Imagen de la banda " + this.newBand.name + " subida", () => {
            resolve(result);
            //});
          }, (error) => {
            this.utilitiesService.showNotification(0, "A ocurrido un error subiendo " + fileName, 5000, () => { });
            //this.utilitiesService.closeLoadingMsg();
            reject(error);
          });
        };
        // This will process our file and get it's attributes/data
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.log("sin imagen seleccionada");

        resolve({ url: "" });
      }
    });
  }

  uploadSongImages(idSong: Number, imagesForUpload: { typeImage: Number, selectedFile: any, }[],
    imagesForDelete: { typeImage: Number }[]) {
    return new Promise(async (resolve, reject) => {

      //console.log(imagesForUpload);
      //Se suben las imagenes y con cada una se marca como true en la cancion si esta fue subida con exito
      //Loading de carga
      let cont = 1;
      this.utilitiesService.showLoadingMsg("Editando imagenes", "Editando " + (imagesForUpload.length + imagesForDelete.length) + " imagenes", () => {
        this.utilitiesService.loadingTitleMsg = "Subiendo Imagenes";
        imagesForUpload.forEach(async (elementForUpload) => {
          this.utilitiesService.loadingMessageMsg = "Subiendo la imagen " + cont + " de " + imagesForUpload.length;
          let fileName: String = "";
          if (elementForUpload.typeImage == 0) {
            fileName = idSong + "-guitar-chords";
          } else if (elementForUpload.typeImage == 1) {
            fileName = idSong + "-bass-chords";
          } else if (elementForUpload.typeImage == 2) {
            fileName = idSong + "-piano-chords";
          } else if (elementForUpload.typeImage == 3) {
            fileName = idSong + "-guitar-tabs";
          } else if (elementForUpload.typeImage == 4) {
            fileName = idSong + "-bass-tabs";
          } else if (elementForUpload.typeImage == 5) {
            fileName = idSong + "-piano-tabs";
          }
          let resultUpload: any = await this.uploadImage(elementForUpload.selectedFile, fileName);
          //console.log(resultUpload);
          if (resultUpload.error == false) {
            //Cosas por hacer en caso de que la subida sea un exito
            cont++;
          } else {
            this.utilitiesService.closeLoadingMsg();
            reject();
          }
        });
        cont = 1;

        //Borrando las imagenes eliminadas desdela interfaz
        imagesForDelete.forEach(async (elementFoDelete) => {
          this.utilitiesService.loadingMessageMsg = "Borrando la imagen " + cont + " de " + imagesForDelete.length;
          let fileName: String = "";
          if (elementFoDelete.typeImage == 0) {
            fileName = "guitar-chords";
          } else if (elementFoDelete.typeImage == 1) {
            fileName = "bass-chords";
          } else if (elementFoDelete.typeImage == 2) {
            fileName = "piano-chords";
          } else if (elementFoDelete.typeImage == 3) {
            fileName = "guitar-tabs";
          } else if (elementFoDelete.typeImage == 4) {
            fileName = "bass-tabs";
          } else if (elementFoDelete.typeImage == 5) {
            fileName = "piano-tabs";
          }
          let resultDelete: any = await this.apiDataService.deleteImageSong(idSong, fileName);
          //console.log(resultDelete);
          if (resultDelete.error != false) {
            this.utilitiesService.closeLoadingMsg();
            reject();
          } else {
            //Cosas por hacer en caso de que la borrada sea un exito
            cont++;
          }
        });

        this.utilitiesService.closeLoadingSuccess("Imagenes Editadas", "Nuevas partituras y tablas editadas con exito.", () => { });
        resolve();
      });
    });
  }

  loadSongBandList(idBand: number) {
    this.songBandList = [];
    this.apiDataService.getListSongsOfBand(idBand).then((response: ServerMessage) => {
      //console.log(response);
      if (response.error == false) {
        //this.utilitiesService.showNotification(0, response.message, 3000, () => { });
        //Cosas para hacer en caso que reciba la lista de canciones
        //console.log(response.data);
        this.songBandList = response.data;
        this.songFiltered = Array.from(this.songBandList);
      } else {
        this.utilitiesService.showNotification(1, response.message, 3000, () => { });
      }
    }).catch((error) => {
      console.log(error);
      this.utilitiesService.showNotification(1, "Error cargando la lista de canciones de la banda", 5000, () => { });
    });
  }

  addSongFronList(newSong: SongBand) {
    let songFinded = this.newList.songs.find((song) => {
      return song.idSong == newSong.idSong;
    });
    //Si la cancion es nueva se añade si no se avisa que ya la añadio
    if (songFinded == null || songFinded == undefined) {
      this.newList.songs.push({ idSong: newSong.idSong, name: newSong.name });
      //Se cierra el modal de nueva cancion
      this.closeNewSong.nativeElement.click();
    } else {
      this.utilitiesService.showNotification(1, "Cancion actualmente en el set", 4000, () => { });
    }
  }

  selectSongForDeleteInSet(idSongForDelete: Number) {
    //Se elimina de la lista de miembros
    this.idSongForDelete = idSongForDelete;
  }

  deleteSongFromSet() {
    //Se elimina de la lista de miembros
    let indexItemSong = this.newList.songs.findIndex((song) => {
      return song.idSong == this.idSongForDelete;
    })
    this.newList.songs.splice(indexItemSong, 1);
    this.closeDeleteModal.nativeElement.click();
  }

  filterSongByName(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);
    if (this.searchValue == "") {
      this.songFiltered = Array.from(this.songBandList);
    } else {
      this.songFiltered = this.songBandList.filter(function (song) {
        let fixed = song.name.charAt(0).toUpperCase() + song.name.slice(1);
        return fixed.toLowerCase().includes(ssearchValue);
      });
    }
  }

  saveNewSong() {
    if (this.validateNewSongData()) {
      //console.log("validado");
      this.newSong.idTag = this.selectedTag[0].idTag;
      this.newSong.idBand = this.selectedBand[0].idBand;
      let newDataSong: NewSong = JSON.parse(JSON.stringify(this.newSong));
      //console.log(newDataSong);
      //console.log(this.newSong);
      //Se hace la logica que decide si se subiran , borraran o no se hace nada con la imagen
      let imagesForUpload: { typeImage: Number, selectedFile: any, }[] = [];
      let imagesForDelete: { typeImage: Number }[] = [];
      //Chequeo de lo que el usuario hizo en la interfaz para decidir si se borra , sube o se deja igual la imagen
      //ACORDES GUITARRA
      if (this.sourceChordsGuitar.length == 0 && newDataSong.chordsGuitar == false && newDataSong.chordsGuitarBlob != undefined) {
        //console.log("imagen de acordes de la guitarra borrada");
        imagesForDelete.push({ typeImage: 0 });
        newDataSong.chordsGuitar = false;
      } else if (this.sourceChordsGuitar.length > 0) {
        //console.log("nueva imagen de acordes de la guitarra");
        //Se añade el tipo y la imagen que se subira por ejemplo 0 para guitarra
        imagesForUpload.push({ typeImage: 0, selectedFile: this.selectedFileChordsGuitar });
        newDataSong.chordsGuitar = true;
      } else {
        //console.log("sin cambios en imagen de acordes de la guitarra");
      }
      //ACORDES BAJO
      if (this.sourceChordsBass.length == 0 && newDataSong.chordsBass == false && newDataSong.chordsBassBlob != undefined) {
        //console.log("imagen de acordes del bajo borrada");
        imagesForDelete.push({ typeImage: 1 });
        newDataSong.chordsBass = false;
      } else if (this.sourceChordsBass.length > 0) {
        //console.log("nueva imagen de acordes del bajo");
        //Se añade el tipo y la imagen que se subira por ejemplo 0 para guitarra
        imagesForUpload.push({ typeImage: 1, selectedFile: this.selectedFileChordsBass });
        newDataSong.chordsBass = true;
      } else {
        //console.log("sin cambios en imagen de acordes del bajo");
      }
      //ACORDES PIANO
      if (this.sourceChordsPiano.length == 0 && newDataSong.chordsPiano == false && newDataSong.chordsPianoBlob != undefined) {
        //console.log("imagen de acordes del piano borrada");
        imagesForDelete.push({ typeImage: 2 });
        newDataSong.chordsPiano = false;
      } else if (this.sourceChordsPiano.length > 0) {
        //console.log("nueva imagen de acordes del piano");
        //Se añade el tipo y la imagen que se subira por ejemplo 0 para guitarra
        imagesForUpload.push({ typeImage: 2, selectedFile: this.selectedFileChordsPiano });
        newDataSong.chordsPiano = true;
      } else {
        //console.log("sin cambios en imagen de acordes del piano");
      }
      //PARTITURAS GUITARRA
      if (this.sourceTabGuitar.length == 0 && newDataSong.tabGuitar == false && newDataSong.tabGuitarBlob != undefined) {
        //console.log("imagen de partituras de la guitarra borrada");
        imagesForDelete.push({ typeImage: 3 });
        newDataSong.tabGuitar = false;
      } else if (this.sourceTabGuitar.length > 0) {
        //console.log("nueva imagen de partituras de la guitarra");
        //Se añade el tipo y la imagen que se subira por ejemplo 0 para guitarra
        imagesForUpload.push({ typeImage: 3, selectedFile: this.selectedFileTabGuitar });
        newDataSong.tabGuitar = true;
      } else {
        //console.log("sin cambios en imagen de partituras de la guitarra");
      }
      //PARTITURAS BAJO
      if (this.sourceTabBass.length == 0 && newDataSong.tabBass == false && newDataSong.tabBassBlob != undefined) {
        //console.log("imagen de partituras del bajo borrada");
        imagesForDelete.push({ typeImage: 4 });
        newDataSong.tabBass = false;
      } else if (this.sourceTabBass.length > 0) {
        //console.log("nueva imagen de partituras del bajo");
        //Se añade el tipo y la imagen que se subira por ejemplo 0 para guitarra
        imagesForUpload.push({ typeImage: 4, selectedFile: this.selectedFileTabBass });
        newDataSong.tabBass = true;
      } else {
        //console.log("sin cambios en imagen de partituras del bajo");
      }
      //PARTITURAS PIANO
      if (this.sourceTabPiano.length == 0 && newDataSong.tabPiano == false && newDataSong.tabPianoBlob != undefined) {
        //console.log("imagen de partituras del piano borrada");
        imagesForDelete.push({ typeImage: 5 });
        newDataSong.tabPiano = false;
      } else if (this.sourceTabPiano.length > 0) {
        //console.log("nueva imagen de partituras del piano");
        //Se añade el tipo y la imagen que se subira por ejemplo 0 para guitarra
        imagesForUpload.push({ typeImage: 5, selectedFile: this.selectedFileTabPiano });
        newDataSong.tabPiano = true;
      } else {
        //console.log("sin cambios en imagen de partituras del piano");
      }

      //Se guardan los nuevos datos segun si es nuevo o se esta actualizando la cancion
      if (this.isNewSong == true) {
        this.utilitiesService.showLoadingMsg("Creando nueva Cancion", "Guardando informacion.", () => {
          this.apiDataService.createSong(newDataSong).then((response: ServerMessage) => {
            //console.log(response);
            if (response.error == true) {
              this.utilitiesService.showNotification(1, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingMsg();
              //Cosas para hacer en caso de que se suba mal
              //reject(response);
            } else {
              this.utilitiesService.showNotification(0, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingSuccess("Nueva Cancion Guardada", "Informacion de la cancion " + newDataSong.name + " guardada.", () => {
                //Cosas para hacer en caso de que se suba correctamente
                //Se le pasa un arreglo vacio porque ya se sabe que no se van a borrar imagenes solo a crear
                this.uploadSongImages(response.data.idSong, imagesForUpload, [] /* imagesForDelete */).then(() => {
                  //console.log("imagenes subidas y borradas");
                  this.newList.songs.push({ idSong: response.data.idSong, name: response.data.name });
                  this.initNewSong();
                  this.closeNewSong.nativeElement.click();
                }).catch(() => {
                  this.utilitiesService.showNotification(1, "A ocurrido un error subiendo las imagenes", 3000, () => { });
                });
              });
            }
          }).catch((error) => {
            console.log(error);
            this.utilitiesService.showNotification(1, "Error creando la cancion", 5000, () => { });
            this.utilitiesService.closeLoadingMsg();
          });
        });
      } else {
        //console.log("editando");
        //console.log(newDataSong);
        //console.log(imagesForDelete)
        this.utilitiesService.showLoadingMsg("Editando Cancion", "Guardando informacion.", () => {
          this.apiDataService.updateSong(newDataSong).then((response: ServerMessage) => {
            //console.log(response);
            if (response.error == true) {
              //Cosas para hacer en caso de que se suba mal
              this.utilitiesService.showNotification(1, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingMsg();
            } else {
              this.utilitiesService.showNotification(0, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingSuccess("Cancion Actualizad", "Informacion de la cancion " + newDataSong.name + " guardada.", () => {
                //Cosas para hacer en caso de que se suba correctamente
                this.uploadSongImages(response.data.idSong, imagesForUpload, imagesForDelete).then(() => {
                  //console.log("imagenes subidas y borradas");
                  //this.newList.songs.push({ idSong: response.data.idSong, name: response.data.name });
                  let indexItemSong = this.newList.songs.findIndex((song) => {
                    return song.idSong == response.data.idSong
                  });
                  //Se actualiza e elemento en la lista
                  this.newList.songs[indexItemSong].name = response.data.name;
                  this.initNewSong();
                  this.closeEditSong.nativeElement.click();
                }).catch(() => {
                  this.utilitiesService.showNotification(1, "A ocurrido un error subiendo las imagenes", 3000, () => { });
                });
              });
            }
          }).catch((error) => {
            console.log(error);
            this.utilitiesService.showNotification(1, "Error editando la cancion", 5000, () => { });
            this.utilitiesService.closeLoadingMsg();
          });
        });
      }
    }
  }

  ////////////////////FUNCIONES PARA LA LISTA
  validateNewListData(): Boolean {
    if (this.newList.name.length < 1) {
      this.utilitiesService.showNotification(1, "Nombre de la lista invalido.", 4000, () => { });
      return false;
    } else if (this.newList.description.length < 1) {
      this.utilitiesService.showNotification(1, "Descripcion de la lista invalida", 4000, () => { });
      return false;
    } else if (this.newList.songs.length == 0) {
      this.utilitiesService.showNotification(1, "Seleccione por lo menos una cancion.", 4000, () => { });
      return false;
    } else if (this.selectedBand.length == 0) {
      this.utilitiesService.showNotification(1, "Seleccione una banda.", 4000, () => { });
      return false;
    } else {
      return true;
    }
  }

  uploadListImage(file: any, fileId: String) {
    return new Promise((resolve, reject) => {
      var newFileName = fileId + ".jpg";
      //console.log(newFileName);

      let reader = new FileReader;

      try {
        // TODO: Define type of 'e'
        reader.onload = (e: any) => {
          this.onChange.emit(file);

          const formData = new FormData();
          let image: Blob = new Blob([reader.result], {
            type: file.type
          });
          formData.append('files[]', image, newFileName);

          this.apiDataService.uploadImageList(formData).then((result: ServerMessage) => {
            //this.utilitiesService.showNotification(result.error ? 1 : 0, result.message, 5000, () => { });
            //this.utilitiesService.closeLoadingSuccess("Imagen subida", "Imagen de la banda " + this.newBand.name + " subida", () => {
            resolve(result);
            //});
          }, (error) => {
            this.utilitiesService.showNotification(0, "A ocurrido un error subiendo " + fileId, 5000, () => { });
            //this.utilitiesService.closeLoadingMsg();
            reject(error);
          });
        };
        // This will process our file and get it's attributes/data
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.log("sin imagen seleccionada");

        resolve({ url: "" });
      }
    });
  }

  saveNewList() {
    if (this.validateNewListData()) {
      //console.log("validado");
      /* this.newSong.idTag = this.selectedTag[0].idTag;
      this.newSong.idBand = this.selectedBand[0].idBand; */
      let newDataList: SetLed = JSON.parse(JSON.stringify(this.newList));
      let isDeleted = false;
      let isUploading = false;

      //Se calcula si la imagen se subira o no
      if (this.source.length == 0 && newDataList.haveImage == false && newDataList.imageBlob != undefined) {
        //console.log("imagen de la lista borrada");
        newDataList.haveImage = false;
        isDeleted = true;
      } else if (this.source.length > 0) {
        //console.log("nueva imagen para la lista");
        newDataList.haveImage = true;
        isUploading = true;
      } else {
        //console.log("sin cambios en imagen de la lista");
      }
      //console.log(newDataList);
      //Se guardan los nuevos datos segun si es nuevo o se esta actualizando la cancion
      if (this.isNewList == true) {
        this.utilitiesService.showLoadingMsg("Creando nueva Lista", "Guardando informacion.", () => {
          this.apiDataService.createList(newDataList).then((response: ServerMessage) => {
            //console.log(response);
            if (response.error == true) {
              //Cosas para hacer en caso de que se suba mal
              this.utilitiesService.showNotification(1, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingMsg();
            } else {
              //Cosas por hacer en caso de que se suba bien
              this.utilitiesService.showNotification(0, response.message, 3000, () => { });
              this.dataSessionService.navigateByUrl("/dashboard/led/my-lists");
              this.utilitiesService.closeLoadingSuccess("Nueva Lista Guardada", "Informacion de la lista " + newDataList.name + " guardada.", () => {
                //Cosas para hacer en caso de que se suba correctamente
                //console.log(response);
                this.dataSessionService.getSetsLed((message) => {
                  if (response.data.haveImage == true) {
                    this.uploadListImage(this.selectedFile, response.data.idSet).then(() => {
                      //console.log("imagenes subidas y borradas");
                      this.newList = new SetLed();
                      this.selectedBand = [];
                    }).catch(() => {
                      this.utilitiesService.showNotification(1, "A ocurrido un error subiendo las imagenes", 3000, () => { });
                    });
                  }
                  
                }, (messageError) => {
                  this.utilitiesService.showNotification(1, messageError, 3000, () => { });
                });
              });
            }
          }).catch((error) => {
            console.log(error);
            this.utilitiesService.showNotification(1, "Error creando la lista", 5000, () => { });
            this.utilitiesService.closeLoadingMsg();
          });
        });
      } else {
        //console.log("editando");
        //console.log(newDataList);
        //console.log(imagesForDelete)
        this.utilitiesService.showLoadingMsg("Editando Lista", "Guardando informacion.", () => {
          this.apiDataService.updateList(newDataList).then((response: ServerMessage) => {
            //console.log(response);
            if (response.error == true) {
              //Cosas para hacer en caso de que se suba mal
              this.utilitiesService.showNotification(1, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingMsg();
            } else {
              this.utilitiesService.showNotification(0, response.message, 3000, () => { });
              this.utilitiesService.closeLoadingSuccess("Lista Actualizada", "Informacion de la cancion " + response.data.name + " guardada.", () => {
                //Cosas para hacer en caso de que se suba correctamente
                //Si se subira una imagen hay que subirla al servidor de la siguiente manera
                if(isUploading == true){
                  this.uploadListImage( this.selectedFile , newDataList.idSet.toString() ).then(() => {
                    console.log("imagenes actualizadas");
                  }).catch(() => {
                    this.utilitiesService.showNotification(1, "A ocurrido un error subiendo las imagenes", 3000, () => { });
                  });
                }
                //Si la imagen se elimino hay que borrarla del servidor de la siguiente manera
                if(isDeleted == true){
                  this.apiDataService.deleteImageList(newDataList.idSet).then((response : ServerMessage) => {
                    if(response.error == false){
                      //console.log("imagenes borradas");
                    }else{
                      this.utilitiesService.showNotification(1, response.message, 3000, () => { });
                    }
                  }).catch(() => {
                    this.utilitiesService.showNotification(1, "A ocurrido un error subiendo las imagenes", 3000, () => { });
                  });
                }
                this.dataSessionService.getSetsLed((message) => {
                  //this.utilitiesService.showNotification(0, message, 3000, () => { });
                  //this.setsListFiltered = Array.from(this.dataSessionService.elementsLed.setsList);
                }, (messageError) => {
                  this.utilitiesService.showNotification(1, messageError, 3000, () => { });
                });
              });
            }
          }).catch((error) => {
            console.log(error);
            this.utilitiesService.showNotification(1, "Error editando la cancion", 5000, () => { });
            this.utilitiesService.closeLoadingMsg();
          }); 
        });
      }
    }
  }
}
