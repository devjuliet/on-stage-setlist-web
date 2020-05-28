import { SafeUrl } from '@angular/platform-browser';
import { BandMember } from './bandMember.class';
import { Genre } from './genre.class';
import { Set } from './set.class';

export class Band {
    idBand: Number;
    name: String;
    urlLogo: String;
    description: String;
    idUserManager: Number;
    genres : Genre[];
    bandMembers: BandMember[];
    bandLiveDesigners : Number[];
    sets : Set[];
    imageBlob: SafeUrl;

    constructor() {
        this.idBand = 0;
        this.name = "";
        this.urlLogo = "";
        this.description = "";
        this.idUserManager = 0;
        this.genres = [];
        this.bandMembers = [];
        this.bandLiveDesigners = [];
        this.sets = [];
        this.imageBlob = "";
    }
}




