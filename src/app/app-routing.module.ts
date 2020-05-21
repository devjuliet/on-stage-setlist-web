import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterProgramComponent } from './views/register-program/register-program.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { LiveExperienceDesignerHomeComponent } from './views/dashboard/live-experience-designer/live-experience-designer-home/live-experience-designer-home.component';
import { ManagerHomeComponent } from './views/dashboard/manager/manager-home/manager-home.component';
import { AddBandComponent } from './views/dashboard/manager/add-band/add-band.component';
import { AdminBandsComponent } from './views/dashboard/manager/admin-bands/admin-bands.component';
import { AdminEventsComponent } from './views/dashboard/manager/admin-events/admin-events.component';
import { BandInfoComponent } from './views/dashboard/manager/band-info/band-info.component';
import { SettingsComponent } from './views/dashboard/manager/settings/settings.component';
import { RegisterComponent } from './views/register/register.component';
import { UsComponent } from './views/us/us.component';
import { CatalogComponent } from './views/dashboard/manager/catalog/catalog.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'us', component: UsComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard/manager', component: ManagerHomeComponent },
  { path: 'dashboard/live-experience-designer', component: LiveExperienceDesignerHomeComponent },
  { path: 'dashboard/manager/add-band', component: AddBandComponent },
  { path: 'dashboard/manager/admin-bands', component: AdminBandsComponent },
  { path: 'dashboard/manager/admin-events', component: AdminEventsComponent },
  { path: 'dashboard/manager/band-info/:id', component: BandInfoComponent },
  { path: 'dashboard/manager/catalog', component: CatalogComponent },
  { path: 'dashboard/manager/settings', component: SettingsComponent },
  /* { path: 'register-program', component: RegisterProgramComponent },
  { path: 'validations', component: ValidationsComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent }, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
