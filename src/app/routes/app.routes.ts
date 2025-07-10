import { Routes } from '@angular/router';
import { LoginView } from '@views/login/login.view';
import { RegisterView } from '@views/register/register.view';
import { LandingComponent } from '@views/landing/landing.component';
import { ClientsView } from '@views/clients/clients.view';
import { DoctorsView } from '@views/doctors/doctors.view';
import { MedicinesView } from '@views/medicines/medicines.view';
import { DiagnosticsView } from '@views/diagnostics/diagnostics.view';
import { MedicinesRequiredView } from '@views/medicinesRequired/medicinesRequired.view';

export const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'login', component: LoginView },
  { path: 'register', component: RegisterView },
  { path: 'Clientes', component: ClientsView },
  { path: 'Doctores', component: DoctorsView },
  { path: 'Farmacia', component: MedicinesView },
  { path: 'Diagnóstico', component: DiagnosticsView },
  { path: 'Recetas', component: MedicinesRequiredView },
  { path: 'Home', redirectTo: '', pathMatch: 'full' },
]