import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface Categorie {
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
export class CategorieService {
    private apiUrl = environment.apiUrl + '/categories'; // URL API depuis le fichier d’environnement

    constructor(private http: HttpClient) { }

    /**
     * Récupérer toutes les categories
     */
    getCategories(): Observable<Categorie[]> {
        return this.http.get<Categorie[]>(this.apiUrl).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    getCategoriesActives(): Observable<Categorie[]> {
        return this.http.get<Categorie[]>(this.apiUrl + "/active").pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Ajouter une nouvelle categorie
     */
    addCategorie(libelle: string): Observable<Categorie> {
        const categorieData = {
            libelle: libelle, // Inclure seulement le libelle
        };
        return this.http.post<Categorie>(this.apiUrl, categorieData).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Modifier une categorie existante
     */
    updateCategorie(categorie: Categorie): Observable<Categorie> {
        return this.http.put<Categorie>(`${this.apiUrl}/${categorie._id}`, categorie).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Supprimer une categorie par ID
     */
    deleteCategorie(categorieId: string): Observable<Categorie> {
        return this.http.delete<Categorie>(`${this.apiUrl}/${categorieId}`).pipe(
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
