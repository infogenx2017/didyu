import {Injectable} from '@angular/core';
import {DayPilot} from 'daypilot-pro-angular';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class DataService {

  resources: any[] = [
    { name: 'Group A', id: 'GA', expanded: true, children: [
      { name: 'Resource 1', id: 'R1' },
      { name: 'Resource 2', id: 'R2' }
    ]},
    { name: 'Group B', id: 'GB', expanded: true, children: [
      { name: 'Resource 3', id: 'R3', unavailable: true},
      { name: 'Resource 4', id: 'R4'}
    ]}
  ];

  events: any[] = [
    {
      id: '1',
      resource: 'R1',
      start: '2019-05-03',
      end: '2019-05-08',
      text: 'Scheduler Event 1',
      color: '#e69138'
    },
    {
      id: '2',
      resource: 'R2',
      start: '2019-05-02',
      end: '2019-05-05',
      text: 'Scheduler Event 2',
      color: '#6aa84f'
    },
    {
      id: '3',
      resource: 'R2',
      start: '2019-05-06',
      end: '2019-05-09',
      text: 'Scheduler Event 3',
      color: '#3c78d8'
    }
  ];

  constructor(private http: HttpClient) {
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString());
  }

  getResources(): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.resources);
      }, 200);
    });

    // return this.http.get("/api/resources");
  }

}
