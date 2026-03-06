using System;
using System.Collections.Generic;

namespace WebApplication1_hospital_.Models;

public partial class Doctor
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Specialization { get; set; } = null!;

    public string? Phone { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
