import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @Input('totalConfirmed')
  totalConfirmed: any;

  @Input('totalDeaths')
  totalDeaths: any;

  @Input('totalActive')
  totalActive: any;

  @Input('totalRecovered')
  totalRecovered: any;

  constructor() {}

  ngOnInit(): void {}
}
