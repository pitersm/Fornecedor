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
    this.route.data.subscribe((res: any) => {
      this.companyCount = res.companyCount;
      this.supplierCount = res.supplierCount;
    });
  }

  ngOnInit() {
  }
}
