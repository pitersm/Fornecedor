import { Supplier } from 'src/app/model/supplier.model';
import { Subject } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { SupplierService } from 'src/app/shared/supplier.service';

@Component({
  selector: 'app-list-supplier',
  templateUrl: './list-supplier.component.html',
  styleUrls: ['./list-supplier.component.sass']
})
export class ListSupplierComponent implements OnDestroy {
  suppliers: Supplier[];
  selectedSupplier: Supplier;
  menuItems: MenuItem[];
  displayDialog = false;
  private ngUnsubscribe = new Subject();

  constructor(private supplierService: SupplierService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.data.subscribe((res: any) => {
      this.suppliers = res.suppliers;
      this.suppliers = this.suppliers.map((supplier: Supplier) => (
        {
          ...supplier,
          telephonesString: supplier.telephoneList.join(', ')
        }));
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
  }

  listSuppliers() {
    this.supplierService.listSuppliers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (supplierList: Supplier[]) => {
          this.suppliers = supplierList;
          this.suppliers = this.suppliers.map((supplier: Supplier) => (
            {
              ...supplier,
              telephonesString: supplier.telephoneList.join(', ')
            }));
        },
        error => this.messageService.add({
          key: 'msg', severity: 'error', summary: 'Erro no servidor',
          detail: error
        }));
  }

  deleteSupplier(id: string) {
    this.supplierService.deleteSupplier(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.displayDialog = false;
        this.listSuppliers();
      }, (error: any) => this.messageService.add({
        key: 'msg', severity: 'error', summary: 'Erro no servidor',
        detail: error
      }));
  }

  onRowSelect(event) {
    this.selectedSupplier = event.data;
    this.displayDialog = true;
  }

  showEdit() {
    const path = this.selectedSupplier.id;
    this.router.navigate([path], { relativeTo: this.route });
  }

  showAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
