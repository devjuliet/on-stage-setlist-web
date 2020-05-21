import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';

@Component({
  selector: 'app-add-band',
  templateUrl: './add-band.component.html',
  styleUrls: ['./add-band.component.css']
})
export class AddBandComponent implements OnInit {

  constructor( public utilitiesService : UtilitiesService) { }

  ngOnInit(): void {
  }

}
