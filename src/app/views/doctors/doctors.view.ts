import { NavBar } from '@components/navBar/navBar';
import { Component, OnInit, inject, signal } from '@angular/core';
import { getDoctors, updateDoctor, createDoctor } from '@services/doctors/doctors.service';
import { LoaderComponent } from '@components/loader/loader';
import doctorsModel from '@sequelizeModels/Doctors.model';
import { LoaderService } from '@services/loader/loader.service';
import { Alert } from '@components/alert/alert';
import { ButtonComponent } from '@layouts/button/button.component';
import { TableComponent, TableColumn, TableRow } from '@components/table/table';
import { DoctorPayload } from '@expressModels/doctors/doctors';
import { ModalService } from '@components/modal/modal.service';
import { ModalData } from '@components/modal/modal.model';
import { Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-doctors-view',
  templateUrl: './doctors.view.html',
  styleUrls: ['./doctors.view.scss'],
  imports: [
    NavBar,
    LoaderComponent,
    ButtonComponent,
    TableComponent,
  ],
  standalone: true
})
export class DoctorsView implements OnInit {
  private loaderService = inject(LoaderService);
  private modalService = inject(ModalService);

  constructor(private alert: Alert) {}

  doctors = signal<doctorsModel[]>([]);

  columns: TableColumn[] = [
    { key: 'espacio', header: '', width: '6dvw', sortable: false, showTriangle: false },
    { key: 'name', header: 'Nombre', width: '15dvw', sortable: true, showTriangle: true },
    { key: 'email', header: 'Correo', width: '19dvw', sortable: true, showTriangle: true },
    { key: 'phone', header: 'Teléfono', width: '14dvw', sortable: true, showTriangle: true },
    { key: 'specialty', header: 'Especialidad', width: '18dvw', sortable: true, showTriangle: true },
    { key: 'is_active', header: 'Activo', width: '10dvw', sortable: true, showTriangle: true }
  ];

  // Datos transformados para la tabla
  tableData = signal<TableRow[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadDoctors();
  }

  async loadDoctors(): Promise<void> {
    this.loaderService.show('Cargando Doctores...');
    try {
      const doctorsData = await getDoctors();
      if (doctorsData instanceof Error) {
        this.alert.showError(doctorsData.message);
        console.error('Error fetching doctors:', doctorsData.message);
        return;
      }

      this.doctors.set(doctorsData);
      this.updateTableData(doctorsData);
      this.alert.showSuccess('Doctores cargados exitosamente!');
    } catch (error) {
      console.error('Error fetching doctors:', error);
      this.alert.showError('Error al cargar los doctores');
    } finally {
      this.loaderService.hide();
    }
  }

  updateTableData(doctorsData: doctorsModel[]): void {
    const transformedData = doctorsData.map(doctor => ({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialty: doctor.specialty,
      is_active: doctor.is_active ? 'Sí' : 'No',
      rawData: doctor
    }));
    this.tableData.set(transformedData);
  }

  openCreateModal(): void {
    const modalData: ModalData = {
      title: 'Añadir doctor',
      confirmButtonText: 'Guardar',
      fields: [
        {
          name: 'name',
          label: 'Nombre',
          icon: 'person',
          initialValue: '',
          validators: [Validators.required, Validators.minLength(3)]
        },
        {
          name: 'email',
          label: 'Correo electrónico',
          type: 'email',
          icon: 'email',
          validators: [Validators.required, Validators.email]
        },
        {
          name: 'phone',
          label: 'Teléfono',
          type: 'text',
          icon: 'phone',
          validators: [Validators.required]
        },
        {
          name: 'specialty',
          label: 'Especialidad',
          type: 'text',
          icon: 'local_hospital',
          validators: [Validators.required]
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleCreateDoctor(result);
      }
    });
  }

  openEditModal(doctor: doctorsModel): void {
    const modalData: ModalData = {
      title: 'Editar Doctor',
      confirmButtonText: 'Guardar Cambios',
      fields: [
        {
          name: 'name',
          label: 'Nombre',
          icon: 'person',
          initialValue: doctor.name,
          validators: [Validators.required, Validators.minLength(3)]
        },
        {
          name: 'email',
          label: 'Correo electrónico',
          type: 'email',
          icon: 'email',
          initialValue: doctor.email,
          validators: [Validators.required, Validators.email]
        },
        {
          name: 'phone',
          label: 'Teléfono',
          type: 'text',
          icon: 'phone',
          initialValue: doctor.phone,
          validators: [Validators.required]
        },
        {
          name: 'specialty',
          label: 'Especialidad',
          type: 'text',
          icon: 'local_hospital',
          initialValue: doctor.specialty,
          validators: [Validators.required]
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleUpdateDoctor({
          ...doctor,
          ...result
        });
      }
    });
  }

  async handleCreateDoctor(formData: any): Promise<void> {
    this.loaderService.show('Creando doctor...');

    const newDoctor: DoctorPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialty: formData.specialty,
    };

    try {
      const result = await createDoctor(newDoctor);
      if (result instanceof Error) {
        this.alert.showError(result.message);
        return;
      }

      this.doctors.update(current => [...current, result]);
      this.updateTableData(this.doctors());
      this.alert.showSuccess('Doctor creado exitosamente!');
    } catch (error) {
      console.error('Error creating doctor:', error);
      this.alert.showError('Error al crear el doctor');
    } finally {
      this.loaderService.hide();
    }
  }

  async handleUpdateDoctor(doctor: doctorsModel): Promise<void> {
    this.loaderService.show('Actualizando doctor...');

    const updatedDoctor: DoctorPayload = {
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialty: doctor.specialty,
    };

    try {
      const result = await updateDoctor(doctor.id_doctor, updatedDoctor);
      if (result instanceof Error) {
        this.alert.showError(result.message);
        return;
      }

      this.doctors.update(current =>
        current.map(d => d.id_doctor === doctor.id_doctor ? result : d)
      );
      this.updateTableData(this.doctors());
      this.alert.showSuccess('Doctor actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating doctor:', error);
      this.alert.showError('Error al actualizar el doctor');
    } finally {
      this.loaderService.hide();
    }
  }
    onEdit(row: TableRow) {
    this.openEditModal(row.rawData);
  }
}