using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1_hospital_.Models;

public partial class HospitalContext : DbContext
{
    public HospitalContext()
    {
    }

    public HospitalContext(DbContextOptions<HospitalContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<Doctor> Doctors { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<Prescription> Prescriptions { get; set; }

    // Connection string is configured via appsettings.json (or env vars in production).
    // Do NOT add OnConfiguring here — it would override DI registration.

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("appointments");

            entity.HasIndex(e => e.DoctorId, "DoctorId");

            entity.HasIndex(e => e.PatientId, "PatientId");

            entity.Property(e => e.AppointmentDate).HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Doctor).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("appointments_ibfk_1");

            entity.HasOne(d => d.Patient).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("appointments_ibfk_2");
        });

        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("doctors");

            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(15);
            entity.Property(e => e.Specialization).HasMaxLength(100);
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("patients");

            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(15);
        });

        modelBuilder.Entity<Prescription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("prescriptions");

            entity.HasIndex(e => e.AppointmentId, "AppointmentId");

            entity.Property(e => e.Dosage).HasMaxLength(50);
            entity.Property(e => e.MedicineName).HasMaxLength(100);

            entity.HasOne(d => d.Appointment).WithMany(p => p.Prescriptions)
                .HasForeignKey(d => d.AppointmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("prescriptions_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
