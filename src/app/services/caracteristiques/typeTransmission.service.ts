import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface TypeTransmission {
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
export class TypeTransmissionService { 
    private apiUrl = environment.apiUrl + '/transmissions'; // URL API depuis le fichier d’environnement

    constructor(private http: HttpClient) { }

    /**
     * Récupérer toutes les typeTransmissions
     */
    getTypeTransmissions(): Observable<TypeTransmission[]> {
        return this.http.get<TypeTransmission[]>(this.apiUrl).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Ajouter une nouvelle typeTransmission
     */
    addTypeTransmission(libelle: string): Observable<TypeTransmission> {
        const typeTransmissionData = {
            libelle: libelle, // Inclure seulement le libelle
        };
        return this.http.post<TypeTransmission>(this.apiUrl, typeTransmissionData).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Modifier une typeTransmission existante
     */
    updateTypeTransmission(typeTransmission: TypeTransmission): Observable<TypeTransmission> {
        return this.http.put<TypeTransmission>(`${this.apiUrl}/${typeTransmission._id}`, typeTransmission).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Supprimer une typeTransmission par ID
     */
    deleteTypeTransmission(typeTransmissionId: string): Observable<TypeTransmission> {
        return this.http.delete<TypeTransmission>(`${this.apiUrl}/${typeTransmissionId}`).pipe(
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
