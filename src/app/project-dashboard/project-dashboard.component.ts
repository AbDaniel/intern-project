import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {ProjectService} from '../projects/services/projects.service';

@Component({
  selector: 'qs-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit, AfterViewInit {

  constructor(private _titleService: Title,
              private _loadingService: TdLoadingService,
              private _projectService: ProjectService,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {
  }

  ngOnInit() {
    this._titleService.setTitle('Projects');
  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    // force a new change detection cycle since change detections
    // have finished when `ngAfterViewInit` is executed
    this._changeDetectorRef.detectChanges();
  }

}
