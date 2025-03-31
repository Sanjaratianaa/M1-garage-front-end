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
import { DetailRendezVousComponent } from '../detail-rendez-vous/detail-rendez-vous.component';
import { ActivatedRoute } from '@angular/router';
import { SpecialiteService } from 'src/app/services/personne/specialite.service';


@Component({
    selector: 'app-rendez-vous',
    standalone: true,
    templateUrl: './historique-rendez-vous.component.html',
    imports: [MatListModule, MatCardModule, DatePipe, MatIconModule, MaterialModule, FormsModule, CommonModule, MatButtonModule],

})
export class HistoriqueRendezVousComponent {
    displayedColumns: string[] = [];
    listeRendezVous: RendezVous[];
    status: string | null = null;
    titre: string = '';
    isValidable: boolean = false;
    isAdmin: boolean = false;
    etats: string[] = ['en attente', 'validé', 'rejeté', 'annulé'];

    paginatedRendezVous: RendezVous[] = [];

    // Nouveau employé à ajouter
    newRendezVous: string = "";

    // Paramètres de pagination
    pageSize = 5;
    currentPage = 0;
    pageSizeOptions = [5, 10, 20];

    constructor(
        private dialog: MatDialog,
        private rendezVousService: RendezVousService,
        private route: ActivatedRoute,
        private specialiteService: SpecialiteService
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const status = params.get('status'); // Récupération de la variable
            if (status)
                this.status = status;
            console.log('Status:', this.status);
        });
        
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user.role.libelle;
        if (role === "manager")
            this.isAdmin = true;

        // Initialisez la pagination au chargement du composant
        if (this.status == "en-attente") {
            this.getAllRendezVousEnAttente();
            this.isValidable = true;
        }
        else
            this.getAllRendezVous();

        this.displayedColumns = this.isAdmin ? ['Date et heure demande', "Client", "Date du rendez-vous", "N° Matriculation", "Validateur", "Remarque", "Statut", 'actions']
            : ['Date et heure demande', "Date du rendez-vous", "N° Matriculation", "Validateur", "Remarque", "Statut", 'actions'];

    }

    getAllRendezVous() {
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

    getAllRendezVousEnAttente() {
        this.rendezVousService.getRendezVousByEtat("en attente").subscribe({
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

    updateStatus(rendezVous: any, newStatus: string) {
        rendezVous.etat = newStatus;
    }

    async openDetailsModal(rendezVous: RendezVous) {
        console.log(rendezVous);
        this.dialog.open(DetailRendezVousComponent, {
            width: '700px',
            data: { rendezVous: rendezVous, isValidable: false, errorMessage: '' },
        });
    }

    async openAnswerDetailsModal(rendezVous: RendezVous, errorMessage: string = '') {
        console.log(rendezVous);
        try {
            for (const service of rendezVous.services) {
                console.log(service.sousSpecialite);
                const specialites = await firstValueFrom(this.specialiteService.getSpecialitesActivesBySousService(service.sousSpecialite._id));
                const mecaniciens: any[] = [];
                for (const specialite of specialites) {
                    mecaniciens.push(specialite.mecanicien);
                }
                console.log(mecaniciens);
                service.mecaniciensDisponibles = mecaniciens;
            }

            const dialogRef = this.dialog.open(DetailRendezVousComponent, {
                width: '800px',
                data: { rendezVous: rendezVous, isValidable: true, errorMessage: errorMessage }
            });

            const result = await firstValueFrom(dialogRef.afterClosed());
            if (result) {
                console.log('Rendez-vous repondu', result);
                const updateRendezVous = await firstValueFrom(this.rendezVousService.answerRendezVous(rendezVous._id, result.action, result.commentaire, result.services, ''));
                console.log(updateRendezVous);
                // Mettre à jour la liste locale
                const index = this.listeRendezVous.findIndex(mq => mq._id === rendezVous._id);
                if (index !== -1) {
                    console.log('Listes demandes Rendez-vous updateee');
                    this.listeRendezVous[index] = updateRendezVous[0];
                    this.updatePagination(); // Rafraîchir la liste affichée
                }
            } else {
                console.log('Modal fermé sans action');
            }
        } catch (error: any) {
            await this.openAnswerDetailsModal(rendezVous, error.message);
        }
    }

}