import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Search and filter options
  searchTerm: string = '';
  sortBy: string = 'title';
  availableOnly: boolean = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks(this.searchTerm, this.sortBy, this.availableOnly).subscribe({
      next: (books) => {
        this.books = books;
        this.filteredBooks = [...books];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load books. Please try again later.';
        this.loading = false;
        console.error('Error loading books:', err);
      }
    });
  }

  applyFilters(): void {
    this.loadBooks();
  }
}
