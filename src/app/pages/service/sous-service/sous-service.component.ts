import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-sous-service',
    templateUrl: './sous-service.component.html',
    styleUrls: ['./sous-service.component.scss'],
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatCardModule,
        CommonModule,
        MatIconModule
    ],
})
export class SousServiceComponent {
    services = [
        { id: 1, nom: 'Mécanique', icon: 'build', backgroundColor: '#FF5722' },   // Orange
        { id: 2, nom: 'Carrosserie', icon: 'cars', backgroundColor: '#4CAF50' },   // Vert
        { id: 3, nom: 'Peinture', icon: 'palette', backgroundColor: '#2196F3' },    // Bleu
        { id: 4, nom: 'Électronique', icon: 'devices', backgroundColor: '#FFEB3B' },  // Jaune
        { id: 5, nom: 'Mécanique 2', icon: 'build', backgroundColor: '#FF5722' },   // Orange
        { id: 6, nom: 'Carrosserie 2', icon: 'cars', backgroundColor: '#4CAF50' },   // Vert
        { id: 7, nom: 'Peinture 3', icon: 'palette', backgroundColor: '#2196F3' },    // Bleu
        { id: 8, nom: 'Électronique 4', icon: 'devices', backgroundColor: '#FFEB3B' }  // Jaune
    ];



    sousServices = [
        { id: 1, nom: 'Vidange', description: 'Changement d’huile', serviceId: 1, serviceNom: "Mécanique" },
        { id: 2, nom: 'Freinage', description: 'Réparation des freins', serviceId: 1, serviceNom: "Mécanique" },
        { id: 3, nom: 'Tôlerie', description: 'Réparation de la carrosserie', serviceId: 2, serviceNom: "Carrosserie" },
        { id: 4, nom: 'Peinture complète', description: 'Peinture complète du véhicule', serviceId: 3, serviceNom: "Peinture" },
        { id: 5, nom: 'Diagnostic électronique', description: 'Analyse des pannes électroniques', serviceId: 4, serviceNom: "Électronique" },
    ];

    selectedService: any = null;
    filteredSousServices = [...this.sousServices];
    displayedColumns: string[] = ['nom', 'description'];

    selectService(service: any) {
        this.selectedService = service;
        this.filteredSousServices = this.sousServices.filter(s => s.serviceId === service.id);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.filteredSousServices = this.sousServices
            .filter(s => (!this.selectedService || s.serviceId === this.selectedService.id))
            .filter(s => s.nom.toLowerCase().includes(filterValue));
    }

}
