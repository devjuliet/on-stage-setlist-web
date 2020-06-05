import { BandLed } from "./bandLed.class";
import { SetLed } from "./setLed.class";

export class ElementsLed{
    bands : BandLed[];
    setsList: SetLed[];
    constructor(){
        this.bands = [];
        this.setsList = [];
    }

    itemsForSidebar(){
        return Array.from(this.setsList)
    }
  }