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
import { Intervention } from '../rendez-vous-intervention.component';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface Service {
  sousSpecialite: any; // Replace 'any' with the actual type
  raison: string;
  mecanicien: any; // Replace 'any' with the actual type
  quantiteEstimee: number;
  heureDebut: Date;
  heureFin: Date;
  quantiteFinale: number;
  prixUnitaire: number;
  prixTotal: number;
  remise: number;
  commentaire: string;
  note: number;
  avis: string;
  status: string; // Enum: 'en cours', 'en attente', 'suspendue', 'terminé'
}

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
    DatePipe,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './rendez-vous-intervention-details.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RendezVousInterventionDetailsComponent implements OnInit {
  intervention: Intervention | undefined;
  detailsForm: FormGroup;
  notesForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
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
    const interventionId = Number(this.route.snapshot.paramMap.get('id'));
    this.intervention = this.getInterventionDetails(interventionId);

    if (this.intervention) {
      this.detailsForm.patchValue({
        title: this.intervention.title,
        description: this.intervention.description,
        assignee: this.intervention.assignee?.name,
        status: this.intervention.status,
        date: this.intervention.date,
        heureDebut: this.intervention.heureDebut,
        heureFin: this.intervention.heureFin
      });
    }
  }

  getInterventionDetails(id: number): Intervention | undefined {
    const interventionsData: Intervention[] = [
      {
        id: 1,
        title: 'Sed ut perspiciatis unde omnis iste',
        description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        assignee: { name: 'Alice', imageUrl: '/assets/images/profile/user-1.jpg' },
        status: 'inprogress',
        date: new Date('2024-05-01'),
        heureDebut: '09:00',
        heureFin: '10:00',
        services: [
          {
            sousSpecialite: { name: 'Oil Change' },
            raison: 'Regular maintenance',
            mecanicien: { name: 'Bob' },
            quantiteEstimee: 1,
            heureDebut: new Date('2024-05-15T09:00:00'),
            heureFin: new Date('2024-05-15T10:00:00'),
            quantiteFinale: 1,
            prixUnitaire: 50,
            prixTotal: 50,
            remise: 0,
            commentaire: 'Completed on time',
            note: 5,
            avis: 'Excellent service',
            status: 'terminé'
          },
          {
            sousSpecialite: { name: 'Tire Rotation' },
            raison: 'Tire maintenance',
            mecanicien: { name: 'Charlie' },
            quantiteEstimee: 1,
            heureDebut: new Date('2024-05-15T10:00:00'),
            heureFin: new Date('2024-05-15T11:00:00'),
            quantiteFinale: 1,
            prixUnitaire: 30,
            prixTotal: 30,
            remise: 5,
            commentaire: 'Completed',
            note: 4,
            avis: 'Good service',
            status: 'terminé'
          }
        ]
      },
      {
        id: 2,
        title: 'Xtreme theme dropdown issue',
        description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        assignee: { name: 'Jonathan', imageUrl: '/assets/images/profile/user-2.jpg' },
        status: 'open',
        date: new Date('2024-05-03'),
        services: []
      },
      {
        id: 3,
        title: 'Header issue in material admin',
        description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        assignee: { name: 'Smith', imageUrl: '/assets/images/profile/user-3.jpg' },
        status: 'closed',
        date: new Date('2024-05-02'),
        heureDebut: '14:00',
        heureFin: '15:00',
        services: []
      },
      {
        id: 4,
        title: 'Sidebar issue in Nice admin',
        description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        assignee: { name: 'Vincent', imageUrl: '/assets/images/profile/user-4.jpg' },
        status: 'inprogress',
        date: new Date('2024-05-06'),
        services: []
      },
      {
        id: 5,
        title: 'Elegant Theme Side Menu show OnClick',
        description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        assignee: { name: 'Chris', imageUrl: '/assets/images/profile/user-5.jpg' },
        status: 'open',
        date: new Date('2024-05-04'),
        heureDebut: '11:00',
        heureFin: '12:00',
        services: []
      }
    ];
    return interventionsData.find(i => i.id === id);
  }

  goBack(): void {
    this.router.navigate(['/rendez-vous/interventions']);
  }

  saveDetails(): void {
    if (this.intervention) {
      // Update intervention object (this is in-memory, you'd save to a service/API)
      this.intervention.title = this.detailsForm.get('title')?.value;
      this.intervention.description = this.detailsForm.get('description')?.value;
      // ... other updates

      console.log('Saving details:', this.detailsForm.value);
    }
  }

  saveServices(): void {
    if (this.intervention && this.intervention.services) {
      // Save changes to the services (replace with your actual logic)
      console.log('Saving services:', this.intervention.services);
    }
  }
}