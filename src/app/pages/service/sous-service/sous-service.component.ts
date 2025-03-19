import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Service, ServiceService } from 'src/app/services/services/service.service';
import { SousService, SousServiceService } from 'src/app/services/services/sousService.service';

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

    services: Service[];
    sousServices: SousService[];
    paginatedSousServices: SousService[] = [];

    selectedService: Service;
    filteredSousServices: SousService[];
    displayedColumns: string[] = ['libelle'];

    // Nouveau employé à ajouter
    newSousService = {};

    // Paramètres de pagination
    pageSize = 5;
    currentPage = 0;
    pageSizeOptions = [5, 10, 20];

    // services = [
    //     { id: 1, nom: 'Mécanique', icon: 'build', backgroundColor: '#FF5722' },   // Orange
    //     { id: 2, nom: 'Carrosserie', icon: 'build', backgroundColor: '#4CAF50' },   // Vert
    //     { id: 3, nom: 'Peinture', icon: 'build', backgroundColor: '#2196F3' },    // Bleu
    //     { id: 4, nom: 'Électronique', icon: 'build', backgroundColor: '#FFEB3B' },  // Jaune
    //     { id: 5, nom: 'Mécanique 2', icon: 'build', backgroundColor: '#FF5722' },   // Orange
    //     { id: 6, nom: 'Carrosserie 2', icon: 'build', backgroundColor: '#4CAF50' },   // Vert
    //     { id: 7, nom: 'Peinture 3', icon: 'build', backgroundColor: '#2196F3' },    // Bleu
    //     { id: 8, nom: 'Électronique 4', icon: 'build', backgroundColor: '#FFEB3B' }  // Jaune
    // ];



    // sousServices = [
    //     { id: 1, nom: 'Vidange', description: 'Changement d’huile', serviceId: 1, serviceNom: "Mécanique" },
    //     { id: 2, nom: 'Freinage', description: 'Réparation des freins', serviceId: 1, serviceNom: "Mécanique" },
    //     { id: 3, nom: 'Tôlerie', description: 'Réparation de la carrosserie', serviceId: 2, serviceNom: "Carrosserie" },
    //     { id: 4, nom: 'Peinture complète', description: 'Peinture complète du véhicule', serviceId: 3, serviceNom: "Peinture" },
    //     { id: 5, nom: 'Diagnostic électronique', description: 'Analyse des pannes électroniques', serviceId: 4, serviceNom: "Électronique" },
    // ];

    

    constructor(private dialog: MatDialog, private serviceService: ServiceService, private souServiceService: SousServiceService) { }

    ngOnInit() {
        // Initialisez la pagination au chargement du composant
        this.getAllServices();
        this.getAllSousServices();
    }

    // updatePagination() {
    //     const startIndex = this.currentPage * this.pageSize;
    //     const endIndex = startIndex + this.pageSize;
    //     this.paginatedServices = this.services.slice(startIndex, endIndex);
    //   }

    getAllServices() {
        this.serviceService.getServices().subscribe({
          next: (services) => {
            this.services = services;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des services:', error.message);
            alert('Impossible de charger les services. Veuillez réessayer plus tard.');
          }
        });
      }

    getAllSousServices() {
        this.souServiceService.getSousServices().subscribe({
            next: (sousServices) => {
                this.sousServices = sousServices;
                this.filteredSousServices = [...this.sousServices];
                console.log(this.filteredSousServices);
            },
            error: (error) => {
                console.error('Erreur lors du chargement des sous services:', error.message);
                alert('Impossible de charger les sous services. Veuillez réessayer plus tard.');
            }
        });
    }

    selectService(service: Service) {
        this.selectedService = service;
        this.filteredSousServices = this.sousServices.filter(s => s.service._id === service._id);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.filteredSousServices = this.sousServices
            .filter(s => (!this.selectedService || s.service._id === this.selectedService._id))
            .filter(s => s.libelle.toLowerCase().includes(filterValue));
    }

}
