import { Component } from '@angular/core';
import { TableComponent, TableColumn, TableRow } from './table';

@Component({
  selector: 'app-table-test',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 20px;">
      <h2>Tabla de Doctores</h2>
      
      <table-selector 
        [columns]="columns" 
        [rows]="data"
        [showActions]="true"
        (editRow)="onEdit($event)"
        >
      </table-selector>
    </div>
  `
})
export class TableTestComponent {
  // Definir columnas como en la imagen
columns: TableColumn[] = [
  { key: 'espacio', header: '', width: '2rem', sortable: false, showTriangle: false },
  { key: 'nombre', header: 'Nombre', width: 250, sortable: true, showTriangle: true },
  { key: 'correo', header: 'Correo', width: 300, sortable: true, showTriangle: true },
  { key: 'telefono', header: 'Teléfono', width: 200, sortable: true, showTriangle: true },
  { key: 'especialidad', header: 'Especialidad', width: 200, sortable: true, showTriangle: true }
];

  // Datos de doctores como en la imagen
  data: TableRow[] = [
    { 

      nombre: 'Pamela Robledo Pinto', 
      correo: 'pamelarobledo@gmail.com', 
      telefono: '+52 871 571 0287', 
      especialidad: 'Cardiología' 
    },
    { 
      nombre: 'Pamela Robledo Pinto', 
      correo: 'pamelarobledo@gmail.com', 
      telefono: '+52 871 571 0287', 
      especialidad: 'Cardiología' 
    },
    { 
      nombre: 'Pamela Robledo Pinto', 
      correo: 'pamelarobledo@gmail.com', 
      telefono: '+52 871 571 0287', 
      especialidad: 'Cardiología' 
    },
    { 
      nombre: 'Pamela Robledo Pinto', 
      correo: 'pamelarobledo@gmail.com', 
      telefono: '+52 871 571 0287', 
      especialidad: 'Cardiología' 
    },
    { 
      nombre: 'Pamela Robledo Pinto', 
      correo: 'pamelarobledo@gmail.com', 
      telefono: '+52 871 571 0287', 
      especialidad: 'Cardiología' 
    },
    { 
      nombre: 'Pamela Robledo Pinto', 
      correo: 'pamelarobledo@gmail.com', 
      telefono: '+52 871 571 0287', 
      especialidad: 'Cardiología' 
    },
    { 
      nombre: 'Pamela Robledo Pinto', 
      correo: 'pamelarobledo@gmail.com', 
      telefono: '+52 871 571 0287', 
      especialidad: 'Cardiología' 
    }
  ];

  onEdit(row: TableRow) {
    console.log('Editando doctor:', row);
  }

}