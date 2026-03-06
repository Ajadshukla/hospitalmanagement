import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService, Patient } from '../../services/patient';

@Component({
  selector: 'app-patients',
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.html',
  styleUrls: ['../shared/crud-page.css', './patients.css'],
})
export class Patients implements OnInit {
  patients: Patient[] = [];
  showForm = false;
  isEditing = false;
  loading = true;
  currentPatient: Patient = { name: '', age: 0, gender: '', phone: '' };
  private cdr = inject(ChangeDetectorRef);

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  openAddForm() {
    this.currentPatient = { name: '', age: 0, gender: '', phone: '' };
    this.isEditing = false;
    this.showForm = true;
  }

  editPatient(patient: Patient) {
    this.currentPatient = { ...patient };
    this.isEditing = true;
    this.showForm = true;
  }

  savePatient() {
    if (this.isEditing && this.currentPatient.id) {
      this.patientService.updatePatient(this.currentPatient.id, this.currentPatient).subscribe({
        next: () => {
          this.loadPatients();
          this.closeForm();
          this.cdr.markForCheck();
        },
      });
    } else {
      this.patientService.createPatient(this.currentPatient).subscribe({
        next: () => {
          this.loadPatients();
          this.closeForm();
          this.cdr.markForCheck();
        },
      });
    }
  }

  deletePatient(id: number) {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => { this.loadPatients(); this.cdr.markForCheck(); },
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.currentPatient = { name: '', age: 0, gender: '', phone: '' };
  }
}
