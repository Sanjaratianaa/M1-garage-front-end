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
  // listeRendezVous: RendezVous[];
  
  interventionsData: Intervention[] = [
    {
      id: 1,
      title: 'Sed ut perspiciatis unde omnis iste',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Alice', imageUrl: '/assets/images/profile/user-1.jpg' },
      status: 'inprogress',
      date: new Date('2024-05-01'),
      heureDebut: '09:00',
      heureFin: '10:00'
    },
    {
      id: 2,
      title: 'Xtreme theme dropdown issue',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Jonathan', imageUrl: '/assets/images/profile/user-2.jpg' },
      status: 'open',
      date: new Date('2024-05-03')
    },
    {
      id: 3,
      title: 'Header issue in material admin',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Smith', imageUrl: '/assets/images/profile/user-3.jpg' },
      status: 'closed',
      date: new Date('2024-05-02' ,  ),
      heureDebut: '14:00',
      heureFin: '15:00'
    },
    {
      id: 4,
      title: 'Sidebar issue in Nice admin',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Vincent', imageUrl: '/assets/images/profile/user-4.jpg' },
      status: 'inprogress',
      date: new Date('2024-05-06')
    },
    {
      id: 5,
      title: 'Elegant Theme Side Menu show OnClick',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Chris', imageUrl: '/assets/images/profile/user-5.jpg' },
      status: 'open',
      date: new Date('2024-05-04'),
      heureDebut: '11:00',
      heureFin: '12:00'
    }
  ];

  listeRendezVous: RendezVous[] = [
    {
      "_id": "67e803adf39f50978ef39411",
      "client": {
        "_id": "67e7feecead3c7edffdcb695",
        "nom": "RAKOTONDRAINY",
        "prenom": "Tahiry",
        "numeroTelephone": "038 99 622 63",
        "email": "tahiry@gmail.com",
        "genre": "Homme"
      },
      "validateur": {
        "_id": "67da371fd1ac391f76c781eb",
        "nom": "Anjaratiana",
        "prenom": "Layah",
        "numeroTelephone": "555-123-1234",
        "email": "layah@example.com",
        "genre": "Femme"
      },
      "voiture": {
        "_id": "67e801cb522f7fe7a83eeafa",
        "client": "67e7feecead3c7edffdcb698",
        "marque": {
          "_id": "67e252445d5a56721f3258b6",
          "libelle": "BMW"
        },
        "modele": {
          "_id": "67e24e8470ebd5b6ae09f569",
          "libelle": "BMW Série 3"
        },
        "categorie": {
          "_id": "67e25015c746a234f5f3b562",
          "libelle": "SUV"
        },
        "typeTransmission": {
          "_id": "67e1546ec9ac9f947030d51f",
          "libelle": "Automatique"
        },
        "annee": 2016,
        "numeroImmatriculation": "5600 ATD",
        "kilometrage": 4500,
        "puissanceMoteur": 500,
        "cylindree": 34,
        "capaciteReservoir": 25,
        "pressionPneusRecommande": "4.5"
      },
      "services": [
        {
          "_id": "67e803adf39f50978ef39412",
          "sousSpecialite": {
            "_id": "67e256df811b3e52c586a976",
            "service": {
              "_id": "67e255a6edec2a99b8385687",
              "libelle": "Diagnostic et réparation mécanique"
            },
            "libelle": "Diagnostic électronique",
            "duree": 45,
            "ptix": 0
          },
          "raison": "Misy tsy milamina ao amn motera.",
          "mecanicien": {
            "_id": "67e1b79f1ff9ce25ead9186f",
            "nom": "ANJARATIANA",
            "prenom": "Noah",
            "numeroTelephone": "023145735",
            "email": "noah@example.com",
            "genre": "Homme"
          },
          "quantiteEstimee": 1,
          "prixUnitaire": 30000,
          "mecaniciensDisponibles": [],
          "status": "en attente"
        }
      ],
      "dateRendezVous": new Date("2025-03-31T08:00:00.000Z"),
      "etat": "validé",
      "dateHeureDemande": new Date("2025-03-29T14:29:01.222Z"),
      "piecesAchetees": [],
      "remarque": "",
      "heureFin": null,
      "heureDebut": null
    },
    {
      "_id": "67e7b6ef4e43f93a901852e3",
      "client": {
        "_id": "67e3071018c9673f291d3ad2",
        "nom": "RABEKOTO",
        "prenom": "Maria",
        "numeroTelephone": "0321423421",
        "email": "maria@example.com",
        "genre": "Femme"
      },
      "validateur": {
        "_id": "67da371fd1ac391f76c781eb",
        "nom": "Anjaratiana",
        "prenom": "Layah",
        "numeroTelephone": "555-123-1234",
        "email": "layah@example.com",
        "genre": "Femme"
      },
      "voiture": {
        "_id": "67e2701349b59270464e2879",
        "client": "67e3071118c9673f291d3ad5",
        "marque": {
          "_id": "67e2537a561193c28b342da8",
          "libelle": "Peugeot"
        },
        "modele": {
          "_id": "67e26f9149b59270464e2861",
          "libelle": "Peugeot 208"
        },
        "categorie": {
          "_id": "67e15462c9ac9f947030d51a",
          "libelle": "Citadine"
        },
        "typeTransmission": {
          "_id": "67e15472c9ac9f947030d523",
          "libelle": "Manuelle"
        },
        "annee": 2015,
        "numeroImmatriculation": "3652 MDT",
        "kilometrage": 6000,
        "puissanceMoteur": 400,
        "cylindree": 28,
        "capaciteReservoir": 20,
        "pressionPneusRecommande": "3.5"
      },
      "services": [
        {
          "_id": "67e7b6ef4e43f93a901852e4",
          "sousSpecialite": {
            "_id": "67e256df811b3e52c586a976",
            "service": {
              "_id": "67e255a6edec2a99b8385687",
              "libelle": "Diagnostic et réparation mécanique"
            },
            "libelle": "Diagnostic électronique",
            "duree": 45,
            "ptix": 0
          },
          "raison": "",
          "mecanicien": {
            "_id": "67e1b79f1ff9ce25ead9186f",
            "nom": "ANJARATIANA",
            "prenom": "Noah",
            "numeroTelephone": "023145735",
            "email": "noah@example.com",
            "genre": "Homme"
          },
          "quantiteEstimee": 45,
          "prixUnitaire": 30000,
          "mecaniciensDisponibles": [],
          "status": "en attente"
        },
        {
          "_id": "67e7b6ef4e43f93a901852e5",
          "sousSpecialite": {
            "_id": "67e256f6811b3e52c586a97c",
            "service": {
              "_id": "67e255adedec2a99b838568c",
              "libelle": "Système de freinage"
            },
            "libelle": "Changement et équilibrage des pneus",
            "duree": 35,
            "ptix": 0
          },
          "raison": "",
          "mecanicien": {
            "_id": "67de8f789315352284c05b9b",
            "nom": "Rota",
            "prenom": "Volamarooa",
            "numeroTelephone": "034 88 735 43",
            "email": "rota@example.com",
            "genre": "Femme"
          },
          "quantiteEstimee": 35,
          "prixUnitaire": 0,
          "mecaniciensDisponibles": [],
          "status": "en attente"
        }
      ],
      "dateRendezVous": new Date("2025-05-12T06:00:00.000Z"),
      "etat": "validé",
      "dateHeureDemande": new Date("2025-03-29T09:01:35.733Z"),
      "piecesAchetees": [],
      "remarque": "Ra afaka tonga 15mn plutot tsara koakoa.",
      "heureFin": null,
      "heureDebut": null
    }
  ];

  dataSource = new MatTableDataSource<RendezVous>(this.paginatedRendezVous);

  totalInterventions = this.interventionsData.length;
  interventionsInProgress = this.interventionsData.filter(t => t.status === 'inprogress').length;
  interventionsOpen = this.interventionsData.filter(t => t.status === 'open').length;
  interventionsClosed = this.interventionsData.filter(t => t.status === 'closed').length;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageSize = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 20];

  selectedIntervention: Intervention | null = null;

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

  onRowClick(intervention: Intervention): void {
    this.selectedIntervention = intervention;
    if (!intervention.heureDebut || !intervention.heureFin) {
      this.openModal();
    }
  }

  onEditClick(intervention: Intervention): void {
    this.selectedIntervention = intervention;
    if (!intervention.heureDebut) {
      this.openModal();
    } else {
      this.router.navigate(['/rendez-vous/interventions-details', intervention.id]);
    }
  }

  async openModal(errorMessage: string = '') {
    const data = {
      title: 'Confirmation Intervention',
      fields: [
        { name: 'heureDebut', label: 'Heure de début', type: 'time', defaultValue: this.selectedIntervention?.heureDebut || "" },
        { name: 'heureFin', label: 'Heure de fin', type: 'time', defaultValue: this.selectedIntervention?.heureFin || "" },
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

          if (this.selectedIntervention) {
            this.selectedIntervention.heureDebut = result.heureDebut;
            this.selectedIntervention.heureFin = result.heureFin;
          }

          // Refresh the table data
          this.dataSource.data = [...this.listeRendezVous];
          
        } catch (error: any) {
          console.error('Erreur lors de l’ajout:', error.message);
          await this.openModal(error.message.replace("Error: ", ""));
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

  onPaginateChange(event: PageEvent) {
      const { pageIndex, pageSize } = event;
      this.currentPage = pageIndex;
      this.pageSize = pageSize;

      this.updatePagination();

      // Vous pouvez ajouter ici une logique de récupération des données paginées depuis un serveur si nécessaire
      console.log('Pagination changed: ', event);
  }
  
}