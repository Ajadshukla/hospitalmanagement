namespace WebApplication1_hospital_.DTOs
{
    public class AppointmentCreateDto
    {
        // Id of doctor selected from dropdown (Angular)
        public int DoctorId { get; set; }

        // Id of patient selected from dropdown
        public int PatientId { get; set; }

        // Appointment date coming from frontend
        public DateTime AppointmentDate { get; set; }

        // Status like Scheduled / Completed
        public string Status { get; set; }
    }
}
