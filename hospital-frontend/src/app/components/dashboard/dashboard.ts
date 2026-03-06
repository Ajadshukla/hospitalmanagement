import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DoctorService } from '../../services/doctor';
import { PatientService } from '../../services/patient';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalDoctors = 0;
  totalPatients = 0;
  totalAppointments = 0;
  todayAppointments = 0;
  recentAppointments: any[] = [];
  loading = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    forkJoin({
      doctors: this.doctorService.getDoctors().pipe(catchError(() => of([]))),
      patients: this.patientService.getPatients().pipe(catchError(() => of([]))),
      appointments: this.appointmentService.getAppointments().pipe(catchError(() => of([]))),
    }).subscribe((result) => {
      this.totalDoctors = result.doctors.length;
      this.totalPatients = result.patients.length;
      this.totalAppointments = result.appointments.length;

      const today = new Date().toISOString().split('T')[0];
      this.todayAppointments = result.appointments.filter(
        (a) => a.appointmentDate?.split('T')[0] === today
      ).length;
      this.recentAppointments = result.appointments.slice(-5).reverse();
      this.loading = false;
      this.cdr.markForCheck();
    });
  }
}
