export class Repertorie {
    idSetlist: number;
    name: string;
    event: Event;
    band: Band;
    tag: Tag;
    idLiveDesigner: number;
    sets: Set[];

    constructor() {
        this.idSetlist = 0;
        this.name = "";
        this.event = new Event();
        this.band = new Band();
        this.tag = new Tag();
        this.idLiveDesigner = 0;
        this.sets = [];
    }
}

class Band {
    idBand: number;
    name: string;

    constructor() {
        this.idBand = 0;
        this.name = "";
    }
}

class Event {
    idLiveEvent: number;
    name: string;
    location: string;
    tour: string;
    date: Date;
    place: string;

    constructor() {
        this.idLiveEvent = 0;
        this.name = "";
        this.location = "";
        this.tour = "";
        this.date = new Date();
        this.place = "";
    }
}

class Set {
    idSet: number;
    name: string;

    constructor() {
        this.idSet = 0;
        this.name = "";
    }
}

class Tag {
    idTag: number;
    name: string;

    constructor() {

    }
}

