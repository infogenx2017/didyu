import {  Component,  ChangeDetectionStrategy,  ViewChild,  TemplateRef, OnInit} from '@angular/core';
import {  startOfDay,  endOfDay,  subDays,  addDays,  endOfMonth,  isSameDay,  isSameMonth,  addHours} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  CalendarEvent,  CalendarEventAction,  CalendarEventTimesChangedEvent,  CalendarView } from 'angular-calendar';
import { RouterModule, Router, ActivatedRoute  } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { Globals } from './global';
import * as moment from 'moment';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // styleUrls: ['styles.css'],
  templateUrl: './calendar.component.html',
  providers: [ Globals ] 
})
export class calendarComponent {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  private userId;
  private tasks;
  private formdata;
  private headers;accessToken;alertMessage;events;editTask;
  private etitle;edescription;eassignee;epriority;eduedate;eexpecteddate;etype;estatus;ereminderdate;currentTaskId;currentTask;
  private options;priority;status;type;assignee;role;errorMessage;currentUser;titles;categories;mcat;
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = false;

  constructor(private modal: NgbModal,private router: Router, private http: HttpClient,private oktaAuth: OktaAuthService, private globals: Globals, private route : ActivatedRoute) {
    this.init();
    this.getOptions();
    this.editTask = false;
    this.checkUser();
    this.getTitles();
  }

  async init() {    
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
    this.getTasks();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
    

    
    if(action == 'Clicked'){
      this.currentTask = event;
      this.etitle = event['title'];    
      this.edescription = event['description'];   
      this.eassignee = event['user_id'] ;
      this.epriority = event['priority_id'];
      event['due_date'] = moment(new Date(event['due_date'])).format("MM/DD/YYYY");
      this.eduedate = event['due_date'];
      event['expected_date'] = moment(new Date(event['expected_date'])).format("MM/DD/YYYY");
      this.eexpecteddate = event['expected_date'];
      this.etype = event['type_id'];
      this.estatus = event['status_id'];
      event['reminder_date'] = moment(new Date(event['reminder_date'])).format("MM/DD/YYYY");
      this.ereminderdate = event['reminder_date'];
      this.currentTaskId = event['id'];
      if(event['titles'])
        this.mcat = event['titles']['category_id'];
      this.editTask = true;
    }
    if(action == 'Deleted'){
      this.formdata = {
        id : event.id
      }
      this.http.post(this.globals.baseUrl+'deletetask',this.formdata,this.headers)
      .subscribe(
          response => {
            this.toast("Task has been deleted...");
            this.router.navigate(['/calendar'])
            setTimeout(function(){
              window.location.reload();
            })
          },
          error => this.errorMessage = <any>error
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

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
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
            this.router.navigate(['/calendar'])
            setTimeout(function(){
              window.location.reload();
            })
          },
          error => this.errorMessage = <any>error
      );
    }    
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
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
  
  getTasks(){
    this.userId = localStorage.getItem('userId');    
     this.formdata = {
      id : this.userId
    }
     
     this.http.post(this.globals.baseUrl+'gettask',this.formdata,this.headers)
      .subscribe(
          response => {
            this.events = response
            for(var i =0; i< this.events.length;i++){
              this.events[i].start = subDays(startOfDay(new Date(this.events[i].due_date)), 0); 
              this.events[i].color = {};
              this.events[i].color.primary = this.events[i].statusColor;
              this.events[i].color.secondary = this.events[i].statusColor;
              this.events[i].actions = this.actions
              this.events[i].allDay = true
              this.events[i].resizable = {
                beforeStart: false,
                afterEnd: true
              }
            }
          },
          error => {this.toast("Invalid credentials...");}
      );
  }
  toast(message) {
    this.alertMessage = message;
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
}
