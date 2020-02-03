import { Injectable } from '@angular/core';
import { Supplier } from '../model/supplier.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  baseUrl = 'https://localhost:5001/api/supplier/';
  constructor(private http: HttpClient) { }
  suppliers: Supplier[];

  getSupplier(id: string): Observable<Supplier> {
    return this.http.get(`${this.baseUrl}${id}`)
      .pipe(map((response: any) => {
        const supplier: Supplier = response;
        return supplier;
      }));
  }

  saveSupplier(supplier: Supplier) {
    return this.http.post(this.baseUrl, supplier);
  }

  updateSupplier(supplier: Supplier) {
    return this.http.put(this.baseUrl + supplier.id, supplier);
  }

  listSuppliers(): Observable<Supplier[]> {
    return this.http.get(this.baseUrl)
      .pipe(map((response: any[]) => {
        this.suppliers = response;
        return this.suppliers.slice();
      }));
  }

  checkIfCpfCnpjExists(cpfCnpj: string): Observable<boolean> {
    return this.http.get(`${this.baseUrl}cpfCnpj/${encodeURIComponent(cpfCnpj)}`)
    .pipe(map((response: any) => {
      const exists: boolean = response;
      return exists;
    }));
  }

  checkIfRgExists(rg: string): Observable<boolean> {
    return this.http.get(`${this.baseUrl}rg/${encodeURIComponent(rg)}`)
    .pipe(map((response: any) => {
      const exists: boolean = response;
      return exists;
    }));
  }

  deleteSupplier(id: string) {
    return this.http.delete(this.baseUrl + id);
  }
}
