import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { DataSessionService } from '../../services/dataSession/data-session.service';

@Component({
  selector: 'app-navbar-dashboard',
  templateUrl: './navbar-dashboard.component.html',
  styleUrls: ['./navbar-dashboard.component.css']
})
export class NavbarDashboardComponent implements OnInit {

  searchInput : String;

  constructor(public utilitiesService : UtilitiesService,private dataSessionService : DataSessionService) { 
    this.searchInput = "";
  }

  ngOnInit(): void {
    this.searchInput = "";
  }

  logOut() {
    this.dataSessionService.logOut();
  }

  search(){
    if(this.searchInput.length == 0){
      this.utilitiesService.showNotification(1,"Busqueda invalida",2000,()=>{});
    }else{
      this.dataSessionService.navigateByUrl("/dashboard/search-result/"+this.searchInput);
    }
  }

}
