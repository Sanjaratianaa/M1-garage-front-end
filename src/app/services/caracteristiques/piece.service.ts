import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environnements/environnement'; // Import de l’environnement

export interface Piece {
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
export class PieceService {
    private apiUrl = environment.apiUrl + '/pieces'; // URL API depuis le fichier d’environnement

    constructor(private http: HttpClient) { }

    /**
     * Récupérer toutes les pieces
     */
    getPieces(): Observable<Piece[]> {
        return this.http.get<Piece[]>(this.apiUrl).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    getPiecesActives(): Observable<Piece[]> {
        console.log('getPiecesActives');
        return this.http.get<Piece[]>(this.apiUrl + "/active").pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Ajouter une nouvelle piece
     */
    addPiece(libelle: string): Observable<Piece> {
        const pieceData = {
            libelle: libelle, // Inclure seulement le libelle
        };
        return this.http.post<Piece>(this.apiUrl, pieceData).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Modifier une piece existante
     */
    updatePiece(piece: Piece): Observable<Piece> {
        return this.http.put<Piece>(`${this.apiUrl}/${piece._id}`, piece).pipe(
            catchError(this.handleError) // Gestion des erreurs
        );
    }

    /**
     * Supprimer une piece par ID
     */
    deletePiece(pieceId: string): Observable<Piece> {
        return this.http.delete<Piece>(`${this.apiUrl}/${pieceId}`).pipe(
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
