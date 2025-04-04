import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-activities',
  imports: [MaterialModule, CommonModule],
  templateUrl: './daily-activities.component.html',
})
export class AppDailyActivitiesComponent {

  @Input() stats: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() isAdmin: boolean = false;
  @Input() isMecanicien: boolean = false;

  constructor() {}

  ngOnInit() {
    console.log("Received stats:", this.stats);
  }

}

