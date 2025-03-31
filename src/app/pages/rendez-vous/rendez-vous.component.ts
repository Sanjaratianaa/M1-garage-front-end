import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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

import { SousServiceService } from 'src/app/services/services/sousService.service';
import { Voiture, VoitureService } from 'src/app/services/caracteristiques/voiture.sevice';
import { RendezVous, RendezVousService } from 'src/app/services/personne/rendez-vous.service';
import { PrixSousServiceService } from 'src/app/services/services/prixSousService.service';
import { Router } from '@angular/router'; 

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
        id_sous_service: [],
        date: null,
    };
    selectedSousServices: any[] = [];

    legendItems = [
        { label: 'En attente', color: '#f7b801' },
        { label: 'Validé', color: '#8cb369' },
        { label: 'Rejeté', color: '#d90429' },
        { label: 'Annulé', color: '#6f1d1b' },
        { label: 'Terminé', color: '#8ac926' }
      ];

    constructor(
        private dialog: MatDialog,
        private sousServiceService: SousServiceService,
        private voitureService: VoitureService,
        private rendezVousService: RendezVousService,
        private prixSousServiceService: PrixSousServiceService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.getAllPrix();
        this.getAllVoitures();
        this.getAllSousServicesActives();
        this.getAllRendezVous();
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
            next: (voitures: Voiture[]) => { 
                this.voitures = voitures.map((voiture: Voiture) => ({
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

                    const serviceDescriptions = rv.services.map(service => service.sousSpecialite?.libelle);
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
                return { primary: '#d90429', secondary: '#d9042933' };
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

        if (event.meta && event.meta.rendezVousData) {
            const rendezVousData = event.meta.rendezVousData;
            console.log('RendezVous Data', rendezVousData);
            this.router.navigate(['/rendez-vous', rendezVousData._id]);

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
                    name: "date",
                    label: "Date souhaité pour le rendez-vous",
                    type: "date",
                    required: true,
                    defaultValue: this.newSousService.date
                },
                {
                    name: 'id_sous_service', label: 'Sous-service', type: 'select', required: true,
                    options: this.sousServices, defaultValue: this.newSousService.id_sous_service,
                },
            ],
            submitText: 'Ajouter',
            errorMessage: errorMessage
        };
    
        const dialogRef = this.dialog.open(RendezVousModalComponent, {
            width: '600px', 
            data: data,
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                try {
                    console.log('Données du formulaire:', result);
    
                    const userString = localStorage.getItem('user');
                    let user;
                    if (userString !== null) {
                        user = JSON.parse(userString);
                    } else {
                        console.log("No User in local storage. Can not associate appointment");
                        return;
                    }
    
                    const servicesArray = result.sousServicesArray.map((sousServiceItem: any) => {
                        const sousServiceId = sousServiceItem.id;
                        const sousServiceObject = this.sousServicesObject.find(ss => ss._id === sousServiceId);
                        const prixSousServiceObject = this.prixSousServices.find(pss => pss.sousService._id === sousServiceId);
    
                        if (sousServiceObject) {
                            return {
                                sousSpecialite: sousServiceId,
                                raison: sousServiceItem.reason, // from form
                                quantiteEstimee: sousServiceItem.quantite, // from form
                                prixUnitaire: prixSousServiceObject ? prixSousServiceObject.prixUnitaire || 0 : 0,
                                status: "en attente"
                            };
                        } else {
                            return null;
                        }
                    }).filter((item: any) => item !== null);
    
    
                    delete result.sousServicesArray;
                    delete result.id_sous_service;
    
                    this.newSousService = {
                        ...result,
                        services: servicesArray,
                        dateRendezVous: result.date,
                        client: user.idPersonne
                    };
    
                    console.log("Data to send to backend:", this.newSousService);
    
                    // this.rendezVousService.addRendezVous(this.newSousService).subscribe({
                    //     next: (response) => {
                    //         console.log('Rendez-vous ajouté avec succès:', response);
                    //         this.getAllRendezVous();
                    //     },
                    //     error: (error) => {
                    //         console.error('Erreur lors de l’ajout:', error.message);
                    //         this.openModal(error.message.replace("Error: ", ""));
                    //     }
                    // });
    
                } catch (error: any) {
                    console.error('Erreur lors de l’ajout:', error.message);
                    this.openModal(error.message.replace("Error: ", ""));
                }
            }
        });
    }
}