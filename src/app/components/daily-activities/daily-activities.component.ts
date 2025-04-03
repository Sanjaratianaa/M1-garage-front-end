import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { RendezVous, RendezVousService, Service } from 'src/app/services/rendez-vous/rendez-vous.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

interface stats {
  id: number;
  time: string;
  color: string;
  title?: string;
  subtext?: string;
  link?: string;
}

@Component({
  selector: 'app-daily-activities',
  imports: [MaterialModule],
  templateUrl: './daily-activities.component.html',
  providers: [DatePipe]
})
export class AppDailyActivitiesComponent {
  stats: stats[] = [
    // {
    //   id: 1,
    //   time: '09.30 am',
    //   color: 'primary',
    //   subtext: 'Payment received from John Doe of $385.90',
    // },
  ];

  sousServices: any[] = [];
  
  displayedColumns: string[] = [];
  listeRendezVous: RendezVous[];
  status: string | null = null;
  isAdmin: boolean = false;
  isMecanicien: boolean = false;
  etats: string[] = ['en attente', 'validé', 'rejeté', 'annulé', 'terminé'];
  isLoading: boolean = false;

  constructor(
      private rendezVousService: RendezVousService,
      private route: ActivatedRoute,
      private datePipe: DatePipe
  ) { }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
          const status = params.get('status');
          if (status)
              this.status = status;
          console.log('Status:', this.status);
      });
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = user.role.libelle;
      if (role === "manager")
          this.isAdmin = true;
      else if(role === "client") {
      
      } else if(role === "mecanicien" || role === "mécanicien") {
        this.isMecanicien = true;
      }

      this.getAllRendezVous();
      this.loadAndPrepareStatsData();

      this.displayedColumns = this.isAdmin ? ['Date et heure demande', "Client", "Date du rendez-vous", "N° Matriculation", "Validateur", "Remarque", "Statut", 'actions']
          : ['Date et heure demande', "Date du rendez-vous", "N° Matriculation", "Validateur", "Remarque", "Statut", 'actions'];

  }
  
  loadAndPrepareStatsData() {
    this.isLoading = true;
    this.stats = [];
    this.listeRendezVous = [];

    this.rendezVousService.getRendezVous().subscribe({
      next: (fetchedListeRendezVous) => {
        if (!fetchedListeRendezVous) {
            console.warn('Received null or undefined rendez-vous list.');
            this.isLoading = false;
            return;
        }

        this.listeRendezVous = fetchedListeRendezVous;

        this.stats = this.listeRendezVous.map((rv, index) => {
          const colorInfo = this.getEventColor(rv.etat);
          const formattedTime = this.formatRendezVousTime(rv.dateRendezVous);
          const subText = this.generateSubtext(rv.services);

          const statItem: stats = {
            id: index + 1,
            time: formattedTime,
            color: colorInfo,
            subtext: subText
          };
          return statItem;
        });

        console.log('Transformed stats data:', this.stats);
        this.isLoading = false; // Turn off loading flag
      },
      error: (error) => {
        console.error('Erreur lors du chargement des listeRendezVous:', error.message);
        alert('Impossible de charger les activités. Veuillez réessayer plus tard.');
        this.isLoading = false; // Turn off loading flag on error
        this.stats = []; // Ensure stats is empty on error
      }
    });
  }

      getAllRendezVous() {
        this.rendezVousService.getAllStatRendezVous().subscribe({
            next: (listeRendezVous) => {
              this.listeRendezVous = listeRendezVous;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des listeRendezVous:', error.message);
                alert('Impossible de charger les listeRendezVous. Veuillez réessayer plus tard.');
            }
        });
      }
    
      private formatRendezVousTime(dateValue: string | Date | undefined): string {
        if (!dateValue) {
          return 'N/A';
        }
        try {
          const formatString = 'MMM d, y, hh:mm a';
          return this.datePipe.transform(dateValue, formatString) || 'Invalid Date';
        } catch (e) {
          console.error("Error formatting date:", dateValue, e);
          return 'Invalid Date';
        }
      }
    
      private generateSubtext(services: Service[] | undefined): string {
        if (!services || services.length === 0) {
          return 'No services listed.';
        }
    
        return services.map(service => {
          const raison = service.raison || 'Service';
          let sousServiceLibelle = 'Unknown Specialty';
    
          if (service.sousSpecialite && typeof service.sousSpecialite === 'object' && 'libelle' in service.sousSpecialite && service.sousSpecialite.libelle) {
             sousServiceLibelle = (service.sousSpecialite as any).libelle;
          } else if (typeof service.sousSpecialite === 'string') {
             console.warn(`SousSpecialite is not populated for service. Cannot display libelle.`);
             sousServiceLibelle = '(Specialty ID)';
          }
    
          return `${raison}: ${sousServiceLibelle}`;
        }).join('; ');
      }
    
      private getEventColor(etat: string): string { 
        switch (etat) {
          case 'en attente':
            return 'warning';
          case 'validé':
            return 'primary';
          case 'rejeté':
            return 'error';
          case 'annulé':
            return 'secondary';
          case 'terminé':
            return 'success';
          default:
            console.warn(`Unknown etat value: ${etat}`);
            return '#cccccc';
        }
      }
}
