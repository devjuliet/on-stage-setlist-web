import { Component, OnInit } from '@angular/core';
import { DataSessionService } from 'src/app/services/dataSession/data-session.service';
import { LogedResponse } from 'src/app/classes/logedResponse.class';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { ApiDataService } from 'src/app/services/api-data/api-data.service';
import { ServerMessage } from 'src/app/classes/serverMessages.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  email: String;
  password: String;
  confirmPass: String;
  type: Number;
  username: String;

  isManager: Boolean;

  constructor(public dataSessionService: DataSessionService, private apiDataService: ApiDataService, private utilitiesService: UtilitiesService) {}
  
  ngOnInit(): void {
    this.clearData();
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      console.log(logedResponse);
      //TO DO - Falta añadir la logica que redirecciona a la ruta y con la data cargada internamente y 
      //        mandar al dashboard correspondiente
      
    }, (noLoginResponse: LogedResponse) => {
      console.log(noLoginResponse);
    });
  }

  clearData() {
    this.name = "";
    this.email = "";
    this.password = "";
    this.confirmPass = "";
    this.type = 1;
    this.username = "";
    this.isManager = true;
  }

  validateRegisterData(): Boolean {
    if (this.username.length < 8) {
      this.utilitiesService.showNotification(1, "Nombre de usuario debe ser mayor de 8 caracteres.", 4000, () => { });
      return false;
    } else if (this.name == "") {
      this.utilitiesService.showNotification(1, "Nombre no valido.", 4000, () => { });
      return false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email.toString())) { //Validacion del correo
      this.utilitiesService.showNotification(1, "Correo electronico no valido.", 4000, () => { });
      return false;
    } else if (this.password.length < 8) {
      this.utilitiesService.showNotification(1, "Contraseña debe ser mayor de 8 caracteres.", 4000, () => { });
      return false;
    } else if (this.password != this.confirmPass) {
      this.utilitiesService.showNotification(1, "Por favor confirma su contraseña.", 4000, () => { });
      return false;
    } else {
      return true;
    }
  }

  registerUser() {
    if (this.validateRegisterData()) {
      //Se setea el typo de perfil que se esta registrando
      this.type = this.isManager ? 1 : 2;
      this.apiDataService.registerUser(this.name, this.email, this.password, this.type, this.username).then((response: ServerMessage) => {
        if (response.error) {
          this.utilitiesService.showNotification(1, response.message, 4000, () => { });
        } else {
          this.clearData();
          this.utilitiesService.showNotification(0, response.message, 3000, () => {
            this.dataSessionService.navigateByUrl("/login");
          });
        }
      }, (error) => {
        console.log(error);
      });

    }
  }
}
