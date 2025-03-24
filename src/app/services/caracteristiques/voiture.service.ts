import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface Voiture {
    _id: string;
    client: { id: string, nom: string, prenom: string } | null;
    marque: {
        _id: string;
        libelle: string;
    } | any,
    modele: {
        _id: string;
        libelle: string;
    } | any,
    categorie: {
        _id: string;
        libelle: string;
    } | any,
    typeTransmission: {
        _id: string;
        libelle: string;
    } | any,
    annee: number | 0,
    numeroImmatriculation: string
    kilometrage: number | 0,
    puissanceMoteur: number | 0,
    cylindree:number | 0,
    capaciteReservoir:  number | 0,
    pressionPneusRecommande: string,
    dateEnregistrement: Date | null;
    dateSuppression: Date | null;
    etat: string;
}

@Injectable({
    providedIn: 'root'
})
export class VoitureService {
    private apiUrl = environment.apiUrl + '/voitures'; // URL API depuis le fichier d’environnement

    constructor(private http: HttpClient) { }

    /**
     * Récupérer toutes les stocks
     */
    getVoitures(): Observable<Voiture[]> {
        return this.http.get<Voiture[]>(this.apiUrl).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    getVoituresByClient(): Observable<Voiture[]> {
        return this.http.get<Voiture[]>(this.apiUrl + "/client").pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Ajouter une nouvelle stock
     */
    addVoiture(idPiece: string, marquePiece: string, idMarque: string, idModele: string, idTypeTransmission: string, entree: number, sortie: number, prixUnitaire: number): Observable<Voiture> {
        const mouvementData = {
            piece: idPiece,
            marquePiece: marquePiece,
            marqueVoiture: idMarque === '0' ? null : idMarque,
            modeleVoiture: idModele === '0' ? null : idModele,
            typeTransmission: idTypeTransmission === '0' ? null : idTypeTransmission,
            entree: entree,
            sortie: sortie,
            prixUnitaire: prixUnitaire
        };
        return this.http.post<Voiture>(this.apiUrl, mouvementData).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Modifier une stock existante
     */
    updateVoiture(stock: Voiture): Observable<Voiture> {
        return this.http.put<Voiture>(`${this.apiUrl}/${stock._id}`, stock).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Supprimer une stock par ID
     */
    deleteVoiture(stockId: string): Observable<Voiture> {
        return this.http.delete<Voiture>(`${this.apiUrl}/${stockId}`).pipe(
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

    getStocks(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + "/stocks").pipe(
            catchError(this.handleError) // Prix des erreurs
        );
    }
}
