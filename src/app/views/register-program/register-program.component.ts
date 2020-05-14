import { Component, OnInit } from '@angular/core';

import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ApiDataService } from '../../services/api-data/api-data.service';
import { ServerMessage } from '../../classes/serverMessages.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-program',
  templateUrl: './register-program.component.html',
  styleUrls: ['./register-program.component.css']
})
export class RegisterProgramComponent implements OnInit {
  show : boolean = false;
  errorSave : boolean = false;
  succeesSave : boolean = false;
  showModal : boolean = false;

  pregunta1 = {
    //RESPUESTASP1 - Estas son las respuestas de la pregunta 1
    sujetoninasninos : false,
    sujetoadolescentes: false,
    sujetojovenes: false,
    sujetomujeres: false,
    sujetomayores60: false,
    sujetodiscapacidad: false,
    sujetoindigenas: false,
    sujetojornaleras: false,
    sujetomigrantes: false,
    sujetoadultas30a59: false,
    sujetofamilias: false,
    sujetosociedadcivil: false,
    sujetootro: false,
    sujetoOtroText: '', //RESPUESTAS - Este es el complemento de la pregunta 1
  };

  pregunta2 = {
    value : 'no', //RESPUESTAS - Esta es la pregunta2
    derechos : [ // respuestasp2complemento
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false
    ]
  };

  pregunta3 = {
    value : 'no', //RESPUESTAS - Esta es la pregunta3
    complemento : "" //RESPUESTAS - Esta es la pregunta3complemento
  };

  pregunta4 = {
    value : 'entregaayudas', //RESPUESTAS - Esta es la pregunta4
    complemento : "" //RESPUESTAS - Esta es la pregunta4complemento
  };

  pregunta5 = {
    value : 'no', //RESPUESTAS - Esta es la pregunta5
    complemento : 0 //RESPUESTAS - Esta es la pregunta5complemento
  };

  pregunta6 = "directamente";

  pregunta7 = "unico";

  pregunta8 = {
    value : 'no', //RESPUESTAS - Esta es la pregunta8
    complemento : 0 //RESPUESTAS - Esta es la pregunta8complemento
  };

  pregunta9 = "federal";

  pregunta10 = {
    value : 'educacionobligatoria', //RESPUESTAS - Esta es la pregunta10
    complemento : '' //RESPUESTAS - Esta es la pregunta10complemento
  };

  pregunta11 = {
    value : 'no', //RESPUESTAS - Esta es la pregunta11
    complemento : '' //RESPUESTAS - Esta es la pregunta11complemento
  };

  pregunta12 = {
    value : 'no', //RESPUESTAS - Esta es la pregunta12
    complemento : '' //RESPUESTAS - Esta es la pregunta12complemento
  };

  dependencia = "";

  programapresupuestal = 0;


  constructor(@Inject(DOCUMENT) private dom, public apiDataService : ApiDataService, private route: Router,) {
    this.createNewHeadLink('stylesheet','https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/animate.min.css');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/bootstrap.min.css');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/menu.css');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/style.css');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/responsive.css');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/icon_fonts/css/all_icons_min.css');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/skins/square/grey.css');
    this.createNewHeadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js');
    this.createNewHeadScript('https://code.jquery.com/ui/1.12.1/jquery-ui.js');
    this.createNewHeadScript('https://code.jquery.com/jquery-1.12.4.min.js');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/color_3.css');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/date_time_picker.css');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/custom.css');
    /* this.createNewHeadScript('assets/cuestionary-files/js/functions.js'); */
    this.createNewHeadScript('assets/cuestionary-files/js/prueba.js');
    
    this.createNewBodyScript('assets/cuestionary-files/js/jquery-3.2.1.min.js');
    this.createNewBodyScript('assets/cuestionary-files/js/common_scripts.js');
    
    this.createNewBodyScript('assets/cuestionary-files/js/velocity.min.js');
    this.createNewBodyScript('assets/cuestionary-files/js/main.js');
    /* this.createNewBodyScript('assets/cuestionary-files/js/functions.js'); */
  }

  async ngOnInit() {
    this.show = false;
    this.apiDataService.checkLogin(async (success)=>{
      /* console.log(success); */
      switch(this.apiDataService.user.rolusuario){
        case 0:
          //this.route.navigateByUrl('/register-program');
          await this.loadData();
          break;
        case 1:
          this.route.navigateByUrl('/validations')
          break;
        case 2: //Usuario que registra los programas
        await this.loadData();
          break;
        case 3:
          this.route.navigateByUrl('/validations')
          break;
      }
    },(error)=>{
      console.log("error")
      console.log(error);
      
      this.route.navigateByUrl('/')
    })
  }

  async loadData(){
    await this.apiDataService.getCatprograms((this.apiDataService.user.entidad=="") ? "105" : this.apiDataService.user.entidad);
    await this.apiDataService.awaitTime(2200,async ()=>{
      await this.initData();
      this.show = true;
      //ESTE SCRIPT PROVOCA ERRORES EN LOS COMPONENTES DE ANGULAR COMO BIDING O DIRECTIVAS
      /* this.createNewBodyScript('assets/cuestionary-files/js/functions.js'); */ 
      this.createNewBodyScript('assets/cuestionary-files/js/questionare_wizard_func.js');
    });
  }

  
  saveData(){
    this.showModal = true;
    let data: any = {};
    data.pregunta1 = this.pregunta1;
    data.pregunta2 = this.pregunta2;
    data.pregunta3 = this.pregunta3;
    data.pregunta4 = this.pregunta4;
    data.pregunta5 = this.pregunta5;
    data.pregunta6 = this.pregunta6;
    data.pregunta7 = this.pregunta7;
    data.pregunta8 = this.pregunta8;
    data.pregunta9 = this.pregunta9;
    data.pregunta10 = this.pregunta10;
    data.pregunta11 = this.pregunta11;
    data.pregunta12 = this.pregunta12;
    data.dependencia = this.dependencia;
    data.programapresupuestal = this.programapresupuestal;
    data.usuario = this.apiDataService.user.idusuarios;
    data.estatus = 0;
    console.log("data enviada");
    console.log(data);
    this.apiDataService.saveRespuestas(data).then((response : ServerMessage)=>{
      console.log("simonki");
      console.log(response);
      this.apiDataService.awaitTime(2000,()=>{
        this.succeesSave = true;
        this.apiDataService.user.alreadyLoged = true;
        this.apiDataService.user.token = this.apiDataService.token.toString();
        localStorage.setItem('user',JSON.stringify(this.apiDataService.user) );
        this.apiDataService.awaitTime(3000,()=>{
          console.log("navegando");
          const currentRoute = this.route.url;

          this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.route.navigate([currentRoute]); // navigate to same route
          });

        });
      });
    }).catch((error:ServerMessage)=>{
      console.log("error");
      console.log(error);
      this.apiDataService.awaitTime(2000,()=>{
        this.errorSave = true;
      });
    })
  }

  createNewHeadLink( rel , href){
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', rel); //Para ojas de estilo
    this.dom.head.appendChild(link);
    link.setAttribute('href', href);
  }

  createNewHeadScript(src){
    const script: HTMLLinkElement = this.dom.createElement('script');
    this.dom.head.appendChild(script);
    script.setAttribute('src', src);
  }

  createNewBodyScript(src){
    const script: HTMLLinkElement = this.dom.createElement('script');
    this.dom.body.appendChild(script);
    script.setAttribute('src', src);
  }
  
  selectEventP5(e){
    this.pregunta5.complemento = e.target.value;
  }

  selectEventP8(e){
    this.pregunta8.complemento = e.target.value;
  }

  selectEventProgram(e){
    this.programapresupuestal = e.target.value;
  }

  clearDataPregunta2(){
    this.pregunta2.derechos = [
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false
    ];
  }

  async initData(){
    if(this.apiDataService.catPrograms[0]){
      this.programapresupuestal = this.apiDataService.catPrograms[0].idprograma;
    }else{
      this.programapresupuestal = 0;
    }
    
    this.pregunta1 = {
      sujetoninasninos : false,
      sujetoadolescentes: false,
      sujetojovenes: false,
      sujetomujeres: false,
      sujetomayores60: false,
      sujetodiscapacidad: false,
      sujetoindigenas: false,
      sujetojornaleras: false,
      sujetomigrantes: false,
      sujetoadultas30a59: false,
      sujetofamilias: false,
      sujetosociedadcivil: false,
      sujetootro: false,
      sujetoOtroText: ""
    };

    this.clearDataPregunta2();
    this.pregunta3 = {
      value : 'no', 
      complemento : "" 
    };

    this.pregunta4 = {
      value : 'entregaayudas', 
      complemento : "" 
    };

    this.pregunta4 = {
      value : 'entregaayudas', //RESPUESTAS - Esta es la pregunta4
      complemento : "" //RESPUESTAS - Esta es la pregunta4complemento
    };
  
    this.pregunta5 = {
      value : 'no', //RESPUESTAS - Esta es la pregunta5
      complemento : 0 //RESPUESTAS - Esta es la pregunta5complemento
    };
  
    this.pregunta6 = "directamente";
  
    this.pregunta7 = "unico";
  
    this.pregunta8 = {
      value : 'no', //RESPUESTAS - Esta es la pregunta8
      complemento : 0 //RESPUESTAS - Esta es la pregunta8complemento
    };
  
    this.pregunta9 = "federal";
  
    this.pregunta10 = {
      value : 'educacionobligatoria', //RESPUESTAS - Esta es la pregunta10
      complemento : '' //RESPUESTAS - Esta es la pregunta10complemento
    };
  
    this.pregunta11 = {
      value : 'no', //RESPUESTAS - Esta es la pregunta11
      complemento : '' //RESPUESTAS - Esta es la pregunta11complemento
    };
  
    this.pregunta12 = {
      value : 'no', //RESPUESTAS - Esta es la pregunta12
      complemento : '' //RESPUESTAS - Esta es la pregunta12complemento
    };
  
    this.dependencia = this.apiDataService.user.entidad;
  }

}
