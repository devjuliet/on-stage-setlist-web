import { BandLed } from "./bandLed.class";
import { SetLed } from "./setLed.class";
import { Repertorie } from "./repertorieLed.class";

export class ElementsLed{
    bands : BandLed[];
    setsList: SetLed[];
    repertories : Repertorie[];

    constructor(){
        this.bands = [];
        this.setsList = [];
        this.repertories = [];
    }

    itemsForSidebar(){
        return Array.from(this.setsList)
    }
  }