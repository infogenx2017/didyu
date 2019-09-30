import { Component } from '@angular/core';
import { Globals } from './global';

@Component({
  selector: 'app-root',
  templateUrl: './roles.component.html',
  styleUrls: [],
  providers: [ Globals ] 
})
export class rolesComponent {
  title = 'task';
}



