import { SafeUrl } from "@angular/platform-browser";

export class NewSong{
    idSong: number;
    name: string;//
    artist: string;//
    lyric: string;
    chordsGuitar: boolean;
    chordsGuitarBlob: SafeUrl;
    tabGuitar: boolean;
    tabGuitarBlob: SafeUrl;
    chordsBass: boolean;
    chordsBassBlob: SafeUrl;
    tabBass: boolean;
    tabBassBlob: SafeUrl;
    chordsPiano: boolean;
    chordsPianoBlob: SafeUrl;
    tabPiano: boolean;
    tabPianoBlob: SafeUrl;
    tempo: number;//
    idBand: number;
    idTag: number;
    nameTag: string;

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
        this.idTag = 0;
        this.nameTag = "";
        //imagenes
        this.chordsGuitarBlob = "";
        this.tabGuitarBlob = "";
        this.chordsBassBlob = "";
        this.tabBassBlob = "";
        this.chordsPianoBlob = "";
        this.tabPianoBlob = "";
    }
}