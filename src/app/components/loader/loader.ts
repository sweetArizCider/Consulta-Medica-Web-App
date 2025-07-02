import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { LoaderService, LoaderState } from '../../services/loader/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  imports: [MatProgressBarModule, CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader implements OnInit, OnDestroy {
  @Input() isLoading: boolean = false;
  @Input() message: string = 'Cargando...';
  
  private loaderSubscription?: Subscription;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    // Suscribirse al servicio de loader
    this.loaderSubscription = this.loaderService.loader$.subscribe(
      (state: LoaderState) => {
        this.isLoading = state.isLoading;
        this.message = state.message;
      }
    );
  }

  ngOnDestroy() {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }
}
