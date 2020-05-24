import { SafeUrl } from '@angular/platform-browser';

export class User{
    idUser : Number;
    name : String;
    email : String;
    password : String;
    type : Number;
    username : String;
    haveImage: Boolean;
    imageBlob : SafeUrl;

    constructor(){
        this.idUser = 0;
        this.name = "";
        this.email = "";
        this.password = "";
        this.username = "";
        this.type = 0;//si es 1 es manager
        this.haveImage = false;
        this.imageBlob = "";
    }
  }