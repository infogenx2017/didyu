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
  // for the recurring type every day
  recurringData;
  recurringDay = "every";
  recurringDayDay = 1;
  selectedDay;
  days = [    
    {name:'Monday', value:'1', checked:false},
    {name:'Tuesday', value:'2', checked:false},
    {name:'wenesday', value:'3', checked:false},
    {name:'Thursday', value:'4', checked:false},
    {name:'Friday', value:'5', checked:false},
    {name:'Satday', value:'6', checked:false},
    {name:'Sunday', value:'7', checked:false},
  ];
  week=1;
  weekDay=1;
  checkBoxdays;
  recurringMonth="0";
  recurringMonthDay=1;
  recurringMonthMonth=1;
  weekNo;
  recurringMonthMonth2=1;
  year=1;
  recurringYear="0";
  recurringYearmonth1;
  recurringYearDate=1;
  recurringYearWeekNo;
  recurringYearDay;
  recurringYearMonth;
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
  get selectedDays() { // right now: ['1','3']
  return this.days
              .filter(day => day.checked)
              .map(day => day.value);
  }
  changeOnMtype(){
    this.days = [    
      {name:'Monday', value:'1', checked:false},
      {name:'Tuesday', value:'2', checked:false},
      {name:'wenesday', value:'3', checked:false},
      {name:'Thursday', value:'4', checked:false},
      {name:'Friday', value:'5', checked:false},
      {name:'Satday', value:'6', checked:false},
      {name:'Sunday', value:'7', checked:false},
    ];
  }
  checkSubFields(mtype):any{
    if(mtype==1){
      // if(this.isEmpty(this.recurringDayDay) || this.recurringDayDay <= 0 || this.recurringDayDay>30 ){
      //   this.toast("please enter valid days")
      //   return null;
      // }
      return {
        // recurring_day: this.recurringDayDay
        recurring_day: mtype
      }
    }
    else if(mtype==4){
      if(!this.weekDay)
      {
        this.toast("please select atleast one day")
        return null;      
      }
      // if(this.week<=0){
      //   this.toast("please enter valid week");
      //   return null;
      // }
      return {
        // recurring_week: this.week,
        // recurring_days:this.selectedDays
        recurring_day:this.weekDay
      }
    }
    else if(mtype == 5){
      if(this.recurringMonth == "0"){
        if(this.isEmpty(this.recurringMonthDay)){
          return null;
        }
        // if(this.isEmpty(this.recurringMonthMonth)){
        //   return null;
        // }
        return {
          // recurring_month :this.recurringMonthMonth,
          recurring_day : this.recurringMonthDay
        };
      }
      else{
        if(this.isEmpty(this.weekNo)){
          this.toast("please select week")
          return null;
        }
        if(this.isEmpty(this.selectedDay)){
          this.toast("please select day");
          return null;
        }
        if(this.isEmpty(this.recurringMonthMonth2 || this.recurringMonthMonth2>30)){
          this.toast("please enter valid month")
          return null;
        }
        return {
          // recurring_week: this.weekNo,
          recurring_day : this.selectedDay,
          recurring_month: this.recurringMonthMonth2
        };
      }
    }
    else if(mtype == 6){
      // if(this.year<=0){
      //   this.toast("please enter valid number of the years");
      //   return null;
      // }
      if(this.recurringYear="0"){
        if(!this.recurringYearmonth1){
          this.toast("please select month");
          return null;
        }
        if(this.isEmpty(this.recurringYearDate) || this.recurringYearDate > 30 || this.recurringYearDate < 0){
          this.toast("please enter valid date");
          return null;
        }        
        return {
          recurring_day : this.recurringYearDate+'-'+this.recurringYearmonth1,
          // recurring_month : this.recurringYearmonth1,
          // recurring_date : this.recurringYearDate
        }
      }
      else{
        if(!this.recurringYearWeekNo){
          this.toast("please select week");
          return null;
        }
        if(!this.recurringYearMonth){
          this.toast("please select month");
          return null;
        }
        if(!this.recurringYearDay){
          this.toast("please select day");
          return null;
        }
        return {
          recurring_week_no : this.recurringYearWeekNo,
          recurring_month : this.recurringYearMonth,
          recurring_day : this.recurringYearDay
        }
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
    if(!this.mtype){
      this.mtype = null;
    }
    else{
       this.recurringData =this.checkSubFields(this.mtype)      
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
    else if(!this.recurringData){
      this.recurringData=null;
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
        notify : this.notify,
        recurring_data : this.recurringData
      }

      // console.log(this.formdata);
      
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



