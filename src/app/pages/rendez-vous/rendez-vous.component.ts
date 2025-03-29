import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';  // Assurez-vous que FormsModule est bien importé ici
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RendezVous, RendezVousService } from 'src/app/services/rendez-vous/rendez-vous.service';
import { DeleteConfirmationModalComponent } from 'src/app/components/modal-generique/confirm-modal/delete-confirmation-modal.component';
import { DetailRendezVousComponent } from './detail-rendez-vous/detail-rendez-vous.component';


@Component({
    selector: 'app-rendez-vous',
    standalone: true,
    templateUrl: './rendez-vous.component.html',
    imports: [MatListModule, MatCardModule, DatePipe, MatIconModule, MaterialModule, FormsModule, CommonModule, MatButtonModule],

})
export class RendezVousComponent {
    displayedColumns: string[] = ['Date et heure demande', "Client", "Date du rendez-vous", "N° Matriculation", "Validateur", "Remarque", "Statut", 'actions'];
    listeRendezVous: RendezVous[];

    paginatedRendezVous: RendezVous[] = [];

    // Nouveau employé à ajouter
    newRendezVous: string = "";

    // Paramètres de pagination
    pageSize = 5;
    currentPage = 0;
    pageSizeOptions = [5, 10, 20];

    constructor(private dialog: MatDialog, private rendezVousService: RendezVousService) { }

    ngOnInit() {
        // Initialisez la pagination au chargement du composant
        this.getAllRendezVouss();
    }

    getAllRendezVouss() {
        this.rendezVousService.getRendezVous().subscribe({
            next: (listeRendezVous) => {
                this.listeRendezVous = listeRendezVous;
                this.updatePagination();
            },
            error: (error) => {
                console.error('Erreur lors du chargement des listeRendezVous:', error.message);
                alert('Impossible de charger les listeRendezVous. Veuillez réessayer plus tard.');
            }
        });
    }

    updatePagination() {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedRendezVous = this.listeRendezVous.slice(startIndex, endIndex);
    }

    // Ouvrir la modale de confirmation avant de supprimer un employé
    openDeleteConfirmation(service: RendezVous): void {
        const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
            width: '400px',
            data: {
                title: 'Confirmer la suppression',
                message: `Êtes-vous sûr de vouloir rejeter cette demande ? Cette action est irréversible.`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // this.deleteRendezVous(service._id); // Si l'utilisateur confirme, supprimer l'employé
            } else {
                console.log('Suppression annulée');
            }
        });
    }

    // Fonction pour gérer la pagination
    onPaginateChange(event: PageEvent) {
        const { pageIndex, pageSize } = event;
        this.currentPage = pageIndex;
        this.pageSize = pageSize;

        this.updatePagination();

        // Vous pouvez ajouter ici une logique de récupération des données paginées depuis un serveur si nécessaire
        console.log('Pagination changed: ', event);
    }

    getStatusClass(etat: string): string {
        switch (etat) {
            case 'en attente':
                return 'status-pending'; // Orange
            case 'validé':
                return 'status-approved'; // Vert
            case 'rejeté':
                return 'status-rejected'; // Rouge
            case 'annulé':
                return 'status-cancelled'; // Gris
            default:
                return 'status-default';
        }
    }

    openDetailsModal(rendezVous: RendezVous) {
        console.log(rendezVous);
        this.dialog.open(DetailRendezVousComponent, {
          width: '500px',
          data: rendezVous
        });
      }

}