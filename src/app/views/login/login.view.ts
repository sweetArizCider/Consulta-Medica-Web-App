import { Component } from '@angular/core';
import { ButtonComponent } from '@layouts/button/button.component'
import { InputComponent} from '@layouts/input/input.component';
import { login, saveTokenToLocalStorage } from '@services/auth/auth.service';
import { Alert } from '@components/alert/alert';

@Component({
  selector: 'app-login-view',
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.scss'],
  imports: [ButtonComponent, InputComponent]
})

export class LoginView {
  constructor(private alert: Alert) {}

  async loginHandler(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const userLoginPayload = {
      username: formData.get('username') as string,
      password_hash: formData.get('password_hash') as string
    }

    try {
      const result = await login(userLoginPayload);

      if (result instanceof Error) {
        this.alert.showError(result.message || 'Login failed!');
        return
      } else {
        const loginResponse = result as any;
        if (loginResponse && loginResponse.token) {
          saveTokenToLocalStorage(loginResponse.token);
          this.alert.showSuccess('Login successful!');
          window.location.href = '/';
        } else {
          this.alert.showError('Login failed: Token not received.');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during login.';
      this.alert.showError(`Login failed: ${errorMessage}`);
    }
  }
}
