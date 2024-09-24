import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Optional if you have additional styles
  standalone: true, // Ensure it's a standalone component
  imports: [ReactiveFormsModule, CommonModule, RouterLink], 
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form Submitted',this.loginForm.value); // Add this line to verify the form is submitted
      const { email, password } = this.loginForm.value;
      console.log(email,password)
      this.authService.login(email, password).subscribe({
        next: () => this.router.navigate(['admin/dashboard']),
        error: (err) => {
          this.error = 'Invalid email or password';
        }
      });
    } else {
      console.log('Form is invalid'); // Add this line to see if form validation fails
    }
  }
  
}
