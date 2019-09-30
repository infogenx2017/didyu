import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { Globals } from './global';

@Component({
  selector: 'app-root',
  templateUrl: './title.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class titleComponent {
  errorMessage: string;
  private accessToken;
  private headers;
  private titles;
  private formdata;
  private alertMessage;category_id;
  private title;titleCategories;
  private showEdit;currentTitleId;etitle;ecategory_id;
  constructor(private router: Router, private http: HttpClient,private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.showEdit = false;
    
  }
  ngOnInit() {
    this.getTitles();
  }
  
  getTitles() {
    this.http.get(this.globals.baseUrl+'titles')
    .subscribe( (data) => {
      this.titles = data
     });    
     this.http.get(this.globals.baseUrl+'categories')
    .subscribe( (data) => {
      this.titleCategories = data
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
    else if(!this.category_id){
      this.toast('Please choose category')
    }
    else{
      this.formdata = {
        title : this.title,
        category_id : this.category_id
      }
      this.http.post(this.globals.baseUrl+'addtitle',this.formdata,this.headers)
      .subscribe(
          response => {
            this.toast("Title added Successfully...");
            window.location.reload();
          },
          error => {this.toast("Title added failed...");}
      ); 
    }     
  }

  deleteTitle(id){
    this.formdata = {
      id : id
    }
    this.http.post(this.globals.baseUrl+'deletetitle',this.formdata,this.headers)
    .subscribe(
        response => {
          this.toast("Title has been deleted...");
          this.router.navigate(['/titles'])
          setTimeout(function(){
            window.location.reload();
          })
        },
        error => this.errorMessage = <any>error
    );
  }

  enableEdit(id,name,categoryId){    
    this.currentTitleId = id;
    this.etitle = name;
    this.showEdit = true;
    this.ecategory_id = categoryId;
  }

  update(){    
    this.formdata = {
      id : this.currentTitleId,
      title : this.etitle,
      category_id : this.ecategory_id
    }
    this.http.post(this.globals.baseUrl+'updatetitle',this.formdata,this.headers)
    .subscribe(
        response => {
          this.toast("Title has been updated...");
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



