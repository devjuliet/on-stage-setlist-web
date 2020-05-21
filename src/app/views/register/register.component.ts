import { Component, OnInit } from '@angular/core';
import { DataSessionService } from 'src/app/services/dataSession/data-session.service';
import { LogedResponse } from 'src/app/classes/logedResponse.class';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name : String;
  email : String;
  password : String;
  type : Number;
  username : String;

  constructor(public dataSessionService : DataSessionService) { }

  ngOnInit(): void {
    this.dataSessionService.checkLogin((logedResponse : LogedResponse)=>{
      console.log(logedResponse);
    },( noLoginResponse : LogedResponse)=>{
      console.log(noLoginResponse);
    });
  }

  registerUser(){

  }
}
