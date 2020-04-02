import {  Component,  ChangeDetectionStrategy,  ViewChild,  TemplateRef, OnInit,AfterViewInit} from '@angular/core';
import {DayPilot, DayPilotSchedulerComponent} from 'daypilot-pro-angular';
import { Globals } from './global';
import { RouterModule, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import {DataService} from './data.service'; {}
import * as moment from 'moment';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

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
  private resources;editTask;canEditAll;etitle;edescription;eassignee;epriority;eduedate;eexpecteddate;etype;estatus;ereminderdate;;currentTaskId;options;
  username;priority;status;type;assignee;userId;formdata;headers;currentUser;role;alertMessage;accessToken;errorMessage;
   enableTask:Boolean = false;showCreateTask;mcat;taskCount;showMenuEditor;

  private memberId;

  private recurenddate;
  private status_notify;overdue_notify;
  private parent_task;
  od_periods = [
      {day:'1',text:'1 day'},
      {day:'2',text:'2 days'},
      {day:'3',text:'3 days'},
      {day:'4',text:'4 days'},
      {day:'5',text:'5 days'},
      {day:'6',text:'6 days'},
      {day:'7',text:'Week'},
      {day:'30',text:'Month'},
  ];
  // for the recurring type every day
  recurringData;
  recurringDay = "every";
  recurringDayDay = 1;
  selectedDay;
  days = [    
    {name:'Monday', value:'1', checked:false},
    {name:'Tuesday', value:'2', checked:false},
    {name:'Wednesday', value:'3', checked:false},
    {name:'Thursday', value:'4', checked:false},
    {name:'Friday', value:'5', checked:false},
    {name:'Saturday', value:'6', checked:false},
    {name:'Sunday', value:'7', checked:false},
  ];
  second_weekdays = [    
    {name:'Monday', value:'1', checked:false},
    {name:'Wednesday', value:'3', checked:false},
    {name:'Friday', value:'5', checked:false},
  ];
  weekday;
  second_weekday;
  week;
  recurringMonthDate;
  recurringMonth;
  recurringYearDate;
  recurringYearMonth;
  checkBoxdays;
  recurringMonthDay;
  recurringMonthMonth=1;
  weekNo;
  recurringMonthMonth2=1;
  year=1;
  recurringYear="0";
  recurringYearmonth1;
  recurringYearWeekNo;
  recurringYearDay;
  
  /** Recurring variable **/
  isrecurring=0;
  is_recurring=0; //for database
  recurring_type = ''; //for database
  recurring_when = ''; //for database
  recurring_end_date = null; //for database
  /** Recurring variable **/

  /** select2 options **/
  public select2_options_data;
  public select2_options = Options;
  public select3_options = Options;
  public show_titles;
  /** select2 options **/

  constructor(private ds: DataService,private router: Router, private http: HttpClient,private oktaAuth: OktaAuthService, private globals: Globals) {
    window.alert = function() {};

    // or simply
    var alert = function() {};
    
    this.init();
    this.memberId = this.router.url.split("/tasklist/");
    if(this.memberId[0] != '/tasklist'){
      this.memberId = this.memberId[1];
    } else {
      this.memberId = '';
    }
    this.getOptions();
    this.getTitles();
    this.gettaskCount();
    this.editTask = false;
    this.canEditAll = false;
    this.checkUser();
    this.showCreateTask = false;
    this.showMenuEditor = false;
    this.showTextbox = false;
    this.showTitlebox = false;
    this.status_notify = 0;
    this.overdue_notify = 0;
    this.parent_task = 0;

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

    /*this.http.get(this.globals.baseUrl+'getevents')
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
          this.events[i].cssClass = this.events[i].id;
        }
      },
      error => {}
    );*/

    this.userId = localStorage.getItem('userId');
    if(this.userId){
      this.formdata = {
        userId : this.userId,
        memberId: this.memberId,
      }
    }
    this.http.post(this.globals.baseUrl+'getUserTasks',this.formdata,this.headers)
    .subscribe( 
      response => {
      //console.log(response);
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
          this.events[i].cssClass = this.events[i].id;
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
      //this.showCreateTask = true;
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
    onEventClicked: args => {
      if(args && args.e && args.e.data) {
        var data = args.e.data;
        //console.log(data);
        this.canEditAll = false;
        if(localStorage.getItem('userId') == data['created_by'])
            this.canEditAll = true;
        this.etitle = data['title_id'];    
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

        //Set title value (sub category)
        this.formdata = {
          catid : this.mcat,
        }

        this.http.post(this.globals.baseUrl+'getTitlesOfCategory',this.formdata,this.headers)
        .subscribe( (data) => {
          this.titles = data;
          this.mcat = this.mcat;
          this.show_titles = true;
        })

        //recurring values

        this.isrecurring = data['is_recurring'];
        if(data['recurring_type'] == 'Every Day') {
            this.recurring_type = '1';
            this.recurenddate = moment(new Date(data['recurring_end_date'])).format("MM/DD/YYYY");
        } else if(data['recurring_type'] == 'Every Weekday') {
            this.recurring_type = '2';
            this.recurenddate = moment(new Date(data['recurring_end_date'])).format("MM/DD/YYYY");
            this.weekday = data['recurring_when'];
        } else if(data['recurring_type'] == 'Every Second Weekday') {
            this.recurring_type = '3';
            this.recurenddate = moment(new Date(data['recurring_end_date'])).format("MM/DD/YYYY");
            this.second_weekday = data['recurring_when'];
        } else if(data['recurring_type'] == 'Weekly') {
            this.recurring_type = '4';
            this.recurenddate = moment(new Date(data['recurring_end_date'])).format("MM/DD/YYYY");
            this.week = data['recurring_when'];
        } else if(data['recurring_type'] == 'Monthly') {
            this.recurring_type = '5';
            this.recurenddate = moment(new Date(data['recurring_end_date'])).format("MM/DD/YYYY");
            var when = data['recurring_when'].split('-');
            this.recurringMonthDate = when[0];
            this.recurringMonth = when[1];
        } else if(data['recurring_type'] == 'Annually') {
            this.recurring_type = '6';
            this.recurenddate = moment(new Date(data['recurring_end_date'])).format("MM/DD/YYYY");
            var when = data['recurring_when'].split('-');
            this.recurringYearDate = when[0];
            this.recurringYearMonth = when[1];
        }
        
        //recurring values

        this.status_notify = parseInt(data['status_notify']);
        this.overdue_notify = parseInt(data['overdue_notify']);
        this.parent_task = data['parent_task'];

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

    onBeforeCellRender: args => {
        /*if (args.cell.start < DayPilot.Date.today() && args.cell.end < DayPilot.Date.today()) {
            args.cell.cssClass = "not_available";
            args.cell.html = "N/A";
        }*/
    },

    onBeforeTimeHeaderRender: args => {
        //console.log(args);
        if (args.header.start.getDatePart().getTime() === new DayPilot.Date().getDatePart().getTime()) {
            args.header.backColor = "#ff8c00";
            args.header.cssClass = "silver";
        }
        /*if (args.header.html == '14') {
            args.header.backColor = "#c71c1c";
            args.header.cssClass = "silver";
        }*/
    },

    onBeforeRowHeaderRender: args => {
      //console.log(args);
      if(args.row.cssClass == "parent_row") {
          args.row.areas = [
              { right: 5, cssClass: 'create-task-class', html: '<i class="far fa-plus-square"></i>' }
          ];
      }
    },

    ResourceHeaderClickHandling: "JavaScript",
    onResourceHeaderClick: args => {
      //this.showMenuEditor = true;
      this.showCreateTask = true;
      //this.mcat = args.resource.id;
    },

    /*rowClickHandling : "JavaScript",
    onRowClick: args => {
        console.log('Hi');
    },*/
    /*rowClickHandling : "Edit",
    onRowEdited: function(args) {
      //console.log("Row text changed to " + args.newText);
    },*/
    onAfterRender: args => {
      //console.log(args);
      //console.log(new DayPilot.Date().addDays(-1));
      $('.scheduler_default_main').children().first().addClass('left_calblock');
      $('.scheduler_default_main div:nth-child(3)').addClass('right_calblock');
      /*var navPosition = $('.scheduler_default_matrix').scrollLeft(),
          elemPosition = $('.silver').offset().left;

      console.log(navPosition);
      console.log(elemPosition);

      // Add the two together to get your scroll distance and animate    
      $(".scheduler_default_matrix").animate({scrollLeft: navPosition + elemPosition}, 800);*/
    },
    scrollTo: new DayPilot.Date().addDays(-1),
  };

  async init() {    
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });

    this.show_titles = true;

    this.select2_options = {
      //width: '500',
      tags: true,
      placeholder: 'Create Category'
    };

    this.select3_options = {
      //width: '500',
      tags: true,
      placeholder: 'Create Title'
    };
  }

  previous(): void {
    this.config.startDate = new DayPilot.Date(this.config.startDate).addMonths(-1);
    this.config.days = this.config.startDate.daysInMonth();
  }

  next(): void {
    this.config.startDate = new DayPilot.Date(this.config.startDate).addMonths(1);
    this.config.days = this.config.startDate.daysInMonth();
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

  /*getTitles(){
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
  }*/

  /** old --- 08/12/2019 **/
  /*getTitles(){
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
  }*/
  /** old --- 08/12/2019 **/

  getTitles(){
      this.http.get(this.globals.baseUrl+'getCategories')
      .subscribe( 
        response => {
          this.categories = response
        },
        error => {}
      );
  }

  categoryChanged(cat) {
      this.show_titles = false;
      this.etitle = '';
      if(cat != null) {
          this.formdata = {
            catid : cat,
          }

          this.http.post(this.globals.baseUrl+'addOrUpdateCategory',this.formdata,this.headers)
          .subscribe( 
            response => {
              //console.log(response);
              this.categories = response
            },
            error => {}
          );

          this.formdata = {
            catid : cat,
          }

          this.http.post(this.globals.baseUrl+'getTitlesOfCategory',this.formdata,this.headers)
          .subscribe( (data) => {
            this.titles = data;
            this.mcat = cat;
            this.show_titles = true;
          });
      } else {
          this.show_titles = false;
      }
  }

  titleChanged(title) {
      this.show_titles = false;
      if(title != null && this.mcat != null) {
          this.formdata = {
            catid : this.mcat,
            title : title
          }

          this.http.post(this.globals.baseUrl+'addOrUpdateTitle',this.formdata,this.headers)
          .subscribe( 
            response => {
              //console.log(response);
              this.titles = response;
              this.show_titles = true;
            },
            error => {}
          );
      } else {
          this.show_titles = true;
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
    this.showMenuEditor = false;
  }

  changeStatusNotify(param){
    this.status_notify = param.target.checked;
  }

  changeOverdueNotify(param){
    this.overdue_notify = param.target.checked;
  }

  gettaskCount(){
    this.userId = localStorage.getItem('userId');
    this.formdata = {
      userId : this.userId,
      memberId: this.memberId,
    }
    this.http.post(this.globals.baseUrl+'gettaskCount',this.formdata,this.headers)
    .subscribe( (data) => {
      this.taskCount = data
     });  
  }

  changeOnMtype(){
    this.days = [    
      {name:'Monday', value:'1', checked:false},
      {name:'Tuesday', value:'2', checked:false},
      {name:'Wednesday', value:'3', checked:false},
      {name:'Thursday', value:'4', checked:false},
      {name:'Friday', value:'5', checked:false},
      {name:'Saturday', value:'6', checked:false},
      {name:'Sunday', value:'7', checked:false},
    ];
  }

  getRecurringData(recurringType) {
      if(recurringType == 1) {
          this.recurring_type = 'Every Day';
          this.recurring_when = '';
          var recurenddate = this.recurenddate ?  moment(new Date(this.recurenddate)).format("YYYY-MM-DD") : null;
          this.recurring_end_date = recurenddate;
      } else if(recurringType == 2) {
          if(!this.weekday || this.weekday == 0) {
              return 'error';
          } else {
              this.recurring_type = 'Every Weekday';
              this.recurring_when = this.weekday;
              var recurenddate = this.recurenddate ?  moment(new Date(this.recurenddate)).format("YYYY-MM-DD") : null;
              this.recurring_end_date = recurenddate;
          }
      } else if(recurringType == 3) {
          if(!this.second_weekday || this.second_weekday == 0) {
              return 'error';
          } else {
              this.recurring_type = 'Every Second Weekday';
              this.recurring_when = this.second_weekday;
              var recurenddate = this.recurenddate ?  moment(new Date(this.recurenddate)).format("YYYY-MM-DD") : null;
              this.recurring_end_date = recurenddate;
          }
      } else if(recurringType == 4) {
          if(!this.week || this.week == 0) {
              return 'error';
          } else {
              this.recurring_type = 'Weekly';
              this.recurring_when = this.week;
              var recurenddate = this.recurenddate ?  moment(new Date(this.recurenddate)).format("YYYY-MM-DD") : null;
              this.recurring_end_date = recurenddate;
          }
      } else if(recurringType == 5) {
          if(!this.recurringMonthDate || this.recurringMonthDate == 0) {
              return 'error';
          } else if(!this.recurringMonth || this.recurringMonth == 0) {
              return 'error';
          } else {
              this.recurring_type = 'Monthly';
              this.recurring_when = this.recurringMonthDate+'-'+this.recurringMonth;
              var recurenddate = this.recurenddate ?  moment(new Date(this.recurenddate)).format("YYYY-MM-DD") : null;
              this.recurring_end_date = recurenddate;
          }
      } else if(recurringType == 6) {
          if(!this.recurringYearDate || this.recurringYearDate == 0) {
              return 'error';
          } else if(!this.recurringYearMonth || this.recurringYearMonth == 0) {
              return 'error';
          } else {
              this.recurring_type = 'Annually';
              this.recurring_when = this.recurringYearDate+'-'+this.recurringYearMonth;
              var recurenddate = this.recurenddate ?  moment(new Date(this.recurenddate)).format("YYYY-MM-DD") : null;
              this.recurring_end_date = recurenddate;
          }
      }
  }

  save(){
    if(!this.edescription){
      this.edescription = null;
    }

    if(this.isrecurring == 0 || this.isrecurring == null){
      this.is_recurring = 0;
      this.recurring_type = '';
      this.recurring_when = '';
      this.recurring_end_date = null;
      /*console.log(this.isrecurring);
      return false;*/
    }
    else{
      /*console.log('No');
      return false;*/
      if(!this.recurring_type){
          this.toast('Select recurring type');
          return false;
      } else if(!this.recurenddate) {
          this.toast('Select recurring end date');
          return false;
      } else {
          this.is_recurring = 1;
          this.recurringData =this.getRecurringData(this.recurring_type);
          if(this.recurringData == 'error') {
              this.toast('Kindly give all the appropriate details');
              return false;
          }
      }
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
        created_by: localStorage.getItem('userId'),
        type_id : this.etype,
        priority_id : this.epriority,
        status_id : this.estatus,
        due_date : eduedate,
        reminder_date : ereminderdate,
        expected_date : eexpecteddate,
        id : this.currentTaskId,
        is_recurring : this.is_recurring,
        status_notify : this.status_notify,
        overdue_notify : this.overdue_notify,
        recurring_type : this.recurring_type,
        recurring_when : this.recurring_when,
        recurring_end_date : this.recurring_end_date,
        parent_task : this.parent_task
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

  setshowMenuEditor(e){
    if(e){
      this.showMenuEditor = e;
    } else {
      this.showMenuEditor = !this.showMenuEditor;
    }
  }

  assignColor(color, fontcolor){
    return {
      background : color,
      color : fontcolor
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

  filterEventsByStatus(status_id) {
    this.formdata = {
      status: status_id
    };
    var body = 'status='+status_id;
    this.http.post(this.globals.baseUrl+'filterEventsByStatus',this.formdata,this.headers)
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

