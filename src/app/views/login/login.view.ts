import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@layouts/button/button.component'
import { InputComponent} from '@layouts/input/input.component';
import { LoaderComponent } from '@components/loader/loader';
import { login, saveTokenToLocalStorage } from '@services/auth/auth.service';
import { Alert } from '@components/alert/alert';
import { LoaderService } from '@services/loader/loader.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.scss'],
  imports: [ButtonComponent, InputComponent, LoaderComponent]
})
export class LoginView {
  private loaderService = inject(LoaderService);

  constructor(private alert: Alert) {}

  navigateToRegister() {
    window.location.href = '/register';
  }
  navigateToHome() {
    window.location.href = '/';
  }

  async loginHandler(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const userLoginPayload = {
      username: formData.get('username') as string,
      password_hash: formData.get('password_hash') as string
    }

    // Mostrar loader
    this.loaderService.show('Iniciando sesión...');

    try {
      const result = await login(userLoginPayload);

      if (result instanceof Error) {
        this.alert.showError(result.message || 'Login failed!');
        return
      } else {
        const loginResponse = result as any;
        if (loginResponse && loginResponse.token) {
          this.loaderService.updateMessage('Guardando sesión...');
          saveTokenToLocalStorage(loginResponse.token);
          this.alert.showSuccess('Logeado correctamente!');
          this.loaderService.updateMessage('Redirigiendo...');
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        } else {
          this.alert.showError('Login failed: Token not received.');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.';
      this.alert.showError(`Login failed: ${errorMessage}`);
    } finally {
      // Ocultar loader
      this.loaderService.hide();
    }
  }
}
