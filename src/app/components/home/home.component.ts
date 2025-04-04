import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredBooks: Book[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadFeaturedBooks();
  }

  loadFeaturedBooks(): void {
    this.loading = true;
    this.bookService.getFeaturedBooks().subscribe({
      next: (books) => {
        this.featuredBooks = books;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load featured books. Please try again later.';
        this.loading = false;
        console.error('Error loading featured books:', err);
      }
    });
  }
}
