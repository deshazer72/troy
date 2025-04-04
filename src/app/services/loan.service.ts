import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookLoan } from '../models/book-loan.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/api/bookloans`;

  constructor(private http: HttpClient) { }

  getMyLoans(): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(this.apiUrl);
  }

  getAllLoans(): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(`${this.apiUrl}/all`);
  }

  checkoutBook(bookId: number): Observable<BookLoan> {
    return this.http.post<BookLoan>(`${this.apiUrl}/checkout/${bookId}`, {});
  }

  returnBook(loanId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/return/${loanId}`, {});
  }
}
