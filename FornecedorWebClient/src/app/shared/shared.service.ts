import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { SelectItem } from 'primeng/api/selectitem';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  baseUrl = 'https://localhost:5001/api';
  constructor(private http: HttpClient) { }

  getEntitiesCount(): Observable<[object, object]> {
    return forkJoin(
      this.http.get(`${this.baseUrl}/company/count`),
      this.http.get(`${this.baseUrl}/supplier/count`),
    );
  }

  getStates(): Observable<SelectItem[]> {
    return this.http.get(`${this.baseUrl}/company/states`)
    .pipe(map((response: any[]) => {
      return response.map(stateDto => {
        return { label: stateDto.nome, value: stateDto.sigla};
      });
    }));
  }
}
