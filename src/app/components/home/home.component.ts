import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ApplicationRef,
  ViewChild,
} from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[] = [];
  loading = false;
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart',
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
  };

  @ViewChild('mypiechart ', { static: false }) mypiechart: any;
  @ViewChild('mycolumnchart ', { static: false }) mycolumnchart: any;

  constructor(
    private dataService: DataServiceService,
    private cd: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (data) => {
        this.globalData = data;
        data.forEach((element: any) => {
          if (!Number.isNaN(element.confirmed)) {
            this.totalActive += element.active;
            this.totalConfirmed += element.confirmed;
            this.totalDeaths += element.deaths;
            this.totalRecovered += element.recovered;
          }
        });

        this.initGoogleChart('c');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  initGoogleChart(type: string) {
    let datatable = [];
    datatable.push(['Country', 'Cases']);
    this.globalData.forEach((data: any) => {
      let value: number = 0;
      if (type == 'a') {
        console.log('inside active');
        value = data.active;
      }
      if (type == 'c') {
        console.log('inside confirmed');
        value = data.confirmed;
      }
      if (type == 'r') {
        console.log('inside recovered');
        value = data.recovered;
      }
      if (type == 'd') {
        console.log('inside deaths');
        value = data.deaths;
      }

      datatable.push([data.country, value]);
    });
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height: 800,
        animation: {
          duration: 1000,
          easing: 'out',
        },
      },
    };

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height: 800,
        animation: {
          duration: 1000,
          easing: 'out',
        },
      },
    };
    this.mypiechart.draw();
    this.mycolumnchart.draw();
  }

  updateChart(type: string) {
    this.initGoogleChart(type);
    this.appRef.tick();
  }
}
