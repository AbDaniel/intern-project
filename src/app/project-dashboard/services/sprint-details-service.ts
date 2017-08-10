import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {API_BASE_URL} from '../../../config/api.config';


@Injectable()
export class SprintDetailsService {

  private sprintsUrl = API_BASE_URL + '/sprint_time_line';  // URL to web api
  private usersUrl = this.sprintsUrl + '/users';  // URL to web api
  private velocityUrl = this.sprintsUrl + '/velocity';  // URL to web api

  constructor(private http: Http) {
  }

  search(boardId: number, daysAgo: number): Promise<JSON[]> {
    const url = `${this.sprintsUrl}/${boardId}/${daysAgo}`;

    return this.http.get(url).toPromise().then(response => response.json() as JSON[]).catch(this.handleError);
  }

  searchUsers(boardId: number, daysAgo: number): Promise<JSON[]> {
    const url = `${this.usersUrl}/${boardId}/${daysAgo}`;

    return this.http.get(url).toPromise().then(response => response.json() as JSON[]).catch(this.handleError);
  }

  searchVelcoity(boardId: number, daysAgo: number): Promise<JSON[]> {
    const url = `${this.velocityUrl}/${boardId}/${daysAgo}`;

    return this.http.get(url).toPromise().then(response => response.json() as JSON[]).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

