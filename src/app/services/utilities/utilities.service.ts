import { Injectable } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  sidebarClass : String;
  navbarClass : String;
  //Utilidades interfaz
  public showOverlay = true;
  //Loading con mensaje 
  public loadingMsg = false;
  public loadingOkMsg = false;
  public loadingMessageMsg = "";
  public loadingTitleMsg = "";

  //Notificacion
  actualMessageServer: String = "";
  successMessage: boolean = false;
  failMessage: boolean = false;
  //SideMenu
  showingMenu: boolean = true;

  constructor(private router: Router, ) {
    this.navbarClass = "myWidth";
    this.sidebarClass = "myMargin";
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    })
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

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showOverlay = true;
    }
    if (event instanceof NavigationEnd) {
      this.showOverlay = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.showOverlay = false;
    }
    if (event instanceof NavigationError) {
      this.showOverlay = false;
    }
  }
  //Muestra el loading con mensage
  showLoadingMsg(title : string,message: string, callback) {
    this.loadingMsg = true;
    this.loadingOkMsg = false;
    this.loadingTitleMsg = title;
    this.loadingMessageMsg = message;
    this.awaitTime(500, () => {
      callback();
    });
  }
  closeLoadingMsg(){
    this.loadingMsg = false;
    this.loadingOkMsg = false;
    this.loadingTitleMsg = "";
    this.loadingMessageMsg = "";
  }

  closeLoadingSuccess(titleSuccess = "",msgSucces = "",callback){
    this.loadingMsg = true;
    this.loadingOkMsg = true;
    this.loadingTitleMsg = titleSuccess;
    this.loadingMessageMsg = msgSucces;
    
    this.awaitTime(1500, () => {
      this.loadingMsg = false;
      this.loadingOkMsg = false;
      this.loadingTitleMsg = "";
      this.loadingMessageMsg = "";
      callback();
    });
  }
  //MENU LATERAL
  closeSidemenu() {
    this.showingMenu = !this.showingMenu;
  }

  closeNotification() {
    this.failMessage = false;
    this.successMessage = false;
    this.actualMessageServer = "";
  }

  showNotification(type: number, message: string, time: number, callback) {
    this.actualMessageServer = message;
    switch (type) {
      case 0:
        this.successMessage = true;
        break;
      case 1:
        this.failMessage = true;
        break;
    }
    this.awaitTime(time, () => {
      this.failMessage = false;
      this.successMessage = false;
      this.actualMessageServer = "";
      callback();
    })
  }

  async awaitTime(ms, callback) {
    this.sleep(ms).finally(() => {
      callback();
    })
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getDateForInputs(){
    let fixMont = new Date().getUTCMonth().toString().length == 1 ? "0"+new Date().getUTCMonth() : new Date().getUTCMonth();
    return "" + new Date().getFullYear() + "-" + fixMont + "-" + new Date().getDate();
  }
}
