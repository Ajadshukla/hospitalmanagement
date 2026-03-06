import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, Doctor } from '../../services/doctor';

@Component({
  selector: 'app-doctors',
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors.html',
  styleUrls: ['../shared/crud-page.css', './doctors.css'],
})
export class Doctors implements OnInit {
  doctors: Doctor[] = [];
  showForm = false;
  isEditing = false;
  loading = true;
  currentDoctor: Doctor = { name: '', specialization: '', phone: '' };
  private cdr = inject(ChangeDetectorRef);

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.loading = true;
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  openAddForm() {
    this.currentDoctor = { name: '', specialization: '', phone: '' };
    this.isEditing = false;
    this.showForm = true;
  }

  editDoctor(doctor: Doctor) {
    this.currentDoctor = { ...doctor };
    this.isEditing = true;
    this.showForm = true;
  }

  saveDoctor() {
    if (this.isEditing && this.currentDoctor.id) {
      this.doctorService.updateDoctor(this.currentDoctor.id, this.currentDoctor).subscribe({
        next: () => {
          this.loadDoctors();
          this.closeForm();
          this.cdr.markForCheck();
        },
      });
    } else {
      this.doctorService.createDoctor(this.currentDoctor).subscribe({
        next: () => {
          this.loadDoctors();
          this.closeForm();
          this.cdr.markForCheck();
        },
      });
    }
  }

  deleteDoctor(id: number) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe({
        next: () => { this.loadDoctors(); this.cdr.markForCheck(); },
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.currentDoctor = { name: '', specialization: '', phone: '' };
  }
}
