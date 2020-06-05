import { Component, OnInit, Input } from '@angular/core';
import { Band } from '../../classes/band.class';
import { SetLed } from '../../classes/led/setLed.class';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() activeLink: number;
  @Input() isManager: Boolean;
  @Input() nameUser: String;
  @Input() imageurl: Boolean;
  @Input() idUser: number;
  @Input() imageSrc: string;
  @Input() bandsList : Band[];
  @Input() setList : SetLed[];
  @Input() idActive : Number;

  colorLinks = [
    "whitesmoke",//0
    "#d6d6d6",//1
    "whitesmoke",//2
    "whitesmoke",//3
    "whitesmoke",//4
    "whitesmoke",//5
  ];
  classesLinks = [
    "border-top",//0
    "active-link",//1
    "border-bottom",//2
    "normal-link",//3
    "normal-link",//4
    "normal-link",//5
  ];

  menuList : any[];

  constructor() {
    this.menuList = [
      {name : "banda fdfs", active : false, id: 1},
      {name : "banda fdfs", active : true, id: 45},
      {name : "banda fdfs", active : false, id: 3}]
   }

  ngOnInit(): void {
    //console.log(this.activeLink);
    //console.log(this.idActiveBand);
    for (let index = 0; index < this.colorLinks.length; index++) {
      this.colorLinks[index] = "whitesmoke";
      this.classesLinks[index] = "normal-link";
    }

    this.classesLinks[this.activeLink] = "active-link"
    this.colorLinks[this.activeLink] = "#d6d6d6";
  }

}
