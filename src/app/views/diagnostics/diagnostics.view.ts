import { NavBar } from '@components/navBar/navBar';
import { Component, OnInit, inject, signal } from '@angular/core';
import { getDiagnostics, updateDiagnostic, createDiagnostic } from '@services/diagnostics/diagnostics.service';
import { LoaderComponent } from '@components/loader/loader';
import { LoaderService } from '@services/loader/loader.service';
import { Alert } from '@components/alert/alert';
import { ButtonComponent } from '@layouts/button/button.component';
import { TableComponent, TableColumn, TableRow } from '@components/table/table';
import { DiagnosticPayload } from '@expressModels/diagnostics/diagnostics';
import { ModalService } from '@components/modal/modal.service';
import { ModalData } from '@components/modal/modal.model';
import { Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { getClients } from '@services/clients/clients.service';
import { getDoctors } from '@services/doctors/doctors.service';

@Component({
  selector: 'app-diagnostics-view',
  templateUrl: './diagnostics.view.html',
  styleUrls: ['./diagnostics.view.scss'],
  imports: [
    NavBar,
    LoaderComponent,
    ButtonComponent,
    TableComponent,
  ],
  standalone: true
})
export class DiagnosticsView implements OnInit {
  private loaderService = inject(LoaderService);
  private modalService = inject(ModalService);

  constructor(private alert: Alert) {}

  diagnostics = signal<any[]>([]);
  clients = signal<any[]>([]);
  doctors = signal<any[]>([]);

  columns: TableColumn[] = [
    { key: 'espacios', header: '', width: '2dvw', sortable: false, showTriangle: false },
    { key: 'espacio', header: 'ID', width: '5dvw', sortable: false, showTriangle: false },
    { key: 'client_name', header: 'Cliente', width: '17dvw', sortable: true, showTriangle: true },
    { key: 'doctor_name', header: 'Doctor', width: '17dvw', sortable: true, showTriangle: true },
    { key: 'diagnosis_date', header: 'Fecha', width: '14dvw', sortable: true, showTriangle: true },
    { key: 'description', header: 'Descripción', width: '24dvw', sortable: true, showTriangle: true }
  ];

  // Datos transformados para la tabla
  tableData = signal<TableRow[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadClients();
    await this.loadDoctors();
    await this.loadDiagnostics();
  }

  async loadClients(): Promise<void> {
    const clientsData = await getClients();
    if (!(clientsData instanceof Error)) {
      this.clients.set(clientsData);
    }
  }

  async loadDoctors(): Promise<void> {
    const doctorsData = await getDoctors();
    if (!(doctorsData instanceof Error)) {
      this.doctors.set(doctorsData);
    }
  }

  async loadDiagnostics(): Promise<void> {
    this.loaderService.show('Cargando Diagnósticos...');
    try {
      const diagnosticsData = await getDiagnostics();
      if (diagnosticsData instanceof Error) {
        this.alert.showError(diagnosticsData.message);
        console.error('Error fetching diagnostics:', diagnosticsData.message);
        return;
      }

      this.diagnostics.set(diagnosticsData);
      this.updateTableData(diagnosticsData);
      this.alert.showSuccess('Diagnósticos cargados exitosamente!');
    } catch (error) {
      console.error('Error fetching diagnostics:', error);
      this.alert.showError('Error al cargar los diagnósticos');
    } finally {
      this.loaderService.hide();
    }
  }

  updateTableData(diagnosticsData: any[]): void {
    const transformedData = diagnosticsData.map(item => ({
      espacio: item.diagnostic?.id_diagnostic || '',
      client_name: item.client?.name || 'Sin cliente',
      doctor_name: item.doctor?.name || 'Sin doctor',
      diagnosis_date: item.diagnostic?.diagnosis_date ? new Date(item.diagnostic.diagnosis_date).toLocaleDateString() : 'Sin fecha',
      description: item.diagnostic?.description || 'Sin descripción',
      rawData: item
    }));
    this.tableData.set(transformedData);
  }

  openCreateModal(): void {
    const modalData: ModalData = {
      title: 'Añadir diagnóstico',
      confirmButtonText: 'Guardar',
      fields: [
         {
    name: 'client_id',
    label: 'Cliente',
    type: 'select',
    icon: 'person',
    options: this.clients().map(c => ({ label: c.name, value: c.id_client })),
    initialValue: '',
    validators: [Validators.required]
  },
  {
    name: 'doctor_id',
    label: 'Doctor',
    type: 'select',
    icon: 'local_hospital',
    options: this.doctors().map(d => ({ label: d.name, value: d.id_doctor })),
    initialValue:  '',
    validators: [Validators.required]
  },
        {
          name: 'diagnosis_date',
          label: 'Fecha de Diagnóstico',
          type: 'text',
          icon: 'calendar_today',
          validators: [Validators.required]
        },
        {
          name: 'description',
          label: 'Descripción',
          type: 'text',
          icon: 'description',
          validators: []
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleCreateDiagnostic(result);
      }
    });
  }

  openEditModal(diagnosticItem: any): void {
    const diagnostic = diagnosticItem.diagnostic;
    const modalData: ModalData = {
      title: 'Editar Diagnóstico',
      confirmButtonText: 'Guardar Cambios',
      fields: [
        {
          name: 'client_id',
          label: 'ID Cliente',
          type: 'number',
          icon: 'person',
          initialValue: diagnostic.client_id.toString(),
          validators: [Validators.required, Validators.min(1)]
        },
        {
          name: 'doctor_id',
          label: 'ID Doctor',
          type: 'select',
          icon: 'local_hospital',
                  options: this.doctors().map(d => ({ label: d.name, value: d.id_doctor })),
          
          initialValue: diagnostic.doctor_id.toString(),
          validators: [Validators.required, Validators.min(1)]
        },
        {
          name: 'diagnosis_date',
          label: 'Fecha de Diagnóstico',
          type: 'text',
          icon: 'calendar_today',
          initialValue: diagnostic.diagnosis_date ? new Date(diagnostic.diagnosis_date).toISOString().split('T')[0] : '',
          validators: [Validators.required]
        },
        {
          name: 'description',
          label: 'Descripción',
          type: 'text',
          icon: 'description',
          initialValue: diagnostic.description || '',
          validators: []
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleUpdateDiagnostic(diagnostic.id_diagnostic, result);
      }
    });
  }


  async handleCreateDiagnostic(formData: any): Promise<void> {
    this.loaderService.show('Creando diagnóstico...');

    const newDiagnostic: DiagnosticPayload = {
      client_id: parseInt(formData.client_id),
      doctor_id: parseInt(formData.doctor_id),
      diagnosis_date: formData.diagnosis_date,
      description: formData.description || null,
    };

    try {
      const result = await createDiagnostic(newDiagnostic);
      if (result instanceof Error) {
        this.alert.showError(result.message);
        return;
      }

      await this.loadDiagnostics();
      this.alert.showSuccess('Diagnóstico creado exitosamente!');
    } catch (error) {
      console.error('Error creating diagnostic:', error);
      this.alert.showError('Error al crear el diagnóstico');
    } finally {
      this.loaderService.hide();
    }
  }

  async handleUpdateDiagnostic(id: number, formData: any): Promise<void> {
    this.loaderService.show('Actualizando diagnóstico...');

    const updatedDiagnostic: DiagnosticPayload = {
      client_id: parseInt(formData.client_id),
      doctor_id: parseInt(formData.doctor_id),
      diagnosis_date: formData.diagnosis_date,
      description: formData.description || null,
    };

    try {
      const result = await updateDiagnostic(id, updatedDiagnostic);
      if (result instanceof Error) {
        this.alert.showError(result.message);
        return;
      }

      await this.loadDiagnostics();
      this.alert.showSuccess('Diagnóstico actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating diagnostic:', error);
      this.alert.showError('Error al actualizar el diagnóstico');
    } finally {
      this.loaderService.hide();
    }
  }

  onEdit(row: TableRow) {
    this.openEditModal(row.rawData);
  }
}