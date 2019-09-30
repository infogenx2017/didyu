import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { Globals } from './global';

@Component({
  selector: 'app-root',
  templateUrl: './titleCategory.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class titleCategoryComponent {
  errorMessage: string;
  private accessToken;
  private headers;
  private titles;
  private formdata;
  private alertMessage;
  private title;
  private showEdit;currentTitleId;etitle;
  constructor(private router: Router, private http: HttpClient,private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.showEdit = false;
    
  }
  ngOnInit() {
    this.getTitles();
  }
  
  getTitles() {
    this.http.get(this.globals.baseUrl+'categories')
    .subscribe( (data) => {
      this.titles = data
     });    
  }

  async init() {
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
  }

  save(){
    if(!this.title){
      this.toast("Please enter title");
    }
    else{
      this.formdata = {
        title : this.title
      }
      this.http.post(this.globals.baseUrl+'addcategory',this.formdata,this.headers)
      .subscribe(
          response => {
            this.toast("Title Category added Successfully...");
            window.location.reload();
          },
          error => {this.toast("Title Category added failed...");}
      ); 
    }     
  }

  deleteTitle(id){
    this.formdata = {
      id : id
    }
    this.http.post(this.globals.baseUrl+'deletecategory',this.formdata,this.headers)
    .subscribe(
        response => {
          this.toast("Title Category has been deleted...");
          this.router.navigate(['/titles'])
          setTimeout(function(){
            window.location.reload();
          })
        },
        error => this.errorMessage = <any>error
    );
  }

  enableEdit(id,name){    
    this.currentTitleId = id;
    this.etitle = name;
    this.showEdit = true;
  }

  update(){    
    this.formdata = {
      id : this.currentTitleId,
      title : this.etitle
    }
    this.http.post(this.globals.baseUrl+'updatecategory',this.formdata,this.headers)
    .subscribe(
        response => {
          this.toast("Title Category has been updated...");
          this.router.navigate(['/titles'])
          setTimeout(function(){
            window.location.reload();
          })
        },
        error => this.errorMessage = <any>error
    );
  }

  cancel(){
    this.showEdit = false;
  }

  toast(message) {
    this.alertMessage = message;
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

}



