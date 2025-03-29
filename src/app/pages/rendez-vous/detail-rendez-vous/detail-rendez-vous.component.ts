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
    columns = ['sousSpecialite', 'quantite', 'prix', 'mecanicien'];

    constructor(
        public dialogRef: MatDialogRef<DetailRendezVousComponent>,
        @Inject(MAT_DIALOG_DATA) public rendezVous: RendezVous
    ) { }

    close(): void {
        this.dialogRef.close();
    }
}
