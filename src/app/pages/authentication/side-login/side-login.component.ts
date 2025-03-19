import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthentificationService  } from 'src/app/services/authentification/authentification.service';
import { NgIf } from '@angular/common'; // Import NgIf

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  errorMessage = '';

  constructor(private router: Router, private authService: AuthentificationService) {}

  // form = new FormGroup({
  //   uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
  //   password: new FormControl('', [Validators.required]),
  // });

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  // submit() {
  //   this.router.navigate(['']);
  // }

  submit() {
    if (this.form.valid) {
      this.authService.login(this.form.value.email!, this.form.value.password!).subscribe({ // The "!" tells TS that email and password will not be null
        next: (response) => {
          // Store the token (e.g., in localStorage)
          localStorage.setItem('token', response.token);

          // Optionally store user data
          localStorage.setItem('user', JSON.stringify(response.user));

          // Redirect to the dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.message; // Display the error message
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.'; // Display a generic error if the form is invalid
    }
  }
}
