import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../../services/api-data/api-data.service';
import { ServerMessage } from './../../classes/serverMessages.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  username : string;
  password : string;

  constructor(
    public apiDataService : ApiDataService,
    private route: Router,
  ){
    this.username = "";
    this.password = "";
  }

  ngOnInit(){
    this.apiDataService.checkLogin((success)=>{
      //this.apiDataService.showNotification(0,success.message,6000);
      /* console.log(success) */
      switch(this.apiDataService.user.rolusuario){
        case 0:
          this.route.navigateByUrl('/admin-dashboard')
          break;
        case 1:
          this.route.navigateByUrl('/validations')
          break;
        case 2: //Usuario que registra los programas
          this.route.navigateByUrl('/register-program');
          break;
        case 3:
          this.route.navigateByUrl('/validations')
          break;
      }
    },(error)=>{
      /* console.log("error") */
      /* console.log(error); */
      
      //this.apiDataService.showNotification(1,error.message,6000);
    });
  }

  validador(){
    if(this.password == "" && this.username == "" || this.password.length < 8 && this.username.length < 8){
      console.log("Usuario y/ó contraseña invalido")
    }else if(this.username == "" || this.username.length < 8){
      console.log("Usuario invalido");
    }else if(this.password == "" || this.password.length < 8){
      console.log("Contraseña invalida");
    }else{
      console.log("Validaciones completas");
    }

  }

}
