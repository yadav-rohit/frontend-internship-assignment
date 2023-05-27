import { Component, OnInit } from '@angular/core';
import { FormControl ,FormsModule } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  bookSearch: FormControl;
  entriesPerPage: FormControl;
  books: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  constructor(private http: HttpClient) {
    this.bookSearch = new FormControl('');
    this.entriesPerPage = new FormControl(this.itemsPerPage);
  }
  isLoading = false;

  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];
  ngOnInit(): void {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
      ).
      subscribe((value: string) => {
        if (value.trim() !== '') {
          this.searchBooks(value);
        } else {
          this.books = []; // Clear search results if search value is empty
        }
        
      });
     
  }

  clearSearch(): void {
    this.bookSearch.setValue(''); // Clear the search input value
  }

  searchBooks(searchTerm: string): void {
    const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`;
    this.isLoading = true; 
    {{searchTerm?
      this.http.get(apiUrl).subscribe(
        (response: any) => {
          this.books = response.docs;
          this.isLoading = false;
        },
        (error: any) => {
          console.log('An error occurred:', error);
          this.books = []; // Clear search results on error
          this.isLoading = false;
        }
      )
    :this.books = [];}}
    
  }
 
  onEntriesPerPageChange(value: string): void {
    this.itemsPerPage = parseInt(value, 10);
    this.currentPage = 1;
    this.getPaginatedBooks();
     // Log the input value when it changes
  }


  getPaginatedBooks(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.books.slice(startIndex, endIndex);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  getTotalPages(): number {
    return Math.ceil(this.books.length / this.itemsPerPage);
  }

  getPaginationRange(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages)
      .fill(0)
      .map((_, index) => index + 1);
  }

}
