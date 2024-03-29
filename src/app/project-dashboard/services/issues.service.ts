import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {API_BASE_URL} from '../../../config/api.config';

@Injectable()
export class IssuesService {

  private bugTimeUrl = API_BASE_URL + '/bugs';  // URL to web api

  constructor(private http: Http) {
  }

  search(boardId: number, daysAgo: number): Promise<JSON[]> {
    const url = `${this.bugTimeUrl}/${boardId}/${daysAgo}`;

    return this.http.get(url).toPromise().then(response => response.json() as JSON[]).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
