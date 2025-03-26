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
import { ServiceService } from 'src/app/services/services/service.service';
import { SousServiceService } from 'src/app/services/services/sousService.service';
import { Specialite, SpecialiteService } from 'src/app/services/personne/specialite.service';
import { PersonneComponent } from '../personne/personne.component';


@Component({
  selector: 'app-prix-sousservice',
  standalone: true,
  templateUrl: './prixSousService.component.html',
  imports: [MatListModule, MatCardModule, DatePipe, MatIconModule, MaterialModule, FormsModule, CommonModule, MatButtonModule],

})
export class SpecialiteComponent {
  columns: string[] = ['service', 'sous service', 'duree', 'Date', 'prixUnitaire', 'Manager', 'Date d\'enregistrement', 'actions'];

  specialites: Specialite[];
  services: any[] = [];
  sousServices: any[] = [];
  mecaniciens: any[] = [];

  paginatedSpecialites: Specialite[] = [];

  newSpecialite: any = {id_sous_service: '', id_service: '', id_mecanicien: ''};

  // Paramètres de pagination
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 20];

  constructor(
    private dialog: MatDialog, 
    private specialiteService: SpecialiteService,
    private serviceService: ServiceService, 
    private sousServiceService: SousServiceService,
    private mecanicienService: PersonneComponent
  ) { }

  ngOnInit() {
    // Initialisez la pagination au chargement du composant
    this.getAllSpecialite();
    this.getAllServicesActives();
    this.getAllSousServicesActives();
  }

  getAllMecaniciens() {
    this.mecanicienService.getAllPersonnes().subscribe({
      next: (mecaniciens) => {
        
        console.log(mecaniciens);

        // this.mecaniciens = mecaniciens;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des mecaniciens:', error.message);
        alert('Impossible de charger les mecaniciens. Veuillez réessayer plus tard.');
      }
    });

  }

  getAllSpecialite() {
    this.specialiteService.getSpecialites().subscribe({
      next: (specialites) => {
        console.log(specialites);
        this.specialites = specialites;
        this.updatePagination();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prix des sous services:', error.message);
        alert('Impossible de charger les prix sous services. Veuillez réessayer plus tard.');
      }
    });
  }

  getAllServicesActives() {
    this.serviceService.getServicesActives().subscribe({
        next: (services) => {
            this.services = services.map(service => ({
                value: service._id,
                label: service.libelle
            }));
        },
        error: (error) => {
            console.error('Erreur lors du chargement des services:', error.message);
            alert('Impossible de charger les services. Veuillez réessayer plus tard.');
        }
    });
  }

  getAllSousServicesActives() {
    this.sousServiceService.getSousServicesActives().subscribe({
        next: (sousServices) => {
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

  updatePagination() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSpecialites = this.specialites.slice(startIndex, endIndex);
  }


  async addNewSpecialiteAsync(): Promise<Specialite | undefined> {
    if (this.newSpecialite) {
      console.log(this.newSpecialite);
      try {
        const prix = await firstValueFrom(this.specialiteService.addSpecialite(this.newSpecialite.id_sous_service, this.newSpecialite.date, this.newSpecialite.prix));
        console.log('prix ajoutée avec succès:', prix);
        this.specialites.push(prix);

        // Calculer le nombre total d'éléments dans la page actuelle
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        // Vérifier si la page actuelle a encore de la place
        if (this.specialites.length > startIndex && this.specialites.length <= endIndex) {
          // La page actuelle a encore de la place, on reste dessus
        } else {
          // Aller à la dernière page si la page actuelle est pleine
          this.currentPage = Math.floor((this.specialites.length - 1) / this.pageSize);
        }

        this.updatePagination();
        this.newSpecialite = {id_sous_service: '', date: null, prix: 0};
        return prix;
      } catch (error: any) {
        console.error('Erreur lors de l’ajout de la service:', error);
        const errorMessage = error.error && error.error.message ? error.error.message : error.toString();
        throw new Error(errorMessage);
      }
    }
    return undefined;
  }

  async openModal(errorMessage: string = '') {
    const data = {
      title: 'Ajouter un prix de sous-service',
      fields: [
        {
          name: 'id_service', label: 'Service', type: 'select', required: true,
          options: this.services, defaultValue: this.newSpecialite.id_service
        },
        {
          name: 'id_sous_service', label: 'Sous-service', type: 'select', required: true,
          options: this.sousServices, defaultValue: this.newSpecialite.id_sous_service
        },
        {
          name: "prix",
          label: "Prix en Ar",
          type: "number",
          required: true,
          defaultValue: this.newSpecialite.prix  // Valeur par défaut pour le champ prix
        },
        {
          name: "date",
          label: "Date",
          type: "date",
          required: true,
          defaultValue: this.newSpecialite.date  // Valeur par défaut pour le champ date
        }
      ],
      submitText: 'Ajouter',
      errorMessage: errorMessage
    };

    const dialogRef = this.dialog.open(PrixModalComponent, {
      width: '400px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          console.log('Données du formulaire:', result);
          this.newSpecialite = result;
          await this.addNewSpecialiteAsync();
        } catch (error: any) {
          console.error('Erreur lors de l’ajout:', error.message);
          await this.openModal(error.message.replace("Error: ", ""));
        }
      }
    });
  }

  // Méthode pour ouvrir le modal en mode édition
  async openEditModal(prixSousService: Specialite, errorMessage: string = ''): Promise<void> {

    console.log(prixSousService);
    const data = {
      title: 'Modifier un prix de sous-service',
      fields: [
        {
          name: 'id_service', label: 'Service', type: 'select', required: true,
          options: this.services, defaultValue: prixSousService.sousService.service._id 
        },
        {
          name: 'id_sous_service', label: 'Sous-service', type: 'select', required: true,
          options: this.sousServices, defaultValue: prixSousService.sousService._id 
        },
        {
          name: "prix",
          label: "Prix en Ar",
          type: "number",
          required: true,
          defaultValue: prixSousService.prixUnitaire  // Valeur par défaut pour le champ prix
        },
        {
          name: "date",
          label: "Date",
          type: "date",
          required: true,
          defaultValue: prixSousService.date ? new Date(prixSousService.date).toISOString().split('T')[0] : ""   // Valeur par défaut pour le champ date
        }
      ],
      submitText: 'Modifier',
      errorMessage: errorMessage
    };

    const dialogRef = this.dialog.open(PrixModalComponent, {
      width: '400px',
      data: data,
    });

    try {
      // Attendre la fermeture de la modale et récupérer les données saisies
      const result = await firstValueFrom(dialogRef.afterClosed());
      
      if (result) {
        console.log('Modification enregistrée:', result);
        this.newSpecialite = result;
        // Fusionner les données existantes de la prixSousService avec les modifications
        const updatedData = { ...prixSousService, sousService: this.newSpecialite.id_sous_service, 
          prixUnitaire: this.newSpecialite.prix, date: this.newSpecialite.date};
        console.log(updatedData);

        this.newSpecialite = {id_sous_service: '', date: null, prix: 0};

        // Attendre la mise à jour via le prixSousService
        const updatedService = await firstValueFrom(this.specialiteService.updateSpecialite(updatedData));

        // Mettre à jour la liste locale
        const index = this.specialites.findIndex(mq => mq._id === prixSousService._id);
        if (index !== -1) {
          this.specialites[index] = updatedService;
          this.updatePagination(); // Rafraîchir la liste affichée
        }
      }
    } catch (error: any) {
      console.error('Erreur lors de la modification:', error.message);
      alert('Erreur lors de la modification: ' + error.message);
      // Réouvrir la modale en passant le message d'erreur
      await this.openEditModal(prixSousService, error.message);
    }
  }


  // Méthode appelée lorsqu'on clique sur "Modifier"
  async editPrix(prixSousService: Specialite) {
    await this.openEditModal(prixSousService);
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