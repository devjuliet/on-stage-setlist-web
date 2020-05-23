import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { DataSessionService } from 'src/app/services/dataSession/data-session.service';

@Component({
  selector: 'app-navbar-dashboard',
  templateUrl: './navbar-dashboard.component.html',
  styleUrls: ['./navbar-dashboard.component.css']
})
export class NavbarDashboardComponent implements OnInit {

  constructor(public utilitiesService : UtilitiesService,private dataSessionService : DataSessionService) { }

  ngOnInit(): void {
  }

  logOut() {
    this.dataSessionService.logOut();
  }

}
