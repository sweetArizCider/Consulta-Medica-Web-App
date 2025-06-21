import { Component } from '@angular/core';
import { NavBar} from '@components/navBar/navBar';
import { login } from '@services/auth/auth.service';
import { saveTokenToLocalStorage } from '@services/auth/auth.service'

@Component({
  selector: 'login-view',
  imports: [],
  template: `./login.view.html'`
})
export class LoginView {
/*
  async loginHandler(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const userLoginPayload = {
      username: formData.get('username') as string,
      password: formData.get('password') as string
    }

    try {
      const result = await login(userLoginPayload);

      if (result instanceof Error) {
        alert(result.message || 'Login failed!');
        return
      } else {
        const loginResponse = result as any;
        if (loginResponse && loginResponse.token) {
          saveTokenToLocalStorage(loginResponse.token);
          alert('Login successful!');
          window.location.href = '/';
        } else {
          // This case might occur if the server response was successful (not an Error instance)
          // but didn't contain a token, or if response.json() was not what we expected.
          alert('Login failed: Token not received.');
        }
      }
    } catch (error) {
      // This catch block handles network errors or other unexpected errors from the login service itself
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during login.';
      alert(`Login failed: ${errorMessage}`);
    }
  }*/
}
