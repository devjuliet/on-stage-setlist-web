import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { ManagerHomeComponent } from './views/dashboard/manager/manager-home/manager-home.component';
import { AddBandComponent } from './views/dashboard/manager/add-band/add-band.component';
import { AdminBandsComponent } from './views/dashboard/manager/admin-bands/admin-bands.component';
import { AdminEventsComponent } from './views/dashboard/manager/admin-events/admin-events.component';
import { BandInfoComponent } from './views/dashboard/manager/band-info/band-info.component';
import { RegisterComponent } from './views/register/register.component';
import { UsComponent } from './views/us/us.component';
import { CatalogComponent } from './views/dashboard/manager/catalog/catalog.component';
import { LedHomeComponent } from './views/dashboard/live-experience-designer/led-home/led-home.component';
import { AddListComponent } from './views/dashboard/live-experience-designer/add-list/add-list.component';

import { SettingsComponent } from './views/dashboard/settings/settings.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { EventComponent } from './views/dashboard/live-experience-designer/event/event.component';
import { SearchResultComponent } from './views/dashboard/search-result/search-result.component';
import { RepertoriesComponent } from './views/dashboard/live-experience-designer/repertories/repertories.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },//lista
  { path: 'login', component: LoginComponent },//lista
  { path: 'us', component: UsComponent },//lista
  { path: 'register', component: RegisterComponent },//lista

  { path: 'dashboard/manager', component: ManagerHomeComponent },//lista
  { path: 'dashboard/manager/admin-bands', component: AdminBandsComponent },//lista
  { path: 'dashboard/manager/band-info/:id', component: BandInfoComponent },//lista
  { path: 'dashboard/manager/add-band', component: AddBandComponent },//lista
  { path: 'dashboard/manager/admin-events', component: AdminEventsComponent },//lista
  { path: 'dashboard/manager/catalog', component: CatalogComponent },//lista
  { path: 'dashboard/manager/settings', component: SettingsComponent },//lista


  { path: 'dashboard/led', component: RepertoriesComponent },
  { path: 'dashboard/led/my-lists', component: LedHomeComponent },//lista
  { path: 'dashboard/led/add-list', component: AddListComponent },//lista
  { path: 'dashboard/led/edit-list/:id', component: AddListComponent },//lista
  { path: 'dashboard/led/settings', component: SettingsComponent },//lista

  { path: 'dashboard/search-result/:search', component: SearchResultComponent },//lista

  { path: 'missing-page', component: NotFoundComponent},//lista
  { path: '**', redirectTo: 'missing-page' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
