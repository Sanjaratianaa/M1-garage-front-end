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
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { addMonths, subMonths } from 'date-fns';
import { GenericModalComponent } from 'src/app/components/modal-generique/add-modal/modal.component';

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

    options = [
        { value: 'Homme', label: 'Homme' },
        { value: 'Femme', label: 'Femme' },
        { value: 'Autre', label: 'Autre' }
      ];

    constructor(private dialog: MatDialog,) {}

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

    async openModal(errorMessage: string = '') {
            const data = {
                title: 'Prendre un nouveau rendez-vous',
                fields: [
                    {
                        name: 'id_voiture', label: 'Voiture', type: 'select', required: true, defaultValue: "haha",
                        options: this.options
                    },
                    {
                        name: 'id_sous_service', label: 'Sous-service', type: 'select', required: true, defaultValue: "haha",
                        options: this.options
                    },
                    { name: 'dateSouhaite', label: 'Date du rendez-vous souhaité', type: 'datetime-local', required: true, defaultValue: "haha" }
                ],
                submitText: 'Ajouter',
                errorMessage: errorMessage,
            };
    
            const dialogRef = this.dialog.open(GenericModalComponent, {
                width: '400px',
                data: data,
            });
    
            dialogRef.afterClosed().subscribe(async result => {
                if (result) {
                    try {
                        this.openModal();
                        console.log('Données du formulaire:', result);
                    } catch (error: any) {
                        console.error('Erreur lors de l’ajout:', error.message);
                        await this.openModal(error.message.replace("Error: ", ""));
                    }
                }
            });
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