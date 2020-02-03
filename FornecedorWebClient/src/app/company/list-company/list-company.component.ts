import { Subject } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { Company } from 'src/app/model/company.model';
import { MenuItem, MessageService } from 'primeng/api';
import { CompanyService } from 'src/app/shared/company.service';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.css']
})
export class ListCompanyComponent implements OnDestroy {
  companies: Company[];
  selectedCompany: Company;
  menuItems: MenuItem[];
  displayDialog = false;
  private ngUnsubscribe = new Subject();

  constructor(private companyService: CompanyService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router) {
      this.route.data.subscribe((res: any) => {
        this.companies = res.companies;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
  }

  listCompanys() {
    this.companyService.listCompanies()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (companyList: Company[]) => this.companies = companyList,
        error => this.messageService.add({
          key: 'msg', severity: 'error', summary: 'Erro no servidor',
          detail: error
        }));
  }

  deleteCompany(id: string) {
    this.companyService.deleteCompany(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(() => {
      this.displayDialog = false;
      this.listCompanys();
    }, (error: any) => this.messageService.add({
      key: 'msg', severity: 'error', summary: 'Erro no servidor',
      detail: error
    }));
  }

  onRowSelect(event) {
    this.selectedCompany = event.data;
    this.displayDialog = true;
  }

  showEdit() {
    const path = this.selectedCompany.id;
    this.router.navigate([path], { relativeTo: this.route });
  }

  showAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
