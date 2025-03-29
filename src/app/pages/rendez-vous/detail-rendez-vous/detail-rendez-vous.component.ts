import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { RendezVous } from 'src/app/services/rendez-vous/rendez-vous.service';

@Component({
    selector: 'app-detail-rendez-vous',
    templateUrl: './detail-rendez-vous.component.html',
    imports: [
        MatDialogModule, 
        CommonModule, 
        NgIf, NgFor, // Import Angular Common Pipes,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule
    ]
})
export class DetailRendezVousComponent {
    columns = ['sousSpecialite', 'raison', 'quantite', 'prix', 'mecanicien'];
    // Définir les colonnes pour le tableau
  displayedColumns: string[] = ['label', 'value'];

  // Données de la voiture à afficher dans le tableau
  voitureDetails = [
    { label: 'Marque', value: this.rendezVous.voiture.marque.libelle },
    { label: 'Modèle', value: this.rendezVous.voiture.modele.libelle },
    { label: 'Catégorie', value: this.rendezVous.voiture.categorie.libelle },
    { label: 'Transmission', value: this.rendezVous.voiture.typeTransmission.libelle },
    { label: 'Année', value: this.rendezVous.voiture.annee },
    { label: 'Immatriculation', value: this.rendezVous.voiture.numeroImmatriculation },
    { label: 'Kilométrage', value: `${this.rendezVous.voiture.kilometrage} km` },
    { label: 'Puissance Moteur', value: `${this.rendezVous.voiture.puissanceMoteur} ch` },
    { label: 'Cylindrée', value: `${this.rendezVous.voiture.cylindree} cm³` },
    { label: 'Capacité Réservoir', value: `${this.rendezVous.voiture.capaciteReservoir} L` },
    { label: 'Pression Pneus', value: `${this.rendezVous.voiture.pressionPneusRecommande} bar` }
  ];

    constructor(
        public dialogRef: MatDialogRef<DetailRendezVousComponent>,
        @Inject(MAT_DIALOG_DATA) public rendezVous: RendezVous
    ) { }

    close(): void {
        this.dialogRef.close();
    }
}
