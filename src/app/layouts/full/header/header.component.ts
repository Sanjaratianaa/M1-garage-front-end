import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    MatBadgeModule
  ],
  templateUrl: './header.component.html',
  // styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  isLoggedIn = false;
  userName: string | null = null;

  constructor(
    private authService: AuthentificationService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.userName = user.username;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload(); 
  }
}