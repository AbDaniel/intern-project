import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {
  MdSnackBarModule, MdIconModule, MdListModule, MdTooltipModule, MdCardModule, MdButtonModule,
  MdToolbarModule, MdInputModule, MdSlideToggleModule, MdMenuModule,
} from '@angular/material';

import {
  CovalentLoadingModule, CovalentDialogsModule, CovalentMediaModule, CovalentLayoutModule,
  CovalentSearchModule, CovalentCommonModule,
} from '@covalent/core';

import {ProjectComponent} from './projects.component';


import {ProjectService, Project} from './services/projects.service';
import {Http} from '@angular/http';

export {ProjectComponent, Project};

@NgModule({
  declarations: [
    ProjectComponent,
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    // angular modules
    CommonModule,
    FormsModule,
    RouterModule,
    // material modules
    MdSnackBarModule,
    MdIconModule,
    MdListModule,
    MdTooltipModule,
    MdCardModule,
    MdButtonModule,
    MdToolbarModule,
    MdInputModule,
    MdSlideToggleModule,
    MdMenuModule,
    // covalent modules
    CovalentLoadingModule,
    CovalentDialogsModule,
    CovalentMediaModule,
    CovalentLayoutModule,
    CovalentSearchModule,
    CovalentCommonModule,
    // extra
    Http,
  ], // modules needed to run this module
  providers: [ProjectService],
})
