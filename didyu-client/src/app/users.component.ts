import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { Globals } from './global';

@Component({
  selector: 'app-root',
  templateUrl: './users.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class usersComponent {
  errorMessage: string;
  private accessToken;
  private headers;
  private users;
  private formdata;
  private alertMessage;
  private test;
  constructor(private router: Router, private http: HttpClient,private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    
  }
  ngOnInit() {
    this.getUsers();
  }

  async init() {
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
  }
  getUsers(){
    this.http.get(this.globals.baseUrl+'users')
    .subscribe( (data) => {
      this.users = data
     });  
  }

  changeStatus(userId,changeStatusValue){
     this.formdata = {
      id : userId,
      changeStatusValue : changeStatusValue
    }
    this.http.post(this.globals.baseUrl+'changestatus',this.formdata,this.headers)
    .subscribe(
        response => {
          this.toast("Status Changed Successfully...");
          window.location.reload();
        },
        error => this.errorMessage = <any>error
    ); 
  }

  changeRoleId(userId,changeStatusValue){
    this.formdata = {
     id : userId,
     changeStatusValue : changeStatusValue
   }
   this.http.post(this.globals.baseUrl+'changerole',this.formdata,this.headers)
   .subscribe(
       response => {
         this.toast("Role Changed Successfully...");
         window.location.reload();
       },
       error => this.errorMessage = <any>error
   ); 
 }


 deleteUser(id){
  this.formdata = {
    id : id
  }
  this.http.post(this.globals.baseUrl+'deleteUser',this.formdata,this.headers)
  .subscribe(
      response => {
        this.toast("User has been deleted...");
        this.router.navigate(['/users'])
        setTimeout(function(){
          window.location.reload();
        })
      },
      error => this.errorMessage = <any>error
  );
}

  toast(message) {
    this.alertMessage = message;
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

}



