import { NavBar } from '@components/navBar/navBar';
import { Component, OnInit, inject, signal } from '@angular/core';
import { getMedicines, updateMedicine, createMedicine } from '@services/medicines/medicines.service';
import { LoaderComponent } from '@components/loader/loader';
import medicinesModel from '@sequelizeModels/Medicines.model';
import { LoaderService } from '@services/loader/loader.service';
import { Alert } from '@components/alert/alert';
import { ButtonComponent } from '@layouts/button/button.component';
import { TableComponent, TableColumn, TableRow } from '@components/table/table';
import { MedicinePayload } from '@expressModels/medicines/medicines';
import { ModalService } from '@components/modal/modal.service';
import { ModalData } from '@components/modal/modal.model';
import { Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-medicines-view',
  templateUrl: './medicines.view.html',
  styleUrls: ['./medicines.view.scss'],
  imports: [
    NavBar,
    LoaderComponent,
    ButtonComponent,
    TableComponent,
  ],
  standalone: true
})
export class MedicinesView implements OnInit {
  private loaderService = inject(LoaderService);
  private modalService = inject(ModalService);

  constructor(private alert: Alert) {}

  medicines = signal<any[]>([]);

  // Definición de columnas para la tabla
  columns: TableColumn[] = [
    { key: 'espacio', header: '', width: '6dvw', sortable: false, showTriangle: false },
    { key: 'name', header: 'Nombre', width: '20dvw', sortable: true, showTriangle: true },
    { key: 'description', header: 'Descripción', width: '25dvw', sortable: true, showTriangle: true },
    { key: 'price', header: 'Precio', width: '15dvw', sortable: true, showTriangle: true },
    { key: 'is_active', header: 'Activo', width: '10dvw', sortable: true, showTriangle: true }
  ];

  // Datos transformados para la tabla
  tableData = signal<TableRow[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadMedicines();
  }

  async loadMedicines(): Promise<void> {
    this.loaderService.show('Cargando Medicinas...');
    try {
      const medicinesData = await getMedicines();
      if (medicinesData instanceof Error) {
        this.alert.showError(medicinesData.message);
        console.error('Error fetching medicines:', medicinesData.message);
        return;
      }

      this.medicines.set(medicinesData);
      this.updateTableData(medicinesData);
      this.alert.showSuccess('Medicinas cargadas exitosamente!');
    } catch (error) {
      console.error('Error fetching medicines:', error);
      this.alert.showError('Error al cargar las medicinas');
    } finally {
      this.loaderService.hide();
    }
  }

  updateTableData(medicinesData: any[]): void {
    const transformedData = medicinesData.map(medicine => ({
      name: medicine.name,
      description: medicine.description || 'Sin descripción',
      price: `$${parseFloat(medicine.price).toFixed(2)}`,
      is_active: medicine.is_active ? 'Sí' : 'No',
      rawData: medicine
    }));
    this.tableData.set(transformedData);
  }

  openCreateModal(): void {
    const modalData: ModalData = {
      title: 'Añadir medicina',
      confirmButtonText: 'Guardar',
      fields: [
        {
          name: 'name',
          label: 'Nombre',
          icon: 'medication',
          initialValue: '',
          validators: [Validators.required, Validators.minLength(3)]
        },
        {
          name: 'description',
          label: 'Descripción',
          type: 'text',
          icon: 'description',
          validators: []
        },
        {
          name: 'price',
          label: 'Precio',
          type: 'number',
          icon: 'attach_money',
          validators: [Validators.required, Validators.min(0)]
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleCreateMedicine(result);
      }
    });
  }

  openEditModal(medicine: any): void {
    const modalData: ModalData = {
      title: 'Editar Medicina',
      confirmButtonText: 'Guardar Cambios',
      fields: [
        {
          name: 'name',
          label: 'Nombre',
          icon: 'medication',
          initialValue: medicine.name,
          validators: [Validators.required, Validators.minLength(3)]
        },
        {
          name: 'description',
          label: 'Descripción',
          type: 'text',
          icon: 'description',
          initialValue: medicine.description || '',
          validators: []
        },
        {
          name: 'price',
          label: 'Precio',
          type: 'number',
          icon: 'attach_money',
          initialValue: medicine.price.toString(),
          validators: [Validators.required, Validators.min(0)]
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleUpdateMedicine(medicine.id_medicine, result);
      }
    });
  }

  async handleCreateMedicine(formData: any): Promise<void> {
    this.loaderService.show('Creando medicina...');

    const newMedicine: MedicinePayload = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
    };

    try {
      const result = await createMedicine(newMedicine);
      if (result instanceof Error) {
        this.alert.showError(result.message);
        return;
      }

      await this.loadMedicines();
      this.alert.showSuccess('Medicina creada exitosamente!');
    } catch (error) {
      console.error('Error creating medicine:', error);
      this.alert.showError('Error al crear la medicina');
    } finally {
      this.loaderService.hide();
    }
  }

  async handleUpdateMedicine(id: number, formData: any): Promise<void> {
    this.loaderService.show('Actualizando medicina...');

    const updatedMedicine: MedicinePayload = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
    };

    try {
      const result = await updateMedicine(id, updatedMedicine);
      if (result instanceof Error) {
        this.alert.showError(result.message);
        return;
      }

      await this.loadMedicines();
      this.alert.showSuccess('Medicina actualizada exitosamente!');
    } catch (error) {
      console.error('Error updating medicine:', error);
      this.alert.showError('Error al actualizar la medicina');
    } finally {
      this.loaderService.hide();
    }
  }
      onEdit(row: TableRow) {
    this.openEditModal(row.rawData);
  }
}