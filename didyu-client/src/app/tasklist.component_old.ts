import {  Component,  ChangeDetectionStrategy,  ViewChild,  TemplateRef, OnInit,AfterViewInit} from '@angular/core';
import {DayPilot, DayPilotSchedulerComponent} from 'daypilot-pro-angular';
import { Globals } from './global';
import { RouterModule, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import {DataService} from './data.service'; {}
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  // styleUrls: ['styles.css'],
  templateUrl: './tasklist.component.html',
  providers: [ Globals ] 
})
export class taskListComponent {

  @ViewChild('scheduler')
  scheduler: DayPilotSchedulerComponent;

  @ViewChild('taskListCompo')
  taskListCompo: taskListComponent;

  private events;titles;categories;showTextbox;showTitlebox;mpriority;
  private resources;editTask;etitle;edescription;eassignee;epriority;eduedate;eexpecteddate;etype;estatus;ereminderdate;;currentTaskId;options;
  username;priority;status;type;assignee;userId;formdata;headers;currentUser;role;alertMessage;accessToken;errorMessage;
   enableTask:Boolean = false;showCreateTask;mcat;taskCount;

   constructor(private ds: DataService,private router: Router, private http: HttpClient,private oktaAuth: OktaAuthService, private globals: Globals) {
    window.alert = function() {};

    // or simply
    var alert = function() {};
    this.init();
    this.getOptions();
    this.getTitles();
    this.gettaskCount();
    this.editTask = false;
    this.checkUser();
    this.showCreateTask = false;
    this.showTextbox = false;
    this.showTitlebox = false;
    this.http.get(this.globals.baseUrl+'categoriesTitle')
    .subscribe( 
      response => {
        this.enableTask = true;
        this.config.resources = response;
        for(var i =0 ;i<this.config.resources.length;i++){
          for(var j =0 ;j<this.config.resources[i].children.length;j++){
            this.config.resources[i].children[j].id = "s"+this.config.resources[i].children[j].id;
          }
        }
      },
      error => {}
    );

    this.http.get(this.globals.baseUrl+'getevents')
    .subscribe( 
      response => {
        this.events = response;
        for(var i =0;i<this.events.length;i++){
          this.events[i].start = moment(new Date(this.events[i].due_date)).format("YYYY-MM-DD");
          this.events[i].end = moment(new Date(this.events[i].due_date)).format("YYYY-MM-DD");
          if(this.events[i].titles) {
            this.events[i].resource = "s"+this.events[i].titles.id;
          }          
          var eventText = this.events[i].status;
          if (typeof eventText !== "undefined") {
            eventText = eventText.substring(0,1);
          }
          this.events[i].text = eventText;
        }
      },
      error => {}
    );
  }
  config: any = {
    locale: "en-us",
    cellWidthSpec: "Fixed",
    cellWidth: 60,
    crosshairType: "Header",
    timeHeaders: [{ groupBy: "Month" },{"groupBy":"Day","format":"ddd"},{"groupBy":"Day","format":"d"}],
    scale: "Day",
    days: DayPilot.Date.today().daysInMonth(),
    startDate: DayPilot.Date.today().firstDayOfMonth(),
    showNonBusiness: true,
    businessWeekends: false,
    floatingEvents: true,
    eventHeight: 40,
    eventMovingStartEndEnabled: false,
    eventResizingStartEndEnabled: false,
    timeRangeSelectingStartEndEnabled: false,
    groupConcurrentEvents: false,
    eventStackingLineHeight: 100,
    allowEventOverlap: true,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: args => {
      this.showCreateTask = true;
      // var dp = this;
      // DayPilot.Modal.prompt("Create a new event:", "Event 1").then(function(modal) {
      //   dp.clearSelection();
      //   if (!modal.result) { return; }
      //   dp.events.add(new DayPilot.Event({
      //     start: args.start,
      //     end: args.end,
      //     id: DayPilot.guid(),
      //     resource: args.resource,
      //     text: modal.result
      //   }));
      // });
    },
    eventMoveHandling: "Update",
    onEventMoved: function (args) {
      this.message("Event moved");
    },
    eventResizeHandling: "Update",
    onEventResized: function (args) {
      this.message("Event resized");
    },
    eventDeleteHandling: "Update",
    onEventDeleted: function (args) {
      this.message("Event deleted");
    },
    eventClickHandling: "Update",

    onBeforeCellRender: args => {
        if (args.cell.start < DayPilot.Date.today() && args.cell.end < DayPilot.Date.today()) {
            args.cell.cssClass = "not_available";
            args.cell.html = "N/A";
        }
    },
    
    onEventClicked: args => {
      if(args && args.e && args.e.data) {
        var data = args.e.data;
        this.etitle = data['title'];    
        this.edescription = data['description'];   
        this.eassignee = data['user_id'] ;
        this.epriority = data['priority_id'];
        data['due_date'] = moment(new Date(data['due_date'])).format("MM/DD/YYYY");
        this.eduedate = data['due_date'];
        data['expected_date'] = moment(new Date(data['expected_date'])).format("MM/DD/YYYY");
        this.eexpecteddate = data['expected_date'];
        this.etype = data['type_id'];
        this.estatus = data['status_id'];
        data['reminder_date'] = moment(new Date(data['reminder_date'])).format("MM/DD/YYYY");
        this.ereminderdate = data['reminder_date'];
        this.currentTaskId = data['id'];
        if(data['titles'])
        this.mcat = data['titles']['category_id'];
        this.editTask = true;
      }
      else{
        this.toast("Event does not found");
      }
    },
    eventHoverHandling: "Bubble",
    bubble: new DayPilot.Bubble({
      onLoad: function(args) {
        // if event object doesn't specify "bubbleHtml" property 
        // this onLoad handler will be called to provide the bubble HTML
        if(args && args.source && args.source.data) {
          args.html = args.source.data.title + " - " + args.source.data.status;
        }
        else {
          args.html = "Event details";
        }
        
      }
    }),
    treeEnabled: true,
  };

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

  setshowCreateCategory(e){
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
  cancel(){
    this.editTask = false;
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
      var eduedate = moment(new Date(this.eduedate)).format("YYYY-MM-DD");
      var ereminderdate = moment(new Date(this.ereminderdate)).format("YYYY-MM-DD");
      var eexpecteddate = moment(new Date(this.eexpecteddate)).format("YYYY-MM-DD");
      this.formdata = {
        title : this.etitle,
        description : this.edescription,
        user_id : this.eassignee,
        type_id : this.etype,
        priority_id : this.epriority,
        status_id : this.estatus,
        due_date : eduedate,
        reminder_date : ereminderdate,
        expected_date : eexpecteddate,
        id : this.currentTaskId
      }
      this.http.post(this.globals.baseUrl+'updatetask',this.formdata,this.headers)
      .subscribe(
          response => {
            this.toast("Task has been Updated...");
            this.router.navigate(['/tasklist'])
            setTimeout(function(){
              window.location.reload();
            })
          },
          error => this.errorMessage = <any>error
      );
    }    
  }

  setshowCreateTask(e){
    if(e){
      this.showCreateTask = e;
    } else {
      this.showCreateTask = !this.showCreateTask;
    }
  }

  assignColor(color){
    return {
      background : color
    };
  }
  toast(message) {
    this.alertMessage = message;
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
  
  filterEvents(e) {
    this.formdata = {
      priority: this.mpriority
    };
    var body = 'priority='+this.mpriority;
    this.http.post(this.globals.baseUrl+'filterEvents',this.formdata,this.headers)
    .subscribe( 
      response => {
        this.events = response;
        for(var i =0;i<this.events.length;i++){
          this.events[i].start = moment(new Date(this.events[i].due_date)).format("YYYY-MM-DD");
          this.events[i].end = moment(new Date(this.events[i].due_date)).format("YYYY-MM-DD");
          if(this.events[i].titles) {
            this.events[i].resource = "s"+this.events[i].titles.id;
          }          
          var eventText = this.events[i].status;
          if (typeof eventText !== "undefined") {
            eventText = eventText.substring(0,1);
          }
          this.events[i].text = eventText;
        }
      },
      error => {}
    );
  }
}
