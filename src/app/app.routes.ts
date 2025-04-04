import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from '../app/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'books',
    loadComponent: () => import('./components/books/book-list/book-list.component').then(m => m.BookListComponent)
  },
  {
    path: 'books/:id',
    loadComponent: () => import('./components/books/book-detail/book-detail.component').then(m => m.BookDetailComponent)
  },
  {
    path: 'admin/books',
    loadComponent: () => import('./components/admin/book-management/book-management.component').then(m => m.BookManagementComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Librarian'] }
  },
  {
    path: 'admin/loans',
    loadComponent: () => import('./components/admin/loan-management/loan-management.component').then(m => m.LoanManagementComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Librarian'] }
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
