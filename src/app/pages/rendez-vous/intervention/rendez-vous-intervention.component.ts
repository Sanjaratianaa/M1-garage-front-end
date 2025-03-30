import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

// Define the interface for your intervention data
export interface Intervention {
  id: number;
  title: string;
  description: string;
  assignee: {
    name: string;
    imageUrl: string;
  };
  status: string;
  date: Date;
}

@Component({
  selector: 'app-intervention-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './rendez-vous-intervention.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
//   styleUrls: ['./rendez-vous-intervention.component.scss']
})
export class RendezVousInterventionComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'assignee', 'status', 'date', 'action'];

  // Sample Data
  interventionsData: Intervention[] = [
    {
      id: 1,
      title: 'Sed ut perspiciatis unde omnis iste',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Alice', imageUrl: '/assets/images/profile/user-1.jpg' },
      status: 'inprogress',
      date: new Date('2024-05-01')
    },
    {
      id: 2,
      title: 'Xtreme theme dropdown issue',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Jonathan', imageUrl: '/assets/images/profile/user-2.jpg' },
      status: 'open',
      date: new Date('2024-05-03')
    },
    {
      id: 3,
      title: 'Header issue in material admin',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Smith', imageUrl: '/assets/images/profile/user-3.jpg' },
      status: 'closed',
      date: new Date('2024-05-02')
    },
    {
      id: 4,
      title: 'Sidebar issue in Nice admin',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Vincent', imageUrl: '/assets/images/profile/user-4.jpg' },
      status: 'inprogress',
      date: new Date('2024-05-06')
    },
    {
      id: 5,
      title: 'Elegant Theme Side Menu show OnClick',
      description: 'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      assignee: { name: 'Chris', imageUrl: '/assets/images/profile/user-5.jpg' },
      status: 'open',
      date: new Date('2024-05-04')
    }
  ];
  dataSource = new MatTableDataSource<Intervention>(this.interventionsData);

  totalInterventions = this.interventionsData.length;
  interventionsInProgress = this.interventionsData.filter(t => t.status === 'inprogress').length;
  interventionsOpen = this.interventionsData.filter(t => t.status === 'open').length;
  interventionsClosed = this.interventionsData.filter(t => t.status === 'closed').length;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'inprogress': return 'bg-light-warning';
      case 'open': return 'bg-light-success';
      case 'closed': return 'bg-light-error';
      default: return 'bg-light';
    }
  }
}