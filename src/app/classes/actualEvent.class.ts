export class ActualEvent {
    idLiveEvent: Number;
    name: String;
    location: String;
    tour: String;
    date: Date;
    place: string;
    idTag: number;
    idBand: number;

    nameBand : string;
    nameTag : string;

    constructor() {
        this.idBand = 0;
        this.name = "";
        this.location = "";
        this.tour = "";
        this.date = new Date();
        this.place = "";
        this.idTag = 0;
        this.idBand = 0;
        this.nameBand = "";
        this.nameTag = "";
    }
}