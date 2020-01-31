import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EditCompanyComponent } from './company/edit-company/edit-company.component';
import { ListCompanyComponent } from './company/list-company/list-company.component';
import { HomeComponent } from './home/home.component';
import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';
import { Observable } from 'rxjs';
import { Company } from './model/company.model';
import { CompanyService } from './shared/company.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CompanyResolver implements Resolve<Observable<Company>> {
  constructor(private companyService: CompanyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Company> {
    return this.companyService.getCompany(route.params.id);
  }
}

@Injectable()
export class CompanyCountResolver implements Resolve<Observable<number>> {
  constructor(private companyService: CompanyService) {}

  resolve(): Observable<number> {
    return this.companyService.listCompanies()
               .pipe(map((list: Company[]) => list.length));
  }
}

@Injectable()
export class CompanyListResolver implements Resolve<Observable<Company[]>> {
  constructor(private companyService: CompanyService) {}

  resolve(): Observable<Company[]> {
    return this.companyService.listCompanies();
  }
}

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, resolve: { count: CompanyCountResolver } },
    { path: 'companies', component: ListCompanyComponent, resolve: { companies: CompanyListResolver } },
    { path: 'companies/new', component: EditCompanyComponent, canDeactivate: [CanDeactivateGuard], data: { edit: false } },
    { path: 'companies/:id', component: EditCompanyComponent, canDeactivate: [CanDeactivateGuard], data: { edit: true},
      resolve: { company: CompanyResolver} },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [],
  providers: [CompanyResolver, CompanyService, CompanyCountResolver, CompanyListResolver]
})
export class AppRoutingModule { }
