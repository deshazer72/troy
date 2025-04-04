import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-management.component.html',
  styleUrls: ['./book-management.component.scss']
})
export class BookManagementComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  error: string | null = null;

  // Book form
  bookForm: FormGroup;
  isEditing = false;
  currentBookId: number | null = null;
  formSubmitting = false;
  formSuccess: string | null = null;
  formError: string | null = null;

  // Delete confirmation
  showDeleteConfirmation = false;
  bookToDelete: Book | null = null;

  // Search and filter
  searchTerm = '';

  constructor(
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      author: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(2000)]],
      coverImageUrl: ['', [Validators.required]],
      publisher: ['', [Validators.required, Validators.maxLength(100)]],
      publicationDate: ['', [Validators.required]],
      category: ['', [Validators.required, Validators.maxLength(50)]],
      isbn: ['', [Validators.required, Validators.maxLength(13)]],
      pageCount: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks(this.searchTerm).subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load books.';
        this.loading = false;
        console.error('Error loading books:', err);
      }
    });
  }

  searchBooks(): void {
    this.loadBooks();
  }

  resetForm(): void {
    this.bookForm.reset();
    this.isEditing = false;
    this.currentBookId = null;
    this.formError = null;
    this.formSuccess = null;
  }

  editBook(book: Book): void {
    this.currentBookId = book.id;
    this.isEditing = true;

    this.bookForm.patchValue({
      title: book.title,
      author: book.author,
      description: book.description,
      coverImageUrl: book.coverImageUrl,
      publisher: book.publisher,
      publicationDate: this.formatDate(book.publicationDate),
      category: book.category,
      isbn: book.isbn,
      pageCount: book.pageCount
    });

    // Scroll to form
    window.scrollTo(0, 0);
  }

  confirmDelete(book: Book): void {
    this.bookToDelete = book;
    this.showDeleteConfirmation = true;
  }

  deleteBook(): void {
    if (!this.bookToDelete) return;

    this.bookService.deleteBook(this.bookToDelete.id).subscribe({
      next: () => {
        this.books = this.books.filter(b => b.id !== this.bookToDelete!.id);
        this.showDeleteConfirmation = false;
        this.bookToDelete = null;
      },
      error: (err) => {
        console.error('Error deleting book:', err);
        this.error = err.error?.message || 'Failed to delete book.';
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.bookToDelete = null;
  }

  onSubmit(): void {
    this.formError = null;
    this.formSuccess = null;

    if (this.bookForm.invalid) {
      this.formError = 'Please fill out all required fields correctly.';
      return;
    }

    const bookData: Partial<Book> = {
      ...this.bookForm.value,
      publicationDate: new Date(this.bookForm.value.publicationDate)
    };

    this.formSubmitting = true;

    if (this.isEditing && this.currentBookId) {
      // Update existing book
      this.bookService.updateBook({
        ...bookData,
        id: this.currentBookId
      } as Book).subscribe({
        next: () => {
          this.formSuccess = 'Book updated successfully!';
          this.formSubmitting = false;
          this.loadBooks();
        },
        error: (err) => {
          this.formError = err.error?.message || 'Failed to update book.';
          this.formSubmitting = false;
          console.error('Error updating book:', err);
        }
      });
    } else {
      // Create new book
      this.bookService.createBook(bookData as Book).subscribe({
        next: (newBook) => {
          this.books.push(newBook);
          this.formSuccess = 'Book created successfully!';
          this.resetForm();
          this.formSubmitting = false;
        },
        error: (err) => {
          this.formError = err.error?.message || 'Failed to create book.';
          this.formSubmitting = false;
          console.error('Error creating book:', err);
        }
      });
    }
  }

  // Format date for input[type=date]
  private formatDate(date: string | Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
