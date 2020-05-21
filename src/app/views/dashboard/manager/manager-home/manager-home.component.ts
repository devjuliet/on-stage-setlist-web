import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent implements OnInit {

  constructor( public utilitiesService : UtilitiesService) { }

  ngOnInit(): void {
  }

}
