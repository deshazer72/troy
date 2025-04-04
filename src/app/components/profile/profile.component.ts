import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { BookLoanDto } from '../../models/book-loan.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  loans: BookLoanDto[] = [];
  loading = false;
  error: string | null = null;
  currentUser: User | null = null;

  constructor(
    private loanService: LoanService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadMyLoans();
  }

  getRoles(): string[] {
    return this.authService.getCurrentUser()?.roles || [];
  }

  loadMyLoans(): void {
    debugger;
    this.loading = true;
    this.error = null;

    this.loanService.getMyLoans().subscribe({
      next: (loans) => {
        this.loans = loans.map(loan => ({
          ...loan,
          dueDate: new Date(loan.dueDate).toISOString(),
          checkoutDate: new Date(loan.checkoutDate).toISOString()
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your loans. Please try again.';
        this.loading = false;
        console.error('Error loading loans:', err);
      }
    });
  }

  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  }

  getDaysOverdue(dueDate: Date): number {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysRemaining(dueDate: Date): number {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

}
