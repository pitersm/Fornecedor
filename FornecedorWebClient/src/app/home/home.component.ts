import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  companyCount: number;
  supplierCount: number;
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: any) => {
      this.companyCount = data.counts.companiesCount;
      this.supplierCount = data.counts.suppliersCount;
    });
  }

  ngOnInit() {
  }
}
