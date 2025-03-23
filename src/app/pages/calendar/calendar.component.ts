import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { CalendarView, CalendarModule, CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { isSameDay, isSameMonth } from 'date-fns';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { addMonths, subMonths } from 'date-fns';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        FormsModule,
        CalendarModule,
    ],
    templateUrl: './calendar.component.html',
    // styleUrls: ['./calendar.component.scss'],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CalendarComponent {
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();

    events: CalendarEvent[] = [];
    activeDayIsOpen: boolean = true;
    refresh = new Subject<void>();

    constructor() {}

    setView(view: CalendarView) {
        this.view = view;
    }

   dayClicked(event: any): void {  // Keep event type as 'any'
        const { day } = event;

        if (isSameMonth(day.date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, day.date) && this.activeDayIsOpen === true) ||
                day.events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = day.date;
        }
    }

    async addEvent() {
        console.log('Event added');
    }

    // Navigation functions
    previousMonth(): void {
        this.viewDate = subMonths(this.viewDate, 1);
    }

    today(): void {
        this.viewDate = new Date();
    }

    nextMonth(): void {
        this.viewDate = addMonths(this.viewDate, 1);
    }
}