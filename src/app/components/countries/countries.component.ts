import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { map } from 'rxjs/internal/operators/map';
import { merge } from 'rxjs';
import { DateWiseData } from 'src/app/models/data-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[] = [];
  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  dateWiseData: any = [];
  loading = false;
  selectedCountryDateWiseData: DateWiseData[] = [];
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart',
  };

  @ViewChild('mylinechart ', { static: false }) myylinechart: any;

  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    merge(
      this.dataService.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      this.dataService.getGlobalData().pipe(
        map((result) => {
          this.data = result;
          this.data.forEach((element: any) => {
            this.countries.push(element.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValues('India');
        this.loading = false;
      },
    });
  }

  updateValues(country: string) {
    this.data.forEach((element: any) => {
      if (country == element.country) {
        this.totalConfirmed = element.confirmed;
        this.totalActive = element.active;
        this.totalDeaths = element.deaths;
        this.totalRecovered = element.recovered;
      }

      this.selectedCountryDateWiseData = this.dateWiseData[country];
      //console.log(this.selectedCountryDateWiseData);
      this.updateChart();
    });
  }

  updateChart() {
    let dataTable = [];
    dataTable.push(['Date', 'Cases']); //Header of datatable
    this.selectedCountryDateWiseData.forEach((data: any) => {
      dataTable.push([data.date, data.cases]);
    });
    this.lineChart = {
      chartType: 'LineChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out',
        },
      },
    };
    this.myylinechart.draw();
  }
}
