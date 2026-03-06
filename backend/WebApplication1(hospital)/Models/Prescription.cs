using System;
using System.Collections.Generic;

namespace WebApplication1_hospital_.Models;

public partial class Prescription
{
    public int Id { get; set; }

    public string MedicineName { get; set; } = null!;

    public string? Dosage { get; set; }

    public int AppointmentId { get; set; }

    public virtual Appointment Appointment { get; set; } = null!;
}
