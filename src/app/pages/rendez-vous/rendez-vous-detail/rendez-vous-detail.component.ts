import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RendezVousService, RendezVous } from 'src/app/services/personne/rendez-vous.service';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-rendez-vous-detail',
    templateUrl: './rendez-vous-detail.component.html',
    // styleUrls: ['./rendez-vous-detail.component.css']
})
export class RendezVousDetailComponent implements OnInit {
    rendezVous: RendezVous | undefined;

    constructor(
        private route: ActivatedRoute,
        private rendezVousService: RendezVousService
    ) { }

    ngOnInit(): void {
        console.log("Tafiditra ato neee");
        this.route.params.pipe(
            switchMap(params => {
                const id = params['id'];
                return this.rendezVousService.getRendezVousById(id);
            })
        ).subscribe(rendezVous => {
            this.rendezVous = rendezVous;
        });
    }
}