import { NavBar } from '@components/navBar/navBar';
import { Component, OnInit, inject, signal } from '@angular/core';
import { getMedicinesRequired, updateMedicineRequired, createMedicineRequired } from '@services/medicinesRequired/medicinesRequired.service';
import { LoaderComponent } from '@components/loader/loader';
import { LoaderService } from '@services/loader/loader.service';
import { Alert } from '@components/alert/alert';
import { ButtonComponent } from '@layouts/button/button.component';
import { TableComponent, TableColumn, TableRow } from '@components/table/table';
import { MedicineRequiredPayload } from '@expressModels/medicinesRequired/medicinesRequired';
import { ModalService } from '@components/modal/modal.service';
import { ModalData } from '@components/modal/modal.model';
import { Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { getMedicines } from '@services/medicines/medicines.service';
import { getDiagnostics } from '@services/diagnostics/diagnostics.service';

@Component({
  selector: 'app-medicines-required-view',
  templateUrl: './medicinesRequired.view.html',
  styleUrls: ['./medicinesRequired.view.scss'],
  imports: [
    NavBar,
    LoaderComponent,
    ButtonComponent,
    TableComponent,
  ],
  standalone: true
})
export class MedicinesRequiredView implements OnInit {
  private loaderService = inject(LoaderService);
  private modalService = inject(ModalService);

  constructor(private alert: Alert) { }

  medicinesRequired = signal<any[]>([]);
  medicines = signal<any[]>([]);
  diagnostics = signal<any[]>([]);

  columns: TableColumn[] = [
    { key: 'espacio', header: '', width: '1dvw', sortable: false, showTriangle: false },
    { key: 'diagnostic_id', header: 'ID Diagnóstico', width: '10dvw', sortable: true, showTriangle: true },
    { key: 'client_name', header: 'Cliente', width: '12dvw', sortable: true, showTriangle: true },
    { key: 'doctor_name', header: 'Doctor', width: '12dvw', sortable: true, showTriangle: true },
    { key: 'medicine_name', header: 'Medicina', width: '12dvw', sortable: true, showTriangle: true },
    { key: 'dosage', header: 'Dosificación', width: '10dvw', sortable: true, showTriangle: true },
    { key: 'frequency', header: 'Frecuencia', width: '12dvw', sortable: true, showTriangle: true },
    { key: 'duration', header: 'Duración', width: '12dvw', sortable: true, showTriangle: true }
  ];

  tableData = signal<TableRow[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadMedicines();
    await this.loadDiagnostics();
    await this.loadMedicinesRequired();
  }

  async loadMedicines(): Promise<void> {
    const medicinesData = await getMedicines();
    if (!(medicinesData instanceof Error)) {
      this.medicines.set(medicinesData);
    }
  }

  async loadDiagnostics(): Promise<void> {
    const diagnosticsData = await getDiagnostics();
    if (!(diagnosticsData instanceof Error)) {
      this.diagnostics.set(diagnosticsData);
    }
  }

  async loadMedicinesRequired(): Promise<void> {
    this.loaderService.show('Cargando Medicinas Requeridas...');
    try {
      const medicinesRequiredData = await getMedicinesRequired();
      const diagnosticsData = await getDiagnostics();

      if (medicinesRequiredData instanceof Error) {
        this.alert.showError('Error al cargar las medicinas requeridas');
        return;
      }

      if (diagnosticsData instanceof Error) {
        this.alert.showError('Error al cargar los diagnósticos');
        return;
      }

      const medicinesRequiredWithDetails =
        medicinesRequiredData.map((item: any) => {
          const diagnosticData = diagnosticsData.find(d => d.diagnostic?.id_diagnostic === item.medicineRequired.diagnostic_id);
          return {
            ...item,
            diagnostic: diagnosticData?.diagnostic || {},
            client: diagnosticData?.client || item.client || {},
            doctor: diagnosticData?.doctor || item.doctor || {},
            medicine: item.medicine || {}
          };
        });

      this.medicinesRequired.set(medicinesRequiredWithDetails);
      this.updateTableData(medicinesRequiredWithDetails);
      this.alert.showSuccess('Medicinas requeridas cargadas exitosamente!');
    } catch (error) {
      console.error('Error fetching medicines required:', error);
      this.alert.showError('Error al cargar las medicinas requeridas');
    } finally {
      this.loaderService.hide();
    }
  }
  updateTableData(medicinesRequiredWithDetails: any[]): void {
    const transformedData = medicinesRequiredWithDetails.map(item => ({
      diagnostic_id: item.medicineRequired?.diagnostic_id?.toString() || 'Sin ID',
      client_name: item.client?.name || 'Sin cliente',
      doctor_name: item.doctor?.name || 'Sin doctor',
      medicine_name: item.medicine?.name || 'Sin medicina',
      dosage: item.medicineRequired?.dosage || 'Sin dosificación',
      frequency: item.medicineRequired?.frequency || 'Sin frecuencia',
      duration: item.medicineRequired?.duration || 'Sin duración',
      rawData: item
    }));
    this.tableData.set(transformedData);
  }

  openCreateModal(): void {
    const modalData: ModalData = {
      title: 'Añadir medicina requerida',
      confirmButtonText: 'Guardar',
      fields: [
        {
          name: 'diagnostic_id',
          label: 'Diagnóstico',
          type: 'select',
          icon: 'assignment',
          options: this.diagnostics().map(d => ({
            label: `ID: ${d.diagnostic?.id_diagnostic || 'N/A'} - ${d.client?.name || 'Sin cliente'} - Dr. ${d.doctor?.name || 'Sin doctor'}`,
            value: d.diagnostic?.id_diagnostic || 0
          })),
          initialValue: '',
          validators: [Validators.required, Validators.min(1)]
        },
        {
          name: 'medicine_id',
          label: 'Medicina',
          type: 'select',
          icon: 'medication',
          options: this.medicines().map(m => ({ label: m.name, value: m.id_medicine })),
          initialValue: '',
          validators: [Validators.required]
        },
        {
          name: 'dosage',
          label: 'Dosificación',
          type: 'text',
          icon: 'science',
          validators: []
        },
        {
          name: 'frequency',
          label: 'Frecuencia',
          type: 'text',
          icon: 'schedule',
          validators: []
        },
        {
          name: 'duration',
          label: 'Duración',
          type: 'text',
          icon: 'timer',
          validators: []
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleCreateMedicineRequired(result);
      }
    });
  }

  openEditModal(medicineRequiredItem: any): void {
    const medicineRequired = medicineRequiredItem.medicineRequired;
    const modalData: ModalData = {
      title: 'Editar Medicina Requerida',
      confirmButtonText: 'Guardar Cambios',
      fields: [
        {
          name: 'diagnostic_id',
          label: 'ID Diagnóstico',
          type: 'number',
          icon: 'assignment',
          initialValue: medicineRequired.diagnostic_id.toString(),
          validators: [Validators.required, Validators.min(1)]
        },
        {
          name: 'medicine_id',
          label: 'Medicina',
          type: 'select',
          icon: 'medication',
          options: this.medicines().map(m => ({ label: m.name, value: m.id_medicine })),
          initialValue: medicineRequired.medicine_id.toString(),
          validators: [Validators.required]
        },
        {
          name: 'dosage',
          label: 'Dosificación',
          type: 'text',
          icon: 'science',
          initialValue: medicineRequired.dosage || '',
          validators: []
        },
        {
          name: 'frequency',
          label: 'Frecuencia',
          type: 'text',
          icon: 'schedule',
          initialValue: medicineRequired.frequency || '',
          validators: []
        },
        {
          name: 'duration',
          label: 'Duración',
          type: 'text',
          icon: 'timer',
          initialValue: medicineRequired.duration || '',
          validators: []
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleUpdateMedicineRequired(medicineRequired.id_medicine_required, result);
      }
    });
  }

  async handleCreateMedicineRequired(formData: any): Promise<void> {
    this.loaderService.show('Creando medicina requerida...');

    const newMedicineRequired: MedicineRequiredPayload = {
      diagnostic_id: parseInt(formData.diagnostic_id),
      medicine_id: parseInt(formData.medicine_id),
      dosage: formData.dosage || null,
      frequency: formData.frequency || null,
      duration: formData.duration || null,
    };

    try {
      const result = await createMedicineRequired(newMedicineRequired);
      if (result instanceof Error) {
        this.alert.showError(result.message);
        return;
      }

      await this.loadMedicinesRequired();
      this.alert.showSuccess('Medicina requerida creada exitosamente!');
    } catch (error) {
      console.error('Error creating medicine required:', error);
      this.alert.showError('Error al crear la medicina requerida');
    } finally {
      this.loaderService.hide();
    }
  }

  async handleUpdateMedicineRequired(id: number, formData: any): Promise<void> {
    this.loaderService.show('Actualizando medicina requerida...');

    const updatedMedicineRequired: MedicineRequiredPayload = {
      diagnostic_id: parseInt(formData.diagnostic_id),
      medicine_id: parseInt(formData.medicine_id),
      dosage: formData.dosage || null,
      frequency: formData.frequency || null,
      duration: formData.duration || null,
    };

    try {
      const result = await updateMedicineRequired(id, updatedMedicineRequired);
      if (result instanceof Error) {
        this.alert.showError(result.message);
        return;
      }

      await this.loadMedicinesRequired();
      this.alert.showSuccess('Medicina requerida actualizada exitosamente!');
    } catch (error) {
      console.error('Error updating medicine required:', error);
      this.alert.showError('Error al actualizar la medicina requerida');
    } finally {
      this.loaderService.hide();
    }
  }

  onEdit(row: TableRow) {
    this.openEditModal(row.rawData);
  }
}