import { SafeUrl } from '@angular/platform-browser';

export class BandMember {
    idMember: Number;
    role: Number;
    haveImage: Boolean;
    imageBlob: SafeUrl;

    constructor() {
        this.idMember = 0;
        this.role = 0;
        this.haveImage = false;
        this.imageBlob = "";
    }
}