import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {Project, ProjectService} from '../projects/services/projects.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {SprintDetailsService} from './services/sprint-details-service';
import {CommitService} from './services/commit.service';
import {JenkinsService} from './services/jenkins.service';
import {IssuesService} from "./services/issues.service";

@Component({
  selector: 'qs-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit, AfterViewInit {
  private project: Project;

  day = 365;

  velocity: JSON[];
  commits: JSON[];
  sprintUsers: JSON[];
  commitUsers: JSON[];
  sprints: JSON[];

  days = [{value: 30, text: 'Last Month'},
    {value: 90, text: 'Last 3 Month'},
    {value: 183, text: 'Last 6 Month'},
    {value: 365, text: 'Last 1 Year'},
    {value: 5000, text: 'All Time'}];

  velocityChartYAxisTitle = 'Percentage';
  velocityChartName = 'velocityChart';

  commitsCountChartYAxisTitle = 'Commits';
  commitsCountChartName = 'commitsCountChart';

  sprintUsersChartName = 'sprintUsersChart';
  sprintUsersYAxisTitle = 'Story Points';

  commitUsersChartName = 'commitUsersChart';
  commitUsersChartYAxisTitle = 'Commits';

  sprintChartName = 'sprintChart';
  sprintChartYAxisTitle = 'Story Points';

  testCoverageChartName = 'testCoverageChart';
  testCoverageChartYAxisTitle = 'Percentage';
  testCoverage: JSON[];

  issuesChartName = 'issuesChart';
  issuesChartYAxisTitle = 'Count';
  issues: JSON[];

  constructor(private _titleService: Title,
              private _loadingService: TdLoadingService,
              private _projectService: ProjectService,
              private _changeDetectorRef: ChangeDetectorRef,
              private sprintDetailsService: SprintDetailsService,
              private commitService: CommitService,
              private jenkinsService: JenkinsService,
              private issuesService: IssuesService,
              private route: ActivatedRoute,
              public media: TdMediaService) {
  }

  async loadVelocityDetails() {
    const loader = `${this.velocityChartName}.load`;
    try {
      this._loadingService.register(loader);
      this.velocity = await this.sprintDetailsService.searchVelcoity(this.project._id, this.day);
    } finally {
      this._loadingService.resolve(loader);
    }
  }

  async loadSprintDetails() {
    const loader = `${this.sprintChartName}.load`;
    try {
      this._loadingService.register(loader);
      this.sprints = await this.sprintDetailsService.search(this.project._id, this.day);
    } finally {
      this._loadingService.resolve(loader);
    }
  }

  async loadCommitsCount() {
    const loader = `${this.commitsCountChartName}.load`;
    try {
      this._loadingService.register(loader);
      this.commits = await this.commitService.commitsCountTimeLine(this.project._id, this.day);
    } finally {
      this._loadingService.resolve(loader);
    }
  }

  async loadSprintUsers() {
    const loader = `${this.sprintUsersChartName}.load`;
    try {
      this._loadingService.register(loader);
      this.sprintUsers = await this.sprintDetailsService.searchUsers(this.project._id, this.day);
    } finally {
      this._loadingService.resolve(loader);
    }
  }

  async loadCommitUsers() {
    const loader = `${this.commitUsersChartName}.load`;
    try {
      this._loadingService.register(loader);
      this.commitUsers = await this.commitService.commitsCountUsers(this.project._id, this.day);
    } finally {
      this._loadingService.resolve(loader);
    }
  }

  async loadTestCoverage() {
    const loader = `${this.testCoverageChartName}.load`;
    try {
      this._loadingService.register(loader);
      this.testCoverage = await this.jenkinsService.testCoverage(this.project._id, this.day);
    } finally {
      this._loadingService.resolve(loader);
    }
  }

  async loadIssues() {
    const loader = `${this.issuesChartName}.load`;
    try {
      this._loadingService.register(loader);
      this.issues = await this.issuesService.search(this.project._id, this.day);
    } finally {
      this._loadingService.resolve(loader);
    }
  }

  ngOnInit() {
    this._titleService.setTitle('Projects');
    this.route.paramMap
      .switchMap((params: ParamMap) => this._projectService.getProject(+params.get('id')))
      .subscribe(project => {
        this.project = project;
        this.loadVelocityDetails();
        this.loadCommitsCount();
        this.loadSprintUsers();
        this.loadCommitUsers();
        this.loadSprintDetails();
        this.loadTestCoverage();
        this.loadIssues();
      });
  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    // force a new change detection cycle since change detections
    // have finished when `ngAfterViewInit` is executed
    this._changeDetectorRef.detectChanges();
  }

  updateFi() {
    this.loadVelocityDetails();
    this.loadCommitsCount();
    this.loadSprintUsers();
    this.loadCommitUsers();
    this.loadSprintDetails();
    this.loadTestCoverage();
    this.loadIssues();
  }
}
