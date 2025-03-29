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
            _id: string;
            mecanicien: { _id: string, personne: {nom: string, prenom: string} } | null;
            heureDebut: Date | null;
            heureFin: Date | null;
            raison: string;
            quantiteEstimee: string;
            prixUnitaire: Number | null;
            prixTotal: Number | null;
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
    private apiUrl = environment.apiUrl + '/rendezVous';

    constructor(private http: HttpClient) { }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Récupérer toutes les sousServices
     */
    getAllRendezVous(): Observable<RendezVous[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        return this.http.get<RendezVous[]>(this.apiUrl, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Ajouter une nouvelle sousService
     */
    addRendezVous(rendezVousData: any): Observable<RendezVous> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
        });
    
        console.log("API URL:", this.apiUrl);
        
        const data = {
            "client": "67e3071018c9673f291d3ad2",
            "date": "3035-09-23T07:00",
            "dateRendezVous": "3035-09-23T07:00",
            "services": [
                {
                    "prixUnitaire": 0,
                    "quantiteEstimee": 40,
                    "raison": "Contrôle et remplacement des bougies",
                    "sousSpecialite": "67e256cd811b3e52c586a970",
                    "status": "en attente"
                }
            ],
            "voiture": "67e2701349b59270464e2879"
        }

        console.log("data: ",data);

        return this.http.post<RendezVous>(this.apiUrl, data, { headers }).pipe(
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
