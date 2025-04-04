import { Book } from './book.model';
import { User } from './user.model';

export interface BookLoan {
  id: number;
  bookId: number;
  book: Book;
  userId: string;
  user?: User;
  checkoutDate: string;
  dueDate: string;
  returnDate?: string;
  isReturned: boolean;
}
