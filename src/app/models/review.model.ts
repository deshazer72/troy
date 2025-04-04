import { User } from './user.model';

export interface Review {
  id: number;
  bookId: number;
  userId: string;
  user?: User;
  rating: number;
  comment: string;
  createdAt: string; // Store as string and convert as needed
}
