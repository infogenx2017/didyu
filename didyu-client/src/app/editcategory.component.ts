import { Component, Output, Input, EventEmitter } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { RouterModule, Router } from '@angular/router';
import { Globals } from './global';
import * as moment from 'moment';

@Component({
  selector: 'editcategory-root',
  templateUrl: './editcategory.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class editcategoryComponent {
  errorMessage: string;
  private accessToken;titles;
  private headers;
  private alertMessage;
  private role;
  private userId;
  private formdata;
  private options;categories;mcat;
  private title;showCreateTask;notify;catid;
  private mexpecteddate;showTextbox;
  @Output() closePopup = new EventEmitter(); 
  @Output() saveclose = new EventEmitter(); 
  @Input() selectedCat: string;
  @Input() cat_id: string;
  constructor(private router: Router, private http: HttpClient, private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.showTextbox = false;
    this.notify = false;
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

  notifychange(param){
    this.notify = param.target.checked;
  }
  update(){
    if(!this.catid) {
      this.closePopup.emit(false);
      this.saveclose.emit();
      return false;
    }
    
    if(!this.title){
      this.toast("Please enter title");
    }

    var doc = this.catid;
    if(!doc.title){
      this.toast("Please enter title");
    }
    else{
      this.formdata = {
        title : doc.title,
        catid : doc.cat_id
      }
      this.http.post(this.globals.baseUrl+'updatecategory',this.formdata,this.headers)
      .subscribe(
          response => {
            this.closePopup.emit(false);
            this.saveclose.emit();
          },
          error => {this.toast("Title Category added failed...");}
      ); 
    }     
  }
}




