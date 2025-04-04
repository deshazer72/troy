import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../environments/environment.development';

interface ReviewDto {
  bookId: number;
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/api/reviews`;

  constructor(private http: HttpClient) { }

  getBookReviews(bookId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/book/${bookId}`);
  }

  createReview(bookId: number, rating: number, comment: string): Observable<Review> {
    const reviewDto: ReviewDto = { bookId, rating, comment };
    return this.http.post<Review>(this.apiUrl, reviewDto);
  }

  updateReview(reviewId: number, rating: number, comment: string): Observable<void> {
    const reviewDto: ReviewDto = { bookId: 0, rating, comment }; // bookId not needed for update
    return this.http.put<void>(`${this.apiUrl}/${reviewId}`, reviewDto);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
  }
}
