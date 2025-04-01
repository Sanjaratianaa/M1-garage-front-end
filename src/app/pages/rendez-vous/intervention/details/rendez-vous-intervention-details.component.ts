import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RendezVous, Service } from 'src/app/services/rendez-vous/rendez-vous.service';
import { firstValueFrom } from 'rxjs';
import { RendezVousService } from 'src/app/services/rendez-vous/rendez-vous.service';

@Component({
    selector: 'app-rendez-vous-intervention-details',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatTabsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    templateUrl: './rendez-vous-intervention-details.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RendezVousInterventionDetailsComponent implements OnInit {
    rendezVous: RendezVous | undefined;
    detailsForm: FormGroup;
    notesForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private rendezVousService: RendezVousService
    ) {

        this.rendezVous = this.router.getCurrentNavigation()?.extras.state?.['rendezVous'];

        this.detailsForm = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            assignee: [''],
            status: [''],
            date: [''],
            heureDebut: [''],
            heureFin: ['']
        });

        this.notesForm = this.fb.group({
            notes: ['']
        });
    }

    ngOnInit(): void {
        console.log("rendezVous: ",this.rendezVous)

        // if (this.intervention) {
        //     this.detailsForm.patchValue({
        //         title: this.intervention.title,
        //         description: this.intervention.description,
        //         assignee: this.intervention.assignee?.name,
        //         status: this.intervention.status,
        //         date: this.intervention.date,
        //         heureDebut: this.intervention.heureDebut,
        //         heureFin: this.intervention.heureFin
        //     });
        // }
    }

    goBack(): void {
        this.router.navigate(['/rendez-vous/interventions']);
    }

    isCurrentUser(service: Service): boolean {
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                return !!(service.mecanicien && user.idPersonne === service.mecanicien._id);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        return false;
    }

    saveDetails(): void {
        if (this.rendezVous) {
            // this.rendezVous.title = this.detailsForm.get('title')?.value;
            // this.intervention.description = this.detailsForm.get('description')?.value;
            // // ... other updates

            // console.log('Saving details:', this.detailsForm.value);
            console.log('Saving details:');
        }
    }

    calculatePrixTotal(service: Service): void {
        const quantite = Number(service.quantiteFinale) || 0;
        const prixUnitaire = Number(service.prixUnitaire) || 0;
    
        const total = quantite * prixUnitaire;
        service.prixTotal = parseFloat(total.toFixed(2));
      }

    saveService(service: Service): void {
        console.log('Saving service:', service);
        const serviceUpdate = {
            "services": [
                service
            ]
        };
        const updatedRendezVous =  firstValueFrom(
            this.rendezVousService.updateRendezVous(serviceUpdate)
        );
        console.log("Backend update successful:", updatedRendezVous);
    }

    getServiceStatusStyle(status: string): any {
        switch (status) {
            case 'en attente':
                return { 'background-color': '#f7b801' };
            case 'en cours':
                return { 'background-color': '#007bff' };
            case 'suspendue':
                return { 'background-color': '#dc3545' };
            case 'terminé':
                return { 'background-color': '#28a745' };
            default:
                return { 'background-color': '#6c757d' };
        }
    }

    saveAllServices() {
      if (this.rendezVous && this.rendezVous.services) {
        this.rendezVous.services.forEach(service => {
          // this.rendezVousService.updateRendezVousService(this.intervention._id, service._id, service)
          //   .subscribe({
          //     next: (response) => {
          //       console.log(`Service ${service.raison} updated successfully:`, response);
          //     },
          //     error: (error) => {
          //       console.error(`Error updating service ${service.raison}:`, error);
          //     }
          //   });
        });
      }
    }
}