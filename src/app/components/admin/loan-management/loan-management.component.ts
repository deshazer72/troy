import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../../services/loan.service';
import { BookLoan, BookLoanDto } from '../../../models/book-loan.model';

@Component({
  selector: 'app-loan-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-management.component.html'
})
export class LoanManagementComponent implements OnInit {
  loans: BookLoan[] = [];
  loading = false;
  error: string | null = null;
  returnSuccess: string | null = null;
  processingReturnId: number | null = null;

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadAllLoans();
  }

  loadAllLoans(): void {
    this.loading = true;
    this.error = null;

    this.loanService.getAllLoans().subscribe({
      next: (loans) => {
        this.loans = loans;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load loans. Please try again.';
        this.loading = false;
        console.error('Error loading loans:', err);
      }
    });
  }

  returnBook(loanId: number): void {
    this.processingReturnId = loanId;
    this.returnSuccess = null;

    this.loanService.returnBook(loanId).subscribe({
      next: () => {
        // Update the loan in our list to mark it as returned
        const index = this.loans.findIndex(loan => loan.id === loanId);
        if (index !== -1) {
          this.loans[index].returnDate = new Date().toISOString();
          this.loans[index].book.isAvailable = true;
        }
        this.returnSuccess = `Book successfully marked as returned.`;
        this.processingReturnId = null;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to return book. Please try again.';
        this.processingReturnId = null;
        console.error('Error returning book:', err);
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
