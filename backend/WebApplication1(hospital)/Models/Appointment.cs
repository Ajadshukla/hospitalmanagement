using System;
using System.Collections.Generic;

namespace WebApplication1_hospital_.Models;

public partial class Appointment
{
    public int Id { get; set; }

    public DateTime AppointmentDate { get; set; }

    public string Status { get; set; } = null!;

    public int DoctorId { get; set; }

    public int PatientId { get; set; }

    public virtual Doctor Doctor { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;

    public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}
