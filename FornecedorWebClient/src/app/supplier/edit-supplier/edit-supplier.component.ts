import { Company } from './../../model/company.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Supplier, SupplierType } from 'src/app/model/supplier.model';
import { SupplierService } from 'src/app/shared/supplier.service';
import { MessageService, SelectItem } from 'primeng/api';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate-guard.service';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { isValidCNPJ, isValidCpf, getAge } from 'src/app/shared/utils';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.sass']
})
export class EditSupplierComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  qtyMask: string;
  supplierForm: FormGroup;
  isEdit: boolean;
  supplier: Supplier;
  title = 'Cadastrar um Fornecedor';
  companies: Company[] = [];
  companyOptions: SelectItem[] = [];
  companyUF = '';
  typeOptions: SelectItem[] = [
    { label: 'PF', value: SupplierType.PF },
    { label: 'PJ', value: SupplierType.PJ }
  ];
  telephoneList: FormArray = this.formBuilder.array([]);
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();
  private ngUnsubscribe = new Subject();

  constructor(
    private supplierService: SupplierService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.route.data.subscribe((data: Data) => {
      this.isEdit = data.edit;
      if (this.isEdit) {
        this.route.data.subscribe((res: any) => {
          this.supplier = res.supplier;
          if (!this.supplier) {
            this.router.navigate(['suppliers']);
            return;
          }
          this.title = 'Editar fornecedor ' + this.supplier.name;
          this.initializeForm();
        }
        );
      } else {
        this.initializeForm();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.route.data.subscribe((res: any) => {
      this.companies = res.companies;
      this.companyOptions = this.companies.map((company: Company) => ({
        label: company.tradeName,
        value: company.id
      }));
      if (this.supplierForm.get('companyId').value) {
        this.companyUF = this.companies.find(company => company.id === this.supplierForm.get('companyId').value).uf;
      }
    });
  }

  private initializeForm() {
    this.supplierForm = new FormGroup({
      name: new FormControl(
        this.isEdit ? this.supplier.name : null,
        Validators.required
      ),
      type: new FormControl(
        this.isEdit ? this.supplier.type : SupplierType.PF,
        Validators.required
      ),
      cpf: new FormControl(
        this.isEdit && this.supplier.type === SupplierType.PF ? this.supplier.cpfCnpj : null,
        [this.invalidCpf]
      ),
      cnpj: new FormControl(
        this.isEdit && this.supplier.type === SupplierType.PJ ? this.supplier.cpfCnpj : null,
        [this.invalidCnpj]
      ),
      companyId: new FormControl(
        this.isEdit ? this.supplier.companyId : null,
        [Validators.required]
      ),
      birthDate: new FormControl(
        this.isEdit ? new Date(this.supplier.birthDate) : null
      ),
      rg: new FormControl(
        this.isEdit ? this.supplier.rg : null
      ),
      telephoneList: this.formBuilder.array([])
    });

    if (this.isEdit) {
      this.supplier.telephoneList.forEach(telephone => {
        this.addTelephone(telephone);
      });
    } else {
      this.addTelephone();
    }

    this.setCpfCnpjValidators();
  }

  invalidCnpj(control: FormControl): { [s: string]: boolean } {
    if (!isValidCNPJ(control.value)) {
      return { invalidCnpj: true };
    }
    return null;
  }

  invalidBirthDate(control: FormControl): { [s: string]: boolean } {
    if (control.value && control.value >= new Date()) {
      return { invalidBirthDate: true };
    }
    return null;
  }

  underageSupplier(control: FormControl): { [s: string]: boolean } {
    if (!control.value || control.value >= new Date() || this.companyUF !== 'PR') {
      return null;
    }

    if (getAge(control.value) < 18) {
      return { underageSupplier: true };
    }

    return null;
  }

  invalidCpf(control: FormControl): { [s: string]: boolean } {
    if (!isValidCpf(control.value)) {
      return { invalidCpf: true };
    }
    return null;
  }

  addTelephone(value: string = null): void {
    this.telephoneList = this.supplierForm.get('telephoneList') as FormArray;
    this.telephoneList.push(value ? this.formBuilder.group({ telephone: new FormControl(value) })
      : this.formBuilder.group({ telephone: new FormControl() }));
  }

  onSubmit() {
    this.supplier = new Supplier(
      this.isEdit ? this.supplier.id : null,
      this.supplierForm.controls.name.value,
      this.supplierForm.controls.type.value,
      this.supplierForm.controls.type.value === SupplierType.PJ ? this.supplierForm.controls.cnpj.value
        : this.supplierForm.controls.cpf.value,
      this.supplierForm.controls.telephoneList.value.map(value => value.telephone),
      this.supplierForm.controls.rg.value,
      this.supplierForm.controls.birthDate.value,
      this.supplierForm.controls.companyId.value
    );

    if (this.isEdit) {
      this.updateSupplier();
    } else {
      this.supplierService
        .checkIfCpfCnpjExists(this.supplier.cpfCnpj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (cpfCnpjExists: boolean) => {
            if (cpfCnpjExists) {
              this.messageService.add({
                key: 'msg',
                severity: 'error',
                summary: 'CPF/CNPJ Repetido',
                detail: 'O CPF/CNPJ ' + this.supplier.cpfCnpj + ' já está cadastrado no sistema!'
              });
            } else if (this.supplier.type === SupplierType.PF) {
              this.supplierService
                .checkIfRgExists(this.supplier.rg)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((rgExists: boolean) => {
                  if (rgExists) {
                    this.messageService.add({
                      key: 'msg',
                      severity: 'error',
                      summary: 'RG Repetido',
                      detail: 'O RG ' + this.supplier.rg + ' já está cadastrado no sistema!'
                    });
                  } else {
                    this.saveSupplier();
                  }
                }, (error: any) => this.alertServerError(error));
            } else {
              this.saveSupplier();
            }
          }, (error: any) => this.alertServerError(error));
    }
  }

  saveSupplier() {
    this.supplierService.saveSupplier(this.supplier)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.messageService.add({
          key: 'msg',
          severity: 'info',
          summary: 'Fornecedor Salva!',
          detail: 'O fornecedor ' + this.supplier.name + ' foi salvo com sucesso!'
        });
        this.supplierForm.markAsUntouched();
        setTimeout(() => {
          this.router.navigate(['suppliers']);
        }, 3000);
      }, (error: any) => this.alertServerError(error));
  }

  updateSupplier() {
    this.supplierService.updateSupplier(this.supplier)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.messageService.add({
          key: 'msg',
          severity: 'info',
          summary: 'Fornecedor Atualizado!',
          detail: 'O fornecedor ' + this.supplier.name + ' foi atualizado com sucesso!'
        });
        this.supplierForm.markAsUntouched();
        setTimeout(() => {
          this.router.navigate(['suppliers']);
        }, 3000);
      }, (error: any) => this.alertServerError(error));
  }

  onTypeChange(event: any) {
    this.setCpfCnpjValidators();
  }

  setCpfCnpjValidators() {
    if (this.supplierForm.controls.type.value === SupplierType.PF) {
      this.supplierForm.get('rg').enable();
      this.supplierForm.get('rg').setValidators(Validators.required);
      this.supplierForm.get('birthDate').enable();
      this.supplierForm.get('birthDate').setValidators([Validators.required, this.invalidBirthDate, this.underageSupplier.bind(this)]);
      this.supplierForm.get('cnpj').disable();
      this.supplierForm.get('cpf').enable();
      this.supplierForm.get('cpf').setValidators([Validators.required, this.invalidCpf]);
    } else {
      this.supplierForm.get('rg').disable();
      this.supplierForm.get('birthDate').disable();
      this.supplierForm.get('cpf').disable();
      this.supplierForm.get('cnpj').enable();
      this.supplierForm.get('cnpj').setValidators([Validators.required, this.invalidCnpj]);
    }
  }

  setCompanyUF(event) {
    this.companyUF = this.companies.find(company => company.id === event.value).uf;
    this.supplierForm.get('birthDate').updateValueAndValidity();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.supplierForm.touched) {
      this.messageService.add({
        key: 'dialog',
        severity: 'warn',
        summary: 'Cuidado!',
        detail:
          'Você realizou alterações que não foram salvas no fornecedor. Deseja realmente sair dessa página?'
      });
      return this.navigateAwaySelection$;
    } else {
      return true;
    }
  }

  onDeactivateChoose(choice: boolean) {
    if (!choice) {
      this.messageService.clear();
    }
    this.navigateAwaySelection$.next(choice);
  }

  alertServerError(error: any) {
    this.messageService.add({
      key: 'msg',
      severity: 'error',
      summary: 'Erro no servidor'
    });
  }
}
