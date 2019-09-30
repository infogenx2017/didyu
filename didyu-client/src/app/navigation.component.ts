import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { RouterModule, Router } from '@angular/router';
import { Globals } from './global';
@Component({
  selector: 'nav-bar',
  templateUrl: './navigation.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class navBarComponent {
  errorMessage: string;
  private accessToken;
  private headers;
  private alertMessage;
  private role;
  private userId;
  private formdata;
  private currentUser;
  private showCreateTask:boolean = false;
  private showNotifications;
  private userNotifications;showUserAccount;showSettings;

  baseUrl = 'http://laravel.didyu.local/';
  constructor(private router: Router, private http: HttpClient, private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.checkUser();
    this.notifications();
  }

  async init() {
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
  }
  setshowCreateTask(e){
    if(e){
      this.showCreateTask = e;
    } else {
      this.showCreateTask = !this.showCreateTask;
    }
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
            this.role = this.currentUser.role;
          },
          error => {this.toast("Invalid credentials...");}
      );
    }
  }

  notifications(){
    this.userId = localStorage.getItem('userId');
    if(this.userId){
      this.formdata = {
        id : this.userId
      }
      this.http.post(this.globals.baseUrl+'notifications',this.formdata,this.headers)
      .subscribe(
          response => {
            this.userNotifications = response;
          },
          error => {this.toast("Invalid request...");}
      );
    }
  }

  showcreate(){
    this.showCreateTask = true;
  }

  
  changeNotification(){
    this.showNotifications=!this.showNotifications;
  }

  openUserAccount(){
    this.showUserAccount = !this.showUserAccount;
  }

  openSetting(){
    this.showSettings = !this.showSettings;
  }

  onClickedOutside(){
    this.showUserAccount = false;
  }

  onClickedOutsideSetting(){
    this.showSettings = false;
  }
  onClickedOutsideNotification(){
    this.showNotifications = false;
  }

  logout(){
    this.http.post(this.globals.baseUrl+'logout',null,this.headers)
      .subscribe(
          response => {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            this.toast("Logout Successfully...");
            this.router.navigate(['/login'])
          },
          error => {this.toast("Login Failed...");}
      );
  }

  changePass(){
    this.router.navigate(['/changePassword']);
    this.showUserAccount = false;
  }

  toUsers(){
    this.router.navigate(['/users']);
    this.showUserAccount = false;
  }

  toast(message) {
    this.alertMessage = message;
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
}



