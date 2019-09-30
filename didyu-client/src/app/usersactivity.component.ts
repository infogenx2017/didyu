import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { Globals } from './global';

@Component({
  selector: 'app-root',
  templateUrl: './usersactivity.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class usersActivityComponent {
  errorMessage: string;
  private accessToken;
  private headers;
  private users;
  private formdata;
  private alertMessage;userId;currentUser;
  constructor(private router: Router, private http: HttpClient,private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    
  }
  ngOnInit() {
    this.checkUser();
  }

  async init() {
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
  }

  checkUser(){
    this.userId = localStorage.getItem('userId');
    if(this.userId){
      this.formdata = {
        id : this.userId
      }
      this.http.post(this.globals.baseUrl+'userrole',this.formdata,this.headers)
      .subscribe(
          response => {
            this.currentUser = response;
          },
          error => {this.toast("Invalid credentials...");}
      );
    }
  }

  toast(message) {
    this.alertMessage = message;
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

}



