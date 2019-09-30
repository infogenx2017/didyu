import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Role,registerService } from './register.service';
import { HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import { OktaAuthService } from '@okta/okta-angular';
import { Globals } from './global';
import * as _ from 'lodash';
import 'rxjs/Rx';

interface Course {
  name: string;
  id:Number;
}


@Component({
  selector: 'app-root',
  templateUrl: './register.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class registerComponent implements OnInit {
  errorMessage: string;
  private accessToken;
  private headers;
  private roles;
  private name;email;mobile;password;cpassword;lemail;lpassword;remail;
  private formdata;
  private alertMessage;
  private currentUser;
  constructor(private router: Router,private _registerService : registerService, private http: HttpClient,private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.checkIsLogin();
  }

  ngOnInit() {
      this.getUserRoles();
  }

  async init() {
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
  }

  checkIsLogin(){
    if (localStorage.getItem("isAuthenticated") === null) {
      if(this.router.url == '/register'){
        this.router.navigate(['/register']);
      }
      else if(this.router.url == '/forgetpassword'){
        this.router.navigate(['/forgetpassword']);
      }
      else {
        this.router.navigate(['/login']);
      }
    }
    else{
      this.router.navigate(['tasklist']);
    }
  }

  getUserRoles(){
    this.http.get(this.globals.baseUrl+'roles')
     .subscribe( (data) => {this.roles = data});            
  }
  register(){
    if(!this.name){
      this.toast("Please enter user name");
    }
    else if(!this.email){
      this.toast("Please enter email");
    }
    else if(!this.mobile){
      this.toast("Please enter mobile");
    }
    else if(!this.password){
      this.toast("Please enter password");
    }
    else if(!this.cpassword){
      this.toast("Please enter confirm password");
    }
    else if(this.password!=this.cpassword){
      this.toast("Password and confirm password did not match");
    }
    else{
      this.formdata = {
        name : this.name,
        email : this.email,
        mobile : this.mobile,
        password : this.password,
        cpassword : this.cpassword
      }
      this.http.post(this.globals.baseUrl+'doSignUp',this.formdata,this.headers)
      .subscribe(
          response => {
            this.currentUser = response;
            localStorage.setItem('userId', this.currentUser.id);
            localStorage.setItem('userName', this.currentUser.name);
            localStorage.setItem('isAuthenticated', "success");
            this.toast("New User has been Registered...");
            this.router.navigate(['/tasklist']);            
          },
          error => this.errorMessage = <any>error
      );
    }    
  }
  login(){
    if(!this.lemail){
      this.toast("Please enter email");
    }
    else if(!this.lpassword){
      this.toast("Please enter password");
    }
    else{
      this.formdata = {
        email : this.lemail,
        password : this.lpassword
      }
      this.http.post(this.globals.baseUrl+'doLogin',this.formdata,this.headers)
      .subscribe(
          response => {
            localStorage.setItem('isAuthenticated', "success");
            this.currentUser = response;
            localStorage.setItem('userId', this.currentUser.user.id);
            localStorage.setItem('userName', this.currentUser.user.name);
            
            this.toast("Login Successfully...");
            this.router.navigate(['/tasklist'])
          },
          error => {this.toast("Invalid credentials...");}
      );
    }   
  }

  reset(){
    if(!this.remail){
      this.toast("Please enter email");
    }
    else{
      this.formdata = {
        email : this.remail
      }
      this.http.post(this.globals.baseUrl+'reset',this.formdata,this.headers)
      .subscribe(
          response => {            
            this.toast("We have sent email for reset your password...");
            this.router.navigate(['/login']);
          },
          error => {this.toast("Invalid credentials...");}
      );
    }
  }

  togglePassword(val){
    var x = document.getElementById(val) as HTMLInputElement;
    if (x.type === "password") {
      x.type = "text";
    } else {  
      x.type = "password";
    }
  }

  toast(message) {
    this.alertMessage = message;
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
}



