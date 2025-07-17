import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  /**
   * Converts a file to base64 string
   * @param file The file to convert
   * @returns Promise that resolves to base64 string
   */
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  /**
   * Uploads a file to the server
   * @param file The file to upload
   * @returns Observable with the upload response
   */
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    
    return this.http.post(`${environment.apiUrl}/api/upload`, formData);
  }

  /**
   * Uploads multiple files to the server
   * @param files Array of files to upload
   * @returns Observable with the upload response
   */
  uploadMultipleFiles(files: File[]): Observable<any> {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }
    
    return this.http.post(`${environment.apiUrl}/api/upload/multiple`, formData);
  }

  /**
   * Validates file size and type
   * @param file The file to validate
   * @param maxSizeInMB Maximum file size in MB
   * @param allowedTypes Array of allowed MIME types
   * @returns Boolean indicating if file is valid
   */
  validateFile(file: File, maxSizeInMB: number = 5, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']): boolean {
    const fileSizeInMB = file.size / (1024 * 1024);
    const fileType = file.type;
    
    if (fileSizeInMB > maxSizeInMB) {
      console.error(`File size exceeds ${maxSizeInMB}MB limit`);
      return false;
    }
    
    if (!allowedTypes.includes(fileType)) {
      console.error(`File type ${fileType} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      return false;
    }
    
    return true;
  }
}
