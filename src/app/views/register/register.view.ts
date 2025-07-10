import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@layouts/button/button.component';
import { InputComponent } from '@layouts/input/input.component';
import { LoaderComponent } from '@components/loader/loader';
import { register } from '@services/auth/auth.service';
import { Alert } from '@components/alert/alert';
import { LoaderService } from '@services/loader/loader.service';

@Component({
  selector: 'app-register-view',
  templateUrl: './register.view.html',
  styleUrls: ['./register.view.scss'],
  imports: [ButtonComponent, InputComponent, LoaderComponent]
})
export class RegisterView {
  private loaderService = inject(LoaderService);

  constructor(private alert: Alert) {}

  navigateToLogin() {
    window.location.href = '/login';
  }

  navigateToHome() {
    window.location.href = '/';
  }

  async registerHandler(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const userRegisterPayload = {
      username: formData.get('username') as string,
      password_hash: formData.get('password_hash') as string,
      email: formData.get('email') as string,
      photo_profile_url: formData.get('photo_profile_url') as string || 'https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
    }

    // Mostrar loader
    this.loaderService.show('Registrando usuario...');

    try {
      const result = await register(userRegisterPayload);

      if (result instanceof Error) {
        this.alert.showError(result.message || 'Registro fallido!');
        return;
      } else {
        const registerResponse = result as any;
        if (registerResponse) {
          this.alert.showSuccess('Registro exitoso!');
          this.loaderService.updateMessage('Redirigiendo...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 500);
        }
      }
    } catch (error) {
      console.error('Register failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado durante el registro.';
      this.alert.showError(`Registro fallido: ${errorMessage}`);
    } finally {
      // Ocultar loader
      this.loaderService.hide();
    }
  }
}
