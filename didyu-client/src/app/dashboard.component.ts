import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { Globals } from './global';


@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class dashboardComponent {

}



