import { SafeUrl } from "@angular/platform-browser";

export class SetLed{
    idSet: Number;
    name: string;
    description: string;
    haveImage: boolean;
    idBand: number;
    songs : Song[];
    imageBlob: SafeUrl;
    constructor(){
        this.idSet = 0;
        this.name = "";
        this.description = "";
        this.haveImage = false;
        this.idBand = 0;
        this.songs = [];
        this.imageBlob = "";
    }
}

class Song{
    idSong: Number;
    name: string;
    constructor(){
        this.idSong = 0;
        this.name = "";
    }
}