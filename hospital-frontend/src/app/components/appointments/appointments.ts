import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from '../../services/appointment';
import { DoctorService, Doctor } from '../../services/doctor';
import { PatientService, Patient } from '../../services/patient';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrls: ['../shared/crud-page.css', './appointments.css'],
})
export class Appointments implements OnInit {
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  showForm = false;
  isEditing = false;
  loading = true;
  statusOptions = ['Scheduled', 'Completed', 'Cancelled'];

  currentAppointment: Appointment = {
    doctorId: 0,
    patientId: 0,
    appointmentDate: '',
    status: 'Scheduled',
  };
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.doctorService.getDoctors().subscribe({
      next: (data) => { this.doctors = data; this.cdr.markForCheck(); },
      error: () => { this.doctors = []; this.cdr.markForCheck(); },
    });

    this.patientService.getPatients().subscribe({
      next: (data) => { this.patients = data; this.cdr.markForCheck(); },
      error: () => { this.patients = []; this.cdr.markForCheck(); },
    });

    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.appointments = [];
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  openAddForm() {
    this.currentAppointment = {
      doctorId: 0,
      patientId: 0,
      appointmentDate: '',
      status: 'Scheduled',
    };
    this.isEditing = false;
    this.showForm = true;
  }

  editAppointment(appointment: Appointment) {
    this.currentAppointment = {
      id: appointment.id,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentDate: this.toDateInput(appointment.appointmentDate),
      status: appointment.status,
    };
    this.isEditing = true;
    this.showForm = true;
  }

  saveAppointment() {
    if (!this.currentAppointment.doctorId || !this.currentAppointment.patientId) {
      return;
    }

    const payload: Appointment = {
      doctorId: +this.currentAppointment.doctorId,
      patientId: +this.currentAppointment.patientId,
      appointmentDate: this.currentAppointment.appointmentDate,
      status: this.currentAppointment.status,
    };

    if (this.isEditing && this.currentAppointment.id) {
      this.appointmentService.updateAppointment(this.currentAppointment.id, payload).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.cdr.markForCheck();
        },
      });
    } else {
      this.appointmentService.createAppointment(payload).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.cdr.markForCheck();
        },
      });
    }
  }

  deleteAppointment(id: number) {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => { this.loadData(); this.cdr.markForCheck(); },
      });
    }
  }

  closeForm() {
    this.showForm = false;
  }

  getDoctorName(id: number) {
    const doctor = this.doctors.find((d) => d.id === id);
    return doctor ? `Dr. ${doctor.name}` : `Doctor #${id}`;
  }

  getPatientName(id: number) {
    const patient = this.patients.find((p) => p.id === id);
    return patient ? patient.name : `Patient #${id}`;
  }

  private toDateInput(value: string | undefined) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value.split('T')[0];
    }
    return date.toISOString().split('T')[0];
  }
}
