import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  NgApexchartsModule,
  ApexFill,
} from 'ng-apexcharts';

import { PaiementService } from 'src/app/services/paiement/paiement.service';

export interface totalincomeChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  fill: ApexFill;
}

interface month {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-total-income',
  imports: [MaterialModule, NgApexchartsModule, CommonModule],
  templateUrl: './total-income.component.html',
})
export class AppTotalIncomeComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public totalincomeChart!: Partial<totalincomeChart> | any;

  selectedYear: string = new Date().getFullYear().toString(); // Default to current year
  selectedMonth: string | undefined = undefined;

  years: string[] = [];

  months: month[] = [
    { value: '01', viewValue: 'Jan' },
    { value: '02', viewValue: 'Feb' },
    { value: '03', viewValue: 'Mar' },
    { value: '04', viewValue: 'Apr' },
    { value: '05', viewValue: 'May' },
    { value: '06', viewValue: 'Jun' },
    { value: '07', viewValue: 'Jul' },
    { value: '08', viewValue: 'Aug' },
    { value: '09', viewValue: 'Sep' },
    { value: '10', viewValue: 'Oct' },
    { value: '11', viewValue: 'Nov' },
    { value: '12', viewValue: 'Dec' },
  ];

  isLoading: boolean = false;
  totalAmount: number = 0;

  constructor(private paiementService: PaiementService) {

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, index) => (currentYear - index).toString());
    
    this.totalincomeChart = {
      series: [
        {
          name: 'Income',
          color: 'rgba(255, 102, 146, 1)',
          data: [30, 25, 35, 20, 30, 40],
        },
      ],

      chart: {
        type: 'line',
        height: 60,
        sparkline: {
          enabled: true,
        },
        group: 'sparklines',
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: true,
          position: 'right',
        },
        x: {
          show: false,
        },
      },
    };

    this.getStatPaiements();
  }

  getStatPaiements() {
    this.isLoading = true;
    this.paiementService.getStatPaiements(this.selectedYear, this.selectedMonth ?? undefined).subscribe(
      (response) => {
        this.totalAmount = response.totalMontant || 0;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching payment data', error);
        this.isLoading = false;
      }
    );
  }

}
