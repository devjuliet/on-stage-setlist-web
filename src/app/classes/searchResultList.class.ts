import { SafeUrl } from "@angular/platform-browser";

export class SearchResultList {
    id: Number;
    name: String;
    haveImage: Boolean;
    description: String;
    role: -1;
    genres: ListGenres[];
    isBand: Boolean;
    imageBlob: SafeUrl;
    
    constructor(){
        this.id = 0;
        this.name = "";
        this.haveImage = false;
        this.description = "";
        this.role = -1;
        this.genres = [];
        this.isBand = false;
        this.imageBlob = "";
    }
}

class ListGenres {
    id: Number;
    name: String;
    constructor() {
        this.id = 0;
        this.name = "";
    }
}