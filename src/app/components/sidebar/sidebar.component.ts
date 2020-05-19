import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() activeLink: number;

  colorLinks = [
    "whitesmoke",//0
    "#d6d6d6",//1
    "whitesmoke",//2
    "whitesmoke",//3
    "whitesmoke",//4
    "whitesmoke",//5
    "whitesmoke",//6
    "whitesmoke",//7
    "whitesmoke",//8
    "whitesmoke",//9
  ];
  classesLinks = [
    "border-top",//0
    "active-link",//1
    "border-bottom",//2
    "normal-link",//3
    "normal-link",//4
    "normal-link",//5
    "normal-link",//6
    "normal-link",//7
    "normal-link",//8
    "normal-link",//9
  ];

  constructor() { }

  ngOnInit(): void {
    console.log(this.activeLink);
    for (let index = 0; index < this.colorLinks.length; index++) {
      this.colorLinks[index] = "whitesmoke";
      if(index == 0 || index == this.colorLinks.length - 1 ){
        this.classesLinks[index] = "normal-link";
      }else{
        this.classesLinks[index] = "normal-link link";
      }
    }

    if(this.activeLink == 1 ){
      this.classesLinks[this.activeLink-1] = "border-top";
      this.classesLinks[this.activeLink] = "active-link";
      this.classesLinks[this.activeLink+1] = "border-bottom link";
    }else if(this.activeLink == this.colorLinks.length - 2){
      this.classesLinks[this.activeLink-1] = "border-top link";
      this.classesLinks[this.activeLink] = "active-link";
      this.classesLinks[this.activeLink+1] = "border-bottom";
    }else{
      this.classesLinks[this.activeLink-1] = "border-top link";
      this.classesLinks[this.activeLink] = "active-link";
      this.classesLinks[this.activeLink+1] = "border-bottom link";
    }
    
    this.colorLinks[this.activeLink] = "#d6d6d6";
  }

}
