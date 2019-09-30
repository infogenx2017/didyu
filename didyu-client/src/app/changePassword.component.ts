import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { Globals } from './global';

@Component({
  selector: 'app-root',
  templateUrl: './changePassword.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class changePasswordComponent {
  errorMessage: string;
  private accessToken;
  private headers;
  private users;
  private formdata;
  private alertMessage;
  private password;
  private cpassword;
  baseUrl = 'http://13.234.116.80:4206/';
  constructor(private router: Router, private http: HttpClient,private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    
  }
  ngOnInit() {
  }

  async init() {
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
  }

  change(){
    if(!this.password){
      this.toast("Please enter password");
    }
    else if(!this.cpassword){
      this.toast("Please confirm your password");
    }
    else if(this.password!=this.cpassword){
      this.toast("Password and confirm password mismatched...");
    }
    else{
      this.formdata = {
        id : localStorage.getItem('userId'),
        password : this.password
      }
      this.http.post(this.globals.baseUrl+'updatepassword',this.formdata,this.headers)
      .subscribe(
          response => {
            this.toast("Password Changed Successfully...");
            window.location.reload();
          },
          error => {this.toast("Change password failed...");}
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



