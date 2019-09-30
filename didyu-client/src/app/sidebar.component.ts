import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { RouterModule, Router } from '@angular/router';
import { Globals } from './global';

@Component({
  selector: 'side-bar',
  templateUrl: './sidebar.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class sideBarComponent {
  errorMessage: string;
  private accessToken;
  private headers;
  private alertMessage;
  private role;
  private userId;
  private formdata;
  private currentUser;
  private showClass;
  private users;
  baseUrl = 'http://laravel.didyu.local/';
  constructor(private router: Router, private http: HttpClient, private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.checkIsLogin();
    this.checkUser();
    this.getUsers();
  }

  async init() {
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
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

  checkIsLogin(){
    if (localStorage.getItem("isAuthenticated") === null) {
      this.router.navigate(['/login']);
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
  changeClass(){
    this.showClass = !this.showClass;
  }
  toast(message) {
      this.alertMessage = message;
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  changeMember(userId){
    this.router.navigate(['/tasks/'+userId]);
    setTimeout(function(){
      window.location.reload();
    })
    
  }

  routeTask(){
    this.router.navigate(['/tasks']);
    setTimeout(function(){
      window.location.reload();
    })   
  }

  getUsers(){
    this.http.get(this.globals.baseUrl+'usersonly')
    .subscribe( (data) => {
      this.users = data
     });  
  }
}



