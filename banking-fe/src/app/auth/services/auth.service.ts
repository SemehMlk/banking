import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  endpoint: string = `${environment.apiUrl}`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  tokenKeyCode = 'DGyuj876VBN';
  private role = new Subject<any>();
  private currentRoleSubject: BehaviorSubject<any>;
  private userName = new Subject<any>();
  public currentRole: Observable<any>;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    public router: Router,

  ) {
    this.currentRoleSubject = new BehaviorSubject<any>(localStorage.getItem('abc'));
    this.currentRole = this.currentRoleSubject.asObservable();
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Sign-in
  signIn(user: any) {
    return this.http.post<any>(`${this.endpoint}/admin/login`, user)
  }

  getToken() {
    return localStorage.getItem(this.tokenKeyCode);
  }
  publishRole(data: any) {
    this.role.next(data);
    this.currentRoleSubject.next(data);
  }

  publishUser(user: any) {
    this.currentUserSubject.next(user);
  }

  roleObservable(): Subject<any> {
    return this.role;
  }
  publishUserName(data: any) {
    this.userName.next(data);
  }
  userNameObservable(): Subject<any> {
    return this.userName;
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem(this.tokenKeyCode);
    return (authToken !== null) ? true : false;
  }

  public get currentUserRole(): any {
    return this.currentRoleSubject.value;
  }

  doLogout() {
    let api = `${this.endpoint}/admin/logout`;
    return this.http.post(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        console.log(res)
        let removeToken = localStorage.removeItem(this.tokenKeyCode);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('abc');
        localStorage.removeItem('user');
        localStorage.removeItem('DGyuj876VBN');
        if (removeToken == null) {
          console.log('redirection')
          this.router.navigate(['login']);
        }
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  logout() {
    let removeToken = localStorage.removeItem(this.tokenKeyCode);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('abc');
    localStorage.removeItem('user');
    localStorage.removeItem('DGyuj876VBN');
    if (removeToken == null) {
      console.log('redirection')
      this.router.navigate(['login']);
    }
  }

  forggotPassword(email) {
    let api = `${this.endpoint}/admin/send_reset_link_email`;
    return this.http.post<any>(api, email);
  }
  // User profile
  getUserProfile(token): Observable<any> {
    let api = `${this.endpoint}/users/profil?api_token=${token}`;
    return this.http.post(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        console.log(res)
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  // Users
  getUsers(): Observable<any> {
    let api = `${this.endpoint}/get-users`;

    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  // update user by id
  updateUserById(user): Observable<any> {
    let api = `${this.endpoint}/users/edit/${user.id}`;
    return this.http.post(api, user).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }


  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}