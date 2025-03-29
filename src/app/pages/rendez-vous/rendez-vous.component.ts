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
import { Voiture, VoitureService } from 'src/app/services/caracteristiques/voiture.sevice';
import { RendezVous, RendezVousService } from 'src/app/services/personne/rendez-vous.service';
import { PrixSousServiceService } from 'src/app/services/services/prixSousService.service';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

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
export class RendezVousComponent {
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();

    events: CalendarEvent[] = [];
    activeDayIsOpen: boolean = true;
    refresh = new Subject<void>();

    sousServices: any[] = [];
    sousServicesObject: any[] = [];
    voitures: VoitureSelectItem[] = [];
    prixSousServices: any[];

    newSousService: any = {
        voiture : null,
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
    ) {}

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

                // this.rendezVousService.addRendezVousTest();
            },
            error: (error) => {
                console.error('Erreur lors du chargement des voitures:', error.message);
                alert('Impossible de charger les voitures. Veuillez réessayer plus tard.');
            }
        });
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
    
        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                try {
                    console.log('Données du formulaire:', result);

                    const userString = localStorage.getItem('user');
                    let user;
                    if (userString !== null) {
                        user =  JSON.parse(userString);
                    } else {
                        console.log("No User in local storage. Can not associate appointment");
                        return
                    }
    
                    const servicesArray = result.id_sous_service.map((sousServiceId: string) => {

                        const sousServiceObject = this.sousServicesObject.find(ss => ss._id === sousServiceId); 
                        const prixSousServiceObject = this.prixSousServices.find(pss => pss.sousService._id === sousServiceId);

                        if(sousServiceObject) {
                            return {
                                sousSpecialite: sousServiceId,
                                raison: sousServiceObject.libelle || "",
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
                            console.log('Rendez-vous ajouté avec succès:', response);
                            // Ici, tu peux afficher un message de succès ou fermer le modal
                        },
                        error: (error) => {
                            throw new Error(error.message);
                        }
                    });
                    
    
                } catch (error: any) {
                    console.error('Erreur lors de l’ajout:', error.message);
                    await this.openModal(error.message.replace("Error: ", ""));
                }
            }
        });
    }
}