import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

export interface revenueForecastChart {
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
  selector: 'app-revenue-forecast',
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule, CommonModule, FormsModule],
  templateUrl: './revenue-forecast.component.html',
})
export class AppRevenueForecastComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public revenueForecastChart!: Partial<revenueForecastChart> | any;

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

  // Years available for selection
  years: string[] = ["2024", "2025", "2026"];

  currentYear: number = new Date().getFullYear();
  selectedYear: string = this.currentYear.toString();
  selectedMonth: string | undefined; // We no longer need the month filter

  constructor(private paiementService: PaiementService) {
    this.years = Array.from({ length: 6 }, (_, index) => (this.currentYear - index).toString());

    this.revenueForecastChart = {
      series: [
        {
          name: this.selectedYear, // Par défaut, on montre l'année en cours
          data: Array(12).fill(0), // Initialize with zeros for each month
        },
      ],
      chart: {
        type: 'bar',
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
        height: 295,
        stacked: true,
        offsetX: -15,
        toolbar: {
          show: false,
        },
      },
      colors: ['rgba(99, 91, 255, 1)'], // Uniquement l'année sélectionnée
      plotOptions: {
        bar: {
          horizontal: false,
          barHeight: '60%',
          columnWidth: '15%',
          borderRadius: [5],
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: true,
        padding: {
          top: 0,
          bottom: 0,
          right: 0,
        },
        borderColor: 'rgba(0,0,0,0.05)',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },

      yaxis: {
        min: 0,
        max: 500000,
        tickAmount: 4,
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        categories: this.months.map((m) => m.viewValue), // Use month names for categories
        labels: {
          style: { fontSize: '13px', colors: '#adb0bb', fontWeight: '400' },
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };

    this.getStatPaiements(); 
  }

  getStatPaiements() {
    const yearToFetch = this.selectedYear;
    
    this.paiementService.getStatPaiements(yearToFetch, this.selectedMonth ?? undefined).subscribe(
      (response) => {
  
        if (response && response.details && Array.isArray(response.details)) {
          const yearData = Array(12).fill(0);

          const responseYear = response._id?.annee;
          
          // Check if the response year matches the selected year
          if (responseYear && responseYear.toString() === yearToFetch.toString()) {
            response.details.forEach((item: any) => {
  
              const monthIndex = this.months.findIndex(m => m.value === item.mois);
              if (monthIndex !== -1) {
                yearData[monthIndex] = item.total;
              }
            });
  
            this.revenueForecastChart.series = [
              { name: `${yearToFetch}`, data: yearData },
            ];

          } 
        } 
      },
      (error) => {
        console.error('Error fetching payments:', error);
      }
    );
  }
  

  // Method to update the chart when year changes
  updateChart() {
    this.getStatPaiements(); // Fetch and update chart when the year is changed
  }
}
