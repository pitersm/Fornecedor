import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { EditCompanyComponent } from './company/edit-company/edit-company.component';
import { ListCompanyComponent } from './company/list-company/list-company.component';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageModule} from 'primeng/message';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { EditSupplierComponent } from './supplier/edit-supplier/edit-supplier.component';
import { CalendarModule } from 'primeng/calendar';
import { ListSupplierComponent } from './supplier/list-supplier/list-supplier.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    EditCompanyComponent,
    ListCompanyComponent,
    EditSupplierComponent,
    ListSupplierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    DialogModule,
    ButtonModule,
    PanelModule,
    DropdownModule,
    ToastModule,
    MessageModule,
    CardModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    InputMaskModule,
    CalendarModule
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
