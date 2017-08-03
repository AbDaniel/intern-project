import {Http} from '@angular/http';

import {Injectable} from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {API_BASE_URL} from '../../../config/api.config';

export interface Project {
  _id: string;
  name: string;
  type: string;
}

@Injectable()
export class ProjectService {

  private projectsUrl = API_BASE_URL;

  constructor(private http: Http) {
  }

  getProjects(): Promise<Project[]> {
    return this.http.get(this.projectsUrl + '/boards')
      .toPromise()
      .then((response) => response.json() as Project[]);
  }

  getProjectsSlowly(): Promise<Project[]> {
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay
      setTimeout(() => resolve(this.getProjects()), 2000);
    });
  }

}
