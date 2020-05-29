import { SafeUrl } from "@angular/platform-browser";

export class Set {
    idSet: Number;
    name: String;
    urlImage : string;
    description : string;
    imageBlob: SafeUrl;

    constructor() {
        this.idSet = 0;
        this.name = "";
        this.urlImage = "";
        this.description = "";
        this.imageBlob = "";
    }
}
