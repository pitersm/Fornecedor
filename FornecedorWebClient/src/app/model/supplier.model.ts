import { Company } from './company.model';
export class Supplier {
  constructor(
    public id: string,
    public name: string,
    public type: SupplierType,
    public cpfCnpj: string,
    public telephoneList: string[],
    public rg: string,
    public birthDate: Date,
    public companyId: string
    ) {}
}

export enum SupplierType {
  PF = 'PF',
  PJ = 'PJ'
}
