import { Genre } from "./genre.class";
import { Band } from "./band.class";
import { ActualEvent } from "./actualEvent.class";

export class ElementsManager{
    
    genresCatalog : Genre[];
    bands : Band[];
    upcomingEvents : ActualEvent[];

    constructor(){
        this.upcomingEvents = [];
        this.genresCatalog = [];
        this.bands = [];
    }
  }