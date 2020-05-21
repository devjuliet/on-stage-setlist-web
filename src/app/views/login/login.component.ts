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
    /* this.apiDataService.checkLogin( (success)=>{
      //this.apiDataService.showNotification(0,success.message,6000);
      //console.log(success)
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
      console.log("error")
      console.log(error);
      
      //this.apiDataService.showNotification(1,error.message,6000);
    }); */
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
  
  login(){
    /* if(this.password == "" && this.username == ""){
      this.apiDataService.showNotification(1,"Usuario y/ó contraseña invalidos",6000);
    }else if(this.username == ""){
      this.apiDataService.showNotification(1,"Usuario invalido",6000);
    }else if(this.password == ""){
      this.apiDataService.showNotification(1,"Contraseña invalida",6000);
    }else{
      this.apiDataService.doLogin(this.username,this.password).subscribe((result : ServerMessage)=>{
        if(result.error){
          // en caso de que en el servidor NO haga el login
          this.apiDataService.showNotification(1,result.message,6000);
        }else{
          // en caso de que en el servidor SI haga el login
          this.apiDataService.showNotification(0,result.message,6000);
          console.log(result)
          this.apiDataService.user = result.data.user;
          this.apiDataService.user.password = this.password;
          this.apiDataService.token = result.data.token;
          this.apiDataService.user.token = result.data.token;

          console.log(this.apiDataService.user);
          
          this.apiDataService.awaitTime(2000,()=>{
            localStorage.setItem('user', JSON.stringify(this.apiDataService.user));
            switch(result.data.user.rolusuario){
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
          })
        }
      },(error)=>{
        console.log("error")
        console.log(error);
        this.apiDataService.showNotification(1,"Ups algo salio mal!",6000);
      });
    } */
  }

}
