import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../app.config';
import {AuthService} from './auth.service';
import {User} from '../models/user';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiResponse} from '../models/api-response';
import {handleError, handleForbiddenUser, ServiceUtil, toApiResponse} from './service.util';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly api = AppConfig.config.api;

  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    this.util = new ServiceUtil(auth);
  }

  getUsers(): Observable<ApiResponse<User[]>> {
    const token = this.auth.getUserToken() || '';
    const headers = new HttpHeaders({'X-Auth-Token': token});
    return this.http.get<User[]>(`${this.api}/users`, {observe: 'response', headers}).pipe(
      toApiResponse<User[]>(),
      catchError(handleError<User[]>()),
      handleForbiddenUser(this.auth),
    );
  }

  getUser(username: string): Observable<ApiResponse<User>> {
    return this.http.get<User>(`${this.api}/users/${username}`, {observe: 'response', headers: this.util.getTokenHeaders('user')})
      .pipe(
        toApiResponse<User>(),
        catchError(handleError<User>()),
        handleForbiddenUser(this.auth),
      );
  }
}
