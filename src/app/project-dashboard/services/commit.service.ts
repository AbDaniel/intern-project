import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {API_BASE_URL} from '../../../config/api.config';

@Injectable()
export class CommitService {

  private commitsTimeLineUrl = API_BASE_URL + '/commit_timeline';  // URL to web api
  private commitsCountTimeLineUrl = API_BASE_URL + '/commit_timeline/count';  // URL to web api
  private commitsCountUsersUrl = API_BASE_URL + '/commit_timeline/users';  // URL to web api

  constructor(private http: Http) {
  }

  commitsBySprint(boardId: number, daysAgo: number): Promise<JSON[]> {
    const url = `${this.commitsTimeLineUrl}/${boardId}/${daysAgo}`;

    return this.http.get(url).toPromise().then(response => response.json() as JSON[]).catch(this.handleError);
  }

  commitsCountTimeLine(boardId: number, daysAgo: number): Promise<JSON[]> {
    const url = `${this.commitsCountTimeLineUrl}/${boardId}/${daysAgo}`;

    return this.http.get(url).toPromise().then(response => response.json() as JSON[]).catch(this.handleError);
  }

  commitsCountUsers(boardId: number, daysAgo: number): Promise<JSON[]> {
    const url = `${this.commitsCountUsersUrl}/${boardId}/${daysAgo}`;

    return this.http.get(url).toPromise().then(response => response.json() as JSON[]).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
