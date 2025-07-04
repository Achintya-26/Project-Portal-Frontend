import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../project';
import { Router } from '@angular/router';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import * as pdfjsLib from 'pdfjs-dist';


@Component({
  selector: 'app-add-project',
  imports: [FormsModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatInputModule, MatExpansionModule, MatSelectModule, CommonModule, MatDatepickerModule, MatCheckboxModule, MatIconModule, MatChipsModule],
  templateUrl: './add-project.html',
  styleUrl: './add-project.scss'
})

export class AddProject implements OnInit, OnDestroy {
  project: any = {
    team_members: [],
    modules_implemented: [],
    agile_project: false,
    emd_bg_required: false,
    search_keywords: ''
  };
  attachments: File[] = [];
  pdfPreviews: Map<string, string> = new Map();
  documentPreviews: Map<string, string> = new Map();

  constructor(private projectService: ProjectService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Set PDF.js worker path - using local worker file
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    
    // Alternative: Disable worker to use main thread (fallback)
    // pdfjsLib.GlobalWorkerOptions.workerSrc = '';
  }

  ngOnDestroy() {
    // Clean up object URLs to prevent memory leaks
    this.pdfPreviews.forEach(url => URL.revokeObjectURL(url));
    this.documentPreviews.forEach(url => URL.revokeObjectURL(url));
  }

  addTeamMember() {
    this.project.team_members.push({ userId: '', resourceDetails: '' });
  }

  onFileChange(e: any) {
    this.attachments = Array.from(e.target.files);
    // Generate previews for new files
    this.attachments.forEach(file => {
      if (this.isPdfFile(file)) {
        this.generatePdfPreview(file);
      }
    });
  }

  async generatePdfPreview(file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error('Unable to get 2D context from canvas');
        return;
      }
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to blob and create object URL
      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          this.pdfPreviews.set(file.name, url);
          // Trigger change detection to update the UI
          this.cdr.detectChanges();
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
    }
  }

  getPdfPreview(fileName: string): string | null {
    return this.pdfPreviews.get(fileName) || null;
  }

  removeFile(index: number) {
    const file = this.attachments[index];
    // Clean up preview URLs
    if (this.pdfPreviews.has(file.name)) {
      URL.revokeObjectURL(this.pdfPreviews.get(file.name)!);
      this.pdfPreviews.delete(file.name);
    }
    if (this.documentPreviews.has(file.name)) {
      URL.revokeObjectURL(this.documentPreviews.get(file.name)!);
      this.documentPreviews.delete(file.name);
    }
    this.attachments.splice(index, 1);
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'grid_on';
      case 'ppt':
      case 'pptx':
        return 'slideshow';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'zip':
      case 'rar':
        return 'archive';
      case 'txt':
        return 'text_snippet';
      default:
        return 'attach_file';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  getFilePreview(file: File): string | null {
    if (this.isImageFile(file)) {
      return URL.createObjectURL(file);
    }
    return null;
  }

  isPdfFile(file: File): boolean {
    return file.type === 'application/pdf';
  }

  isDocumentFile(file: File): boolean {
    const documentTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
      'text/plain'
    ];
    return documentTypes.includes(file.type);
  }

  generateDocumentPreview(file: File): string {
    // For documents, we'll create a stylized preview with file info
    const extension = file.name.split('.').pop()?.toLowerCase();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    canvas.width = 160;
    canvas.height = 200;
    
    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Header area
    ctx.fillStyle = this.getDocumentColor(extension || '');
    ctx.fillRect(0, 0, canvas.width, 40);
    
    // File type text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(extension?.toUpperCase() || 'DOC', canvas.width / 2, 25);
    
    // Document lines simulation
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const y = 60 + (i * 15);
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.stroke();
    }
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }

  getDocumentColor(extension: string): string {
    const colors: { [key: string]: string } = {
      'pdf': '#dc3545',
      'doc': '#2563eb',
      'docx': '#2563eb',
      'xls': '#16a34a',
      'xlsx': '#16a34a',
      'ppt': '#ea580c',
      'pptx': '#ea580c',
      'txt': '#6b7280'
    };
    return colors[extension] || '#6366f1';
  }

  async submit() {
    // Collect client information
    const clientInfo = await this.getClientInfo();
    
    const form = new FormData();
    for (let [k, v] of Object.entries(this.project)) {
      if (Array.isArray(v) || typeof v === 'object') {
        form.append(k, JSON.stringify(v));
      } else {
        form.append(k, String(v || ''));
      }
    }
    
    // Add client information to form data
    form.append('ip_address', clientInfo.ip_address);
    form.append('browser_info', clientInfo.browser_info);
    form.append('geo_info', clientInfo.geo_info);
    
    this.attachments.forEach(f => form.append('attachments', f));
    
    this.projectService.add(form).subscribe({
      next: (res) => {
        alert('Project Created Successfully!');
        // Redirect to project details page
        if (res && res.id) {
          this.router.navigate(['/project', res.id]);
        } else {
          // Fallback to project list if no ID returned
          this.router.navigate(['/projects']);
        }
      },
      error: (error) => {
        console.error('Error creating project:', error);
        alert('Error creating project. Please try again.');
      }
    });
  }

  private async getClientInfo(): Promise<{ip_address: string, browser_info: string, geo_info: string}> {
    let ipAddress = 'Unknown';
    let geoInfo = 'Unknown';
    
    // Get browser information
    const browserInfo = this.getBrowserInfo();
    
    // Get IP address and geolocation
    try {
      // Get IP address from external service
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
      
      // Get geolocation information
      const geoResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const geoData = await geoResponse.json();
      geoInfo = JSON.stringify({
        country: geoData.country_name || 'Unknown',
        region: geoData.region || 'Unknown',
        city: geoData.city || 'Unknown',
        timezone: geoData.timezone || 'Unknown',
        latitude: geoData.latitude || null,
        longitude: geoData.longitude || null
      });
    } catch (error) {
      console.error('Error fetching IP/Geo information:', error);
      // Try to get geolocation from browser if available
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          geoInfo = JSON.stringify({
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        } catch (geoError) {
          console.error('Error getting browser geolocation:', geoError);
        }
      }
    }
    
    return {
      ip_address: ipAddress,
      browser_info: browserInfo,
      geo_info: geoInfo
    };
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const screenResolution = `${screen.width}x${screen.height}`;
    const colorDepth = screen.colorDepth;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return JSON.stringify({
      userAgent: userAgent,
      platform: platform,
      language: language,
      screenResolution: screenResolution,
      colorDepth: colorDepth,
      timezone: timezone,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      timestamp: new Date().toISOString()
    });
  }
}

