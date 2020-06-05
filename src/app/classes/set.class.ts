import { SafeUrl } from "@angular/platform-browser";

export class Set {
    idSet: Number;
    name: String;
    haveImage: boolean;
    description : string;
    imageBlob: SafeUrl;

    constructor() {
        this.idSet = 0;
        this.name = "";
        this.haveImage = false;
        this.description = "";
        this.imageBlob = "";
    }
}
