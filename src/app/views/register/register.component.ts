import { Component, OnInit } from '@angular/core';
import { DataSessionService } from '../../services/dataSession/data-session.service';
import { LogedResponse } from '../../classes/logedResponse.class';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { ApiDataService } from '../../services/api-data/api-data.service';
import { ServerMessage } from '../../classes/serverMessages.dto';

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
      //console.log(logedResponse);
      if (this.dataSessionService.user.type != 0 && this.dataSessionService.user.type != 1 && this.dataSessionService.user.type != 2) {
        this.dataSessionService.logOut();
        this.utilitiesService.showNotification(1, "Usuario desconocido.", 4000, () => { });
      } else if (this.dataSessionService.user.type == 1 ) {
        this.dataSessionService.navigateByUrl("/dashboard/manager");
        this.dataSessionService.getBandsManager((response) => {
          //console.log(this.elementsManager.bands);
        }, (err) => {
          console.log(err);
          this.utilitiesService.showNotification(1, "A ocurrido un erro cargando las bandas.", 4000, () => { });
        });
      } else if (this.dataSessionService.user.type == 2 || this.dataSessionService.user.type == 0) {
        this.dataSessionService.navigateByUrl("/dashboard/led");
      }else{
        //Cosas para hacer en la vista

      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);

    });
  }

  clearData() {
    this.name = "";
    this.email = "";
    this.password = "";
    this.confirmPass = "";
    this.type = 1;
    this.username = "";
    this.isManager = false;
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
          //console.log(response);
          
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
