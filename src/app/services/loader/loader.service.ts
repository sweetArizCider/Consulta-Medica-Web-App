import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LoaderState {
  isLoading: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new BehaviorSubject<LoaderState>({
    isLoading: false,
    message: 'Cargando...'
  });

  public loader$ = this.loaderSubject.asObservable();

  show(message: string = 'Cargando...') {
    this.loaderSubject.next({
      isLoading: true,
      message
    });
  }

  updateMessage(message: string) {
    const currentState = this.loaderSubject.value;
    if (currentState.isLoading) {
      this.loaderSubject.next({
        ...currentState,
        message
      });
    }
  }

  hide() {
    this.loaderSubject.next({
      isLoading: false,
      message: 'Cargando...'
    });
  }

  get isLoading(): boolean {
    return this.loaderSubject.value.isLoading;
  }
}
