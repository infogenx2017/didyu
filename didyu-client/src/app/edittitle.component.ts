import { Component, Output, Input, EventEmitter } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { RouterModule, Router } from '@angular/router';
import { Globals } from './global';
import * as moment from 'moment';

@Component({
  selector: 'edittitle-root',
  templateUrl: './edittitle.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class editTitleComponent {
  errorMessage: string;
  private accessToken;titles;
  private headers;
  private alertMessage;
  private role;
  private userId;
  private formdata;
  private options;categories;mcat;
  private title;showCreateTask;notify;category_id;titleid;
  private mexpecteddate;showTextbox;titleCategories;
  @Output() closePopup = new EventEmitter(); 
  @Output() saveclose = new EventEmitter(); 
  @Input() selectedTitle: string;
  @Input() cat_id: string;
  @Input() title_id: string;
  constructor(private router: Router, private http: HttpClient, private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.showTextbox = false;
    this.notify = false;
    this.getTitles();
  }
  async init() {
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
  }

  getTitles() {
     this.http.get(this.globals.baseUrl+'categories')
    .subscribe( (data) => {
      this.titleCategories = data
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
    if(!this.titleid) {
      this.closePopup.emit(false);
      this.saveclose.emit();
      return false;
    }

    var doc = this.titleid;
    if(!doc.title && !doc.selectedTitle && doc.title == '' && doc.selectedTitle == ''){
      this.toast("Please enter title");
      return false;
    } 
    else if(doc.category_id == 0 || doc.category_id == "0") {
      this.toast('Please choose category')
      return false;
    }
    else{
      if(doc.title) {
        var title = doc.title;
      } else {
        var title = doc.selectedTitle;
      }

      if(doc.category_id) {
        var cat_id = doc.category_id;
      } else {
        var cat_id = doc.cat_id;
      }
      this.formdata = {
        title : title,
        cat_id : cat_id,
        title_id : doc.title_id
      }
      this.http.post(this.globals.baseUrl+'updatetitle',this.formdata,this.headers)
      .subscribe(
          response => {
            // this.toast("Title added Successfully...");
            this.closePopup.emit(false);
            this.saveclose.emit();
          },
          error => {this.toast("Title added failed...");}
      ); 
    }     
  }
}




