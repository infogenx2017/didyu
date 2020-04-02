import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { RouterModule, Router } from '@angular/router';
import { Globals } from './global';
import * as moment from 'moment';

@Component({
  selector: 'menueditor-root',
  templateUrl: './menueditor.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class menueditorComponent {
  errorMessage: string;
  private accessToken;titles;
  private headers;
  private alertMessage;
  private mtitle;
  private role;
  private userId;
  private formdata;
  private options;categories;
  public mcat;mcatname;mtitlename;
  private showTextbox;showTitlebox;showEditCategory;showEditTitle;
  @Output() closePopup = new EventEmitter(); 
  constructor(private router: Router, private http: HttpClient, private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.getTitles();
    this.showTextbox = false;
    this.showTitlebox = false;
    this.showEditCategory = false;
    this.showEditTitle = false;
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

  editCategory(){
    this.formdata = {
      cat_id : this.mcat
    }
    this.http.post(this.globals.baseUrl+'categoryname',this.formdata,this.headers)
    .subscribe( 
      response => {
        this.mcatname = response;
        this.showEditCategory = true;
      },
      error => { console.log(<any>error) }
    );
  }

  deleteCategory(){
    this.formdata = {
      id : this.mcat
    }
    this.http.post(this.globals.baseUrl+'deletecategory',this.formdata,this.headers)
    .subscribe( 
      response => {
        this.getTitles()
      },
      error => { console.log(<any>error) }
    );
  }

  deleteTitle(){
    this.formdata = {
      id : this.mtitle
    }
    this.http.post(this.globals.baseUrl+'deletetitle',this.formdata,this.headers)
    .subscribe( 
      response => {
        this.getTitles()
      },
      error => { console.log(<any>error) }
    );
  }

  editTitle(){
    this.formdata = {
      cat_id : this.mcat,
      title_id : this.mtitle
    }
    this.http.post(this.globals.baseUrl+'categorytitlename',this.formdata,this.headers)
    .subscribe(
      response => {
        this.mtitlename = response;
        this.showEditTitle = true;
      },
      error => { console.log(<any>error) }
    );
  }

  showTitle(){
    this.showTitlebox = true;
  }

  hideText(){
    this.showTextbox = false;
  }

  cancel(){
    this.closePopup.emit(false);
  }

  setshowMenuEditor(e){
    if(e){
      this.showTextbox = e;
    } else {
      this.showTextbox = !this.showTextbox;
    }
  }

  setshowMenuCategoryEditor(e){
    if(e){
      this.showEditCategory = e;
    } else {
      this.showEditCategory = !this.showEditCategory;
    }
  }

  setshowMenuTitleEditor(e){
    if(e){
      this.showEditTitle = e;
    } else {
      this.showEditTitle = !this.showEditTitle;
    }
  }

  setshowCreateTitle(e){
    if(e){
      this.showTitlebox = e;
    } else {
      this.showTitlebox = !this.showTitlebox;
    }
  }

  getTitles(){
    this.http.get(this.globals.baseUrl+'categoriesTitle')
    .subscribe( 
      response => {
        this.categories = response
      },
      error => {}
    );
    this.http.get(this.globals.baseUrl+'titles')
    .subscribe( (data) => {
      this.titles = data
     });
  }

  toast(message) {
    this.alertMessage = message;
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  save(){
    if(!this.mtitle){
      this.toast("Please enter title");
    }
    else{
      this.formdata = {
        title : this.mtitle
      }
      this.http.post(this.globals.baseUrl+'menueditor',this.formdata,this.headers)
      .subscribe(
          response => {
            this.toast("New Task has been Created...");
            window.location.reload();
          },
          error => this.errorMessage = <any>error
      );
    }    
  }
}




