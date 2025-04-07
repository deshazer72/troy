import { Book } from './book.model';
import { User } from './user.model';

export interface BookLoan {
  id: number;
  bookId: number;
  book: Book;
  userId: string;
  user?: User;
  checkoutDate: string;
  dueDate: Date;
  returnDate?: string;
  isReturned: boolean;
  userName: string;
  userEmail: string;
}

export interface BookLoanDto {
  id: number;
  bookTitle: string;
  checkoutDate: string; // Use `string` for dates returned from the API
  dueDate: string;
  isReturned: boolean;
  userName: string;
  userEmail: string;
  returnDate?: string; // Use `string` for dates returned from the API
}
