import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { BookLoan } from '../../models/book-loan.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loans: BookLoan[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private loanService: LoanService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMyLoans();
  }

  loadMyLoans(): void {
    this.loading = true;
    this.error = null;

    this.loanService.getMyLoans().subscribe({
      next: (loans) => {
        this.loans = loans;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your loans. Please try again.';
        this.loading = false;
        console.error('Error loading loans:', err);
      }
    });
  }

  isOverdue(dueDate: Date): boolean {
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
