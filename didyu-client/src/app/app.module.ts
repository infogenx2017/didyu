import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { sideBarComponent } from './sidebar.component';
import { navBarComponent } from './navigation.component';
import { registerComponent } from './register.component';
import { rolesComponent } from './roles.component';
import { usersComponent } from './users.component';
import { usersActivityComponent } from './usersactivity.component';
import { dashboardComponent } from './dashboard.component';
import { createtaskComponent } from './createtask.component';
import { taskComponent } from './task.component';
import { changePasswordComponent } from './changePassword.component';
import { calendarComponent } from './calendar.component';
import { titleComponent } from './title.component';
import { taskListComponent } from './tasklist.component';
import { titleCategoryComponent } from './titleCategory.component';
import { createCategoryComponent } from './createcategory.component';
import { createTitleComponent } from './createtitle.component';
import { Globals } from './global';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { OktaAuthModule, OktaCallbackComponent } from '@okta/okta-angular';
import { Role,registerService } from './register.service';
import { MyFilterPipe, MyPriorityFilterPipe, TitleFilterPipe,CategoryFilterPipe } from './customFilter.js';
import { DateFilterPipe } from './customFilter.js';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { ClickOutsideModule } from 'ng-click-outside';
import { FlatpickrModule } from 'angularx-flatpickr';

// import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import {DayPilotModule} from 'daypilot-pro-angular';
import { DataService } from './data.service';


const oktaConfig = {
  issuer: 'https://dev-541473.okta.com',
  redirectUri: 'http://localhost:4200/implicit/callback',
  clientId: '{yourClientId}'
};

const appRoutes: Routes = [ 
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: registerComponent },
  { path: 'login', component: registerComponent },
  { path: 'forgetpassword', component: registerComponent },
  { path: 'changePassword', component: changePasswordComponent },
  { path: 'roles', component: rolesComponent },
  { path: 'users', component: usersComponent },
  { path: 'activity', component: usersActivityComponent },
  { path: 'dashboard', component: taskComponent },
  { path: 'summary', component: taskComponent },
  { path: 'report', component: taskComponent },
  { path: 'createtask', component: createtaskComponent },
  { path: 'calendar', component: calendarComponent },
  { path: 'title', component: titleComponent },
  { path: 'category', component: titleCategoryComponent },
  { path: 'tasklist', component: taskListComponent },
  { path: 'tasks', component: taskComponent,children :[
    {
      path : ":id",component:taskComponent
    }
  ] },
  { path: 'implicit/callback', component: OktaCallbackComponent },
  // { path: '**', redirectTo: '', pathMatch: 'full' },
  ];

@NgModule({
  declarations: [ 
    AppComponent,
    sideBarComponent,
    navBarComponent,
    registerComponent,
    rolesComponent,
    usersComponent,
    dashboardComponent,
    createtaskComponent,
    taskComponent,
    changePasswordComponent,
    usersActivityComponent,
    titleComponent,
    calendarComponent,
    titleCategoryComponent,
    taskListComponent,
    createCategoryComponent,
    createTitleComponent,
    MyFilterPipe,
    MyPriorityFilterPipe,
    DateFilterPipe,
    TitleFilterPipe,
    CategoryFilterPipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    CommonModule,
    FormsModule,
    HttpClientModule,
    OktaAuthModule.initAuth(oktaConfig),
    AngularDateTimePickerModule,
    BsDatepickerModule.forRoot(),
    ClickOutsideModule,
    BrowserAnimationsModule,
    DayPilotModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [Globals,DataService],
  bootstrap: [AppComponent],
  exports: [calendarComponent]
})
export class AppModule { }
