import { Component } from '@angular/core';
import { NavBar } from '@components/navBar/navBar';
import { register } from '@services/auth/auth.service';

@Component({
  selector: 'register-view',
  imports: [NavBar],
  templateUrl: './register.view.html'
})
export class RegisterView {

  async registerHandler(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const userRegisterPayload = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      email: formData.get('email') as string
    };

    try {
      const result = await register(userRegisterPayload);
      if (result instanceof Error) {
        alert(result.message || 'Registration failed!');
        return;
      } else {
        alert('Registration successful! You can now log in :).');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during registration.';
      alert(`Registration failed: ${errorMessage}`);
    }
  }
}
