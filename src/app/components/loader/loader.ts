import { Component, Input, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { LoaderService, LoaderState } from '../../services/loader/loader.service';
import { Subscription } from 'rxjs';

/**
 * Componente Loader que muestra un indicador de carga
 * 
 * @example
 * ```html
 * <app-loader></app-loader>
 * 
 * <!-- Con override -->
 * <app-loader 
 *   [overrideIsLoading]="customLoading" 
 *   [overrideMessage]="customMessage">
 * </app-loader>
 * ```
 */
@Component({
  selector: 'app-loader',
  imports: [MatProgressBarModule, CommonModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.scss'],
  standalone: true
})
export class LoaderComponent implements OnInit, OnDestroy {
  // Dependency injection usando inject()
  private readonly loaderService = inject(LoaderService);
  
  // Señales para un estado reactivo
  private readonly loaderState = signal<LoaderState>({
    isLoading: false,
    message: 'Cargando...'
  });
  
  // Computed values para propiedades derivadas
  readonly isLoading = computed(() => this.loaderState().isLoading);
  readonly message = computed(() => this.loaderState().message);
  
  /** Permite sobrescribir el estado de carga desde el componente padre */
  @Input() overrideIsLoading?: boolean;
  
  /** Permite sobrescribir el mensaje desde el componente padre */
  @Input() overrideMessage?: string;
  
  // Computed final que considera overrides
  readonly finalIsLoading = computed(() => 
    this.overrideIsLoading ?? this.isLoading()
  );
  
  readonly finalMessage = computed(() => 
    this.overrideMessage ?? this.message()
  );
  
  private loaderSubscription?: Subscription;

  ngOnInit(): void {
    // Suscribirse al servicio de loader con manejo de errores
    this.loaderSubscription = this.loaderService.loader$.subscribe({
      next: (state: LoaderState) => {
        this.loaderState.set(state);
      },
      error: (error) => {
        console.error('Error en loader service:', error);
        this.loaderState.set({
          isLoading: false,
          message: 'Error al cargar'
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Limpieza de suscripciones
    this.loaderSubscription?.unsubscribe();
  }
}
