import { Component,OnInit } from '@angular/core';
import { UtilitiesService } from './services/utilities/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'client';

  constructor(public utilitiesService : UtilitiesService,) { }
}
