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
import { SharedService } from './shared/shared.service';
import { EditSupplierComponent } from './supplier/edit-supplier/edit-supplier.component';
import { SupplierService } from './shared/supplier.service';
import { Supplier } from './model/supplier.model';
import { ListSupplierComponent } from './supplier/list-supplier/list-supplier.component';

@Injectable()
export class CompanyResolver implements Resolve<Observable<Company>> {
  constructor(private companyService: CompanyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Company> {
    return this.companyService.getCompany(route.params.id);
  }
}

@Injectable()
export class SupplierResolver implements Resolve<Observable<Supplier>> {
  constructor(private supplierService: SupplierService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Supplier> {
    return this.supplierService.getSupplier(route.params.id);
  }
}

@Injectable()
export class EntitiesCountResolver implements Resolve<Observable<any>> {
  constructor(private sharedService: SharedService) {}

  resolve(): Observable<any> {
    return this.sharedService.getEntitiesCount()
               .pipe(map((counts) => {
                 return { companiesCount: counts[0], suppliersCount: counts[1] };
                }));
  }
}

@Injectable()
export class CompanyListResolver implements Resolve<Observable<Company[]>> {
  constructor(private companyService: CompanyService) {}

  resolve(): Observable<Company[]> {
    return this.companyService.listCompanies();
  }
}

@Injectable()
export class SupplierListResolver implements Resolve<Observable<Supplier[]>> {
  constructor(private supplierService: SupplierService) {}

  resolve(): Observable<Supplier[]> {
    return this.supplierService.listSuppliers();
  }
}

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, resolve: { counts: EntitiesCountResolver } },
    { path: 'companies', component: ListCompanyComponent, resolve: { companies: CompanyListResolver } },
    { path: 'companies/new', component: EditCompanyComponent, canDeactivate: [CanDeactivateGuard], data: { edit: false } },
    { path: 'companies/:id', component: EditCompanyComponent, canDeactivate: [CanDeactivateGuard], data: { edit: true},
      resolve: { company: CompanyResolver} },
    { path: 'suppliers', component: ListSupplierComponent, resolve: { suppliers: SupplierListResolver } },
    { path: 'suppliers/new', component: EditSupplierComponent, canDeactivate: [CanDeactivateGuard], data: { edit: false },
      resolve: { companies: CompanyListResolver } },
    { path: 'suppliers/:id', component: EditSupplierComponent, canDeactivate: [CanDeactivateGuard], data: { edit: true },
      resolve: { supplier: SupplierResolver, companies: CompanyListResolver } },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [],
  providers: [CompanyResolver, CompanyService, EntitiesCountResolver, CompanyListResolver, SupplierResolver, SupplierListResolver]
})
export class AppRoutingModule { }
