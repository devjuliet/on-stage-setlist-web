import { Genre } from "./genre.class";
import { Band } from "./band.class";
import { ActualEvent } from "./actualEvent.class";
import { SafeUrl } from '@angular/platform-browser';

export class ElementsManager{
    
    genresCatalog : Genre[];
    bands : Band[];
    upcomingEvents : ActualEvent[];
    songsCatalog : SongsBandCatalog[];

    constructor(){
        this.upcomingEvents = [];
        this.genresCatalog = [];
        this.bands = [];
        this.songsCatalog = [];
    }
  }

class SongsBandCatalog{
    idBand : number;
    name : string;
    urlLogo : string;
    songs : Song[];
    imageBlob : SafeUrl;

    constructor(){
        this.idBand = 0;
        this.name = "";
        this.urlLogo = "";
        this.songs = [];
        this.imageBlob = "";
    }
  }

export class Song{
    idSong : number;
    name: string;
    artist : string;
    lyric: string;
    chordsGuitar : boolean;
    tabGuitar : boolean;
    chordsBass : boolean;
    tabBass : boolean;
    chordsPiano : boolean;
    tabPiano : boolean;
    tempo : number;
    idBand :number;
    idTag : number;
    constructor(){
        this.idSong = 0;
        this.name = "";
        this.artist = "";
        this.lyric = "";
        this.chordsGuitar = false;
        this.tabGuitar = false;
        this.chordsBass = false;
        this.tabBass = false;
        this.chordsPiano = false;
        this.tabPiano = false;
        this.tempo = 0;
        this.idBand = 0;
        this.idTag = 0 ;
    }
  }