import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';

@Component({
  selector: 'app-admin-bands',
  templateUrl: './admin-bands.component.html',
  styleUrls: ['./admin-bands.component.css']
})
export class AdminBandsComponent implements OnInit {

  constructor( public utilitiesService : UtilitiesService) { }

  ngOnInit(): void {
  }

}
