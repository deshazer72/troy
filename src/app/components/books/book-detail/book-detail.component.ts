import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { LoanService } from '../../../services/loan.service';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';
import { Book } from '../../../models/book.model';
import { Review } from '../../../models/review.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-detail.component.html'
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading: boolean = true;
  error: string | null = null;
  checkoutMessage: string | null = null;
  isCheckingOut: boolean = false;

  // Review form
  newReview = {
    rating: 5,
    comment: ''
  };
  isSubmittingReview: boolean = false;
  reviewError: string | null = null;
  reviewSuccess: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private loanService: LoanService,
    private reviewService: ReviewService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadBook(id);
      } else {
        this.error = 'Invalid book ID';
        this.loading = false;
      }
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.book = book;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load book details';
        this.loading = false;
        console.error('Error loading book:', err);
      }
    });
  }

  checkoutBook(): void {
    if (!this.book) return;

    this.isCheckingOut = true;
    this.checkoutMessage = null;

    this.loanService.checkoutBook(this.book.id).subscribe({
      next: () => {
        this.book!.isAvailable = false;
        this.checkoutMessage = 'Book checked out successfully! Due in 5 days.';
        this.isCheckingOut = false;
      },
      error: (err) => {
        this.checkoutMessage = err.error?.message || 'Failed to checkout book. Please try again.';
        this.isCheckingOut = false;
        console.error('Error checking out book:', err);
      }
    });
  }

  submitReview(): void {
    if (!this.book) return;
    if (!this.newReview.comment.trim()) {
      this.reviewError = 'Please enter a comment';
      return;
    }

    this.isSubmittingReview = true;
    this.reviewError = null;
    this.reviewSuccess = null;

    this.reviewService.createReview(
      this.book.id,
      this.newReview.rating,
      this.newReview.comment
    ).subscribe({
      next: (review) => {
        if (!this.book!.reviews) {
          this.book!.reviews = [];
        }
        this.book!.reviews.unshift(review);
        this.newReview = { rating: 5, comment: '' };
        this.reviewSuccess = 'Review submitted successfully!';
        this.isSubmittingReview = false;
      },
      error: (err) => {
        this.reviewError = err.error?.message || 'Failed to submit review. Please try again.';
        this.isSubmittingReview = false;
        console.error('Error submitting review:', err);
      }
    });
  }

  deleteReview(reviewId: number): void {
    if (!this.book) return;

    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.book!.reviews = this.book!.reviews.filter(r => r.id !== reviewId);
      },
      error: (err) => {
        console.error('Error deleting review:', err);
      }
    });
  }

  canDeleteReview(review: Review): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    return this.authService.isLibrarian() || (review.user?.id !== undefined && review.user.id === currentUser.id);
  }
}
