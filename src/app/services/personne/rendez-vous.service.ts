import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface RendezVous {
    _id: string;
    voiture: { _id: string, numeroImmatriculation: string, annee: string} | null;
    mecanicien: { _id: string, personne: {nom: string, prenom: string} } | null;
    services: [
        {
            sousSpecialite: string;
            libelle: string;
            service: { 
                _id: string;
                mecanicien: { _id: string, personne: {nom: string, prenom: string} } | null;
                heureDebut: Date | null;
                heureFin: Date | null;
                quantiteEstimee: string;
            }
        }
    ]
    dateHeureDemande: Date | null;
    dateRendezVous: Date | null;
    heureDebut: Date | null;
    heureFin: Date | null;
    validateur: { _id: string },
    remarque: string | null;
    etat: string;
}

@Injectable({
    providedIn: 'root'
})
export class RendezVousService {
    private apiUrl = environment.apiUrl + '/specialites';

    constructor(private http: HttpClient) { }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Récupérer toutes les sousServices
     */
    getSpecialites(): Observable<RendezVous[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        return this.http.get<RendezVous[]>(this.apiUrl, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    getSpecialitesActives(): Observable<RendezVous[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        return this.http.get<RendezVous[]>(this.apiUrl + "/active", { headers }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Ajouter une nouvelle sousService
     */
    addSpecialite(idSousService: string, idMecanicien: string): Observable<RendezVous> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        const specialiteData = {
            sousService: idSousService,
            mecanicien: idMecanicien
        };

        return this.http.post<RendezVous>(this.apiUrl, specialiteData, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Modifier une specialite existante
     */
    updateSpecialite(specialite: RendezVous): Observable<RendezVous> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        return this.http.put<RendezVous>(`${this.apiUrl}/${specialite._id}`, specialite, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Supprimer une specialite par ID
     */
    deleteSpecialite(specialiteId: string): Observable<RendezVous> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        return this.http.delete<RendezVous>(`${this.apiUrl}/${specialiteId}`, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Fonction de gestion des erreurs HTTP
     */
    private handleError(error: HttpErrorResponse) {
        let errorMessage = error.error.message;
        console.log("handle erreur: error message : " + errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
