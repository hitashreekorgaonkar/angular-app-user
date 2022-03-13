import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  baseUrl = "http://localhost:3000/";

  constructor(
    private http: HttpClient
  ) { }


  userExists(data: any) {
    return this.http.get<any>(this.baseUrl + "posts?email_like=" + data).pipe(map((res: any) => {
      return res
    }));
  }

  userLogin(data: any) {
    return this.http.get<any>(this.baseUrl + "posts").pipe(map((res: any) => {
      return res
    }));
  }

  userSignup(data: any) {
    return this.http.post<any>(this.baseUrl + "posts", data).pipe(map((res: any) => {
      return res
    }));
  }

  updateUser(data: any, id: number) {
    return this.http.put<any>(this.baseUrl + "posts/" + id, data).pipe(map((res: any) => {
      return res
    }));
  }
  userInfo(userId) {
    return this.http.get<any>(this.baseUrl + "posts/" + userId);
  }

}
