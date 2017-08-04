import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {Project, ProjectService} from '../projects/services/projects.service';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'qs-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit, AfterViewInit {
  private project: Project;

  day = 365;

  days = [{value: 30, text: 'Last Month'},
    {value: 90, text: 'Last 3 Month'},
    {value: 183, text: 'Last 6 Month'},
    {value: 365, text: 'Last 1 Year'},
    {value: 5000, text: 'All Time'}];


  constructor(private _titleService: Title,
              private _loadingService: TdLoadingService,
              private _projectService: ProjectService,
              private _changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              public media: TdMediaService) {
  }

  ngOnInit() {
    this._titleService.setTitle('Projects');
    this.route.paramMap
      .switchMap((params: ParamMap) => this._projectService.getProject(+params.get('id')))
      .subscribe(project => this.project = project);
  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    // force a new change detection cycle since change detections
    // have finished when `ngAfterViewInit` is executed
    this._changeDetectorRef.detectChanges();
  }

}
