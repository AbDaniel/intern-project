import {Component, AfterViewInit, OnInit, ChangeDetectorRef} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MdSnackBar} from '@angular/material';

import {TdLoadingService, TdDialogService, TdMediaService} from '@covalent/core';

import {ProjectService, Project} from './services/projects.service';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'qs-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectComponent implements AfterViewInit, OnInit {

  projects: Project[];
  filteredProjects: Project[];

  constructor(private _titleService: Title,
              private _loadingService: TdLoadingService,
              private _projectService: ProjectService,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {
  }

  ngOnInit(): void {
    this._titleService.setTitle('Projects');
    this.load();
    // this._projectService.getProjects().then(data => {
    //   // console.log(data);
    //   this.projects = data;
    //   this.filteredProjects = data;
    //   // this.render();
    //   console.log('not here')
    // });
    //
    // console.log('ere');
  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    // force a new change detection cycle since change detections
    // have finished when `ngAfterViewInit` is executed
    this._changeDetectorRef.detectChanges();
  }

  filterProjects(name: string = ''): void {
    this.filteredProjects = this.projects.filter((project: Project) => {
      return project.name.toLowerCase().indexOf(name.toLowerCase()) > -1;
    });
  }

  async load(): Promise<void> {
    try {
      this._loadingService.register('projects.list');
      this.projects = await this._projectService.getProjectsSlowly();
    } finally {
      this.filteredProjects = Object.assign([], this.projects);
      this._loadingService.resolve('projects.list');
    }
  }
}
