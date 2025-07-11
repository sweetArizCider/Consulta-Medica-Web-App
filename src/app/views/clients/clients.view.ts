import { NavBar } from '@components/navBar/navBar';
import { Component, OnInit, inject, signal } from '@angular/core';
import { getClients, updateClient, createClient } from '@services/clients/clients.service';
import { LoaderComponent } from '@components/loader/loader';
import clientsModel from '@sequelizeModels/Clients.model';
import { LoaderService } from '@services/loader/loader.service';
import { Alert } from '@components/alert/alert';
import { ButtonComponent } from '@layouts/button/button.component';
import { TableComponent, TableColumn, TableRow } from '@components/table/table';
import { ClientPayload } from '@expressModels/clients/clients';
import { ModalService } from '@components/modal/modal.service';
import { ModalData } from '@components/modal/modal.model';
import { Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients.view.html',
  styleUrls: ['./clients.view.scss'],
  imports: [
    NavBar,
    LoaderComponent,
    ButtonComponent,
    TableComponent,
  ],
  standalone: true
})
export class ClientsView implements OnInit {
  private loaderService = inject(LoaderService);
  private modalService = inject(ModalService);

  constructor(private alert: Alert) {}

  clients = signal<clientsModel[]>([]);

  // Definición de columnas para la tabla
  columns: TableColumn[] = [
    { key: 'espacio', header: '', width: '6dvw', sortable: false, showTriangle: false },
    { key: 'name', header: 'Nombre', width: '13dvw', sortable: true, showTriangle: true },
    { key: 'email', header: 'Correo', width: '19dvw', sortable: true, showTriangle: true },
    { key: 'phone', header: 'Teléfono', width: '14dvw', sortable: true, showTriangle: true },
    { key: 'address', header: 'Dirección', width: '20dvw', sortable: true, showTriangle: true },
    { key: 'is_active', header: 'Activo', width: '10dvw', sortable: true, showTriangle: true }
  ];

  // Datos transformados para la tabla
  tableData = signal<TableRow[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadClients();
  }

  async loadClients(): Promise<void> {
    this.loaderService.show('Cargando Clientes...');
    try {
      const clientsData = await getClients();
      if (clientsData instanceof Error) {
        this.alert.showError(clientsData.message);
        console.error('Error fetching clients:', clientsData.message);
        return;
      }

      this.clients.set(clientsData);
      this.updateTableData(clientsData);
      this.alert.showSuccess('Clientes cargados exitosamente!');
    } catch (error) {
      console.error('Error fetching clients:', error);
      this.alert.showError('Error al cargar los clientes');
    } finally {
      this.loaderService.hide();
    }
  }

  updateTableData(clientsData: clientsModel[]): void {
    const transformedData = clientsData.map(client => ({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      is_active: client.is_active ? 'Sí' : 'No',
      rawData: client
    }));
    this.tableData.set(transformedData);
  }

  openCreateModal(): void {
    const modalData: ModalData = {
      title: 'Añadir cliente',
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
          name: 'address',
          label: 'Dirección',
          type: 'text',
          icon: 'home',
          validators: [Validators.required]
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleCreateClient(result);
      }
    });
  }

  openEditModal(client: clientsModel): void {
    const modalData: ModalData = {
      title: 'Editar Cliente',
      confirmButtonText: 'Guardar Cambios',
      fields: [
        {
          name: 'name',
          label: 'Nombre',
          icon: 'person',
          initialValue: client.name,
          validators: [Validators.required, Validators.minLength(3)]
        },
        {
          name: 'email',
          label: 'Correo electrónico',
          type: 'email',
          icon: 'email',
          initialValue: client.email,
          validators: [Validators.required, Validators.email]
        },
        {
          name: 'phone',
          label: 'Teléfono',
          type: 'text',
          icon: 'phone',
          initialValue: client.phone,
          validators: [Validators.required]
        },
        {
          name: 'address',
          label: 'Dirección',
          type: 'text',
          icon: 'home',
          initialValue: client.address,
          validators: [Validators.required]
        }
      ]
    };

    const dialogRef = this.modalService.open(modalData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleUpdateClient({
          ...client,
          ...result
        });
      }
    });
  }

  async handleCreateClient(formData: any): Promise<void> {
    this.loaderService.show('Creando cliente...');

    const newClient: ClientPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    };

    try {
      const result = await createClient(newClient);
      if (result instanceof Error) {
        this.alert.showError(result.message);
        return;
      }

      this.clients.update(current => [...current, result]);
      this.updateTableData(this.clients());
      this.alert.showSuccess('Cliente creado exitosamente!');
    } catch (error) {
      console.error('Error creating client:', error);
      this.alert.showError('Error al crear el cliente');
    } finally {
      this.loaderService.hide();
    }
  }

  async handleUpdateClient(client: clientsModel): Promise<void> {
    this.loaderService.show('Actualizando cliente...');

    const updatedClient: ClientPayload = {
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    };

    try {
      const result = await updateClient(client.id_client, updatedClient);
      if (result instanceof Error) {
        this.alert.showError(result.message);
        return;
      }

      this.clients.update(current =>
        current.map(c => c.id_client === client.id_client ? result : c)
      );
      this.updateTableData(this.clients());
      this.alert.showSuccess('Cliente actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating client:', error);
      this.alert.showError('Error al actualizar el cliente');
    } finally {
      this.loaderService.hide();
    }
  }

  onEdit(row: TableRow) {
    this.openEditModal(row.rawData);
  }
}
