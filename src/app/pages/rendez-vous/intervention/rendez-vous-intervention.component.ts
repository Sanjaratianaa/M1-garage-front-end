import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalComponent } from 'src/app/components/modal-generique/add-modal/modal.component';
import { Router } from '@angular/router';

// Define the interface for your intervention data
export interface Intervention {
  id: number;
  title: string;
  description: string;
  assignee: {
    name: string;
    imageUrl: string;
  };
  status: string;
  date: Date;
  heureDebut?: string; // Optional property
  heureFin?: string;   // Optional property
  services?: any[];
}

@Component({
  selector: 'app-intervention-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './rendez-vous-intervention.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
//   styleUrls: ['./rendez-vous-intervention.component.scss']
})
export class RendezVousInterventionComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'assignee', 'status', 'date', 'debut', 'fin', 'action'];

  interventionsData: Intervention[] = [
    {
      id: 1,
      title: 'Sed ut perspiciatis unde omnis iste',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Alice', imageUrl: '/assets/images/profile/user-1.jpg' },
      status: 'inprogress',
      date: new Date('2024-05-01'),
      heureDebut: '09:00',
      heureFin: '10:00'
    },
    {
      id: 2,
      title: 'Xtreme theme dropdown issue',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Jonathan', imageUrl: '/assets/images/profile/user-2.jpg' },
      status: 'open',
      date: new Date('2024-05-03')
    },
    {
      id: 3,
      title: 'Header issue in material admin',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Smith', imageUrl: '/assets/images/profile/user-3.jpg' },
      status: 'closed',
      date: new Date('2024-05-02' ,  ),
      heureDebut: '14:00',
      heureFin: '15:00'
    },
    {
      id: 4,
      title: 'Sidebar issue in Nice admin',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Vincent', imageUrl: '/assets/images/profile/user-4.jpg' },
      status: 'inprogress',
      date: new Date('2024-05-06')
    },
    {
      id: 5,
      title: 'Elegant Theme Side Menu show OnClick',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Chris', imageUrl: '/assets/images/profile/user-5.jpg' },
      status: 'open',
      date: new Date('2024-05-04'),
      heureDebut: '11:00',
      heureFin: '12:00'
    }
  ];
  dataSource = new MatTableDataSource<Intervention>(this.interventionsData);

  totalInterventions = this.interventionsData.length;
  interventionsInProgress = this.interventionsData.filter(t => t.status === 'inprogress').length;
  interventionsOpen = this.interventionsData.filter(t => t.status === 'open').length;
  interventionsClosed = this.interventionsData.filter(t => t.status === 'closed').length;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageSize = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 20];

  selectedIntervention: Intervention | null = null;

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'inprogress': return 'bg-light-warning';
      case 'open': return 'bg-light-success';
      case 'closed': return 'bg-light-error';
      default: return 'bg-light';
    }
  }

  onRowClick(intervention: Intervention): void {
    this.selectedIntervention = intervention;
    if (!intervention.heureDebut || !intervention.heureFin) {
      this.openModal();
    }
  }

  onEditClick(intervention: Intervention): void {
    this.selectedIntervention = intervention;
    if (!intervention.heureDebut) {
      this.openModal();
    } else {
      this.router.navigate(['/rendez-vous/interventions-details', intervention.id]);
    }
  }

  async openModal(errorMessage: string = '') {
    const data = {
      title: 'Confirmation Intervention',
      fields: [
        { name: 'heureDebut', label: 'Heure de début', type: 'time', defaultValue: this.selectedIntervention?.heureDebut || "" },
        { name: 'heureFin', label: 'Heure de fin', type: 'time', defaultValue: this.selectedIntervention?.heureFin || "" },
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

          console.log('Données du formulaire:', result);

          if (this.selectedIntervention) {
            this.selectedIntervention.heureDebut = result.heureDebut;
            this.selectedIntervention.heureFin = result.heureFin;
          }

          // Refresh the table data
          this.dataSource.data = [...this.interventionsData];
          
        } catch (error: any) {
          console.error('Erreur lors de l’ajout:', error.message);
          await this.openModal(error.message.replace("Error: ", ""));
        }
      }
    });
  }
}