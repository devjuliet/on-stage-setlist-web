import { Genre } from "./genre.class";

export class ElementsManager{
    upcomingEvents : [];

    genresCatalog : Genre[];
    constructor(){
        this.upcomingEvents = [];
        this.genresCatalog = [];
    }
  }