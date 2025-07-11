import {AfterViewInit, Component, ViewChild, Input, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {CommonModule} from '@angular/common';

export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'number' | 'date';
  width?: string | number;
  sortable?: boolean;
  showTriangle?: boolean; 
}

export interface TableRow {
  [key: string]: any;
  rawData?: any; 

}

@Component({
  selector: 'table-selector',
  styleUrl: 'table.scss',
  templateUrl: 'table.html',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    CommonModule
  ],
})
export class TableComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() rows: TableRow[] = [];
  @Input() showActions: boolean = true;
  @Input() rowHeight?: string | number;
  @Input() headerHeight?: string | number;

  @Output() editRow = new EventEmitter<TableRow>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<TableRow>([]);
  displayedColumns: string[] = [];

  ngOnInit() {
    this.updateTable();
  }

  ngOnChanges() {
    this.updateTable();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private updateTable() {
    this.dataSource.data = this.rows;
    this.displayedColumns = this.columns.map(col => col.key);
    if (this.showActions) {
      this.displayedColumns.push('actions');
    }
  }

  getColumnWidth(column: TableColumn): string {
    if (column.width) {
      return typeof column.width === 'number' ? `${column.width}px` : column.width;
    }
    return 'auto';
  }

  getRowHeight(): string {
    if (this.rowHeight) {
      return typeof this.rowHeight === 'number' ? `${this.rowHeight}px` : this.rowHeight;
    }
    return 'auto';
  }

  getHeaderHeight(): string {
    if (this.headerHeight) {
      return typeof this.headerHeight === 'number' ? `${this.headerHeight}px` : this.headerHeight;
    }
    return 'auto';
  }

  onEdit(row: TableRow) {
    this.editRow.emit(row);
  }


}
