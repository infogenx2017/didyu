import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { Globals } from './global';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class AppComponent {
  isAuthenticated: boolean;
  constructor(private router: Router,public oktaAuth: OktaAuthService){
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
  );
  }
  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
  } 

  login() {
      this.oktaAuth.loginRedirect('/');
  }

  logout() {
      this.oktaAuth.logout('/');
  }
}



