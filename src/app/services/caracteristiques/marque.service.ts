import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface Marque {
    _id: string;
    libelle: string;
    dateEnregistrement: Date | null;
    manager: { id: string, nom: string, prenom: string } | any;
    dateSuppression: Date | any;
    managerSuppression: { id: string, nom: string, prenom: string } | any;
    etat: number;
}

@Injectable({
    providedIn: 'root'
})
export class MarqueService {
    private apiUrl = environment.apiUrl + '/marques'; // URL API depuis le fichier d’environnement

    constructor(private http: HttpClient) { }

    /**
     * Récupérer toutes les marques
     */
    getMarques(): Observable<Marque[]> {
        return this.http.get<Marque[]>(this.apiUrl).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    getMarquesActives(): Observable<Marque[]> {
        return this.http.get<Marque[]>(this.apiUrl + "/active").pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Ajouter une nouvelle marque
     */
    addMarque(libelle: string): Observable<Marque> {
        const marqueData = {
            libelle: libelle, // Inclure seulement le libelle
        };
        return this.http.post<Marque>(this.apiUrl, marqueData).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Modifier une marque existante
     */
    updateMarque(marque: Marque): Observable<Marque> {
        return this.http.put<Marque>(`${this.apiUrl}/${marque._id}`, marque).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Supprimer une marque par ID
     */
    deleteMarque(marqueId: string): Observable<Marque> {
        return this.http.delete<Marque>(`${this.apiUrl}/${marqueId}`).pipe(
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
