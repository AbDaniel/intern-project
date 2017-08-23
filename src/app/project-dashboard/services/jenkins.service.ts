import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {API_BASE_URL} from '../../../config/api.config';

@Injectable()
export class JenkinsService {

  private commitsTimeLineUrl = API_BASE_URL + '/jenkins_timeline';  // URL to web api
  private testCoverageUrl = API_BASE_URL + '/jenkins_timeline/test_coverage';  // URL to web api

  constructor(private http: Http) {
  }

  buildStatus(boardId: number, daysAgo: number): Promise<JSON[]> {
    const url = `${this.commitsTimeLineUrl}/${boardId}/${daysAgo}`;

    return this.http.get(url).toPromise().then(response => response.json() as JSON[]).catch(this.handleError);
  }

  testCoverage(boardId: number, daysAgo: number): Promise<JSON[]> {
    const url = `${this.testCoverageUrl}/${boardId}/${daysAgo}`;

    return this.http.get(url).toPromise().then(response => response.json() as JSON[]).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
