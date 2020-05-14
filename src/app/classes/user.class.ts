export class User{
    idusuarios : number;
    usuario : string;
    nombre : string;
    apellidos : string;
    password : string;
    entidad : string;
    extension : string;
    rolusuario : number;
    alreadyLoged : Boolean;
    token : string;

    constructor(){
        this.idusuarios = 0;
        this.usuario = "";
        this.nombre = "";
        this.apellidos = "";
        this.password = "";
        this.entidad = "";
        this.extension = "";
        this.rolusuario = 0;
        this.alreadyLoged = false;
        this.token = "";
    }
  }