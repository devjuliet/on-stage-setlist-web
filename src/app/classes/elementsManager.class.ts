import { Genre } from "./genre.class";
import { Band } from "./band.class";

export class ElementsManager{
    upcomingEvents : [];

    genresCatalog : Genre[];
    bands : [];

    constructor(){
        this.upcomingEvents = [];
        this.genresCatalog = [];
        this.bands = [];
    }
  }