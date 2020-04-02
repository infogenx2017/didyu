import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { RouterModule, Router } from '@angular/router';
import { Globals } from './global';
import * as moment from 'moment';

@Component({
  selector: 'createuser-root',
  templateUrl: './createuser.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class createUserComponent {
  errorMessage: string;

  /**create user vaiables**/
  private name;
  private email;
  private password;
  private mobile;
  private role;roles;
  private department;departments;
  private designation;designations;
  private status;
  /**create user vaiables**/

  private accessToken;titles;
  private headers;
  private alertMessage;
  private userId;
  private formdata;
  private options;categories;mcat;
  private title;showCreateTask;notify
  private mexpecteddate;showTextbox;
  @Output() closePopup = new EventEmitter(); 
  @Output() saveclose = new EventEmitter();
  constructor(private router: Router, private http: HttpClient, private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.showTextbox = false;
    this.notify = false;
    this.getRoles();
    this.getDepartments();
    this.getDesignations();
  }
  async init() {
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
  }

  showText(){
    this.showTextbox = true;
  }

  hideText(){
    this.showTextbox = false;
  }

  cancel(){
    this.closePopup.emit(false);
  }

  toast(message) {
    this.alertMessage = message;
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  getRoles() {
    this.http.get(this.globals.baseUrl+'getRoles')
      .subscribe(
          response => {
            this.roles = response;
          },
          error => {this.toast("Request Failed...");}
      );
  }

  getDepartments() {
    this.http.get(this.globals.baseUrl+'getDepartments')
      .subscribe(
          response => {
            this.departments = response;
          },
          error => {this.toast("Request Failed...");}
      );
  }

  getDesignations() {
    this.http.get(this.globals.baseUrl+'getDesignations')
      .subscribe(
          response => {
            this.designations = response;
          },
          error => {this.toast("Request Failed...");}
      );
  }

  save(){
    if(!this.name){
      this.toast("Please enter name");
    }
    else if(!this.email){
      this.toast("Please enter email");
    }
    else if(!this.password){
      this.toast("Please enter password");
    }
    else if(!this.mobile){
      this.toast("Please enter mobile");
    }
    else if(!this.role){
      this.toast("Please enter role");
    }
    else{
      this.formdata = {
        name : this.name,
        email : this.email,
        password : this.password,
        mobile : this.mobile,
        role_id : this.role,
        department_id : this.department,
        designation_id : this.designation,
        isActive : this.status
      }
      this.http.post(this.globals.baseUrl+'adduser',this.formdata,this.headers)
      .subscribe(
          response => {
            this.closePopup.emit(false);
            //this.saveclose.emit();
            window.location.reload();
          },
          error => {this.toast("Adding User failed...");}
      ); 
    }     
  }
}
