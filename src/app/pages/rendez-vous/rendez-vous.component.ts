import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { CalendarView, CalendarModule, CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { isSameDay, isSameMonth, subDays, addDays, endOfMonth, isPast, addHours, endOfDay, startOfDay } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { addMonths, subMonths } from 'date-fns';
import { RendezVousModalComponent } from './add-rendez-vous-modal/rendez-vous-modal.component';

import { ServiceService } from 'src/app/services/services/service.service';
import { SousServiceService } from 'src/app/services/services/sousService.service';
import { Voiture, VoitureService } from 'src/app/services/caracteristiques/voiture.sevice';
import { RendezVous, RendezVousService } from 'src/app/services/personne/rendez-vous.service';
import { PrixSousServiceService } from 'src/app/services/services/prixSousService.service';

interface VoitureSelectItem {
    value: string;
    label: string;
}

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
export class RendezVousComponent implements OnInit {
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();

    events: CalendarEvent[] = [];
    activeDayIsOpen: boolean = false;  // Initialize to false
    refresh = new Subject<void>();

    sousServices: any[] = [];
    sousServicesObject: any[] = [];
    voitures: VoitureSelectItem[] = [];
    prixSousServices: any[];
    rendezVous: any[] = [];

    newSousService: any = {
        voiture: null,
        id_sous_service: [], // Array of sub-service IDs
        date: null,
        // prix: 0,  // This isn't directly part of the RendezVous Schema, it's on services array.
    };
    selectedSousServices: any[] = [];

    constructor(
        private dialog: MatDialog,
        private serviceService: ServiceService,
        private sousServiceService: SousServiceService,
        private voitureService: VoitureService,
        private rendezVousService: RendezVousService,
        private prixSousServiceService: PrixSousServiceService
    ) { }

    ngOnInit() {
        this.getAllPrix();
        this.getAllVoitures();
        this.getAllSousServicesActives();
        this.getAllRendezVous();

        //this.rendezVousService.addRendezVous(null); //Remove this line. It does nothing
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    getAllPrix() {
        this.prixSousServiceService.getPrixSousServices().subscribe({
            next: (prixSousServices) => {
                this.prixSousServices = prixSousServices;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des prix des sous services:', error.message);
                alert('Impossible de charger les prix sous services. Veuillez réessayer plus tard.');
            }
        });
    }

    getAllSousServicesActives() {
        this.sousServiceService.getSousServicesActives().subscribe({
            next: (sousServices) => {
                this.sousServicesObject = sousServices;
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
        this.voitureService.getVoituresByClient().subscribe({
            next: (voitures: Voiture[]) => { // Correctly receive an array of Voiture objects
                this.voitures = voitures.map((voiture: Voiture) => ({ // Correctly iterate over the voitures array
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

    getAllRendezVous() {
        this.rendezVousService.getAllRendezVous().subscribe({
            next: (rendezVous: RendezVous[]) => {
                this.rendezVous = rendezVous;

                console.log(this.rendezVous);

                this.events = rendezVous.map(rv => {

                    const serviceDescriptions = rv.services.map(service => service.raison);
                    const eventColor = this.getEventColor(rv.etat);

                    return {
                        start: rv.dateRendezVous ? new Date(rv.dateRendezVous) : new Date(),
                        end: rv.heureFin ? new Date(rv.heureFin) : undefined,
                        title: `Rendez-vous pour: ${rv.voiture?.numeroImmatriculation || 'N/A'} - ${serviceDescriptions.join(', ')}`,
                        allDay: false,
                        meta: {
                            rendezVousData: rv
                        },
                        color: eventColor,
                    };
                });
                this.refresh.next();
            },
            error: (error) => {
                console.error('Erreur lors du chargement des rendez-vous:', error.message);
                alert('Impossible de charger les rendez-vous. Veuillez réessayer plus tard.');
            }
        });
    }

    private getEventColor(etat: string): { primary: string; secondary: string } {
        switch (etat) {
            case 'en attente':
                return { primary: '#f7b801', secondary: '#f7b80133' };
            case 'validé':
                return { primary: '#8cb369', secondary: '#8cb36933' };
            case 'rejeté':
                return { primary: '#660708', secondary: '#66070833' };
            case 'annulé':
                return { primary: '#6f1d1b', secondary: '#6f1d1b33' };
            case 'terminé':
                return { primary: '#8ac926', secondary: '#8ac92633' };
            default:
                return { primary: '#cccccc', secondary: '#dddddd' };
        }
    }

    dayClicked(event: { day: any; sourceEvent: MouseEvent | KeyboardEvent }): void {
        if (isSameMonth(event.day.date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, event.day.date) && this.activeDayIsOpen === true) ||
                event.day.events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = event.day.date;
        }
    }

    handleEvent(action: string, event: CalendarEvent): void {
        // Here, you can access the 'event' object (which is a CalendarEvent)
        // and the 'action' (which will be 'Clicked' in this case).

        console.log('Event', event);
        console.log('Action', action);

        // You can also access the original RendezVous data from the 'meta' property:
        if (event.meta && event.meta.rendezVousData) {
            const rendezVousData = event.meta.rendezVousData;
            console.log('RendezVous Data', rendezVousData);

            // Implement your logic to display event details here (e.g., open a modal).
        }
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
            title: 'Prendre un rendez-vous',
            fields: [
                {
                    name: 'voiture', label: 'Voiture', type: 'select', required: true,
                    options: this.voitures, defaultValue: this.newSousService.voiture
                },
                {
                    name: 'id_sous_service', label: 'Sous-service', type: 'select', required: true,
                    options: this.sousServices, defaultValue: this.newSousService.id_sous_service,
                },
                {
                    name: "date",
                    label: "Date souhaité pour le rendez-vous",
                    type: "date",
                    required: true,
                    defaultValue: this.newSousService.date
                }
            ],
            submitText: 'Ajouter',
            errorMessage: errorMessage
        };

        const dialogRef = this.dialog.open(RendezVousModalComponent, {
            width: '400px',
            data: data,
        });

        dialogRef.afterClosed().subscribe(result => {  // Remove 'async' keyword here
            if (result) {
                try {
                    console.log('Données du formulaire:', result);

                    const userString = localStorage.getItem('user');
                    let user;
                    if (userString !== null) {
                        user = JSON.parse(userString);
                    } else {
                        console.log("No User in local storage. Can not associate appointment");
                        return
                    }

                    const servicesArray = result.id_sous_service.map((sousServiceId: string) => {

                        const sousServiceObject = this.sousServicesObject.find(ss => ss._id === sousServiceId);
                        const prixSousServiceObject = this.prixSousServices.find(pss => pss.sousService._id === sousServiceId);

                        if (sousServiceObject) {
                            return {
                                sousSpecialite: sousServiceId,
                                libelle: sousServiceObject.libelle || "",  // Use libelle directly
                                quantiteEstimee: sousServiceObject.duree || 1,
                                prixUnitaire: prixSousServiceObject ? prixSousServiceObject.prixUnitaire || 0 : 0,
                                status: "en attente"
                            };
                        } else {
                            return null;
                        }

                    });

                    // Update newSousService with the constructed services array and date
                    delete result.id_sous_service

                    this.newSousService = {
                        ...result,
                        services: servicesArray,
                        dateRendezVous: result.date,
                        client: user.idPersonne
                    };

                    console.log("Data to send to backend:", this.newSousService);

                    this.rendezVousService.addRendezVous(this.newSousService).subscribe({
                        next: (response) => {
                            this.getAllRendezVous();
                        },
                        error: (error) => {
                            console.error('Erreur lors de l’ajout:', error.message);
                            this.openModal(error.message.replace("Error: ", "")); // Call openModal directly
                        }
                    });

                } catch (error: any) {
                    console.error('Erreur lors de l’ajout:', error.message);
                    this.openModal(error.message.replace("Error: ", "")); // Call openModal directly
                }
            }
        });
    }
}