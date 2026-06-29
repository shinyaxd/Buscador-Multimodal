import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchMode: 'text' | 'image' = 'text'; 
  // Variable para guardar el modelo seleccionado por defecto VIT-L-14
  selectedModel: string = 'VIT-L-14'; 
  
  textQuery: string = '';
  selectedFile: File | null = null;
  results: string[] = [];

  // Inyectamos el cliente HTTP para hacer peticiones
  private http = inject(HttpClient);
  // La URL donde está corriendo la FastAPI
  private apiUrl = 'http://127.0.0.1:8000';

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  clearSelection(fileInput: HTMLInputElement) {
    this.selectedFile = null;
    this.results = []; 
    fileInput.value = ''; 
  }

  onModeChange() {
    this.results = [];         // Limpia las imágenes de la pantalla
    this.textQuery = '';       // Limpia el texto escrito
    this.selectedFile = null;  // Quita la imagen subida 
  }
  
  onSearch() {
    if (this.searchMode === 'text' && !this.textQuery) return;
    if (this.searchMode === 'image' && !this.selectedFile) return;

    const formData = new FormData();
    
    formData.append('modelo', this.selectedModel); 

    if (this.searchMode === 'text') {
      formData.append('query', this.textQuery);
      
      this.http.post<any>(`${this.apiUrl}/search/text`, formData).subscribe({
        next: (response) => {
          this.results = response.results;
        },
        error: (err) => console.error('Error en la búsqueda por texto:', err)
      });

    } else if (this.searchMode === 'image' && this.selectedFile) {
      formData.append('file', this.selectedFile);
      
      this.http.post<any>(`${this.apiUrl}/search/image`, formData).subscribe({
        next: (response) => {
          this.results = response.results;
        },
        error: (err) => console.error('Error en la búsqueda por imagen:', err)
      });
    }
  }
}