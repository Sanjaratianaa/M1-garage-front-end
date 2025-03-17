import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface Service {
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
export class ServiceService {
    private apiUrl = environment.apiUrl + '/services'; // URL API depuis le fichier d’environnement

    constructor(private http: HttpClient) { }

    /**
     * Récupérer toutes les services
     */
    getServices(): Observable<Service[]> {
        return this.http.get<Service[]>(this.apiUrl).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Ajouter une nouvelle service
     */
    addService(libelle: string): Observable<Service> {
        const serviceData = {
            libelle: libelle, // Inclure seulement le libelle
        };
        return this.http.post<Service>(this.apiUrl, serviceData).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Modifier une service existante
     */
    updateService(service: Service): Observable<Service> {
        return this.http.put<Service>(`${this.apiUrl}/${service._id}`, service).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Supprimer une service par ID
     */
    deleteService(serviceId: string): Observable<Service> {
        return this.http.delete<Service>(`${this.apiUrl}/${serviceId}`).pipe(
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
