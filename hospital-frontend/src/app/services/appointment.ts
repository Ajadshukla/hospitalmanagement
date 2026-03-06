import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Appointment {
  id?: number;
  doctorId: number;
  patientId: number;
  appointmentDate: string;
  status: string;
  doctorName?: string;
  patientName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/api/appointments`;

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
