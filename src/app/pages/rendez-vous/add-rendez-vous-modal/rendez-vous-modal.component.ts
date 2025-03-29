import { Component, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';

export interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  options?: { value: string; label: string; serviceId?: string }[]; // Ajout du typage pour les options
}

@Component({
  selector: 'app-add-rendez-vous-modal',
  standalone: true,
  templateUrl: './rendez-vous-modal.component.html',
  imports: [
    NgIf, NgFor,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule
  ],
})
export class RendezVousModalComponent implements OnInit {
  form: FormGroup;
  @Input() title: string = '';
  @Input() fields: any[] = [];
  @Input() buttonLabel: string = 'Submit';
  @Input() errorMessage: string = '';
  @Output() saveData = new EventEmitter<any>();

  allSousServices: any[] = [];
  voituresOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RendezVousModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      services: this.fb.array([])
    });

    if (!this.data || !this.data.fields) {
      console.log('Aucun champ fourni pour le formulaire dynamique.');
      return;
    }

    const controls: { [key: string]: any[] } = {};

    // Initialisation du formulaire avec les valeurs par défaut définies dans chaque champ
    this.data.fields.forEach((field: any) => {
      let validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }

      // Handle array of selected subservices
      if (field.name === 'id_sous_service') {
        controls[field.name] = [[], validators]; // Initialize as empty array
      } else {
        controls[field.name] = [field.defaultValue || '', validators];
      }
    });

    this.form = this.fb.group(controls);

    // Initialisation des options pour le service
    this.voituresOptions = this.data.fields.find((f: Field) => f.name === 'voiture')?.options || [];
    this.allSousServices = this.data.fields.find((f: Field) => f.name === 'id_sous_service')?.options || [];

    // You don't need the filteredSousServices logic anymore, as all options are available.
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  addService() {
    this.services.push(this.createServiceForm());
  }

  createServiceForm(): FormGroup {
    return this.fb.group({
      sousService: ['', Validators.required],
      quantite: ['', Validators.required],
      raison: ['', Validators.required]
    });
  }
}
