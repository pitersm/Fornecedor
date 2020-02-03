import { SharedService } from './../../shared/shared.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Company } from 'src/app/model/company.model';
import { CompanyService } from 'src/app/shared/company.service';
import { MessageService, SelectItem } from 'primeng/api';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate-guard.service';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { isValidCNPJ } from 'src/app/shared/utils';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent
  implements OnInit, OnDestroy, CanComponentDeactivate {
  qtyMask: string;
  companyForm: FormGroup;
  isEdit: boolean;
  company: Company;
  title = 'Cadastrar uma Empresa';
  stateOptions: SelectItem[] = [];
  currentDate = new Date();
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();
  private ngUnsubscribe = new Subject();

  constructor(
    private companyService: CompanyService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.data.subscribe((data: Data) => {
      this.isEdit = data.edit;
      if (this.isEdit) {
        this.route.data.subscribe((res: any) => {
          this.company = res.company;
          if (!this.company) {
            this.router.navigate(['companies']);
            return;
          }
          this.title = 'Editar empresa ' + this.company.tradeName;
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
    this.sharedService.getStates()
      .subscribe((options: SelectItem[]) =>
        this.stateOptions = options
      );
  }

  private initializeForm() {
    this.companyForm = new FormGroup({
      tradeName: new FormControl(
        this.isEdit ? this.company.tradeName : null,
        Validators.required
      ),
      uf: new FormControl(
        this.isEdit ? this.company.uf : null,
        Validators.required
      ),
      cnpj: new FormControl(
        this.isEdit ? this.company.cnpj : null,
        [Validators.required, this.invalidCnpj]
      )
    });
  }

  invalidCnpj(control: FormControl): { [s: string]: boolean } {
    if (!isValidCNPJ(control.value)) {
      return { invalidCnpj: true };
    }
    return null;
  }

  onSubmit() {
    this.company = new Company(
      this.isEdit ? this.company.id : null,
      this.companyForm.controls.tradeName.value,
      this.companyForm.controls.uf.value,
      this.companyForm.controls.cnpj.value
    );

    if (this.isEdit) {
      this.updateCompany();
    } else {
      this.companyService
        .checkIfCnpjExists(this.company.cnpj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (cnpjExists: boolean) => {
            if (cnpjExists) {
              this.messageService.add({
                key: 'msg',
                severity: 'error',
                summary: 'CNPJ Repetido',
                detail: 'O CNPJ ' + this.company.cnpj + ' já está cadastrado no sistema!'
              });
            } else {
              this.saveCompany();
            }
          },
          (error: any) => this.alertServerError(error)
        );
    }
  }

  saveCompany() {
    this.companyService.saveCompany(this.company)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(() => {
      this.messageService.add({
        key: 'msg',
        severity: 'info',
        summary: 'Empresa Salva!',
        detail: 'A empresa ' + this.company.tradeName + ' foi salva com sucesso!'
      });
      this.companyForm.markAsUntouched();
      setTimeout(() => {
        this.router.navigate(['companies']);
      }, 3000);
    }, (error: any) => this.alertServerError(error));
  }

  updateCompany() {
    this.companyService.updateCompany(this.company)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(() => {
      this.messageService.add({
        key: 'msg',
        severity: 'info',
        summary: 'Empresa Atualizada!',
        detail: 'A empresa ' + this.company.tradeName + ' foi atualizada com sucesso!'
      });
      this.companyForm.markAsUntouched();
      setTimeout(() => {
        this.router.navigate(['companies']);
      }, 3000);
    }, (error: any) => this.alertServerError(error));
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.companyForm.touched) {
      this.messageService.add({
        key: 'dialog',
        severity: 'warn',
        summary: 'Cuidado!',
        detail:
          'Você realizou alterações que não foram salvas na empresa. Deseja realmente sair dessa página?'
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
