import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface Personne {
    _id: string;
    nom: string;
    prenom: string;
    numeroTelephone: string;
    email: string;
}

export interface Voiture {
    _id: string;
    client: string;
    marque: { _id: string; libelle: string; };
    modele: { _id: string; libelle: string; };
    categorie: { _id: string; libelle: string; };
    typeTransmission: { _id: string; libelle: string; };
    annee: number;
    numeroImmatriculation: string;
    kilometrage: number;
    puissanceMoteur: number;
    cylindree: number;
    capaciteReservoir: number;
    pressionPneusRecommande: string;
}

export interface SousSpecialite {
    _id: string;
    service: { _id: string; libelle: string; };
    libelle: string;
    duree: number;
    ptix: number;
}

export interface Service {
    sousSpecialite: SousSpecialite;
    raison: string;
    mecanicien: Personne;
    quantiteEstimee: number;
    prixUnitaire: number;
    _id: string;
}

export interface RendezVous {
    _id: string;
    client: Personne;
    validateur: Personne;
    voiture: Voiture;
    services: Service[];
    dateRendezVous: Date;
    etat: string;
    dateHeureDemande: Date;
    piecesAchetees: any[];
    remarque: string;
}


@Injectable({
    providedIn: 'root'
})
export class RendezVousService {
    private apiUrl = environment.apiUrl + '/rendezVous'; // URL API depuis le fichier d’environnement

    constructor(private http: HttpClient) { }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Récupérer toutes les rendezVous
     */
    getRendezVous(): Observable<RendezVous[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        return this.http.get<RendezVous[]>(this.apiUrl, { headers }).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    getRendezVousByEtat(etat: string): Observable<RendezVous[]> {

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        return this.http.get<RendezVous[]>(`${this.apiUrl}/parEtat/${etat}`, { headers }).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Ajouter une nouvelle categorie
     */
    addRendezVous(libelle: string): Observable<RendezVous> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        const categorieData = {
            libelle: libelle, // Inclure seulement le libelle
        };
        return this.http.post<RendezVous>(this.apiUrl, categorieData, { headers }).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Modifier une categorie existante
     */
    updateRendezVous(categorie: RendezVous): Observable<RendezVous> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        return this.http.put<RendezVous>(`${this.apiUrl}/${categorie._id}`, categorie, { headers }).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Supprimer une categorie par ID
     */
    deleteRendezVous(categorieId: string): Observable<RendezVous> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });

        return this.http.delete<RendezVous>(`${this.apiUrl}/${categorieId}`, { headers }).pipe(
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
