import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Enable Biding
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Importacion de las vistas/componentes
import { RegisterProgramComponent } from './views/register-program/register-program.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { ManagerHomeComponent } from './views/dashboard/manager/manager-home/manager-home.component';
import { LedHomeComponent } from './views/dashboard/live-experience-designer/led-home/led-home.component';
import { AdminBandsComponent } from './views/dashboard/manager/admin-bands/admin-bands.component';
import { AddBandComponent } from './views/dashboard/manager/add-band/add-band.component';
import { AdminEventsComponent } from './views/dashboard/manager/admin-events/admin-events.component';
import { BandInfoComponent } from './views/dashboard/manager/band-info/band-info.component';

import { SettingsComponent } from './views/dashboard/settings/settings.component';

//Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AddImageComponent } from './components/add-image/add-image.component';
import { FooterComponent } from './components/footer/footer.component';
import { UsComponent } from './views/us/us.component';
import { RegisterComponent } from './views/register/register.component';
import { NavbarDashboardComponent } from './components/navbar-dashboard/navbar-dashboard.component';
import { CatalogComponent } from './views/dashboard/manager/catalog/catalog.component';
import { AddListComponent } from './views/dashboard/live-experience-designer/add-list/add-list.component';
import { EditListComponent } from './views/dashboard/live-experience-designer/edit-list/edit-list.component';
import { NotFoundComponent } from './views/not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterProgramComponent,
    LoginComponent,
    HomeComponent,
    ManagerHomeComponent,
    LedHomeComponent,
    AdminBandsComponent,
    AddBandComponent,
    AdminEventsComponent,
    SettingsComponent,
    BandInfoComponent,
    NavbarComponent,
    SidebarComponent,
    AddImageComponent,
    FooterComponent,
    UsComponent,
    RegisterComponent,
    NavbarDashboardComponent,
    CatalogComponent,
    LedHomeComponent,
    AddListComponent,
    EditListComponent,
    NotFoundComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
