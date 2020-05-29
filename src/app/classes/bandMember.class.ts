import { SafeUrl } from '@angular/platform-browser';

export class BandMember {
    idMember: Number;
    role: Number;
    name: String;
    haveImage: Boolean;
    imageBlob: SafeUrl;
    idUser : Number;

    constructor() {
        this.idMember = 0;
        this.role = 0;
        this.name = "";
        this.haveImage = false;
        this.imageBlob = "";
        this.idUser = 0;
    }
}