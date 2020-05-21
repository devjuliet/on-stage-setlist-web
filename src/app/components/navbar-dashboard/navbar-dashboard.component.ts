import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities/utilities.service';

@Component({
  selector: 'app-navbar-dashboard',
  templateUrl: './navbar-dashboard.component.html',
  styleUrls: ['./navbar-dashboard.component.css']
})
export class NavbarDashboardComponent implements OnInit {

  constructor(public utilitiesService : UtilitiesService) { }

  ngOnInit(): void {
  }

}
