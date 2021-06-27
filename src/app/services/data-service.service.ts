import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data';
import { DateWiseData } from '../models/data-wise-data';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  private globalDataURL =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/01-01-2021.csv';

  private dateWiseDataURL =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

  constructor(private http: HttpClient) {}

  getDateWiseData(): Observable<any> {
    return this.http.get(this.dateWiseDataURL, { responseType: 'text' }).pipe(
      map((result) => {
        let rows = result.split('\n'); //splitting into multiple rows on the basis of new line
        let header = rows[0];
        let dates = header.split(/,(?=\S)/); // splitting into multiple fields on the basis of comma
        dates.splice(0, 4); //removing unecessary fields as we need only dates
        rows.splice(0, 1); //removing header

        let mainData: any = {};
        rows.forEach((row) => {
          let cols = row.split(/,(?=\S)/);
          let country = cols[1];
          //console.log(country);
          cols.splice(0, 4);
          mainData[country] = []; // creating a object with key as country name and value as array of DateWiseData Object
          cols.forEach((value, index) => {
            let dwData: DateWiseData = {
              cases: +value, // + operator converts string to number
              country: country,
              date: new Date(Date.parse(dates[index])),
            };
            mainData[country].push(dwData);
          });
        });

        //console.log(mainData);
        return mainData;
      })
    );
  }

  getGlobalData(): Observable<any> {
    return this.http.get(this.globalDataURL, { responseType: 'text' }).pipe(
      map((data) => {
        let result: GlobalDataSummary[] = [];
        let raw: any = {};

        let rows = data.split('\n'); // spliting each row by new line
        rows.splice(0, 1); //removing the 0th index as it is the header in csv
        rows.forEach((row) => {
          let cols = row.split(/,(?=\S)/); //Split only on the basis of comma not followed by white space

          let summary = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };

          // Combine all the data with same country name as key and GlobalSummaryData object as value
          let temp = raw[summary.country];
          if (temp) {
            temp.active = temp.active + summary.active;
            temp.confirmed = temp.confirmed + summary.confirmed;
            temp.deaths = temp.deaths + summary.deaths;
            temp.recovered = temp.recovered + summary.recovered;

            raw[summary.country] = temp;
          } else {
            raw[summary.country] = summary;
          }
        });
        return <GlobalDataSummary[]>Object.values(raw);
      })
    );
  }
}
