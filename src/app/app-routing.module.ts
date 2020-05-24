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
import { EditListComponent } from './views/dashboard/live-experience-designer/edit-list/edit-list.component';
import { AddListComponent } from './views/dashboard/live-experience-designer/add-list/add-list.component';

import { SettingsComponent } from './views/dashboard/settings/settings.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'us', component: UsComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard/manager', component: ManagerHomeComponent },
  { path: 'dashboard/manager/admin-bands', component: AdminBandsComponent },
  { path: 'dashboard/manager/band-info/:id', component: BandInfoComponent },
  { path: 'dashboard/manager/add-band', component: AddBandComponent },
  { path: 'dashboard/manager/admin-events', component: AdminEventsComponent },
  { path: 'dashboard/manager/catalog', component: CatalogComponent },
  { path: 'dashboard/manager/settings', component: SettingsComponent },//lista


  { path: 'dashboard/led/home', component: LedHomeComponent },
  { path: 'dashboard/led/edit-list', component: EditListComponent },
  { path: 'dashboard/led/add-list', component: AddListComponent },
  { path: 'dashboard/led/settings', component: SettingsComponent },//lista

  { path: 'missing-page', component: NotFoundComponent},
  { path: '**', redirectTo: 'missing-page' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
