import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute  } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { Globals } from './global';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './task.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class taskComponent {
  errorMessage: string;
  private accessToken;
  private headers;
  private tasks;
  private formdata;
  private alertMessage;categories;titles;mcat;
  private currentDate;
  private taskCount;
  private userId;
  private memberId;
  private editTask;
  private currentTask;currentUser;role;
  private etitle;edescription;eassignee;epriority;eduedate;eexpecteddate;etype;estatus;ereminderdate;currentTaskId;
  private options;priority;status;type;assignee;snote;currentNote;
  private currentPage;fduedate;notePopup;notePopupId;translateHeight;showNote;
  private safetyenvinstance;businesslocationfieldsvalues;safetytypefieldsvalues;valuestreamfieldsvalues;rrr;

  date: Date = new Date();
	settings = {
		bigBanner: true,
		timePicker: false,
		format: 'dd-MM-yyyy',
		defaultOpen: false
	}
  
  baseUrl = 'http://13.234.116.80:4206/';
  constructor(private router: Router, private http: HttpClient,private oktaAuth: OktaAuthService, private globals: Globals, private route : ActivatedRoute ){
    this.init();
    this.gettaskCount();
    this.getTitles();
    this.currentDate = new Date();
    this.memberId = this.router.url.split("/tasks/");
    if(this.memberId[0] != '/tasks'){
      this.memberId = this.memberId[1];
    }
    // this.memberId = this.router.url;
    this.getTasks(this.memberId);
    this.editTask = false;
    // this.etitle = 'jsnadjnasd';
    this.checkUser();
    var currentUrl = this.router.url.split('/');
    this.currentPage = currentUrl[1].toUpperCase();
    if(this.currentPage == 'DASHBOARD' || this.currentPage == 'TASKS'){
      this.currentPage = 'Manage Tasks';
    }
    else if(this.currentPage=='SUMMARY'){
      this.currentPage = 'Summary';
    }
    else if(this.currentPage=='REPORT'){
      this.currentPage = 'Report';
    }
    this.showNote = false;
  }
  ngOnInit() {
    
  }

  async init() {
    this.tasks = [];
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
  }

  getTasks(memberId){
    if(memberId && (this.memberId[0] != '/tasks')) {
      this.userId = memberId;
    }
    else{
      this.userId = localStorage.getItem('userId');
    }
    
     this.formdata = {
      id : this.userId
    }
     
     this.http.post(this.globals.baseUrl+'gettask',this.formdata,this.headers)
      .subscribe(
          response => {
            this.tasks = response
          },
          error => {this.toast("Invalid credentials...");}
      );
  }

  gettaskCount(){
    this.userId = localStorage.getItem('userId');
     this.formdata = {
      id : this.userId
    }
    this.http.post(this.globals.baseUrl+'gettaskCount',this.formdata,this.headers)
    .subscribe( (data) => {
      this.taskCount = data
     });  
  }


  toast(message) {
    this.alertMessage = message;
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
  assignColor(color){
    return {
      background : color
    };
  }
  assignPriorityColor(color){
    return {
      color : color
    }
  }

  
  showEditTask(task){
    this.getOptions();
    this.editTask = true;
    this.currentTask = task;
    this.etitle = task['title'];    
    this.edescription = task['description'];   
    this.eassignee = task['user_id'] ;
    this.epriority = task['priority_id'];
    task['due_date'] = moment(new Date(task['due_date'])).format("MM/DD/YYYY");
    this.eduedate = task['due_date'];
    task['expected_date'] = moment(new Date(task['expected_date'])).format("MM/DD/YYYY");
    this.eexpecteddate = task['expected_date'];
    this.etype = task['type_id'];
    this.estatus = task['status_id'];
    task['reminder_date'] = moment(new Date(task['reminder_date'])).format("MM/DD/YYYY");
    this.ereminderdate = task['reminder_date'];
    this.currentTaskId = task['id'];
    this.currentNote = task['note'];
    if(task['titles'])
        this.mcat = task['titles']['category_id'];
    if(this.currentNote){
      this.showNote = true;
    }    
  }

  cancel(){
    this.editTask = false;
    this.router.navigate(['/tasks'])
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

  deleteTask(id){
    this.formdata = {
      id : id
    }
    this.http.post(this.globals.baseUrl+'deletetask',this.formdata,this.headers)
    .subscribe(
        response => {
          this.toast("Task has been deleted...");
          this.router.navigate(['/tasks'])
          setTimeout(function(){
            window.location.reload();
          })
        },
        error => this.errorMessage = <any>error
    );
  }

  onDateSelect(value){
    this.fduedate = value.value;
  }

  clear(){
    // this.safetyenvinstance = new SheSafetyEnvIncidentModal();
    // this.businesslocationfieldsvalues = 0;
    // this.safetytypefieldsvalues = 0;
    // this.valuestreamfieldsvalues = 0;
    // this.safetyenvinstance.IncidentDateTime = new Date;
    // this.safetyenvinstance.ReportedDateTime = new Date;
  }

  toggleNote(id,index){
    if(this.notePopupId!=id){
      this.notePopup=true;
      this.notePopupId=id;
      var translate = 267 + (index*50)+"px";
      this.translateHeight = {
        transform: "translate3d(997px, "+ translate +", 0px)"
      }  
    }
    else{
      this.notePopup=false;
      this.notePopupId=null;
    } 
  }

  clearNotePopup(){
    if(this.snote) {
      this.formdata = {
        id : this.notePopupId,
        note : this.snote
      }
      this.http.post(this.globals.baseUrl+'addNote',this.formdata,this.headers)
      .subscribe(
          response => {
            this.notePopup=false;
            this.notePopupId=null;
            this.toast("Saved successfully...");
            setTimeout(function(){
              window.location.reload();
            })
          },
          error => {this.toast("Invalid credentials...");}
      );
    }
    else{
      this.toast("Please enter the note...");
    }    
  }

  printTasks(){
      this.rrr = false;
      var divId = 'print';
      
      var content = document.getElementById(divId).innerHTML;
      var mywindow = window.open('', 'Print', 'height=600,width=800');
  
      mywindow.document.write('<html><head><title>Print</title>');
      mywindow.document.write('</head><body >');
      mywindow.document.write(content);
      mywindow.document.write('</body></html>');
  
      mywindow.document.close();
      mywindow.focus()
      mywindow.print();
      mywindow.close();
      setTimeout(function(){
        this.rrr = true;
      })
      
      return true;
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

  deleteNote(){
    this.formdata = {
      id : this.currentTaskId
    }
    this.http.post(this.globals.baseUrl+'deleteNote',this.formdata,this.headers)
    .subscribe(
        response => {
          this.toast("Deleted successfully...");
          this.showNote = false;
        },
        error => {this.toast("Invalid credentials...");}
    );
  }

  save(){
    if(!this.edescription){
      this.edescription = null;
    }
    if(!this.etype){
      this.etype = null;
    }
    if(!this.ereminderdate){
      this.ereminderdate = null;
    }
    if(!this.eexpecteddate){
      this.eexpecteddate = null;
    }
    if(!this.etitle){
      this.toast("Please enter title");
    }
    else if(!this.eassignee){
      this.toast("Please choose assignee");
    }
    else if(!this.epriority){
      this.toast("Please choose priority");
    }
    else if(!this.estatus){
      this.toast("Please choose status");
    }
    else if(!this.eduedate){
      this.toast("Please enter due date");
    }
    
    else{
      var duedate = moment(new Date(this.eduedate)).format("YYYY-MM-DD");
      var ereminderdate = moment(new Date(this.ereminderdate)).format("YYYY-MM-DD");
      var eexpecteddate = moment(new Date(this.eexpecteddate)).format("YYYY-MM-DD");
      this.formdata = {
        title : this.etitle,
        description : this.edescription,
        user_id : this.eassignee,
        type_id : this.etype,
        priority_id : this.epriority,
        status_id : this.estatus,
        due_date : duedate,
        reminder_date : ereminderdate,
        expected_date : eexpecteddate,
        id : this.currentTaskId
      }
      this.http.post(this.globals.baseUrl+'updatetask',this.formdata,this.headers)
      .subscribe(
          response => {
            this.toast("Task has been Updated...");
            this.router.navigate(['/tasks'])
            setTimeout(function(){
              window.location.reload();
            })
          },
          error => this.errorMessage = <any>error
      );
    }    
}

}



