import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface Personne {
    _id: string;
    nom: string;
    prenom: string;
    dateDeNaissance: Date | null;
    lieuDeNaissance: string;
    genre: string;
    numeroTelephone: string;
    email: string;
    motDePasse: string;
    idRole: string;
    dateEmbauche: Date | any;
}

@Injectable({
    providedIn: 'root'
})
export class PersonneService {
    private apiUrl = environment.apiUrl + '/personne';

    constructor(private http: HttpClient) { }

    /**
     * Récupérer toutes les personnes
     */
    getPersonnes(): Observable<Personne[]> {
        return this.http.get<Personne[]>(this.apiUrl).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Ajouter une nouvelle personne
     */
    addPersonne(libelle: string): Observable<Personne> {
        const personneData = {
            libelle: libelle, // Inclure seulement le libelle
        };
        return this.http.post<Personne>(this.apiUrl, personneData).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Modifier une personne existante
     */
    updatePersonne(personne: Personne): Observable<Personne> {
        return this.http.put<Personne>(`${this.apiUrl}/${personne._id}`, personne).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Supprimer une personne par ID
     */
    deletePersonne(personneId: string): Observable<Personne> {
        return this.http.delete<Personne>(`${this.apiUrl}/${personneId}`).pipe(
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
