import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface Modele {
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
export class ModeleService {
    private apiUrl = environment.apiUrl + '/modeles'; // URL API depuis le fichier d’environnement

    constructor(private http: HttpClient) { }

    /**
     * Récupérer toutes les modeles
     */
    getModeles(): Observable<Modele[]> {
        return this.http.get<Modele[]>(this.apiUrl).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Ajouter une nouvelle modele
     */
    addModele(libelle: string): Observable<Modele> {
        const modeleData = {
            libelle: libelle, // Inclure seulement le libelle
        };
        return this.http.post<Modele>(this.apiUrl, modeleData).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Modifier une modele existante
     */
    updateModele(modele: Modele): Observable<Modele> {
        return this.http.put<Modele>(`${this.apiUrl}/${modele._id}`, modele).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Supprimer une modele par ID
     */
    deleteModele(modeleId: string): Observable<Modele> {
        return this.http.delete<Modele>(`${this.apiUrl}/${modeleId}`).pipe(
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
