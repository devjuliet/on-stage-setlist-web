import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  sidebarClass : String;
  navbarClass : String;
  
  constructor() {
    this.navbarClass = "myWidth";
    this.sidebarClass = "myMargin";
   }

   showSidebar(){
      if(this.sidebarClass == "myMargin"){
        this.sidebarClass = "";
      }
      else{
        this.sidebarClass = "myMargin";
      }
      if(this.navbarClass == "myWidth"){
         this.navbarClass = "";
      }else{
        this.navbarClass = "myWidth";
      }
  }
}
