import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface PrixSousService {
    _id: string;
    sousService: {
        _id: string;
        libelle: string;
        service: { 
            _id: string;
            libelle: string;
        },
        duree: number | 0
    }
    date: Date | null;
    prixUnitaire: number | 0;
    dateEnregistrement: Date | null;
}

@Injectable({
    providedIn: 'root'
})
export class PrixSousServiceService {
    private apiUrl = environment.apiUrl + '/prixSousServices'; // URL API depuis le fichier d’environnement

    constructor(private http: HttpClient) { }

    /**
     * Récupérer toutes les sousServices
     */
    getPrixSousServices(): Observable<PrixSousService[]> {
        return this.http.get<PrixSousService[]>(this.apiUrl).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Ajouter une nouvelle sousService
     */
    addPrixSousService(idSousService: string, date: Date, prixUnitaire: number): Observable<PrixSousService> {
        const prixSousServiceData = {
            sousService: idSousService, 
            date: date,
            prixUnitaire: prixUnitaire
        };
        return this.http.post<PrixSousService>(this.apiUrl, prixSousServiceData).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Modifier une sousService existante
     */
    updatePrixSousService(sousService: PrixSousService): Observable<PrixSousService> {
        return this.http.put<PrixSousService>(`${this.apiUrl}/${sousService._id}`, sousService).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Supprimer une sousService par ID
     */
    deletePrixSousService(sousServiceId: string): Observable<PrixSousService> {
        return this.http.delete<PrixSousService>(`${this.apiUrl}/${sousServiceId}`).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Fonction de gestion des erreurs HTTP
     */
    private handleError(error: HttpErrorResponse) {
        let errorMessage = error.error.message;
        console.log("handle erreur: erreor message : " + errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
