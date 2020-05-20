import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() activeLink: number;
  @Input() isManager: Boolean;

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

  constructor() { }

  ngOnInit(): void {
    console.log(this.activeLink);
    for (let index = 0; index < this.colorLinks.length; index++) {
      this.colorLinks[index] = "whitesmoke";
      this.classesLinks[index] = "normal-link";
    }

    this.classesLinks[this.activeLink] = "active-link"
    this.colorLinks[this.activeLink] = "#d6d6d6";
  }

}
