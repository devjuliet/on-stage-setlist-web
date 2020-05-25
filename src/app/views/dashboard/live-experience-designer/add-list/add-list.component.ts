import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { DataSessionService } from 'src/app/services/dataSession/data-session.service';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.css']
})
export class AddListComponent implements OnInit {

  constructor(public dataSessionService : DataSessionService, public utilitiesService : UtilitiesService) { }

  ngOnInit(): void {
  }

}
