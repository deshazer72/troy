import { Review } from './review.model';

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  coverImageUrl: string;
  publisher: string;
  publicationDate: string; // Store as string and convert as needed
  category: string;
  isbn: string;
  pageCount: number;
  isAvailable: boolean;
  reviews: Review[];
  averageRating: number;
}
