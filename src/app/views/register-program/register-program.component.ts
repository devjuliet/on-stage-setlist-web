import { Component, OnInit } from '@angular/core';

import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-register-program',
  templateUrl: './register-program.component.html',
  styleUrls: ['./register-program.component.css']
})
export class RegisterProgramComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private dom) {
    this.createNewHeadLink('stylesheet','https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i');
    this.createNewHeadLink('stylesheet','assets/cuestionary-files/css/animate.min.css');
    this.createNewBodyScript('assets/cuestionary-files/js/main.js');
    /* this.createNewBodyScript('assets/cuestionary-files/js/functions.js'); */
  }

  ngOnInit(): void {
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

}
