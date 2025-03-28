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
import { RendezVousModalComponent } from './add-rendez-vous-modal/rendez-vous-modal.component';

import { ServiceService } from 'src/app/services/services/service.service';
import { SousServiceService } from 'src/app/services/services/sousService.service';
import { VoitureService } from 'src/app/services/caracteristiques/voiture.sevice';

@Component({
    selector: 'app-rendez-vous',
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
    templateUrl: './rendez-vous.component.html',
    // styleUrls: ['./calendar.component.scss'],
    schemas: [NO_ERRORS_SCHEMA],
})
export class RendezVousComponent {
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();

    events: CalendarEvent[] = [];
    activeDayIsOpen: boolean = true;
    refresh = new Subject<void>();

    services: any[] = [];
    sousServices: any[] = [];
    voitures: any[] = [];

    newPrixSousService: any = {
        id_sous_service: [],
        date: null,
        voiture: null
    };

    options = [
        { value: 'Homme', label: 'Homme' },
        { value: 'Femme', label: 'Femme' },
        { value: 'Autre', label: 'Autre' }
      ];

    constructor(
        private dialog: MatDialog,
        private serviceService: ServiceService, 
        private sousServiceService: SousServiceService,
        private voitureService: VoitureService
    ) {}

    ngOnInit() {
        // Initialisez la pagination au chargement du composant
        this.getAllServicesActives();
        this.getAllSousServicesActives();
      }

    setView(view: CalendarView) {
        this.view = view;
    }

    getAllServicesActives() {
        this.serviceService.getServicesActives().subscribe({
            next: (services) => {
                this.services = services.map(service => ({
                    value: service._id,
                    label: service.libelle
                }));
            },
            error: (error) => {
                console.error('Erreur lors du chargement des services:', error.message);
                alert('Impossible de charger les services. Veuillez réessayer plus tard.');
            }
        });
      }
    
    getAllSousServicesActives() {
        this.sousServiceService.getSousServicesActives().subscribe({
            next: (sousServices) => {
                this.sousServices = sousServices.map(sousService => ({
                    value: sousService._id,
                    label: sousService.libelle,
                    serviceId: sousService.service._id
                }));
            },
            error: (error) => {
                console.error('Erreur lors du chargement des sous Services:', error.message);
                alert('Impossible de charger les sous Services. Veuillez réessayer plus tard.');
            }
        });
    }

    getAllVoitures() {
        const userString = localStorage.getItem('user');

        if(userString) {
            const user = JSON.parse(userString);

            this.voitureService.getVoituresById(user.id).subscribe({
                next: (voitures) => {
                    this.voitures = voitures.map(voiture => ({
                        value: voiture._id,
                        label: voiture.numeroImmatriculation
                    }));
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des voitures:', error.message);
                    alert('Impossible de charger les voitures. Veuillez réessayer plus tard.');
                }
            });

        }
        
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

    async openModal(errorMessage: string = '') {
        const data = {
          title: 'Ajouter un prix de sous-service',
          fields: [
            {
              name: 'id_service', label: 'Service', type: 'select', required: true,
              options: this.services, defaultValue: this.newPrixSousService.id_service
            },
            {
              name: 'id_sous_service', label: 'Sous-service', type: 'select', required: true,
              options: this.sousServices, defaultValue: this.newPrixSousService.id_sous_service
            },
            {
              name: "prix",
              label: "Prix en Ar",
              type: "number",
              required: true,
              defaultValue: this.newPrixSousService.prix  // Valeur par défaut pour le champ prix
            },
            {
              name: "date",
              label: "Date souhaité pour le rendez-vous",
              type: "date",
              required: true,
              defaultValue: this.newPrixSousService.date  // Valeur par défaut pour le champ date
            }
          ],
          submitText: 'Ajouter',
          errorMessage: errorMessage
        };
    
        const dialogRef = this.dialog.open(RendezVousModalComponent, {
          width: '400px',
          data: data,
        });
    
        dialogRef.afterClosed().subscribe(async result => {
          if (result) {
            try {
              console.log('Données du formulaire:', result);
              this.newPrixSousService = result;
            //   await this.addNewPrixSousServiceAsync();
            } catch (error: any) {
              console.error('Erreur lors de l’ajout:', error.message);
              await this.openModal(error.message.replace("Error: ", ""));
            }
          }
        });
      }
}