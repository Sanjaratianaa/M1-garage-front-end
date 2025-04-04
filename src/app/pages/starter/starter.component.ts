import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppNewCustomersComponent } from 'src/app/components/new-customers/new-customers.component';
import { AppTotalIncomeComponent } from 'src/app/components/total-income/total-income.component';
import { AppDailyActivitiesComponent } from 'src/app/components/daily-activities/daily-activities.component';
import { AppBlogCardsComponent } from 'src/app/components/blog-card/blog-card.component';
import { AppRevenueProductComponent } from 'src/app/components/revenue-product/revenue-product.component';
import { AppRevenueForecastComponent } from 'src/app/components/revenue-forecast/revenue-forecast.component';
import { RendezVousService } from 'src/app/services/rendez-vous/rendez-vous.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';  

interface EtatCount {
  etat: string;
  count: number;
}

@Component({
  selector: 'app-starter',
  imports: [
    MaterialModule,
    AppNewCustomersComponent,
    AppTotalIncomeComponent,
    AppDailyActivitiesComponent,
    AppBlogCardsComponent,
    AppRevenueProductComponent,
    AppRevenueForecastComponent,
    CommonModule,
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})

export class StarterComponent implements OnInit {
  stats: any[] = [];
  listeRendezVous: any[] = [];
  isAdmin: boolean = false;
  isLoading: boolean = false;
  isMecanicien: boolean = false;

  totalInterventions = 0;
  interventionsInProgress = 0;
  interventionsOpen = 0;
  interventionsClosed = 0;
  interventionsPending = 0;
  interventionsApproved = 0;

  constructor(
    private rendezVousService: RendezVousService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.checkUserRole();
    this.loadAndPrepareStatsData();
    this.updateNumberCounts();
  }

  checkUserRole() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role.libelle;
    console.log(role);
    this.isAdmin = role === 'manager';
    this.isMecanicien = role === 'mecanicien' || role === 'mécanicien';
  }

  loadAndPrepareStatsData() {
    this.isLoading = true;
    this.stats = [];
    this.listeRendezVous = [];

    this.rendezVousService.getAllStatRendezVous().subscribe({
      next: (fetchedListeRendezVous) => {
        if (!fetchedListeRendezVous) {
          console.warn('Received null or undefined rendez-vous list.');
          this.isLoading = false;
          return;
        }

        console.log(fetchedListeRendezVous);

        this.listeRendezVous = fetchedListeRendezVous;

        this.stats = this.listeRendezVous.map((rv, index) => {
          const colorInfo = this.getEventColor(rv.etat);
          const formattedTime = this.formatRendezVousTime(rv.dateRendezVous);
          const subText = this.generateSubtext(rv.services);
          const [raison, sousServiceLibelle] = subText.split(':').map(item => item.trim());

          return {
              id: index + 1,
              time: formattedTime,
              color: colorInfo,
              subtext: subText,
              title: raison || 'No Title', // Use 'raison' for the title
              description: sousServiceLibelle || 'No Description' // Use 'sousServiceLibelle' for the description
          };
        });

        console.log('Transformed stats data:', this.stats);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading rendez-vous list:', error.message);
        alert('Unable to load activities. Please try again later.');
        this.isLoading = false;
      }
    });
  }

  updateNumberCounts() {
    this.interventionsInProgress = 0;
    this.interventionsOpen = 0;
    this.interventionsClosed = 0;

    this.rendezVousService.getNumberStat().subscribe({
      next: (fetchedListeRendezVous) => {
        if (!fetchedListeRendezVous) {
          console.warn('Received null or undefined rendez-vous list.');
          this.isLoading = false;
          return;
        }

        // Pour en attente
        this.interventionsInProgress = fetchedListeRendezVous.filter((t: EtatCount) => t.etat?.toLowerCase() === 'en attente')
        .reduce((total: number, item: EtatCount) => total + item.count, 0);

        // Pour validé ou valide
        this.interventionsApproved = fetchedListeRendezVous.filter((t: EtatCount) => t.etat?.toLowerCase() === 'validé' || t.etat?.toLowerCase() === 'valide')
            .reduce((total: number, item: EtatCount) => total + item.count, 0);

        // Pour terminé ou termine
        this.interventionsOpen = fetchedListeRendezVous.filter((t: EtatCount) => t.etat?.toLowerCase() === 'terminé' || t.etat?.toLowerCase() === 'termine')
            .reduce((total: number, item: EtatCount) => total + item.count, 0);

        // Pour annulé ou annule
        this.interventionsPending = fetchedListeRendezVous.filter((t: EtatCount) => t.etat?.toLowerCase() === 'annulé' || t.etat?.toLowerCase() === 'annule')
            .reduce((total: number, item: EtatCount) => total + item.count, 0);

        // Pour rejeté ou rejete
        this.interventionsClosed = fetchedListeRendezVous.filter((t: EtatCount) => t.etat?.toLowerCase() === 'rejeté' || t.etat?.toLowerCase() === 'rejete')
            .reduce((total: number, item: EtatCount) => total + item.count, 0);

        // Calculer le total des interventions
        this.totalInterventions = fetchedListeRendezVous.reduce((total: number, item: EtatCount) => total + item.count, 0);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading rendez-vous list:', error.message);
        alert('Unable to load activities. Please try again later.');
        this.isLoading = false;
      }
    });

  }

  private formatRendezVousTime(dateValue: string | Date | undefined): string {
    if (!dateValue) {
      return 'N/A';
    }
    try {
      return this.datePipe.transform(dateValue, 'MMM d, y, hh:mm a') || 'Invalid Date';
    } catch (e) {
      console.error("Error formatting date:", dateValue, e);
      return 'Invalid Date';
    }
  }

  private generateSubtext(services: any[] | undefined): string {
    if (!services || services.length === 0) {
      return 'No services listed.';
    }

    return services.map(service => {
      const raison = service.raison || 'Service';
      let sousServiceLibelle = 'Unknown Specialty';

      if (service.sousSpecialite && 'libelle' in service.sousSpecialite) {
        sousServiceLibelle = service.sousSpecialite.libelle;
      }

      return `${sousServiceLibelle}`;
    }).join('; ');
  }

  private getEventColor(etat: string): string {
    switch (etat) {
      case 'en attente': return 'warning';
      case 'validé': return 'primary';
      case 'rejeté': return 'error';
      case 'annulé': return 'secondary';
      case 'terminé': return 'success';
      default: return '#cccccc';
    }
  }
}

