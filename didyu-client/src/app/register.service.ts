import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { HttpClient,HttpHeaders,HttpParams,HttpRequest} from '@angular/common/http';
// import { Observable } from 'rxjs';  
// import { map } from 'rxjs/operators';
export interface Role {
  id: Number,
  name: String
}
const requestOptions = {
  params: new HttpParams()
};
requestOptions.params.set('foo', 'bar');
@Injectable({
  providedIn: 'root'
})

export class registerService {
  private accessToken;
  private headers;
  constructor(private oktaAuth: OktaAuthService, private http: HttpClient) {
    this.init();
  }
  async init() {
    this.accessToken = await this.oktaAuth.getAccessToken();
    this.headers = new Headers({
        Authorization: 'Bearer ' + this.accessToken
    });
  }
  httpGet(url){

    // return this.http.get(API_URL + url, {responseType: 'text'})
    // .pipe(
    //   map<Role[]>(res => res)
    // );
    // return this.http.get(API_URL + url,this.headers).
    // map<Role[]>(res => res);
    // .pipe(
      // map(res => res);
    // .pipe(map((response : Response) => {
    //     return response;   
    // }));
    // .map<Role[]>(res => res)
    // .pipe(
      // map<Role[],{}>((res) => res));
  }
  // httpPost(role,url): Observable<Role> {
    // return this.http.post(API_URL + url, role,this.headers
    // ).map(res => res);
// }
}



