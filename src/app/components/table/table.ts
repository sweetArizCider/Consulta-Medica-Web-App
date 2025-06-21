import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { PeriodicElement } from './mockData';
import ELEMENT_DATA  from './table.json';
@Component({
  selector: 'table-selector',
  styleUrl: 'table.css',
  templateUrl: 'table.html',
  imports: [MatTableModule, MatPaginatorModule, ],
})
export class TableComponent implements AfterViewInit {
  
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
