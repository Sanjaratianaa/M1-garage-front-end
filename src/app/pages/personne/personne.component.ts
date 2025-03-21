import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { GenericModalComponent } from '../../../components/modal-generique/add-modal/modal.component';
import { DeleteConfirmationModalComponent } from '../../../components/modal-generique/confirm-modal/delete-confirmation-modal.component';
import { PersonneService } from 'src/app/services/personne/personne.service';
import { Personne } from 'src/app/services/personne/personne.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-service',
  standalone: true,
  templateUrl: './service.component.html',
  imports: [MatListModule, MatCardModule, DatePipe, MatIconModule, MaterialModule, FormsModule, CommonModule, MatButtonModule],

})
export class PersonneComponent {
  displayedColumns: string[] = ['Nom', "Prenoms", "Manager", "Date Suppression", "Manager Suppression", "Statut", 'actions'];
  personnes: Personne[];

  paginatedPersonnes: Personne[] = [];

  // Nouveau employé à ajouter
  newPersonne: string = "";

  // Paramètres de pagination
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 20];

  constructor(private dialog: MatDialog, private personneService: PersonneService) { }

  ngOnInit() {
    // Initialisez la pagination au chargement du composant
    this.getAllPersonnes();
  }

  getAllPersonnes() {
    this.personneService.getPersonnes().subscribe({
      next: (personnes) => {
        this.personnes = personnes;
        this.updatePagination();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des personnes:', error.message);
        alert('Impossible de charger les personnes. Veuillez réessayer plus tard.');
      }
    });

  }

  updatePagination() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPersonnes = this.personnes.slice(startIndex, endIndex);
  }


  async addNewPersonneAsync(): Promise<Personne | undefined> {
    if (this.newPersonne) {
      console.log(this.newPersonne);
      try {
        const personne = await firstValueFrom(this.personneService.addPersonne(this.newPersonne));
        console.log('Personne ajoutée avec succès:', personne);
        this.personnes.push(personne);

        // Calculer le nombre total d'éléments dans la page actuelle
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        // Vérifier si la page actuelle a encore de la place
        if (this.personnes.length > startIndex && this.personnes.length <= endIndex) {
          // La page actuelle a encore de la place, on reste dessus
        } else {
          // Aller à la dernière page si la page actuelle est pleine
          this.currentPage = Math.floor((this.personnes.length - 1) / this.pageSize);
        }

        this.updatePagination();
        this.newPersonne = "";
        return personne;
      } catch (error: any) {
        console.error('Erreur lors de l’ajout de la personne:', error);
        const errorMessage = error.error && error.error.message ? error.error.message : error.toString();
        throw new Error(errorMessage);
      }
    }
    return undefined;
  }

  async openModal(errorMessage: string = '') {
    const data = {
      title: 'Ajouter un nouveau Personne',
      fields: [
        { name: 'libelle', label: 'Personne', type: 'text', required: true, defaultValue: this.newPersonne },
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
          this.newPersonne = result.libelle;
          await this.addNewPersonneAsync();
        } catch (error: any) {
          console.error('Erreur lors de l’ajout:', error.message);
          await this.openModal(error.message.replace("Error: ", ""));
        }
      }
    });
  }

  // Méthode pour ouvrir le modal en mode édition
  async openEditModal(personne: Personne, errorMessage: string = ''): Promise<void> {
    const data = {
      title: 'Modifier une personne',
      fields: [
        { name: 'libelle', label: 'Nom', type: 'text', required: true, defaultValue: personne.nom }
      ],
      submitText: 'Modifier',
      errorMessage: errorMessage
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '400px',
      data: data,
    });

    try {
      // Attendre la fermeture de la modale et récupérer les données saisies
      const result = await firstValueFrom(dialogRef.afterClosed());
      
      if (result) {
        console.log('Modification enregistrée:', result);
        
        // Fusionner les données existantes de la personne avec les modifications
        const updatedData = { ...personne, libelle: result.libelle };
        console.log(updatedData);

        // Attendre la mise à jour via le service
        const updatedPersonne = await firstValueFrom(this.personneService.updatePersonne(updatedData));

        // Mettre à jour la liste locale
        const index = this.personnes.findIndex(mq => mq._id === personne._id);
        if (index !== -1) {
          this.personnes[index] = updatedPersonne;
          this.updatePagination(); // Rafraîchir la liste affichée
        }
      }
    } catch (error: any) {
      console.error('Erreur lors de la modification:', error.message);
      alert('Erreur lors de la modification: ' + error.message);
      // Réouvrir la modale en passant le message d'erreur
      await this.openEditModal(personne, error.message);
    }
  }


  // Méthode appelée lorsqu'on clique sur "Modifier"
  async editPersonne(personne: Personne) {
    await this.openEditModal(personne);
  }

  // Ouvrir la modale de confirmation avant de supprimer un employé
  openDeleteConfirmation(personne: Personne): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer "${ personne.nom }" comme personne ? Cette action est irréversible.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePersonne(personne._id); // Si l'utilisateur confirme, supprimer l'employé
      } else {
        console.log('Suppression annulée');
      }
    });
  }

  // Fonction de suppression d'un employé
  async deletePersonne(personneId: string) {
  
    try {
      // Appel API pour supprimer la personne
      const deletedPersonne = await lastValueFrom(this.personneService.deletePersonne(personneId));

      // Vérification si la suppression a bien été effectuée
      if (deletedPersonne && deletedPersonne.dateSuppression) {
        // Mise à jour locale en modifiant l'état au lieu de supprimer
        const index = this.personnes.findIndex(mq => mq._id === personneId);
        if (index !== -1) {
          this.personnes[index] = deletedPersonne; // Mettre à jour l'objet avec la version renvoyée
          this.updatePagination(); // Rafraîchir la liste affichée
        }
      } 

    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      const errorMessage = error.error?.message || 'Erreur inconnue lors de la suppression.';
      alert(errorMessage); // Affiche l'erreur à l'utilisateur
    }
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
    this.dialog.closeAll(); // Ferme la modale
  }
}