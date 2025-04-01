import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { GenericModalComponent } from 'src/app/components/modal-generique/add-modal/modal.component';

import { RendezVous, RendezVousService } from 'src/app/services/rendez-vous/rendez-vous.service';

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
  heureDebut?: string;
  heureFin?: string;
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
})
export class RendezVousInterventionComponent implements OnInit {

  displayedColumns: string[] = ['description', 'client', 'status', 'date', 'debut', 'fin', 'action'];

  paginatedRendezVous: RendezVous[] = [];
  listeRendezVous: RendezVous[] = [];

  dataSource = new MatTableDataSource<RendezVous>(this.paginatedRendezVous);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageSize = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 20];

  selectedRendezVous: RendezVous | null = null;

  totalInterventions: any;
  interventionsInProgress: any;
  interventionsOpen: any;
  interventionsClosed: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private rendezVousService: RendezVousService
  ) { }

  ngOnInit() {
    this.getAllRendezVous();
    this.dataSource.paginator = this.paginator;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'validé': return 'bg-light-warning';
      case 'open': return 'bg-light-success';
      case 'closed': return 'bg-light-error';
      default: return 'bg-light';
    }
  }

  getDescription(rendezVous: RendezVous): string {
    const serviceDescriptions = rendezVous.services.map(service => service.sousSpecialite?.libelle);
    return serviceDescriptions.join(', ');
  }

  getImageUrl(rendezVous: RendezVous): string {
    if(rendezVous.client.genre === 'Femme') {
      return '/assets/images/profile/user-2.jpg';
    }
    return '/assets/images/profile/user-1.jpg';
  }

  onRowClick(rendezVous: RendezVous): void {
    this.selectedRendezVous = rendezVous;
    if (!rendezVous.heureDebut || !rendezVous.heureFin) {
      this.openModal();
    }
  }

  onEditClick(rendezVous: RendezVous): void {
    this.selectedRendezVous = rendezVous;
    if (!rendezVous.heureDebut) {
      this.openModal();
    } else {
      this.router.navigate(['/rendez-vous/interventions-details', rendezVous._id], {
        state: { rendezVous: rendezVous}
    });
    }
  }

  async openModal(errorMessage: string = '') {
    const data = {
      title: 'Confirmation Intervention',
      fields: [
        { name: 'heureDebut', label: 'Heure de début', type: 'datetime-local', required: true, defaultValue: this.selectedRendezVous?.heureDebut || "" },
        { name: 'heureFin', label: 'Heure de fin', type: 'datetime-local', defaultValue: this.selectedRendezVous?.heureFin || "" },
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

        if(this.selectedRendezVous) {
          const rendezVousId = this.selectedRendezVous._id;
          try {
  
            console.log('Données du formulaire:', result);

            this.selectedRendezVous.heureDebut = result.heureDebut;
            this.selectedRendezVous.heureFin = result.heureFin;
            
            const rendezVousUpdate = {
                _id: rendezVousId,
                heureDebut: result.heureDebut,
                heureFin: result.heureFin
            }

            console.log("update: ", rendezVousUpdate);

            const updatedRendezVous = await firstValueFrom(
                this.rendezVousService.updateRendezVous(rendezVousUpdate)
            );
            console.log("Backend update successful:", updatedRendezVous);

            const index = this.listeRendezVous.findIndex(rdv => rdv._id === rendezVousId);
            if (index !== -1) {
              this.listeRendezVous[index] = updatedRendezVous;
            } else {
                this.selectedRendezVous.heureDebut = updatedRendezVous.heureDebut;
                this.selectedRendezVous.heureFin = updatedRendezVous.heureFin;
            }

            this.dataSource.data = [...this.listeRendezVous];
            
          } catch (error: any) {
            console.error('Erreur lors de l’ajout:', error.message);
            await this.openModal(error.message.replace("Error: ", ""));
          }
        }
      }
    });
  }

  getAllRendezVous() {
    this.rendezVousService.getRendezVousByMecanicien().subscribe({
        next: (listeRendezVous) => {
          console.log(listeRendezVous);
            this.listeRendezVous = listeRendezVous;
            this.updatePagination();
            this.updateInterventionCounts();
        },
        error: (error) => {
            console.error('Erreur lors du chargement des listeRendezVous:', error.message);
            alert('Impossible de charger les listeRendezVous. Veuillez réessayer plus tard.');
        }
    });
  }

  updateInterventionCounts() {
    this.totalInterventions = this.listeRendezVous.length;
    this.interventionsInProgress = this.listeRendezVous.filter(t => t.etat === 'en attente').length;
    this.interventionsOpen = this.listeRendezVous.filter(t => t.etat === 'validé' || t.etat === 'valide').length;
    this.interventionsClosed = this.listeRendezVous.filter(t => t.etat === 'terminé' || t.etat === 'termine').length;
  }

  updatePagination() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRendezVous = this.listeRendezVous.slice(startIndex, endIndex);
    this.dataSource.data = this.paginatedRendezVous; // Update the data source
    this.totalInterventions = this.listeRendezVous.length; //Update totalInterventions
  }

  onPaginateChange(event: PageEvent) {
      const { pageIndex, pageSize } = event;
      this.currentPage = pageIndex;
      this.pageSize = pageSize;

      this.updatePagination();

      console.log('Pagination changed: ', event);
  }
  
}