using System;
using System.Collections.Generic;

namespace WebApplication1_hospital_.Models;

public partial class Patient
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int? Age { get; set; }

    public string? Gender { get; set; }

    public string? Phone { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
