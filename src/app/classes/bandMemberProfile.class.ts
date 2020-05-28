import { SafeUrl } from '@angular/platform-browser';

export class BandMemberProfile {
    idUser: Number;
    name: String;
    type: Number;
    role: Number;
    description: String;
    haveImage: Boolean;
    userHistories: [];

    imageBlob: SafeUrl;

    constructor() {
        this.idUser = 0;
        this.name = "";
        this.type = 0;
        this.role = 0;
        this.description = "";
        this.haveImage = false;
        this.userHistories = [];

        this.imageBlob = "";
    }
}

class UserHistories {
    bandName: String;
    description: String;
    date: Date;

    constructor() {
        this.bandName = "";
        this.description = "";
        this.date = new Date();
    }
}