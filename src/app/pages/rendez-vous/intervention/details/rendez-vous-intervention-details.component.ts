import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { PiecesAchetees, RendezVous, Service } from 'src/app/services/rendez-vous/rendez-vous.service';
import { firstValueFrom } from 'rxjs';
import { RendezVousService } from 'src/app/services/rendez-vous/rendez-vous.service';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalComponent } from 'src/app/components/modal-generique/add-modal/modal.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { PieceService } from 'src/app/services/caracteristiques/piece.service';
import { PrixPiece, PrixPieceService } from 'src/app/services/caracteristiques/prixStock.service';

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
        MatPaginatorModule,
        MatTableModule,
        DatePipe,
    ],
    templateUrl: './rendez-vous-intervention-details.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RendezVousInterventionDetailsComponent implements OnInit {
    rendezVous: RendezVous | undefined;
    detailsForm: FormGroup;
    notesForm: FormGroup;

    displayedColumns: string[] = ['Libelle', "Quantite", "Prix Unitaire", "Prix Total", "Commentaire", 'actions'];
    pieces: PiecesAchetees[] = [];
    piecesOrigines: any[] = [];
    prixPieces: PrixPiece[] = [];
    paginatedPieces: PiecesAchetees[] = [];
    newPieceAchete: PiecesAchetees = {
        piece: { _id: '', libelle: '' },
        quantite: 0,
        prixUnitaire: 0,
        prixTotal: 0,
        commentaire: '',
    };

    pageSize = 5;
    currentPage = 0;
    pageSizeOptions = [5, 10, 20];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private rendezVousService: RendezVousService,
        private dialog: MatDialog,
        private pieceService: PieceService,
        private prixPieceService: PrixPieceService,
    ) {

        this.rendezVous = this.router.getCurrentNavigation()?.extras.state?.['rendezVous'];

        console.log(">> rendez: ", this.rendezVous);

        if (this.rendezVous?.services) {
            this.rendezVous.services = this.rendezVous.services.map((service: Service) => ({
                ...service,
                tempStatus: service.status
            }));
        }

        this.notesForm = this.fb.group({
            notes: ['']
        });
    }

    ngOnInit(): void {
        this.pieces = this.rendezVous?.piecesAchetees || [];

        this.updatePagination();
        
        this.getAllPieceActives();
        this.getAllPrixPieces();
    }
    

    goBack(): void {
        this.router.navigate(['/rendez-vous/interventions']);
    }

    formatDate(date: string | Date): string {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        const hours = ('0' + d.getHours()).slice(-2);
        const minutes = ('0' + d.getMinutes()).slice(-2);
        return `${year}-${month}-${day}T${hours}:${minutes}`;
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

    async saveService(service: Service): Promise<void> {
        console.log('Saving service:', service);
    
        if (!this.rendezVous) {
            console.error("Erreur : Aucun rendez-vous sélectionné.");
            return;
        }

        service.status = service.tempStatus || '';
    
        const serviceUpdate = {
            _id:this.rendezVous._id,
            services: [service]
        };
    
        try {
            const updatedRendezVous = await firstValueFrom(
                this.rendezVousService.updateRendezVous(this.rendezVous._id, serviceUpdate)
            );
            console.log("Backend update successful:", updatedRendezVous);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du service :", error);
        }
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

    // PIECES

    getAllPieceActives() {
        this.pieceService.getPiecesActives().subscribe({
          next: (pieces) => {
            this.piecesOrigines = pieces.map(piece => ({
              value: piece._id,
              label: piece.libelle
            }));
          },
          error: (error) => {
            console.error('Erreur lors du chargement des marques:', error.message);
            alert('Impossible de charger les marques. Veuillez réessayer plus tard.');
          }
        });
    }

    getAllPrixPieces() {
        this.prixPieceService.getPrixPieces().subscribe({
          next: (prixPieces) => {
            this.prixPieces = prixPieces;
            console.log("Prix des pieces: ", this.prixPieces);
          },
          error: (error) => {
            console.error('Erreur lors du chargement des prixPieces:', error.message);
            alert('Impossible de charger les prixPieces. Veuillez réessayer plus tard.');
          }
        });
    }

    updatePagination() {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedPieces = this.pieces.slice(startIndex, endIndex);
    }

    async addNewPieceAsync(piecesAcheteesData: any): Promise<PiecesAchetees | undefined> {
        if (piecesAcheteesData) {

            try {

                if (this.rendezVous?.piecesAchetees) {
                    this.rendezVous.piecesAchetees.push(...piecesAcheteesData.addPiecesAchetees);
                }

                let piece = null;
                if (this.rendezVous && this.rendezVous._id) {
                    try {
                        piece = await firstValueFrom(this.rendezVousService.updateRendezVous(this.rendezVous._id, piecesAcheteesData));
                        console.log('Pièce ajoutée avec succès:', piece);
                        this.rendezVous.piecesAchetees = piece.piecesAchetees;
                        this.pieces = piece.piecesAchetees;
                    } catch (error: any) {
                        console.error('Erreur lors de l’ajout de la pièce:', error);
                    }
                } else {
                    console.error("Impossible de récupérer l'ID du rendez-vous.");
                }
        
                const startIndex = this.currentPage * this.pageSize;
                const endIndex = startIndex + this.pageSize;
        
                if (this.pieces.length > startIndex && this.pieces.length <= endIndex) {
                // La page actuelle a encore de la place, on reste dessus
                } else {
                    this.currentPage = Math.floor((this.pieces.length - 1) / this.pageSize);
                }
        
                this.updatePagination();    
                return ;
            } catch (error: any) {
                console.error('Erreur lors de l’ajout de la marque:', error);
                const errorMessage = error.error && error.error.message ? error.error.message : error.toString();
                throw new Error(errorMessage);
            }
            }
            return undefined;
        }
    
        async openModal(errorMessage: string = '') {
            const data = {
            title: 'Ajouter un achat de piece',
            fields: [
                {
                    name: 'id_piece', label: 'Piece', type: 'select', required: true,
                    options: this.piecesOrigines
                },
                { name: 'quantite', label: 'Quantite', type: 'text', required: true, defaultValue: "" },
                { name: 'commentaire', label: 'Commentaire', type: 'text', defaultValue: "" },
            ],
            submitText: 'Ajouter',
            errorMessage: errorMessage,
        };
    
        const dialogRef = this.dialog.open(GenericModalComponent, {
            width: '400px',
            data: data,
        });
    
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                console.log('Données du formulaire pour pièce:', result);
                console.log('Données du formulaire pour prix:', this.prixPieces);
        
                try {
                    // Check if prixPieces is defined and is an array
                    if (!Array.isArray(this.prixPieces)) {
                        throw new Error("Les prix des pièces ne sont pas disponibles.");
                    }
        
                    const prixSousService = this.prixPieces.find(
                        (ss) => ss.piece && ss.piece._id === result.id_piece
                    );
        
                    if (!prixSousService) {
                        throw new Error("Pièce non trouvée dans les prix disponibles.");
                    }
        
                    // Vérifier que les propriétés existent dans result
                    if (!result.id_piece || !result.quantite || result.commentaire === undefined) {
                        throw new Error("Données du formulaire incomplètes.");
                    }
        
                    // Set the new piece data
                    this.newPieceAchete.piece._id = result.id_piece;
                    this.newPieceAchete.quantite = result.quantite;
                    this.newPieceAchete.commentaire = result.commentaire;
                    this.newPieceAchete.prixUnitaire = prixSousService.prixUnitaire;
                    this.newPieceAchete.prixTotal = prixSousService.prixUnitaire * result.quantite;
        
                    console.log('Données du formulaire pour prixPiece:', prixSousService);
        
                    const piecesAcheteesData = {
                        addPiecesAchetees: [this.newPieceAchete],
                    };
        
                    console.log('Données du formulaire pour prixPieceData:', piecesAcheteesData);
        
                    // Uncomment the following line when you are ready to save
                    await this.addNewPieceAsync(piecesAcheteesData);
        
                } catch (error: any) {
                    console.error('Erreur lors de l’ajout:', error.message);
                    await this.openModal(error.message.replace("Error: ", ""));
                }
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
    
    }
    
    @Component({
      selector: 'app-modal',
      template: `
      `,
    })
    export class ModalComponent {
      constructor(public dialog: MatDialog) { }
    
      close() {
        this.dialog.closeAll();
      }
}