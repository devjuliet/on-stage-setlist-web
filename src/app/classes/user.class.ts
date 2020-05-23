export class User{
    idUser : Number;
    name : String;
    email : String;
    password : String;
    type : Number;
    username : String;

    constructor(){
        this.idUser = 0;
        this.name = "";
        this.email = "";
        this.password = "";
        this.username = "";
        this.type = 1;//si es 1 es manager
    }
  }