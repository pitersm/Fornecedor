import { Injectable } from '@angular/core';
import { Company } from '../model/company.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/api/selectitem';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  baseUrl = 'http://localhost:50001/api/company/';
  constructor(private http: HttpClient) { }
  companies: Company[];

  getCompany(id: string): Observable<Company> {
    return this.http.get(this.baseUrl + id)
      .pipe(map((response: any) => {
        const company: Company = response;
        return company;
      }));
  }

  saveCompany(company: Company) {
    return this.http.post(this.baseUrl, company);
  }

  updateCompany(company: Company) {
    return this.http.put(this.baseUrl + company.id, company);
  }

  listCompanies(): Observable<Company[]> {
    return this.http.get(this.baseUrl)
      .pipe(map((response: any[]) => {
        this.companies = response;
        return this.companies.slice();
      }));
  }

  checkIfCnpjExists(cnpj: string): Observable<boolean> {
    return this.http.get(this.baseUrl + 'cnpj/' + cnpj)
    .pipe(map((response: any) => {
      const exists: boolean = response;
      return exists;
    }));
  }

  deleteCompany(id: string) {
    return this.http.delete(this.baseUrl + id);
  }

  getStates(): Observable<SelectItem[]> {
    return this.http.get(`${this.baseUrl}/states`)
    .pipe(map((response: any[]) => {
      return response.map(stateDto => {
        return { label: stateDto.nome, value: stateDto.sigla};
      });
    }));
  }
}
