import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouteReuseStrategy, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true, // standalone component
  imports: [ReactiveFormsModule, CommonModule, RouterLink] // Ensure to import necessary modules
})
export class SignupComponent {
  signupForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    // if (this.signupForm.valid) {
    //   const { email, password, name } = this.signupForm.value;
    //   // Call your auth service to register the user
    //   this.authService.signup(email, password, name).subscribe({
    //     next: () => this.router.navigate(['/login']),
    //     error: (err) => {
    //       this.error = 'حدث خطأ أثناء إنشاء الحساب';
    //     }
    //   });
    // }
  }
}
