import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../layouts/button/button.component';
import { InputComponent } from '../../layouts/input/input.component';
import { RegisterService, RegisterPayload } from '../../services/auth/register.service';
import { ButtonType } from '../../layouts/button/button.enums';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './register.view.html',
  styleUrls: ['./register.view.scss']
})
export class RegisterViewComponent {
  private readonly fb = inject(FormBuilder);
  private readonly registerService = inject(RegisterService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  fieldErrors: { [key: string]: string } = {};

  // Enums para template
  ButtonType = ButtonType;

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      photo_profile_url: [''] // Opcional
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validador personalizado para confirmar que las contraseñas coincidan
   */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  /**
   * Maneja el envío del formulario de registro
   */
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const payload: RegisterPayload = {
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password_hash: this.registerForm.get('password')?.value,
        photo_profile_url: this.registerForm.get('photo_profile_url')?.value || undefined
      };

      console.log('Enviando payload:', payload);

      this.registerService.register(payload).subscribe({
        next: (response) => {
          setTimeout(() => {
            this.isLoading = false;
            if (response.success) {
              this.successMessage = 'Usuario registrado exitosamente. Redirigiendo al login...';
              this.cdr.detectChanges();
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2000);
            } else {
              this.errorMessage = response.message;
              this.cdr.detectChanges();
            }
          }, 0);
        },
        error: (error) => {
          console.error('Error en registro:', error);
          
          // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            this.isLoading = false;
            
            // Limpiar errores anteriores
            this.fieldErrors = {};
            this.errorMessage = '';
            
            // Analizar el tipo de error y asignarlo al campo correspondiente
            if (error.message) {
              const errorText = error.message.toLowerCase();
              
              if (errorText.includes('username') || errorText.includes('usuario')) {
                this.fieldErrors['username'] = error.message;
              } else if (errorText.includes('email')) {
                this.fieldErrors['email'] = error.message;
              } else if (errorText.includes('password') || errorText.includes('contraseña')) {
                this.fieldErrors['password'] = error.message;
              } else {
                // Error general
                this.errorMessage = error.message;
              }
            } else {
              this.errorMessage = 'Error al registrar usuario. Inténtalo de nuevo.';
            }
            
            // Forzar detección de cambios
            this.cdr.detectChanges();
          }, 0);
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldError(fieldName: string): string {
    // Primero verificar si hay errores del servidor
    if (this.fieldErrors[fieldName]) {
      return this.fieldErrors[fieldName];
    }
    
    // Luego verificar errores de validación del formulario
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['passwordMismatch']) return 'Las contraseñas no coinciden';
    }
    return '';
  }

  /**
   * Verifica si un campo tiene errores
   */
  hasFieldError(fieldName: string): boolean {
    // Verificar errores del servidor
    if (this.fieldErrors[fieldName]) {
      return true;
    }
    
    // Verificar errores de validación del formulario
    const field = this.registerForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  /**
   * Navega al login
   */
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Maneja el cambio en los inputs del formulario
   */
  onInputChange(event: Event, fieldName: string): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.registerForm.get(fieldName)?.setValue(target.value);
      
      // Limpiar errores del servidor cuando el usuario empiece a escribir
      // Usar setTimeout para evitar errores de change detection
      if (this.fieldErrors[fieldName]) {
        setTimeout(() => {
          delete this.fieldErrors[fieldName];
          this.cdr.detectChanges();
        }, 0);
      }
    }
  }
}
