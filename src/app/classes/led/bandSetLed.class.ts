import { SafeUrl } from "@angular/platform-browser";

export class BandSetLed {
    idSet: number;
    name: string;
    haveImage: boolean;
    numberSongs: number;
    imageBlob : SafeUrl;
    selected : boolean;

    constructor() {
        this.idSet = 0;
        this.name = "";
        this.haveImage = false;
        this.numberSongs = 0;
        this.imageBlob = "";
        this.selected = false;
    }
}