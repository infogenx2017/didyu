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
  private moverdue;
  private mduedate;
  private mreminderdate;status_notify;overdue_notify;
  private mexpecteddate;showTextbox;showTitlebox;
  private recurenddate;
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

  @Output() closePopup = new EventEmitter(); 
  constructor(private router: Router, private http: HttpClient, private oktaAuth: OktaAuthService, private globals: Globals){
    this.init();
    this.getOptions();
    this.getTitles();
    this.showTextbox = false;
    this.status_notify = false;
    this.overdue_notify = false;
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

  showCreateCat(){
    if(this.mcat == 'add') {
      this.showTextbox = true;
      this.closePopup.emit(false);
    }
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

  changeStatusNotify(param){
    this.status_notify = param.target.checked;
  }

  changeOverdueNotify(param){
    this.overdue_notify = param.target.checked;
  }

  get selectedDays() { // right now: ['1','3']
  return this.days
              .filter(day => day.checked)
              .map(day => day.value);
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

  isEmpty(value):boolean{
    if(value == '' || value==null || value == undefined){
      return true;
    }
    return false;
  }

  save(){
    if(!this.mdescription){
      this.mdescription = null;
    }

    if(this.isrecurring == 0){
      this.is_recurring = 0;
      this.recurring_type = '';
      this.recurring_when = '';
      this.recurring_end_date = null;
    }
    else{
      if(!this.mtype){
          this.toast('Select recurring type');
          return false;
      } else if(!this.recurenddate) {
          this.toast('Select recurring end date');
          return false;
      } else {
          this.is_recurring = 1;
          this.recurringData =this.getRecurringData(this.mtype);
          if(this.recurringData == 'error') {
              this.toast('Kindly give all the appropriate details');
              return false;
          }
      }
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
    /*else if(!this.moverdue){
      this.toast("Please choose overdue period");
    }*/
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
          created_by: localStorage.getItem('userId'),
          type_id : this.mtype,
          priority_id : this.mpriority,
          status_id : this.mstatus,
          overdue: this.moverdue,
          due_date : mduedate,
          reminder_date : mreminderdate,
          expected_date : mduedate,
          is_recurring : this.is_recurring,
          status_notify : this.status_notify,
          overdue_notify : this.overdue_notify,
          recurring_type : this.recurring_type,
          recurring_when : this.recurring_when,
          recurring_end_date : this.recurring_end_date
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




