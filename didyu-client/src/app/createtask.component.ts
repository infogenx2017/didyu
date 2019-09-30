import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { RouterModule, Router } from '@angular/router';
import { Globals } from './global';
import * as moment from 'moment';

@Component({
  selector: 'createtask-root',
  templateUrl: './createtask.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class createtaskComponent {
  errorMessage: string;
  private accessToken;titles;
  private headers;
  private alertMessage;
  private role;
  private userId;
  private formdata;
  private options;categories;mcat;
  private priority;
  private status;
  private type;
  private assignee;
  private mtitle;showCreateTask;
  private mdescription;
  private massignee;
  private mpriority;
  private mtype;
  private mstatus;
  private mduedate;
  private mreminderdate;notify
  private mexpecteddate;showTextbox;showTitlebox;
  @Output() closePopup = new EventEmitter(); 
  constructor(private router: Router, private http: HttpClient, private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.getOptions();
    this.getTitles();
    this.showTextbox = false;
    this.notify = false;
    this.showTitlebox = false;
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

  showTitle(){
    this.showTitlebox = true;
  }

  hideText(){
    this.showTextbox = false;
  }

  cancel(){
    this.closePopup.emit(false);
  }

  setshowCreateTask(e){
    if(e){
      this.showTextbox = e;
    } else {
      this.showTextbox = !this.showTextbox;
    }
  }

  setshowCreateTitle(e){
    if(e){
      this.showTitlebox = e;
    } else {
      this.showTitlebox = !this.showTitlebox;
    }
  }
  getOptions() {
    this.http.get(this.globals.baseUrl+'getOptions')
      .subscribe(
          response => {
            this.options = response;
            this.priority = this.options.priority;
            this.status = this.options.status;
            this.type = this.options.type;
            this.assignee = this.options.users
          },
          error => {this.toast("Request Failed...");}
      );
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

  notifychange(param){
    this.notify = param.target.checked;
  }
  save(){
    console.log(this.notify)
    if(!this.mdescription){
      this.mdescription = null;
    }
    if(!this.mtype){
      this.mtype = null;
    }
    if(!this.mreminderdate){
      this.mreminderdate = null;
    }
    if(!this.mexpecteddate){
      this.mexpecteddate = null;
    }
    if(!this.mtitle){
      this.toast("Please enter title");
    }
    else if(!this.massignee){
      this.toast("Please choose assignee");
    }
    else if(!this.mpriority){
      this.toast("Please choose priority");
    }
    else if(!this.mstatus){
      this.toast("Please choose status");
    }
    else if(!this.mduedate){
      this.toast("Please enter due date");
    }    
    else{
      var mduedate = this.mduedate ? moment(new Date(this.mduedate)).format("YYYY-MM-DD") : null;
      var mreminderdate = this.mreminderdate ?  moment(new Date(this.mreminderdate)).format("YYYY-MM-DD") : null;
      var mexpecteddate = this.mexpecteddate ? moment(new Date(this.mexpecteddate)).format("YYYY-MM-DD") : null;
      this.formdata = {
        title : this.mtitle,
        description : this.mdescription,
        user_id : this.massignee,
        type_id : this.mtype,
        priority_id : this.mpriority,
        status_id : this.mstatus,
        due_date : mduedate,
        reminder_date : mreminderdate,
        expected_date : mexpecteddate,
        notify : this.notify
      }
      this.http.post(this.globals.baseUrl+'createtask',this.formdata,this.headers)
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



